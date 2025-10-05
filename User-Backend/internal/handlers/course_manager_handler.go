package handlers

import (
	"User-Backend/api"
	"User-Backend/internal/services"
	"context"
	"database/sql"
)

type CourseManagerHandler struct {
	api.UnimplementedCourseManagerServer
	dbCon *sql.DB
}

func NewCourseManagerHandler(db *sql.DB) *CourseManagerHandler {
	return &CourseManagerHandler{dbCon: db}
}

func (h *CourseManagerHandler) GetCourses(ctx context.Context, req *api.GetCoursesRequest) (*api.GetCoursesResponse, error) {
	if req.UserId == "" {
		return &api.GetCoursesResponse{
			Courses: []*api.Course{},
		}, nil
	}

	courses, err := services.GetCourses(req, h.dbCon)
	if err != nil {
		return &api.GetCoursesResponse{
			Courses: []*api.Course{},
		}, nil
	}

	courseMessages := make([]*api.Course, 0, len(courses))
	for _, course := range courses {
		courseMessages = append(courseMessages, course.ToGRPC())
	}

	return &api.GetCoursesResponse{
		Courses: courseMessages,
	}, nil
}
