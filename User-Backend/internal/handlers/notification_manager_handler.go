package handlers

import (
	"User-Backend/api"
	"User-Backend/internal/services"
	"context"
	"database/sql"
	"fmt"
)

type NotificationManagerHandler struct {
	api.UnimplementedNotificationManagerServer
	dbCon *sql.DB
}

func NewNotificationManagerHandler(db *sql.DB) *NotificationManagerHandler {
	return &NotificationManagerHandler{dbCon: db}
}

func (h *NotificationManagerHandler) GetNotifications(ctx context.Context, req *api.GetNotificationsRequest) (*api.GetNotificationsResponse, error) {
	fmt.Println("req.UserId", req.UserId)
	if req.UserId == "" {
		return &api.GetNotificationsResponse{
			Notifications: []*api.Notification{},
		}, nil
	}

	notifications, err := services.GetNotifications(req, h.dbCon)
	if err != nil {
		return &api.GetNotificationsResponse{
			Notifications: []*api.Notification{},
		}, nil
	}

	notificationMessages := make([]*api.Notification, 0, len(notifications))
	for _, notification := range notifications {
		notificationMessages = append(notificationMessages, notification.ToGRPC())
	}

	return &api.GetNotificationsResponse{
		Notifications: notificationMessages,
	}, nil
}
