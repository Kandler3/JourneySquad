package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string // SSL mode (disable, require)
}

var instance *sql.DB

func InitDB(cfg DBConfig) error {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("error connecting to the database: %w", err)
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(24 * time.Hour)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to verify database connection: %w", err)
	}

	instance = db
	log.Println("✅ Database connection successfully established")
	return nil
}

func CloseDB() {
	if instance != nil {
		if err := instance.Close(); err != nil {
			log.Printf("Error closing database connection: %v", err)
		} else {
			log.Println("🛑 Database connection closed")
		}
	}
}

func Query(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return instance.QueryContext(ctx, query, args...)
}

func QueryRow(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return instance.QueryRowContext(ctx, query, args...)
}

func Exec(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return instance.ExecContext(ctx, query, args...)
}
