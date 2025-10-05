package handlers

import (
	"User-Backend/api"
	"User-Backend/internal/services"
	"context"
	"database/sql"
	"errors"
)

type AuthenticationHandler struct {
	api.UnimplementedAuthenticationServer
	dbCon *sql.DB
}

func NewAuthenticationHandler(db *sql.DB) *AuthenticationHandler {
	return &AuthenticationHandler{dbCon: db}
}

func (h *AuthenticationHandler) SignUp(ctx context.Context, req *api.SignUpRequest) (*api.SignUpResponse, error) {
	if req.Email == "" || req.Username == "" || req.Password == "" || req.Role == "" {
		return &api.SignUpResponse{
			Success: false,
			Message: "Missing required fields",
		}, nil
	}

	user, err := services.SignUp(req, h.dbCon)
	if err != nil {
		return &api.SignUpResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &api.SignUpResponse{
		Success: true,
		Message: "User created successfully",
		User:    user.ToGRPC(),
	}, nil
}

func (h *AuthenticationHandler) Login(ctx context.Context, req *api.LoginRequest) (*api.LoginResponse, error) {
	if req.Email == "" || req.Password == "" {
		return &api.LoginResponse{
			Success: false,
			Message: "Missing required fields",
		}, nil
	}

	user, err := services.Login(req, h.dbCon)
	if err != nil {
		return &api.LoginResponse{
			Success: false,
			Message: err.Error(),
		}, nil
	}

	return &api.LoginResponse{
		Success: true,
		Message: "Login successful",
		User:    user.ToGRPC(),
	}, nil
}

func (h *AuthenticationHandler) RefreshToken(ctx context.Context, req *api.RefreshTokenRequest) (*api.RefreshTokenResponse, error) {
	if req.RefreshToken == "" {
		return &api.RefreshTokenResponse{
			Success: false,
		}, errors.New("missing refresh token")
	}

	token, err := services.RefreshToken(req, h.dbCon)
	if err != nil {
		return &api.RefreshTokenResponse{
			Success: false,
		}, nil
	}

	return &api.RefreshTokenResponse{
		Success: true,
		Token:   token,
	}, nil
}

func (h *AuthenticationHandler) ValidateToken(ctx context.Context, req *api.ValidateTokenRequest) (*api.ValidateTokenResponse, error) {
	if req.Token == "" {
		return &api.ValidateTokenResponse{
			Valid: false,
		}, nil
	}

	valid := services.ValidateToken(req.Token)
	return &api.ValidateTokenResponse{
		Valid: valid,
	}, nil
}
