package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

var instance1 *sql.DB
var instance2 *sql.DB

func InitDB(num byte) error {
	dsn := os.Getenv("DATABASE_URL")

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

	if err := runMigrations(db); err != nil {
		return fmt.Errorf("migration error: %w", err)
	}

	if num == 1 {
		instance1 = db
	} else {
		instance2 = db
	}
	log.Println("✅ Database connection successfully established")
	return nil
}

func runMigrations(db *sql.DB) error {
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("failed to create migration driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://migrations",
		"postgres", driver)
	if err != nil {
		return fmt.Errorf("failed to initialize migration: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migration failed: %w", err)
	}

	log.Println("📜 Migrations applied successfully")
	return nil
}

func CloseDB(num byte) {
	var instance *sql.DB
	if num == 1 {
		instance = instance1
	} else {
		instance = instance2
	}
	if instance != nil {
		if err := instance.Close(); err != nil {
			log.Printf("Error closing database connection: %v", err)
		} else {
			log.Println("🛑 Database connection closed")
		}
	}
}

func Query(num byte, ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	if num == 1 {
		return instance1.QueryContext(ctx, query, args...)
	} else {
		return instance2.QueryContext(ctx, query, args...)
	}
}

func QueryRow(num byte, ctx context.Context, query string, args ...interface{}) *sql.Row {
	if num == 1 {
		return instance1.QueryRowContext(ctx, query, args...)
	} else {
		return instance2.QueryRowContext(ctx, query, args...)
	}
}

func Exec(num byte, ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	if num == 1 {
		return instance1.ExecContext(ctx, query, args...)
	} else {
		return instance2.ExecContext(ctx, query, args...)
	}
}
