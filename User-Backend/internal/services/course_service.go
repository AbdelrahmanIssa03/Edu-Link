package services

import (
	"User-Backend/api"
	"User-Backend/internal/models"
	"database/sql"
	"fmt"
)

func GetCourses(req *api.GetCoursesRequest, db *sql.DB) ([]models.Course, error) {
	rows, err := db.Query(`
		SELECT DISTINCT c.id, c.name
		FROM classes c
		LEFT JOIN class_students cs ON c.id = cs.class_id
		WHERE c.user_id = $1 OR cs.student_id = $1
	`, req.UserId)

	if err != nil {
		return nil, fmt.Errorf("error fetching courses: %w", err)
	}
	defer rows.Close()

	courses := []models.Course{}
	for rows.Next() {
		var classID, className string
		if err := rows.Scan(&classID, &className); err != nil {
			return nil, fmt.Errorf("error scanning course row: %w", err)
		}

		sessions, err := getClassSessions(db, classID)
		if err != nil {
			return nil, err
		}

		courses = append(courses, models.Course{
			ID:       classID,
			Name:     className,
			Sessions: sessions,
		})
	}

	return courses, nil
}

func getClassSessions(db *sql.DB, classID string) ([]models.Session, error) {
	rows, err := db.Query(`
		SELECT id, title, date, is_live
		FROM sessions
		WHERE class_id = $1
	`, classID)

	if err != nil {
		return nil, fmt.Errorf("error fetching sessions: %w", err)
	}
	defer rows.Close()

	var sessions []models.Session
	for rows.Next() {
		var session models.Session
		if err := rows.Scan(&session.ID, &session.Title, &session.Date, &session.IsLive); err != nil {
			return nil, fmt.Errorf("error scanning session row: %w", err)
		}
		sessions = append(sessions, session)
	}

	return sessions, nil
}
