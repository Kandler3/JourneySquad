package models

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"slices"
	"sort"

	//"strconv"
	"strings"
	"time"

	"github.com/Kandler3/JourneySquad/api/pkg/db"
	"github.com/Kandler3/JourneySquad/api/pkg/middlewares"
)

type TravelPlanParticipant struct {
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	TravelPlanId int       `json:"travel_plan_id"`
	User_id      int       `json:"user_id"`
}

type TravelPlan struct {
	ID           int                     `json:"id"`
	CreatedAt    time.Time               `json:"created_at"`
	EditedAt     time.Time               `json:"edited_at"`
	Title        string                  `json:"title"`
	StartDate    time.Time               `json:"startDate"`
	EndDate      time.Time               `json:"endDate"`
	Description  string                  `json:"description"`
	AuthorId     UserView                `json:"author"`
	Tags         []TravelPlanTag         `json:"tags"`
	Photos       []TravelPlanPhoto       `json:"photos"`
	Participants []TravelPlanParticipant `json:"participants"`
}

type TravelPlanTravelPlanTag struct {
	ID              int       `json:"id"`
	CreatedAt       time.Time `json:"created_at"`
	EditedAt        time.Time `json:"edited_at"`
	TravelPlanId    int       `json:"travel_plan_id"`
	TravelPlanTagId int       `json:"travel_plan_tag_id"`
}

type TravelPlanTag struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	EditedAt  time.Time `json:"edited_at"`
	Name      string    `json:"name"`
}

type TravelPlanPhoto struct {
	Photo_id     int       `json:"photo_id"`
	ID           int       `json:"id"`
	CreatedAt    time.Time `json:"created_at"`
	EditedAt     time.Time `json:"edited_at"`
	URL          string    `json:"url"`
	TravelPlanId int       `json:"travel_plan_id"`
}

type CreateTPInput struct {
	ID           int                     `json:"id"`
	Title        string                  `json:"title"`
	StartDate    time.Time               `json:"startDate"`
	EndDate      time.Time               `json:"endDate"`
	Description  string                  `json:"description"`
	AuthorId     UserView                `json:"author"`
	Tags         []TravelPlanTag         `json:"tags"`
	Photos       []TravelPlanPhoto       `json:"photos"`
	Participants []TravelPlanParticipant `json:"participants"`
}

type UpdateTPInput struct {
	Title       string    `json:"title"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Description string    `json:"description"`
	AuthorId    int       `json:"author"`
}

type UpdateTpTagInput struct {
	Name string `json:"name"`
}

type UpdateTPTPtagInput struct {
	TravelPlanId    int `json:"travel_plan_id"`
	TravelPlanTagId int `json:"travel_plan_tag_id"`
}

type CreateTPTagInput struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type CreateTPTPTagInput struct {
	TravelPlanId    int `json:"travel_plan_id"`
	TravelPlanTagId int `json:"travel_plan_tag_id"`
}

type TPParticipantInput struct {
	User_id int `json:"userId"`
}

type UserView struct {
	TelegramID int64  `json:"id"`
	Name       string `json:"name"`
	Age        int    `json:"age"`
	Gender     string `json:"gender"`
	Bio        string `json:"bio"`
	Avatar     string `json:"avatarUrl"`
}

// travel_plans/ - get
func GetAllTravelPlans(ctx context.Context) ([]TravelPlan, error) {
	query := `
		SELECT id, created_at, edited_at, title, start_date, end_date, description, author
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
		err := rows.Scan(&tp.ID, &tp.CreatedAt, &tp.EditedAt, &tp.Title, &tp.StartDate, &tp.EndDate, &tp.Description, &tp.AuthorId.TelegramID)
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
		SELECT id, created_at, edited_at, title, start_date, end_date, description, author
		FROM travel_plans
		WHERE id = $1
	`

	var tp TravelPlan
	err := db.QueryRow(ctx, query, TravelPLanId).Scan(&tp.ID, &tp.CreatedAt, &tp.EditedAt, &tp.Title, &tp.StartDate, &tp.EndDate, &tp.Description, &tp.AuthorId.TelegramID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	tpPhotos, err := GetTpPhotosById(ctx, tp.ID)
	if err != nil {
		return nil, err
	}
	tp.Photos = tpPhotos
	tpTags, err := GetTpTagsByID(ctx, tp.ID)
	if err != nil {
		return nil, err
	}
	tp.Tags = tpTags
	tpParticipants, err := GetTpParticipantsById(ctx, tp.ID)
	if err != nil {
		return nil, err
	}
	tp.Participants = tpParticipants
	return &tp, nil
}

func GetUserByTgId(ctx context.Context, telegramId int64) (*UserView, error){
	url := fmt.Sprintf("http://userapi/user/%d", telegramId)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}
	client := http.DefaultClient
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("ошибка при выполнении запроса: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		return nil, fmt.Errorf("микросервис вернул ошибку: %s", string(body))
	}
	var author UserView
	if err := json.NewDecoder(resp.Body).Decode(&author); err != nil {
		return nil, fmt.Errorf("ошибка при парсинге ответа: %v", err)
	}

	return &author, nil
}

func GetTelegramIdFromCtx(ctx context.Context) (int64, bool) {
	initData, ok := middlewares.CtxInitData(ctx)
	if !ok {
		return 0, false
	}
	return initData.User.ID, initData.User.ID != 0
}

// travel_plans/ - post
func UserCreateTravelPlan(ctx context.Context, input CreateTPInput) (*TravelPlan, error) {
	var tp TravelPlan

	query := `
		INSERT INTO travel_plans (id, created_at, edited_at, title, start_date, end_date, description, author)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, title, start_date, end_date, description, author
	`
	var authorId int
	var str1, str2 string
	err := db.QueryRow(
		ctx,
		query,
		input.ID,
		time.Now(),
		time.Now(),
		input.Title,
		input.StartDate,
		input.EndDate,
		input.Description,
		input.AuthorId.TelegramID,
	).Scan(&tp.ID, &tp.Title, &str1, &str2, &tp.Description, &authorId)
	if err != nil {
		return nil, err
	}
	log.Println(input.StartDate, input.EndDate)
	tp.StartDate, err = time.Parse("2006-01-02T15:04:05Z", str1)
	if err != nil {
		return nil, err
	}
	tp.EndDate, err = time.Parse("2006-01-02T15:04:05Z", str2)
	if err != nil {
		return nil, err
	}
	log.Println(tp.StartDate, tp.EndDate)
	tp.Participants = input.Participants
	_, err = AddParticipantToTP(ctx, tp.ID, TPParticipantInput{User_id: authorId})
	if err != nil {
		return nil, err
	}
	tpPhotos := make([]TravelPlanPhoto, 0)
	for _, el := range input.Photos {
		tpPhoto, err := CreateTpPhoto(ctx, tp.ID, el.ID, el.URL)
		if err != nil {
			return nil, err
		}
		tpPhotos = append(tpPhotos, *tpPhoto)
	}
	tp.Photos = tpPhotos
	tpTags := make([]TravelPlanTag, 0)
	for _, el := range input.Tags {
		_, err := CreateTpTag(ctx, CreateTPTagInput{ID: el.ID, Name: el.Name})
		if err != nil {
			return nil, err
		}
		_, err = CreateTPTPTag(ctx, CreateTPTPTagInput{TravelPlanId: input.ID, TravelPlanTagId: el.ID})
		if err != nil {
			return nil, err
		}
		tpTags = append(tpTags, el)
	}
	tp.Tags = tpTags
	tp.AuthorId = input.AuthorId
	tp.CreatedAt = time.Now()
	tp.EditedAt = time.Now()
	return &tp, err
}

func FilterTravelPlans(ctx context.Context, TravelPlans []TravelPlan, queryParams map[string]interface{}) ([]TravelPlan, error) {
	//log.Println(queryParams)
	filteredTravelPlans := make([]TravelPlan, 0)
	filteredTravelPlans = append(filteredTravelPlans, TravelPlans...)
	var UserID = queryParams["user_id"].(int)
	var Query = queryParams["query"].(string)
	var TagIDs = queryParams["tag_id"].([]int)
	var sortBy = queryParams["sort_by"].(string)
	var ascending = queryParams["ascending"].(bool)
	var startDate = queryParams["start_date"].(time.Time)
	var endDate = queryParams["end_date"].(time.Time)
	if UserID != -1 {
		newFiltered := make([]TravelPlan, 0)
		var oldFiltered []TravelPlan
		if len(filteredTravelPlans) == 0 {
			oldFiltered = TravelPlans
		} else {
			oldFiltered = filteredTravelPlans
		}
		for _, el := range oldFiltered {
			if int(el.AuthorId.TelegramID) == UserID {
				filteredTravelPlans = append(filteredTravelPlans, el)
			}
		}
		filteredTravelPlans = newFiltered
	}
	if Query != "" {
		newFiltered := make([]TravelPlan, 0)
		var oldFiltered []TravelPlan
		if len(filteredTravelPlans) == 0 {
			oldFiltered = TravelPlans
		} else {
			oldFiltered = filteredTravelPlans
		}
		for _, el := range oldFiltered {
			if strings.Contains(el.Title, Query) {
				newFiltered = append(newFiltered, el)
			}
		}
		filteredTravelPlans = newFiltered
	}
	if len(TagIDs) != 0 {
		TPtoTags, err := GetAllTPTPTags(ctx)
		if err != nil {
			return nil, err
		}
		sort.Ints(TagIDs)
		for _, el := range TravelPlans {
			j := 0
			k := 0
			arr1 := TPtoTags[int(el.ID)]
			for j < len(arr1) && k < len(TagIDs) {
				if arr1[j] == TagIDs[k] {
					k++
				}
				j++
			}
			if k == len(TagIDs) {
				filteredTravelPlans = append(filteredTravelPlans, el)
			}
		}
	}
	ok4 := (startDate != time.Time{})
	ok5 := (endDate != time.Time{})
	if ok4 || ok5 {
		newFiltered := make([]TravelPlan, 0)
		var oldFiltered []TravelPlan
		if len(filteredTravelPlans) == 0 {
			oldFiltered = TravelPlans
		} else {
			oldFiltered = filteredTravelPlans
		}
		for _, el := range oldFiltered {
			if ok4 && ok5 && (el.StartDate.After(startDate) || el.StartDate.Equal(startDate)) && (el.EndDate.Before(endDate) || el.EndDate.Equal(endDate)) {
				newFiltered = append(newFiltered, el)
			}
			if ok4 && !ok5 && (el.StartDate.After(startDate) || el.StartDate.Equal(startDate)) {
				newFiltered = append(newFiltered, el)
			}
			if !ok4 && ok5 && (el.EndDate.Before(endDate) || el.EndDate.Equal(endDate)) {
				newFiltered = append(newFiltered, el)
			}
		}
		filteredTravelPlans = newFiltered
	}
	if sortBy != "" {
		if sortBy == "title" {
			sort.Slice(filteredTravelPlans, func(i, j int) bool {
				return filteredTravelPlans[i].Title < filteredTravelPlans[j].Title
			})
		} else if sortBy == "start_date" {
			sort.Slice(filteredTravelPlans, func(i, j int) bool {
				return filteredTravelPlans[i].StartDate.Before(filteredTravelPlans[j].StartDate)
			})
		}
	}
	if !ascending {
		slices.Reverse(filteredTravelPlans)
	}
	return filteredTravelPlans, nil
}

// travel_plans/?user_id={id}&... - get
func UserGetTravelPlans(ctx context.Context, queryParams map[string]any) ([]TravelPlan, error) {
	travelPlans, err := GetAllTravelPlans(ctx)
	if err != nil {
		return nil, err
	}
	filteredTravelPlans, err := FilterTravelPlans(ctx, travelPlans, queryParams)
	if err != nil {
		return nil, err
	}

	for i, el := range filteredTravelPlans {
		tptags, err := GetTpTagsByID(ctx, el.ID)
		if err != nil {
			return nil, err
		}
		tpphotos, err := GetTpPhotosById(ctx, el.ID)
		if err != nil {
			return nil, err
		}
		tpparticipants, err := GetTpParticipantsById(ctx, el.ID)
		if err != nil {
			return nil, err
		}
		filteredTravelPlans[i].Tags = tptags
		filteredTravelPlans[i].Photos = tpphotos
		filteredTravelPlans[i].Participants = tpparticipants
		//user, err := GetUserByTgId(ctx, el.AuthorId.TelegramID)
		// if err != nil {
		// 	return nil, err
		// }
		filteredTravelPlans[i].AuthorId = el.AuthorId //*user
	}
	return filteredTravelPlans, nil
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
			author = COALESCE($6, author)
		WHERE id = $7
	`
	_, err := db.Exec(
		ctx,
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
func DeleteTravelPlan(ctx context.Context, TravelPlanID int) error {
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
func GetAllTPTPTags(ctx context.Context) (map[int][]int, error) {
	query := `
		SELECT id, created_at, edited_at, travel_plan_id, travel_plan_tag_id
		FROM tp_tp_tags
	`
	rows, err := db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tpTpTags []TravelPlanTravelPlanTag
	for rows.Next() {
		var tpTpTag TravelPlanTravelPlanTag
		err := rows.Scan(&tpTpTag.ID, &tpTpTag.CreatedAt, &tpTpTag.EditedAt, &tpTpTag.TravelPlanId, &tpTpTag.TravelPlanTagId)
		if err != nil {
			return nil, err
		}
		tpTpTags = append(tpTpTags, tpTpTag)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	IdsToTags := make(map[int][]int)
	for _, el := range tpTpTags {
		_, ok := IdsToTags[el.TravelPlanId]
		if !ok {
			IdsToTags[el.TravelPlanId] = make([]int, 0)
			IdsToTags[el.TravelPlanId] = append(IdsToTags[el.TravelPlanId], el.TravelPlanTagId)
			continue
		}
		IdsToTags[el.TravelPlanId] = append(IdsToTags[el.TravelPlanId], el.TravelPlanTagId)
	}

	for key, _ := range IdsToTags {
		sort.Ints(IdsToTags[key])
	}
	return IdsToTags, nil
}

func GetTpTagsByID(ctx context.Context, tpId int) ([]TravelPlanTag, error) {
	query := `
		SELECT id, created_at, edited_at, travel_plan_id, travel_plan_tag_id
		FROM tp_tp_tags
		WHERE travel_plan_id = $1
	`
	rows, err := db.Query(ctx, query, tpId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	uniqueTags := make(map[int]struct{})
	for rows.Next() {
		var tpTpTag TravelPlanTravelPlanTag
		err := rows.Scan(&tpTpTag.ID, &tpTpTag.CreatedAt, &tpTpTag.EditedAt, &tpTpTag.TravelPlanId, &tpTpTag.TravelPlanTagId)
		if err != nil {
			return nil, err
		}
		uniqueTags[tpTpTag.TravelPlanTagId] = struct{}{}
	}

	Tags := make([]TravelPlanTag, 0)
	for el, _ := range uniqueTags {
		Tag, err := GetTPTagByID(ctx, el)
		if err != nil {
			return nil, err
		}
		Tags = append(Tags, *Tag)
	}
	return Tags, nil
}

func GetTpPhotosById(ctx context.Context, tpId int) ([]TravelPlanPhoto, error) {
	query := `
		SELECT photo_id, id, created_at, edited_at, travel_plan_id, url
		FROM tp_photos
		WHERE travel_plan_id = $1
	`
	rows, err := db.Query(ctx, query, tpId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	Photos := make([]TravelPlanPhoto, 0)
	for rows.Next() {
		var Photo TravelPlanPhoto
		var phID int
		err := rows.Scan(&phID, &Photo.ID, &Photo.CreatedAt, &Photo.EditedAt, &Photo.TravelPlanId, &Photo.URL)
		if err != nil {
			return nil, err
		}
		Photos = append(Photos, Photo)
	}
	uniquePhotos := make(map[int]TravelPlanPhoto)
	for _, el := range Photos {
		uniquePhotos[el.ID] = el
	}
	log.Println(uniquePhotos)
	Photoss := make([]TravelPlanPhoto, 0)
	for _, el := range uniquePhotos {
		Photoss = append(Photoss, el)
	}
	return Photoss, nil
}

func GetTpParticipantsById(ctx context.Context, tpId int) ([]TravelPlanParticipant, error) {
	query := `
		SELECT participant_id, id, created_at, edited_at, travel_plan_id, user_id
		FROM tp_participants
		WHERE travel_plan_id = $1
	`
	rows, err := db.Query(ctx, query, tpId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tpParticipants := make([]TravelPlanParticipant, 0)
	for rows.Next() {
		var tpParticipant TravelPlanParticipant
		var p_id int
		err := rows.Scan(&p_id, &tpParticipant.ID, &tpParticipant.CreatedAt, &tpParticipant.EditedAt, &tpParticipant.TravelPlanId, &tpParticipant.User_id)
		if err != nil {
			return nil, err
		}
		tpParticipants = append(tpParticipants, tpParticipant)
	}
	mp := make(map[int]TravelPlanParticipant)
	for _, el := range tpParticipants {
		mp[el.ID] = el
	}
	tpParticipantss := make([]TravelPlanParticipant, 0)
	for _, el := range mp {
		tpParticipantss = append(tpParticipantss, el)
	}
	return tpParticipantss, nil
}

func CreateTpTag(ctx context.Context, input CreateTPTagInput) (*TravelPlanTag, error) {
	var tpTag TravelPlanTag
	query := `
		INSERT INTO tp_tags (id, created_at, edited_at, name)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (id) DO UPDATE SET name = tp_tags.name 
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
		tpTag.ID = input.ID
		tpTag.Name = input.Name
	}

	tpTag.CreatedAt, tpTag.EditedAt = time.Now(), time.Now()
	return &tpTag, nil
}

// travel_plan_tags - post
func CreateTPTPTag(ctx context.Context, input CreateTPTPTagInput) (*TravelPlanTravelPlanTag, error) {
	var tpTpTag TravelPlanTravelPlanTag
	query := `
		INSERT INTO tp_tp_tags (created_at, edited_at, travel_plan_id, travel_plan_tag_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, travel_plan_id, travel_plan_tag_id
	`

	err := db.QueryRow(
		ctx,
		query,
		time.Now(),
		time.Now(),
		input.TravelPlanId,
		input.TravelPlanTagId,
	).Scan(&tpTpTag.ID, &tpTpTag.TravelPlanId, &tpTpTag.TravelPlanTagId)

	if err != nil {
		return nil, err
	}

	tpTpTag.CreatedAt, tpTpTag.EditedAt = time.Now(), time.Now()
	return &tpTpTag, nil
}

func GetTPTagByID(ctx context.Context, TPTagID int) (*TravelPlanTag, error) {
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

	return &tpTag, nil
}

// travel_plan_tags/{id} - get
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

// travel_plan_tags/{id} - patch
func UpdateTPTagByID(ctx context.Context, TPTagID int, input UpdateTpTagInput) error {
	query := `
		UPDATE tp_tags
		SET
			edited_at = $1,
			name = COALESCE($2, name)
		WHERE id = $3
	`
	log.Println(input, TPTagID)
	_, err := db.Exec(
		ctx,
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
	_, err := db.Exec(
		ctx,
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

// travel_plan_tags/{id} - delete
func DeleteTPTagByID(ctx context.Context, TPTagID int) error {
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

func DeleteTPTPTagByID(ctx context.Context, TPTPTagID int) error {
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

func DeleteTPTPTagByIDs(ctx context.Context, TPID int, TPTagID int) error {
	query := `
		DELETE FROM tp_tp_tags
		WHERE travel_plan_id = $1 and travel_plan_tag_id = $2
	`
	_, err := db.Exec(ctx, query, TPID, TPTagID)
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

func AddParticipantToTP(ctx context.Context, TpId int, input TPParticipantInput) (*TravelPlanParticipant, error) {
	var TpParticipant TravelPlanParticipant
	query := `
		INSERT INTO tp_participants (id, created_at, edited_at, travel_plan_id, user_id)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, travel_plan_id, user_id
	`
	err := db.QueryRow(
		ctx,
		query,
		input.User_id,
		time.Now(),
		time.Now(),
		TpId,
		input.User_id,
	).Scan(&TpParticipant.ID, &TpParticipant.TravelPlanId, &TpParticipant.User_id)

	log.Println(input.User_id,TpParticipant.ID)

	if err != nil {
		return nil, err
	}
	TpParticipant.CreatedAt, TpParticipant.EditedAt = time.Now(), time.Now()
	return &TpParticipant, nil
}

func DeleteParticipantfromTP(ctx context.Context, TPid int, ParticipantId int) error {
	query := `
		DELETE FROM tp_participants
		WHERE id = $1 AND travel_plan_id = $2
	`
	log.Println(TPid, ParticipantId)
	_, err := db.Exec(ctx, query, ParticipantId, TPid)
	if err != nil {
		return err
	}

	return nil
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

func CreateTpPhoto(ctx context.Context, tpID int, ID int, url string) (*TravelPlanPhoto, error) {
	var tpPhoto TravelPlanPhoto
	query := `
		INSERT INTO tp_photos (id, created_at, edited_at, travel_plan_id, url)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, travel_plan_id, url
	`
	err := db.QueryRow(
		ctx,
		query,
		ID,
		time.Now(),
		time.Now(),
		tpID,
		url,
	).Scan(&tpPhoto.ID, &tpPhoto.TravelPlanId, &tpPhoto.URL)
	if err != nil {
		return nil, err
	}
	log.Println(tpPhoto.ID, tpPhoto.TravelPlanId, tpPhoto.URL)
	tpPhoto.CreatedAt, tpPhoto.EditedAt = time.Now(), time.Now()
	return &tpPhoto, nil
}

func DeleteTpPhoto(ctx context.Context, tpId int, photoId int) error {
	query := `
		DELETE FROM tp_photos
		WHERE id = $1 AND travel_plan_id = $2
	`
	_, err := db.Exec(ctx, query, photoId, tpId)
	if err != nil {
		return err
	}

	return nil
}

func GetTpPhotoById(ctx context.Context, Id int) (*TravelPlanPhoto, error) {
	query := `
		SELECT * FROM tp_photos
		WHERE id = $1
	`
	var tpPhoto TravelPlanPhoto
	err := db.QueryRow(ctx, query, Id).Scan(&tpPhoto.ID, &tpPhoto.CreatedAt, &tpPhoto.EditedAt, &tpPhoto.URL, &tpPhoto.TravelPlanId)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &tpPhoto, nil
}

func GetActiveTPsById(ctx context.Context) ([]TravelPlan, error) {
	query := `
		SELECT * FROM travel_plans
		WHERE author = $1
	`
	authorId, ok := GetTelegramIdFromCtx(ctx)
	if !ok {
		return nil, fmt.Errorf("wrong tg")
	}
	user, err := GetUserByTgId(ctx, int64(authorId))
	if err != nil {
		return nil, err
	}
	activeTps := make([]TravelPlan, 0)
	rows, err := db.Query(ctx, query, user.TelegramID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var tp TravelPlan
		err := rows.Scan(&tp.ID, &tp.CreatedAt, &tp.EditedAt, &tp.Title, &tp.StartDate, &tp.EndDate, &tp.Description, &tp.AuthorId.TelegramID)
		if err != nil {
			return nil, err
		}
		activeTps = append(activeTps, tp)
		tp.AuthorId = *user
	}
	return activeTps, nil
}
