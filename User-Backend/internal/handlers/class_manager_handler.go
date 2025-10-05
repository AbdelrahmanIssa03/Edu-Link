package handlers

import (
	"User-Backend/api"
	"User-Backend/internal/services"
	"context"
	"database/sql"
)

type ClassManagerHandler struct {
	api.UnimplementedClassManagerServer
	dbCon *sql.DB
}

func NewClassManagerHandler(db *sql.DB) *ClassManagerHandler {
	return &ClassManagerHandler{dbCon: db}
}

func (h *ClassManagerHandler) CreateClass(ctx context.Context, req *api.CreateClassRequest) (*api.CreateClassResponse, error) {
	if req.UserId == "" || req.Name == "" {
		return &api.CreateClassResponse{
			Success:       false,
			ErrorMessages: []string{"Missing required fields"},
		}, nil
	}

	class, err := services.CreateClass(req, h.dbCon)
	if err != nil {
		return &api.CreateClassResponse{
			Success:       false,
			ErrorMessages: []string{err.Error()},
		}, nil
	}

	return &api.CreateClassResponse{
		Success:   true,
		Classroom: class.ToGRPC(),
	}, nil
}

func (h *ClassManagerHandler) GetClasses(ctx context.Context, req *api.GetClassesRequest) (*api.GetClassesResponse, error) {
	if req.UserId == "" {
		return &api.GetClassesResponse{
			Classrooms: []*api.Class{},
		}, nil
	}

	classes, err := services.GetClasses(req, h.dbCon)
	if err != nil {
		return nil, err
	}

	classMessages := make([]*api.Class, 0, len(classes))
	for _, class := range classes {
		classMessages = append(classMessages, class.ToGRPC())
	}

	return &api.GetClassesResponse{
		Classrooms: classMessages,
	}, nil
}

func (h *ClassManagerHandler) UpdateClass(ctx context.Context, req *api.UpdateClassRequest) (*api.UpdateClassResponse, error) {
	if req.UserId == "" || req.Classroom == nil {
		return &api.UpdateClassResponse{}, nil
	}

	updatedClass, err := services.UpdateClass(req, h.dbCon)
	if err != nil {
		return &api.UpdateClassResponse{}, nil
	}

	return &api.UpdateClassResponse{
		Classroom: updatedClass.ToGRPC(),
	}, nil
}

func (h *ClassManagerHandler) DeleteClass(ctx context.Context, req *api.DeleteClassRequest) (*api.DeleteClassResponse, error) {
	if req.UserId == "" || req.ClassroomId == "" {
		return &api.DeleteClassResponse{
			Success:       false,
			ErrorMessages: []string{"Missing required fields"},
		}, nil
	}

	success, err := services.DeleteClass(req, h.dbCon)
	if err != nil {
		return &api.DeleteClassResponse{
			Success:       false,
			ErrorMessages: []string{err.Error()},
		}, nil
	}

	return &api.DeleteClassResponse{
		Success: success,
	}, nil
}
