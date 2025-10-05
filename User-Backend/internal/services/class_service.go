package services

import (
	"User-Backend/api"
	"User-Backend/internal/models"
	"database/sql"
	"fmt"
)

func CreateClass(req *api.CreateClassRequest, db *sql.DB) (*models.Class, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	var classID string
	err = tx.QueryRow(`
		INSERT INTO classes(name, user_id, start_time, end_time) 
		VALUES ($1, $2, $3, $4) RETURNING id
	`, req.Name, req.UserId, req.StartTime, req.EndTime).Scan(&classID)

	if err != nil {
		return nil, fmt.Errorf("error creating class: %w", err)
	}

	if len(req.Students) > 0 {
		stmt, err := tx.Prepare("INSERT INTO class_students(class_id, student_id) VALUES ($1, $2)")
		if err != nil {
			return nil, fmt.Errorf("error preparing student enrollment statement: %w", err)
		}
		defer stmt.Close()

		for _, studentEmail := range req.Students {
			var studentID string
			err = tx.QueryRow("SELECT id FROM users WHERE email = $1 AND role = 'student'", studentEmail).Scan(&studentID)
			if err != nil {
				if err == sql.ErrNoRows {
					return nil, fmt.Errorf("student with email %s not found", studentEmail)
				}
				return nil, fmt.Errorf("error finding student with email %s: %w", studentEmail, err)
			}

			_, err = stmt.Exec(classID, studentID)
			if err != nil {
				return nil, fmt.Errorf("error enrolling student %s: %w", studentEmail, err)
			}
			
			notificationTitle := "You've been added to a new class"
			notificationSubtitle := fmt.Sprintf("You have been enrolled in %s", req.Name)
			if err := CreateNotification(db, studentID, notificationTitle, notificationSubtitle); err != nil {
				return nil, fmt.Errorf("error creating notification for student %s: %w", studentEmail, err)
			}
		}
	}

	if len(req.Files) > 0 {
		stmt, err := tx.Prepare("INSERT INTO class_files(class_id, file_path) VALUES ($1, $2)")
		if err != nil {
			return nil, fmt.Errorf("error preparing class files statement: %w", err)
		}
		defer stmt.Close()

		for _, filePath := range req.Files {
			_, err = stmt.Exec(classID, filePath)
			if err != nil {
				return nil, fmt.Errorf("error adding file %s: %w", filePath, err)
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	class := &models.Class{
		ID:        classID,
		Name:      req.Name,
		UserID:    req.UserId,
		Files:     req.Files,
		Students:  req.Students,
		StartTime: req.StartTime,
		EndTime:   req.EndTime,
		Sessions:  []models.Session{},
	}

	return class, nil
}

func GetClasses(req *api.GetClassesRequest, db *sql.DB) ([]models.Class, error) {
	rows, err := db.Query(`
		SELECT id, name, start_time, end_time
		FROM classes
		WHERE user_id = $1
	`, req.UserId)

	if err != nil {
		return nil, fmt.Errorf("error fetching classes: %w", err)
	}
	defer rows.Close()

	classes := []models.Class{}
	for rows.Next() {
		var class models.Class
		err := rows.Scan(&class.ID, &class.Name, &class.StartTime, &class.EndTime)
		if err != nil {
			return nil, fmt.Errorf("error scanning class row: %w", err)
		}

		filesRows, err := db.Query("SELECT file_path FROM class_files WHERE class_id = $1", class.ID)
		if err != nil {
			return nil, fmt.Errorf("error fetching files for class %s: %w", class.ID, err)
		}
		defer filesRows.Close()

		files := []string{}
		for filesRows.Next() {
			var file string
			if err := filesRows.Scan(&file); err != nil {
				return nil, fmt.Errorf("error scanning file row: %w", err)
			}
			files = append(files, file)
		}
		class.Files = files

		studentsRows, err := db.Query(`
			SELECT u.email 
			FROM class_students cs 
			JOIN users u ON cs.student_id = u.id 
			WHERE cs.class_id = $1
		`, class.ID)
		if err != nil {
			return nil, fmt.Errorf("error fetching students for class %s: %w", class.ID, err)
		}
		defer studentsRows.Close()

		students := []string{}
		for studentsRows.Next() {
			var studentEmail string
			if err := studentsRows.Scan(&studentEmail); err != nil {
				return nil, fmt.Errorf("error scanning student row: %w", err)
			}
			students = append(students, studentEmail)
		}
		class.Students = students

		sessionsRows, err := db.Query("SELECT id, title, date, is_live FROM sessions WHERE class_id = $1", class.ID)
		if err != nil {
			return nil, fmt.Errorf("error fetching sessions for class %s: %w", class.ID, err)
		}
		defer sessionsRows.Close()

		sessions := []models.Session{}
		for sessionsRows.Next() {
			var session models.Session
			if err := sessionsRows.Scan(&session.ID, &session.Title, &session.Date, &session.IsLive); err != nil {
				return nil, fmt.Errorf("error scanning session row: %w", err)
			}
			sessions = append(sessions, session)
		}
		class.Sessions = sessions

		classes = append(classes, class)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating class rows: %w", err)
	}

	return classes, nil
}

func UpdateClass(req *api.UpdateClassRequest, db *sql.DB) (*models.Class, error) {
	tx, err := db.Begin()
	if err != nil {
		return nil, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	_, err = tx.Exec(`
		UPDATE classes 
		SET name = $1, start_time = $2, end_time = $3
		WHERE id = $4 AND user_id = $5
	`, req.Classroom.Name, req.Classroom.StartTime, req.Classroom.EndTime, req.Classroom.Id, req.UserId)

	if err != nil {
		return nil, fmt.Errorf("error updating class: %w", err)
	}

	_, err = tx.Exec("DELETE FROM class_students WHERE class_id = $1", req.Classroom.Id)
	if err != nil {
		return nil, fmt.Errorf("error removing existing students: %w", err)
	}

	if len(req.Classroom.Students) > 0 {
		stmt, err := tx.Prepare("INSERT INTO class_students(class_id, student_id) VALUES ($1, $2)")
		if err != nil {
			return nil, fmt.Errorf("error preparing student enrollment statement: %w", err)
		}
		defer stmt.Close()

		for _, studentEmail := range req.Classroom.Students {
			var studentID string
			err = tx.QueryRow("SELECT id FROM users WHERE email = $1 AND role = 'student'", studentEmail).Scan(&studentID)
			if err != nil {
				if err == sql.ErrNoRows {
					return nil, fmt.Errorf("student with email %s not found", studentEmail)
				}
				return nil, fmt.Errorf("error finding student with email %s: %w", studentEmail, err)
			}

			_, err = stmt.Exec(req.Classroom.Id, studentID)
			if err != nil {
				return nil, fmt.Errorf("error enrolling student %s: %w", studentEmail, err)
			}

			// Create notification for the student
			notificationTitle := "You've been added to a class"
			notificationSubtitle := fmt.Sprintf("You have been enrolled in %s", req.Classroom.Name)
			if err := CreateNotification(db, studentID, notificationTitle, notificationSubtitle); err != nil {
				return nil, fmt.Errorf("error creating notification for student %s: %w", studentEmail, err)
			}
		}
	}

	_, err = tx.Exec("DELETE FROM class_files WHERE class_id = $1", req.Classroom.Id)
	if err != nil {
		return nil, fmt.Errorf("error removing existing files: %w", err)
	}

	if len(req.Classroom.Files) > 0 {
		stmt, err := tx.Prepare("INSERT INTO class_files(class_id, file_path) VALUES ($1, $2)")
		if err != nil {
			return nil, fmt.Errorf("error preparing class files statement: %w", err)
		}
		defer stmt.Close()

		for _, filePath := range req.Classroom.Files {
			_, err = stmt.Exec(req.Classroom.Id, filePath)
			if err != nil {
				return nil, fmt.Errorf("error adding file %s: %w", filePath, err)
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	class := &models.Class{}
	class.FromGRPC(req.Classroom)
	return class, nil
}

func DeleteClass(req *api.DeleteClassRequest, db *sql.DB) (bool, error) {
	tx, err := db.Begin()
	if err != nil {
		return false, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	_, err = tx.Exec("DELETE FROM class_students WHERE class_id = $1", req.ClassroomId)
	if err != nil {
		return false, fmt.Errorf("error removing class students: %w", err)
	}

	_, err = tx.Exec("DELETE FROM class_files WHERE class_id = $1", req.ClassroomId)
	if err != nil {
		return false, fmt.Errorf("error removing class files: %w", err)
	}

	_, err = tx.Exec("DELETE FROM sessions WHERE class_id = $1", req.ClassroomId)
	if err != nil {
		return false, fmt.Errorf("error removing class sessions: %w", err)
	}

	_, err = tx.Exec("DELETE FROM classes WHERE id = $1 AND user_id = $2",
		req.ClassroomId, req.UserId)
	if err != nil {
		return false, fmt.Errorf("error deleting class: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return false, err
	}

	return true, nil
}
