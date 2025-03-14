package models

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"time"

	"github.com/Kandler3/JourneySquad/api/pkg/db"
)

type User struct {
	ID         int       `json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	EditedAt   time.Time `json:"edited_at"`
	TelegramID int64     `json:"telegram_id"`
	IsAdmin    bool      `json:"is_admin"`
	Name       string    `json:"name"`
	Avatar     string    `json:"avatar"`
	ProfileID  int       `json:"profile_id"`
}

type Profile struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	EditedAt  time.Time `json:"edited_at"`
	Age       int       `json:"age"`
	Gender    string    `json:"gender"`
	Bio       string    `json:"bio"`
}

type UserView struct {
	TelegramID int64  `json:"id"`
	Name       string `json:"name"`
	Age        int    `json:"age"`
	Gender     string `json:"gender"`
	Bio        string `json:"bio"`
	Avatar     string `json:"avatarUrl"`
}

type CreateUserInput struct {
	TelegramID int64  `json:"telegram_id"`
	IsAdmin    bool   `json:"is_admin"`
	Name       string `json:"name"`
	Avatar     string `json:"avatarUrl"`
	Age        int    `json:"age"`
	Gender     string `json:"gender"`
	Bio        string `json:"bio"`
}

type UpdateUserInput struct {
	Name    *string `json:"name,omitempty"`
	Age     *int    `json:"age,omitempty"`
	Gender  *string `json:"gender,omitempty"`
	Avatar  *string `json:"avatarUrl,omitempty"`
	Bio     *string `json:"bio,omitempty"`
	IsAdmin *bool   `json:"is_admin,omitempty"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type UnauthorisedResponse struct {
	Message string `json:"message"`
}

func getRawUserByTelegramID(ctx context.Context, telegramID int64) (*User, error) {
	query := "SELECT telegram_id, name, avatar, profile_id FROM users WHERE telegram_id = $1"

	row := db.QueryRow(ctx, query, telegramID)

	var user User
	if err := row.Scan(&user.TelegramID, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error retrieving user by telegram_id: %w", err)
	}

	return &user, nil
}

func GetUserByTelegramID(ctx context.Context, telegramID int64) (*UserView, error) {
	query := "SELECT telegram_id, name, avatar, profile_id FROM users WHERE telegram_id = $1"

	row := db.QueryRow(ctx, query, telegramID)

	var user User
	if err := row.Scan(&user.TelegramID, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("error retrieving user by telegram_id: %w", err)
	}
	userView, err := buildUserView(ctx, user)
	if err != nil {
		return nil, err
	}

	return userView, nil
}

func GetAllUsers(ctx context.Context) ([]UserView, error) {
	query := "SELECT telegram_id, name, avatar, profile_id FROM users"

	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []UserView
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.TelegramID, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
			return nil, err
		}

		userView, err := buildUserView(ctx, user)
		if err != nil {
			return nil, err
		}
		users = append(users, *userView)
	}

	return users, nil
}

func CreateUser(ctx context.Context, input CreateUserInput) (*UserView, error) {
	profile, err := createProfile(ctx, input)
	if err != nil {
		return nil, err
	}

	query := `
		INSERT INTO users (is_admin, name, avatar, profile_id, telegram_id, created_at, edited_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING telegram_id, name, avatar, profile_id
	`

	// TODO: password hashing
	row := db.QueryRow(ctx, query, input.IsAdmin, input.Name, input.Avatar, profile.ID, input.TelegramID)
	var user User
	if err := row.Scan(&user.TelegramID, &user.Name, &user.Avatar, &user.ProfileID); err != nil {
		return nil, err
	}
	userView, err := buildUserView(ctx, user)
	if err != nil {
		return nil, err
	}

	return userView, nil
}

func UpdateUser(ctx context.Context, telegramID int64, input UpdateUserInput) error {
	var fields []string
	var profileFields []string
	var args []any
	var profileArgs []any
	argID := 1
	profileArgID := 1

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
	if input.Bio != nil {
		profileFields = append(profileFields, fmt.Sprintf("bio = $%d", profileArgID))
		profileArgs = append(profileArgs, *input.Bio)
		profileArgID++
	}
	if input.Gender != nil {
		profileFields = append(profileFields, fmt.Sprintf("gender = $%d", profileArgID))
		profileArgs = append(profileArgs, *input.Gender)
		profileArgID++
	}
	if input.Age != nil {
		profileFields = append(profileFields, fmt.Sprintf("age = $%d", profileArgID))
		profileArgs = append(profileArgs, *input.Age)
		profileArgID++
	}
	if input.IsAdmin != nil {
		fields = append(fields, fmt.Sprintf("is_admin = $%d", argID))
		args = append(args, *input.IsAdmin)
		argID++
	}

	if len(fields) == 0 {
		return fmt.Errorf("no fields to update")
	}

	// Update edited_at field
	fields = append(fields, "edited_at = NOW()")
	query := fmt.Sprintf("UPDATE users SET %s WHERE telegram_id = $%d", strings.Join(fields, ", "), argID)
	args = append(args, telegramID)

	_, err := db.Exec(ctx, query, args...)
	if err != nil {
		return err
	}

	user, err := getRawUserByTelegramID(ctx, telegramID)
	if err != nil {
		return err
	}
	profileFields = append(profileFields, "edited_at = NOW()")
	query = fmt.Sprintf("UPDATE profiles SET %s WHERE id = $%d", strings.Join(profileFields, ", "), profileArgID)
	profileArgs = append(profileArgs, user.ProfileID)
	_, err = db.Exec(ctx, query, profileArgs...)
	return err
}

func DeleteUser(ctx context.Context, telegramID int64) error {
	query := "DELETE FROM users WHERE telegram_id = $1"
	_, err := db.Exec(ctx, query, telegramID)
	return err
}

func GetProfileByID(ctx context.Context, profileID int) (*Profile, error) {
	query := "SELECT id, created_at, edited_at, age, gender, bio FROM profiles WHERE id = $1"

	row := db.QueryRow(ctx, query, profileID)
	var profile Profile
	if err := row.Scan(&profile.ID, &profile.CreatedAt, &profile.EditedAt, &profile.Age, &profile.Gender, &profile.Bio); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &profile, nil
}

func buildUserView(ctx context.Context, user User) (*UserView, error) {
	profile, err := GetProfileByID(ctx, user.ProfileID)
	if err != nil {
		return nil, err
	}
	return &UserView{
		user.TelegramID,
		user.Name,
		profile.Age,
		profile.Gender,
		profile.Bio,
		user.Avatar,
	}, nil
}

func createProfile(ctx context.Context, input CreateUserInput) (*Profile, error) {
	query := `
		INSERT INTO profiles (age, gender, bio, created_at, edited_at)
		VALUES ($1, $2, $3, NOW(), NOW())
		RETURNING id, age, gender, bio
	`

	row := db.QueryRow(ctx, query, input.Age, input.Gender, input.Bio)
	var profile Profile
	if err := row.Scan(&profile.ID, &profile.Age, &profile.Gender, &profile.Bio); err != nil {
		return nil, err
	}

	return &profile, nil
}
