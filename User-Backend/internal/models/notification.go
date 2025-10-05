package models

import (
	"User-Backend/api"
)

type Notification struct {
	ID       string
	Title    string
	Subtitle string
	Time     string
}

func (n *Notification) FromGRPC(grpcNotification *api.Notification) {
	if grpcNotification == nil {
		return
	}

	n.ID = grpcNotification.Id
	n.Title = grpcNotification.Title
	n.Subtitle = grpcNotification.Subtitle
	n.Time = grpcNotification.Time
}

func (n *Notification) ToGRPC() *api.Notification {
	return &api.Notification{
		Id:       n.ID,
		Title:    n.Title,
		Subtitle: n.Subtitle,
		Time:     n.Time,
	}
}
