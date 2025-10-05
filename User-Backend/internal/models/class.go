package models

import (
	"User-Backend/api"
)

type Class struct {
	ID        string
	Name      string
	UserID    string
	Files     []string
	Students  []string
	StartTime string
	EndTime   string
	Sessions  []Session
}

func (c *Class) FromGRPC(grpcClass *api.Class) {
	if grpcClass == nil {
		return
	}

	c.ID = grpcClass.Id
	c.Name = grpcClass.Name
	c.Files = grpcClass.Files
	c.Students = grpcClass.Students
	c.StartTime = grpcClass.StartTime
	c.EndTime = grpcClass.EndTime

	c.Sessions = make([]Session, 0, len(grpcClass.Sessions))
	for _, s := range grpcClass.Sessions {
		var session Session
		session.FromGRPC(s)
		c.Sessions = append(c.Sessions, session)
	}
}

func (c *Class) ToGRPC() *api.Class {
	sessionMessages := make([]*api.Session, 0, len(c.Sessions))
	for _, s := range c.Sessions {
		sessionMessages = append(sessionMessages, s.ToGRPC())
	}

	return &api.Class{
		Id:        c.ID,
		Name:      c.Name,
		Files:     c.Files,
		Students:  c.Students,
		StartTime: c.StartTime,
		EndTime:   c.EndTime,
		Sessions:  sessionMessages,
	}
}
