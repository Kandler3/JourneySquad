package models

import (
	"context"
	"database/sql"

	//"fmt"
	//"strings"
	"time"

	"github.com/Kandler3/JourneySquad/api/internal/db"
)

type TravelPlanParticipant struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	TravelPlanId int `json:"travel_plan_id"`
	User_id int `json:"user_id"`
}

type TravelPlan struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	Title string `json:"title"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
	Description string `json:"description"`
	AuthorId int `json:"author"`
}

type TravelPlanTravelPlanTag struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	TravelPlanId int `json:"travel_plan_id"`
	TravelPlanTagId int `json:"travel_plan_tag_id"`
}

type TravelPlanTag struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	Name string `json:"name"`
}

type TravelPlanPhoto struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	URL string `json:"url"`
	TravelPlanId int `json:"travel_plan_id"`
}

type CreateTPInput struct {
	ID           int       `json:"id"`
	Title string `json:"title"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
	Description string `json:"description"`
	AuthorId int `json:"author"`
}

type UpdateTPInput struct {
	Title string `json:"title"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
	Description string `json:"description"`
	AuthorId int `json:"author"`
}

type UpdateTpTagInput struct {
	Name string `json:"name"`
}

type UpdateTPTPtagInput struct {
	TravelPlanId int `json:"travel_plan_id"`
	TravelPlanTagId int `json:"travel_plan_tag_id"`
}

type CreateTPTagInput struct {
	ID           int       `json:"id"`
	Name string `json:"name"`
}

type CreateTPTPTagInput struct {
	ID           int       `json:"id"`
	TravelPlanId int `json:"travel_plan_id"`
	TravelPlanTagId int `json:"travel_plan_tag_id"`
}

type myErr struct {
	message string
}

func (err myErr) Error() string {
	return err.message
}

// travel_plans/ - get
func GetAllTravelPlans(ctx context.Context) ([]TravelPlan, error){
	query := `
		SELECT id, created_at, edited_at, title, start_date, end_date, description, author_id
		FROM travel_plans
	`
	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var travelPlans []TravelPlan
	for rows.Next() {
		var tp TravelPlan
		err := rows.Scan(&tp.ID, &tp.CreatedAt, &tp.EditedAt, &tp.Title, &tp.StartDate, &tp.EndDate, &tp.Description, &tp.AuthorId)
		if err != nil {
			return nil, err
		}
		travelPlans = append(travelPlans, tp)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return travelPlans, nil
}

// travel_plans/{id} - get
func GetTravelPlanByID(ctx context.Context, TravelPLanId int) (*TravelPlan, error) {
	query := `
		SELECT id, created_at, edited_at, title, start_date, end_date, description, author_id
		FROM travel_plans
		WHERE id = $1
	`

	var tp TravelPlan
	err := db.QueryRow(ctx, query, TravelPLanId).Scan(&tp.ID, &tp.CreatedAt, &tp.EditedAt, &tp.Title, &tp.StartDate, &tp.EndDate, &tp.Description, &tp.AuthorId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &tp, nil
}

// travel_plans/?user_id={id} - post
func UserCreateTravelPlan(ctx context.Context, UserID int, input CreateTPInput) (*TravelPlan, error) {
	var tp TravelPlan

	query := `
		INSERT INTO travel_plans (id, created_at, edited_at, title, start_date, end_date, description, author_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, title, start_date, end_date, description, author_id
	`

	err := db.QueryRow(
		ctx,
		query,
		UserID,
		time.Now(),
		time.Now(),
		input.Title,
		input.StartDate,
		input.EndDate,
		input.Description,
		input.AuthorId,
	).Scan(&tp.ID, &tp.Title, &tp.StartDate, &tp.EndDate, &tp.Description, &tp.AuthorId)

	if err != nil {
		return nil, err
	}

	tp.CreatedAt, tp.EditedAt = time.Now(), time.Now()
	return &tp, err
}

// func FilterTravelPlans(TravelPlans []TravelPlan, queryParams map[string]interface{}) ([]TravelPlan, error) {
// 	var filteredTravelPlans []TravelPlan
// 	var TagIDs, ok1 = queryParams["tag_id"].([]int)
// 	var sortBy, ok2 = queryParams["sort_by"].(bool)
// 	var ascending, ok3 = queryParams["ascending"].(bool)
// 	var startDate, ok4 = queryParams["start_date"].(time.Time)
// 	var endDate, ok5 = queryParams["end_date"].(time.Time)
// 	if ok1 && ok4 && ok5 {

// 	}
// }

// travel_plans/?user_id={id}&... - get
func UserGetTravelPlans(ctx context.Context, queryParams map[string]any) ([]TravelPlan, error) {
	query := `
		SELECT id, created_at, edited_at, title, start_date, end_date, description, author_id
		FROM travel_plans
		WHERE id = $1
	`

	UserID, ok := queryParams["user_id"].(int)
	if !ok {
		return nil, myErr{"can't send request without user_id"}
	}

	rows, err := db.Query(ctx, query, UserID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var travelPlans []TravelPlan
	for rows.Next() {
		var tp TravelPlan
		err := rows.Scan(
			&tp.ID,
			&tp.CreatedAt,
			&tp.EditedAt,
			&tp.Title,
			&tp.StartDate,
			&tp.EndDate,
			&tp.Description,
			&tp.AuthorId,
		)
		if err != nil {
			return nil, err
		}
		travelPlans = append(travelPlans, tp)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return travelPlans, nil
}

// travel_plans/{id} - patch
func UpdateTravelPlan(ctx context.Context, TravelPlanID int, input UpdateTPInput) error {
	query := `
		UPDATE travel_plans
		SET
			edited_at = $1,
			title = COALESCE($2, title),
			start_date = COALESCE($3, start_date),
			end_date = COALESCE($4, end_date),
			description = COALESCE($5, description),
			author_id = COALESCE($6, author_id)
		WHERE id = $7
	`
	_, err := db.Exec(ctx,
		query,
		time.Now(),
		input.Title,
		input.StartDate,
		input.EndDate,
		input.Description,
		input.AuthorId,
		TravelPlanID,
	)
	if err != nil {
		return err
	}

	return nil
}

// travel_plans/{id} - delete
func DeleteTravelPlan(ctx context.Context, TravelPlanID int) (error) {
	query := `
		DELETE FROM travel_plans
		WHERE id = $1
	`
	_, err := db.Exec(ctx, query, TravelPlanID)
	if err != nil {
		return err
	}

	return nil
}

func GetAllTPTags(ctx context.Context) ([]TravelPlanTag, error) {
	query := `
		SELECT id, created_at, edited_at, name
		FROM tp_tags
	`

	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var travelPlanTags []TravelPlanTag
	for rows.Next() {
		var tpTag TravelPlanTag
		err := rows.Scan(&tpTag.ID, &tpTag.CreatedAt, &tpTag.EditedAt, &tpTag.Name)
		if err != nil {
			return nil, err
		}
		travelPlanTags = append(travelPlanTags, tpTag)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return travelPlanTags, nil
}

// travel_plan_tags - get
func GetAllTPTPTags(ctx context.Context) ([]TravelPlanTravelPlanTag, []string, error) {
	TPTags, err := GetAllTPTags(ctx)
	if err != nil {
		return nil, nil, err
	}

	query := `
		SELECT id, created_at, edited_at, title, travel_plan_id, travel_plan_tag_id
		FROM tp_tp_tags
	`
	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	var tpTpTags []TravelPlanTravelPlanTag
	for rows.Next() {
		var tpTpTag TravelPlanTravelPlanTag
		err := rows.Scan(&tpTpTag.ID, &tpTpTag.CreatedAt, &tpTpTag.EditedAt, &tpTpTag.TravelPlanId, &tpTpTag.TravelPlanTagId)
		if err != nil {
			return nil, nil, err
		}
		tpTpTags = append(tpTpTags, tpTpTag)
	}
	
	if err = rows.Err(); err != nil {
		return nil, nil, err
	}
	IdsToTagNames := make(map[int]string)
	for _, el := range TPTags {
		IdsToTagNames[el.ID] = el.Name
	}
	TagNames := make([]string, len(IdsToTagNames))
	for key, value := range IdsToTagNames {
		TagNames[key] = value
	}

	return tpTpTags, TagNames, nil
}

func CreateTpTag(ctx context.Context, input CreateTPTagInput) (*TravelPlanTag, error) {
	var tpTag TravelPlanTag
	query := `
		INSERT INTO tp_tags (id, created_at, edited_at, name)
		VALUES ($1, $2, $3, $4)
		RETURNING id, name
	`

	err := db.QueryRow(
		ctx,
		query,
		input.ID,
		time.Now(),
		time.Now(),
		input.Name,
	).Scan(&tpTag.ID, &tpTag.Name)

	if err != nil {
		return nil, err
	}

	tpTag.CreatedAt, tpTag.EditedAt = time.Now(), time.Now()
	return &tpTag, err
} 

// travel_plan_tags - post
func CreateTPTPTag(ctx context.Context, input CreateTPTPTagInput) (*TravelPlanTravelPlanTag, error) {
	var tpTpTag TravelPlanTravelPlanTag
	query := `
		INSERT INTO tp_tp_tags (id, created_at, edited_at, travel_plan_id, travel_plan_tag_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, travel_plan_id, travel_plan_tag_id
	`

	err := db.QueryRow(
		ctx,
		query,
		input.ID,
		time.Now(),
		time.Now(),
		input.TravelPlanId,
		input.TravelPlanTagId,
	).Scan(&tpTpTag.ID, &tpTpTag.TravelPlanId, &tpTpTag.TravelPlanTagId)

	if err != nil {
		return nil, err
	}

	tpTpTag.CreatedAt, tpTpTag.EditedAt = time.Now(), time.Now()
	return &tpTpTag, err
}



func GetTPTagByID(ctx context.Context, TPTagID int) (*TravelPlanTag, error){
	query := `
	SELECT id, created_at, edited_at, name
	FROM tp_tags
	WHERE id = $1
	`
	var tpTag TravelPlanTag
	err := db.QueryRow(ctx, query, TPTagID).Scan(&tpTag.ID, &tpTag.CreatedAt, &tpTag.EditedAt, &tpTag.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &tpTag,  nil
}

//travel_plan_tags/{id} - get
func GetTPTPTagByID(ctx context.Context, TPTPTagID int) (*TravelPlanTravelPlanTag, error) {
	query := `
		SELECT id, created_at, edited_at, title, travel_plan_id, travel_plan_tag_id
		FROM tp_tp_tags
		WHERE id = $1
	`

	var tpTpTag TravelPlanTravelPlanTag
	err := db.QueryRow(ctx, query, TPTPTagID).Scan(&tpTpTag.ID, &tpTpTag.CreatedAt, &tpTpTag.EditedAt, &tpTpTag.TravelPlanId, &tpTpTag.TravelPlanTagId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &tpTpTag, nil
}

//travel_plan_tags/{id} - patch
func UpdateTPTagByID(ctx context.Context, TPTagID int, input UpdateTpTagInput) error {
	query := `
		UPDATE tp_tags
		SET
			edited_at = $1,
			name = COALESCE($2, name),
		WHERE id = $3
	`
	_, err := db.Exec(ctx,
		query,
		time.Now(),
		input.Name,
		TPTagID,
	)
	if err != nil {
		return err
	}

	return nil
}

func UpdateTPTPTagByID(ctx context.Context, TPTagID int, input UpdateTPTPtagInput) error {
	query := `
		UPDATE tp_tp_tags
		SET
			edited_at = $1,
			travel_plan_id = COALESCE($2, travel_plan_id),
			travel_plan_tag_id = COALESCE($3, travel_plan_tag_id)

		WHERE id = $4
	`
	_, err := db.Exec(ctx,
		query,
		time.Now(),
		input.TravelPlanId,
		input.TravelPlanTagId,
		TPTagID,
	)
	if err != nil {
		return err
	}

	return nil
}

//travel_plan_tags/{id} - delete
func DeleteTPTagByID(ctx context.Context, TPTagID int) (error) {
	query := `
		DELETE FROM tp_tags
		WHERE id = $1
	`
	_, err := db.Exec(ctx, query, TPTagID)
	if err != nil {
		return err
	}

	return nil
}

func DeleteTPTPTagByID(ctx context.Context, TPTPTagID int) (error) {
	query := `
		DELETE FROM tp_tp_tags
		WHERE id = $1
	`
	_, err := db.Exec(ctx, query, TPTPTagID)
	if err != nil {
		return err
	}

	return nil
}

func GetAllTPParticipants(ctx context.Context) ([]TravelPlanParticipant, error) {
	query := `
		SELECT id, created_at, edited_at, travel_plan_id, user_id
		FROM tp_participants
	`

	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var travelPlanParticipants []TravelPlanParticipant
	for rows.Next() {
		var tpParticipant TravelPlanParticipant
		err := rows.Scan(&tpParticipant.ID, &tpParticipant.CreatedAt, &tpParticipant.EditedAt, &tpParticipant.TravelPlanId, &tpParticipant.User_id)
		if err != nil {
			return nil, err
		}
		travelPlanParticipants = append(travelPlanParticipants, tpParticipant)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return travelPlanParticipants, nil
}


func GetAllTpPhotos(ctx context.Context) ([]TravelPlanPhoto, error) {
	query := `
		SELECT id, created_at, edited_at, url, travel_plan_id
		FROM tp_photos
	`

	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var travelPlanPhotos []TravelPlanPhoto
	for rows.Next() {
		var tpPhoto TravelPlanPhoto
		err := rows.Scan(&tpPhoto.ID, &tpPhoto.CreatedAt, &tpPhoto.EditedAt, &tpPhoto.URL, &tpPhoto.TravelPlanId)
		if err != nil {
			return nil, err
		}
		travelPlanPhotos = append(travelPlanPhotos, tpPhoto)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}
	return travelPlanPhotos, nil
}