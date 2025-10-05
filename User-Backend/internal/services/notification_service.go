package services

import (
	"User-Backend/api"
	"User-Backend/internal/models"
	"database/sql"
	"fmt"
	"time"
)

func CreateNotification(db *sql.DB, userID, title, subtitle string) error {
	currentTime := time.Now().Format(time.RFC3339)

	_, err := db.Exec(`
		INSERT INTO notifications(user_id, title, subtitle, time)
		VALUES ($1, $2, $3, $4)
	`, userID, title, subtitle, currentTime)

	if err != nil {
		return fmt.Errorf("error creating notification: %w", err)
	}

	return nil
}

func GetNotifications(req *api.GetNotificationsRequest, db *sql.DB) ([]models.Notification, error) {
	fmt.Println("req.UserId", req.UserId)
	rows, err := db.Query(`
		SELECT id, title, subtitle, time
		FROM notifications
		WHERE user_id = $1
		ORDER BY time DESC
	`, req.UserId)

	if err != nil {
		return nil, fmt.Errorf("error fetching notifications: %w", err)
	}
	defer rows.Close()

	notifications := []models.Notification{}
	for rows.Next() {
		var notification models.Notification
		err := rows.Scan(&notification.ID, &notification.Title, &notification.Subtitle, &notification.Time)
		if err != nil {
			return nil, fmt.Errorf("error scanning notification row: %w", err)
		}
		notifications = append(notifications, notification)
	}

	fmt.Println("notifications", notifications)
	return notifications, nil
}
