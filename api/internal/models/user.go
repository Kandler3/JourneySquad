package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/Kandler3/JourneySquad/api/internal/db"
)

type User struct {
	ID           int
	CreatedAt    time.Time
	EditedAt     time.Time
	Email        string
	PasswordHash string
	IsAdmin      bool
	Name         string
	Avatar       string
	ProfileID    int
}

func GetUserByID(ctx context.Context, userID int) (*User, error) {
	query := "SELECT id, email, name, avatar, profile_id FROM users WHERE id = $1"

	row := db.QueryRow(ctx, query, userID)

	var user User
	if err := row.Scan(&user.ID, &user.Email, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error retrieving user: %w", err)
	}

	return &user, nil
}
