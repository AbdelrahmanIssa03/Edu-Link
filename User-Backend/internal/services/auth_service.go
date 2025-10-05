package services

import (
	"User-Backend/api"
	"User-Backend/internal/config"
	"User-Backend/internal/models"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type CustomClaims struct {
	UserID string `json:"sub"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func SignUp(req *api.SignUpRequest, db *sql.DB) (*models.User, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	var userID string
	err = tx.QueryRow(`
        INSERT INTO users(password, username, email, role) 
        VALUES ($1, $2, $3, $4) RETURNING id
    `, req.Password, req.Username, req.Email, req.Role).Scan(&userID)

	if err != nil {
		return nil, fmt.Errorf("insert user error: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	token, refreshToken, err := generateTokens(userID, req.Role)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		ID:           userID,
		Username:     req.Username,
		Email:        req.Email,
		Token:        token,
		RefreshToken: refreshToken,
	}

	return user, nil
}

func Login(req *api.LoginRequest, db *sql.DB) (*models.User, error) {
	var userID, username, email, role string

	query := `SELECT u.id, u.username, u.email, u.role FROM users u WHERE u.email = $1 AND u.password = $2`
	err := db.QueryRow(query, req.Email, req.Password).Scan(&userID, &username, &email, &role)

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	fmt.Println("userID", userID)
	token, refreshToken, err := generateTokens(userID, role)
	if err != nil {
		return nil, errors.New("error generating authentication tokens")
	}

	user := &models.User{
		ID:           userID,
		Username:     username,
		Email:        email,
		Token:        token,
		RefreshToken: refreshToken,
	}

	return user, nil
}

func RefreshToken(req *api.RefreshTokenRequest, db *sql.DB) (string, error) {
	token, err := jwt.ParseWithClaims(req.RefreshToken, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		jwtSecretKey := config.GetENVdata("JWT_SECRET")
		if jwtSecretKey == "" {
			return nil, errors.New("JWT secret not found")
		}
		return []byte(jwtSecretKey), nil
	})

	if err != nil || !token.Valid {
		return "", errors.New("invalid refresh token")
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok {
		return "", errors.New("invalid token claims")
	}

	newToken, _, err := generateTokens(claims.UserID, claims.Role)
	if err != nil {
		return "", err
	}

	return newToken, nil
}

func ValidateToken(tokenString string) bool {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		jwtSecretKey := config.GetENVdata("JWT_SECRET")
		if jwtSecretKey == "" {
			return nil, errors.New("JWT secret not found")
		}
		return []byte(jwtSecretKey), nil
	})

	if err != nil || !token.Valid {
		return false
	}

	return true
}

func generateTokens(userID string, role string) (string, string, error) {

	accessClaims := CustomClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)

	refreshClaims := CustomClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	jwtSecretKey := config.GetENVdata("JWT_SECRET")
	if jwtSecretKey == "" {
		return "", "", errors.New("JWT secret not found")
	}

	signedAccessToken, err := accessToken.SignedString([]byte(jwtSecretKey))
	if err != nil {
		return "", "", err
	}

	signedRefreshToken, err := refreshToken.SignedString([]byte(jwtSecretKey))
	if err != nil {
		return "", "", err
	}

	return signedAccessToken, signedRefreshToken, nil
}
