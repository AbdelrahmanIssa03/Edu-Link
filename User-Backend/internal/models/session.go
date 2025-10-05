package models

import (
	"User-Backend/api"
)

type Session struct {
	ID     string
	Title  string
	Date   string
	IsLive bool
}

func (s *Session) FromGRPC(grpcSession *api.Session) {
	if grpcSession == nil {
		return
	}

	s.ID = grpcSession.Id
	s.Title = grpcSession.Title
	s.Date = grpcSession.Date
	s.IsLive = grpcSession.IsLive
}

func (s *Session) ToGRPC() *api.Session {
	return &api.Session{
		Id:     s.ID,
		Title:  s.Title,
		Date:   s.Date,
		IsLive: s.IsLive,
	}
}
