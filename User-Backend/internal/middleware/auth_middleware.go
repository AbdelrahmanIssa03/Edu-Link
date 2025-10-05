package middleware

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"User-Backend/internal/config"
	"User-Backend/internal/services"

	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

var methodRoleMap = map[string][]string{

	"/userAPI.Authentication/Login":        {},
	"/userAPI.Authentication/SignUp":       {},
	"/userAPI.Authentication/RefreshToken": {},

	"/userAPI.Authentication/ValidateToken":         {"student", "instructor"},
	"/userAPI.ClassManager/CreateClass":             {"instructor"},
	"/userAPI.ClassManager/GetClasses":              {"student", "instructor"},
	"/userAPI.ClassManager/UpdateClass":             {"instructor"},
	"/userAPI.ClassManager/DeleteClass":             {"instructor"},
	"/userAPI.CourseManager/GetCourses":             {"student", "instructor"},
	"/userAPI.SessionManager/StartSession":          {"instructor"},
	"/userAPI.SessionManager/EndSession":            {"instructor"},
	"/userAPI.NotificationManager/GetNotifications": {"student", "instructor"},
}

func AuthInterceptor() grpc.UnaryServerInterceptor {
	return func(
		ctx context.Context,
		req interface{},
		info *grpc.UnaryServerInfo,
		handler grpc.UnaryHandler,
	) (interface{}, error) {

		allowedRoles, methodRegistered := methodRoleMap[info.FullMethod]

		if !methodRegistered {
			fmt.Printf("Method %s is not registered\n", info.FullMethod)
			return nil, errors.New("unauthorized: method not registered")
		}

		if len(allowedRoles) == 0 {
			return handler(ctx, req)
		}

		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, errors.New("missing metadata")
		}

		authHeader := md.Get("authorization")
		if len(authHeader) == 0 {
			return nil, errors.New("missing authorization token")
		}

		tokenString := strings.TrimPrefix(authHeader[0], "Bearer ")
		tokenString = strings.TrimSpace(tokenString)

		if !services.ValidateToken(tokenString) {
			return nil, errors.New("invalid token")
		}

		token, err := jwt.ParseWithClaims(tokenString, &services.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			jwtSecretKey := config.GetENVdata("JWT_SECRET")
			if jwtSecretKey == "" {
				return nil, errors.New("JWT secret not found")
			}
			return []byte(jwtSecretKey), nil
		})

		if err != nil {
			return nil, errors.New("error parsing token")
		}

		claims, ok := token.Claims.(*services.CustomClaims)
		if !ok {
			return nil, errors.New("invalid token claims")
		}

		roleAuthorized := false
		for _, allowed := range allowedRoles {
			if claims.Role == allowed {
				roleAuthorized = true
				break
			}
		}

		if !roleAuthorized {
			fmt.Printf("Unauthorized: role '%s' cannot access %s\n", claims.Role, info.FullMethod)
			return nil, errors.New("unauthorized: insufficient permissions")
		}

		ctx = context.WithValue(ctx, "user_id", claims.UserID)
		ctx = context.WithValue(ctx, "role", claims.Role)

		return handler(ctx, req)
	}
}
