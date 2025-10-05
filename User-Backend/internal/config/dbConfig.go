package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

var db *sql.DB

func InitDB() *sql.DB {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it:", err)
	}

	host := GetENVdata("DB_HOST")
	port := GetENVdata("DB_PORT")
	user := GetENVdata("DB_USER")
	password := GetENVdata("DB_PASSWORD")
	dbname := GetENVdata("DB_NAME")
	sslmode := GetENVdata("DB_SSL_MODE")
	schema := os.Getenv("DB_SCHEMA")

	connectionString := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s search_path=%s",
		host, port, user, password, dbname, sslmode, schema,
	)

	database, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatalf("❌ Failed to open connection to PostgreSQL: %v", err)
	}

	if err := database.Ping(); err != nil {
		log.Fatalf("❌ PostgreSQL unreachable: %v", err)
	}

	_, err = database.Exec(fmt.Sprintf("SET search_path TO %s", schema))
	if err != nil {
		log.Printf("⚠️ Warning: Failed to set schema search path to '%s': %v", schema, err)
	} else {
		log.Printf("✅ Using database schema: %s", schema)
	}

	database.SetMaxOpenConns(25)
	database.SetMaxIdleConns(15)
	database.SetConnMaxLifetime(30 * time.Minute)

	log.Println("✅ Connected to PostgreSQL on GCP VM")
	db = database
	return db
}

func GetENVdata(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Printf("⚠️  Warning: Environment variable %s not found", key)
	}
	return value
}
