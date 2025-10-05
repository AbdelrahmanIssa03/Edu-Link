package handlers

import (
	"User-Backend/api"
	"User-Backend/internal/services"
	"context"
	"database/sql"
)

type SessionManagerHandler struct {
	api.UnimplementedSessionManagerServer
	dbCon *sql.DB
}

func NewSessionManagerHandler(db *sql.DB) *SessionManagerHandler {
	return &SessionManagerHandler{dbCon: db}
}

func (h *SessionManagerHandler) StartSession(ctx context.Context, req *api.StartSessionRequest) (*api.StartSessionResponse, error) {
	if req.UserId == "" || req.ClassroomId == "" || req.Name == "" {
		return &api.StartSessionResponse{
			Success:       false,
			ErrorMessages: []string{"Missing required fields"},
		}, nil
	}

	session, err := services.StartSession(req, h.dbCon)
	if err != nil {
		return &api.StartSessionResponse{
			Success:       false,
			ErrorMessages: []string{err.Error()},
		}, nil
	}

	return &api.StartSessionResponse{
		Success: true,
		Session: session.ToGRPC(),
	}, nil
}

func (h *SessionManagerHandler) EndSession(ctx context.Context, req *api.EndSessionRequest) (*api.EndSessionResponse, error) {
	if req.UserId == "" || req.ClassroomId == "" || req.SessionId == "" {
		return &api.EndSessionResponse{
			Success:       false,
			ErrorMessages: []string{"Missing required fields"},
		}, nil
	}

	session, err := services.EndSession(req, h.dbCon)
	if err != nil {
		return &api.EndSessionResponse{
			Success:       false,
			ErrorMessages: []string{err.Error()},
		}, nil
	}

	return &api.EndSessionResponse{
		Success: true,
		Session: session.ToGRPC(),
	}, nil
}
