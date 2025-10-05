package services

import (
	"User-Backend/api"
	"User-Backend/internal/models"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

func StartSession(req *api.StartSessionRequest, db *sql.DB) (*models.Session, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	var isClassOwner bool
	err = tx.QueryRow("SELECT EXISTS(SELECT 1 FROM classes WHERE id = $1 AND user_id = $2)",
		req.ClassroomId, req.UserId).Scan(&isClassOwner)
	if err != nil || !isClassOwner {
		return nil, errors.New("no permission to start a session in this class")
	}

	var activeSessionExists bool
	err = tx.QueryRow("SELECT EXISTS(SELECT 1 FROM sessions WHERE class_id = $1 AND is_live = true)",
		req.ClassroomId).Scan(&activeSessionExists)
	if err != nil {
		return nil, fmt.Errorf("error checking for active sessions: %w", err)
	}
	if activeSessionExists {
		return nil, errors.New("an active session already exists for this class")
	}

	var sessionID string
	currentDate := time.Now().Format(time.RFC3339)
	err = tx.QueryRow(`
		INSERT INTO sessions(class_id, title, date, is_live) 
		VALUES ($1, $2, $3, true) RETURNING id
	`, req.ClassroomId, req.Name, currentDate).Scan(&sessionID)

	if err != nil {
		return nil, fmt.Errorf("error creating session: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	session := &models.Session{
		ID:     sessionID,
		Title:  req.Name,
		Date:   currentDate,
		IsLive: true,
	}

	return session, nil
}

func EndSession(req *api.EndSessionRequest, db *sql.DB) (*models.Session, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	var isClassOwner bool
	err = tx.QueryRow("SELECT EXISTS(SELECT 1 FROM classes WHERE id = $1 AND user_id = $2)",
		req.ClassroomId, req.UserId).Scan(&isClassOwner)
	if err != nil || !isClassOwner {
		return nil, errors.New("no permission to end this session")
	}

	var isSessionActive bool
	err = tx.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM sessions 
			WHERE id = $1 AND class_id = $2 AND is_live = true
		)
	`, req.SessionId, req.ClassroomId).Scan(&isSessionActive)

	if err != nil {
		return nil, fmt.Errorf("error checking session status: %w", err)
	}

	if !isSessionActive {
		return nil, errors.New("session not found or not active")
	}

	_, err = tx.Exec(`
		UPDATE sessions 
		SET is_live = false 
		WHERE id = $1 AND class_id = $2
	`, req.SessionId, req.ClassroomId)

	if err != nil {
		return nil, fmt.Errorf("error ending session: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	var title, date string
	err = db.QueryRow(`
		SELECT title, date
		FROM sessions
		WHERE id = $1
	`, req.SessionId).Scan(&title, &date)
	if err != nil {
		return nil, fmt.Errorf("error retrieving session details: %w", err)
	}

	session := &models.Session{
		ID:     req.SessionId,
		Title:  title,
		Date:   date,
		IsLive: false,
	}

	return session, nil
}
