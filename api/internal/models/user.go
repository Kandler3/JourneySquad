package models

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/Kandler3/JourneySquad/api/internal/db"
)

type User struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password"`
	IsAdmin      bool      `json:"is_admin"`
	Name         string    `json:"name"`
	Avatar       string    `json:"avatar"`
	ProfileID    int       `json:"profile_id"`
}

type Profile struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	EditedAt  time.Time `json:"edited_at"`
	Age       int       `json:"age"`
	Gender    bool      `json:"gender"`
}

type UserResponse struct {
	User    *User    `json:"user"`
	Profile *Profile `json:"profile,omitempty"`
}

type CreateUserInput struct {
	Email     string `json:"email" binding:"required"`
	Password  string `json:"password" binding:"required"`
	IsAdmin   bool   `json:"is_admin"`
	Name      string `json:"name"`
	Avatar    string `json:"avatar"`
	ProfileID int    `json:"profile_id"`
}

type UpdateUserInput struct {
	Email     *string `json:"email,omitempty"`
	Name      *string `json:"name,omitempty"`
	Avatar    *string `json:"avatar,omitempty"`
	IsAdmin   *bool   `json:"is_admin,omitempty"`
	ProfileID *int    `json:"profile_id,omitempty"`
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

func GetAllUsers(ctx context.Context) ([]User, error) {
	query := "SELECT id, email, name, avatar, profile_id FROM users"

	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.ID, &user.Email, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func CreateUser(ctx context.Context, input CreateUserInput) (*User, error) {
	query := `
		INSERT INTO users (email, password, is_admin, name, avatar, profile_id, created_at, edited_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
		RETURNING id, email, name, avatar, profile_id
	`

	// TODO: password hashing
	row := db.QueryRow(ctx, query, input.Email, input.Password, input.IsAdmin, input.Name, input.Avatar, input.ProfileID)
	var user User
	if err := row.Scan(&user.ID, &user.Email, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
		return nil, err
	}

	return &user, nil
}

func UpdateUser(ctx context.Context, userID int, input UpdateUserInput) error {
	var fields []string
	var args []interface{}
	argID := 1

	if input.Email != nil {
		fields = append(fields, fmt.Sprintf("email = $%d", argID))
		args = append(args, *input.Email)
		argID++
	}
	if input.Name != nil {
		fields = append(fields, fmt.Sprintf("name = $%d", argID))
		args = append(args, *input.Name)
		argID++
	}
	if input.Avatar != nil {
		fields = append(fields, fmt.Sprintf("avatar = $%d", argID))
		args = append(args, *input.Avatar)
		argID++
	}
	if input.IsAdmin != nil {
		fields = append(fields, fmt.Sprintf("is_admin = $%d", argID))
		args = append(args, *input.IsAdmin)
		argID++
	}
	if input.ProfileID != nil {
		fields = append(fields, fmt.Sprintf("profile_id = $%d", argID))
		args = append(args, *input.ProfileID)
		argID++
	}

	if len(fields) == 0 {
		return fmt.Errorf("no fields to update")
	}

	// Update edited_at field
	fields = append(fields, "edited_at = NOW()")
	query := fmt.Sprintf("UPDATE users SET %s WHERE id = $%d", strings.Join(fields, ", "), argID)
	args = append(args, userID)

	_, err := db.Exec(ctx, query, args...)
	return err
}

func DeleteUser(ctx context.Context, userID int) error {
	query := "DELETE FROM users WHERE id = $1"
	_, err := db.Exec(ctx, query, userID)
	return err
}

func GetProfileByID(ctx context.Context, profileID int) (*Profile, error) {
	query := "SELECT id, created_at, edited_at, age, gender FROM profiles WHERE id = $1"

	row := db.QueryRow(ctx, query, profileID)
	var profile Profile
	if err := row.Scan(&profile.ID, &profile.CreatedAt, &profile.EditedAt, &profile.Age, &profile.Gender); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &profile, nil
}
