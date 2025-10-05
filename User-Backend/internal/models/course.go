package models

import (
	"User-Backend/api"
)

type Course struct {
	ID       string
	Name     string
	Sessions []Session
}

func (c *Course) FromGRPC(grpcCourse *api.Course) {
	if grpcCourse == nil {
		return
	}

	c.ID = grpcCourse.Id
	c.Name = grpcCourse.Name

	c.Sessions = make([]Session, 0, len(grpcCourse.Sessions))
	for _, s := range grpcCourse.Sessions {
		var session Session
		session.FromGRPC(s)
		c.Sessions = append(c.Sessions, session)
	}
}

func (c *Course) ToGRPC() *api.Course {
	sessionMessages := make([]*api.Session, 0, len(c.Sessions))
	for _, s := range c.Sessions {
		sessionMessages = append(sessionMessages, s.ToGRPC())
	}

	return &api.Course{
		Id:       c.ID,
		Name:     c.Name,
		Sessions: sessionMessages,
	}
}
