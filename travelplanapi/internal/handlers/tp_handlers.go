package handlers

import (
	"errors"
	"fmt"
	"log"
	"slices"

	//"log"
	"net/http"
	"net/url"
	"strconv"
	"time"

	"github.com/Kandler3/JourneySquad/travelplanapi/internal/models"
	"github.com/gin-gonic/gin"
)

func GetQueryParam(c *gin.Context, ParamStr string) (int, error) {
	if ParamStr == "" {
		return -1, nil
	}
	Param, err := strconv.Atoi(ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid %s", ParamStr)})
		return 0, errors.New("smth wrong with query param")
	}
	return Param, nil
}

func GetBoolQueryParam(c *gin.Context, ParamStr string) (bool, error) {
	if ParamStr == "" {
		return true, nil
	}
	Param, err := strconv.ParseBool(ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid %s", ParamStr)})
		return true, errors.New("smth wrong with query param")
	}
	return Param, nil
}

func GetDateQueryParam(c *gin.Context, ParamStr string) (time.Time, error) {
	if ParamStr == "" {
		return time.Time{}, nil
	}
	Param, err := time.Parse("2006-01-02", ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid %s", ParamStr)})
		return time.Time{}, errors.New("smth wrong with query param")
	}
	return Param, nil
}

func GetArrayQueryParam(c *gin.Context, mp *url.Values, s string) ([]int, error) {
	ParamStrArr := (*mp)[s]
	ParamArr := make([]int, 0)
	for _, el := range ParamStrArr {
		elem, err := strconv.Atoi(el)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid %s", s)})
			return nil, errors.New("smth wrong with query param")
		}
		ParamArr = append(ParamArr, elem)
	}

	return ParamArr, nil
}

// GET /travel_plans
func GetTPsHandler(c *gin.Context) {
	ctx := c.Request.Context()
	TravelPlans, err := models.GetAllTravelPlans(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, TravelPlans)
}

// POST /travel_plans/
func CreateTravelPlanHandler(c *gin.Context) {
	var input models.CreateTPInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx := c.Request.Context()
	travelPlan, err := models.UserCreateTravelPlan(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, travelPlan)
}

// GET /travel_plans/?query={string}&user_id={id}&sort_by={parameter}&ascending={bool}&start_date={date}&end_date={date}&tag={tag_id}&(tag={tag_id}){n}
func UserGetTPHandler(c *gin.Context) {
	ctx := c.Request.Context()
	queryParams := c.Request.URL.Query()
	//log.Println(queryParams.Get("query"))
	userID, err := GetQueryParam(c, queryParams.Get("user_id"))
	if err != nil {
		return
	}
	query := queryParams.Get("query")
	//log.Println(query)
	sortBy := queryParams.Get("sort_by")
	ascending, err := GetBoolQueryParam(c, queryParams.Get("ascending"))
	if err != nil {
		return
	}
	startDate, err := GetDateQueryParam(c, queryParams.Get("start_date"))
	if err != nil {
		return
	}
	endDate, err := GetDateQueryParam(c, queryParams.Get("end_date"))
	if err != nil {
		return
	}

	tags, err := GetArrayQueryParam(c, &queryParams, "tag")
	if err != nil {
		return
	}

	userTP, err := models.UserGetTravelPlans(ctx, map[string]any{"user_id": userID, "ascending": ascending, "sort_by": sortBy, "start_date": startDate, "end_date": endDate, "tag_id": tags, "query": query})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, userTP)
}

// GET /travel_plans/:id
func GetTPByIdHandler(c *gin.Context) {
	ctx := c.Request.Context()
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	TP, err := models.GetTravelPlanByID(ctx, ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, TP)
}

// PATCH /travel_plans/:id
func UpdateTPHandler(c *gin.Context) {
	type UpdateTPBody struct {
		models.UpdateTPInput
		Tags []models.TravelPlanTag `json:"tags"`
	}

	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}

	var input models.UpdateTPInput
	var body UpdateTPBody
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input = body.UpdateTPInput
	log.Println(input)

	ctx := c.Request.Context()
	if err := models.UpdateTravelPlan(ctx, ID, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	prevTags, err := models.GetTpTagsByID(ctx, ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := models.UpdateTravelPlan(ctx, ID, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for _, tag := range body.Tags {
		if !slices.Contains(prevTags, tag) {
			_, err := models.CreateTPTPTag(ctx, models.CreateTPTPTagInput{TravelPlanId: ID, TravelPlanTagId: tag.ID})
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
	}

	for _, tag := range prevTags {
		if !slices.Contains(body.Tags, tag) {
			err := models.DeleteTPTPTagByIDs(ctx, ID, tag.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		}
	}

	c.Status(http.StatusNoContent)
}

// DELETE /travel_plan/:id
func DeleteTPHandler(c *gin.Context) {
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	ctx := c.Request.Context()
	if err := models.DeleteTravelPlan(ctx, ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// GET /travel_plan_tags
func GetTravelPlanTags(c *gin.Context) {
	ctx := c.Request.Context()
	TravelPlanTags, err := models.GetAllTPTags(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, TravelPlanTags)
}

// POST /travel_plan_tags
func CreateTPTagHandler(c *gin.Context) {
	var input models.CreateTPTagInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx := c.Request.Context()
	travelPlanTags, err := models.CreateTpTag(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, travelPlanTags)
}

// GET /travel_plan_tags/:id
func GetTPTagByID(c *gin.Context) {
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	ctx := c.Request.Context()
	TPtag, err := models.GetTPTagByID(ctx, ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, TPtag)
}

// PATCH /travel_plan_tags/:id
func UpdateTPTagHandler(c *gin.Context) {
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	var input models.UpdateTpTagInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx := c.Request.Context()
	if err := models.UpdateTPTagByID(ctx, ID, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// DELETE /travel_plan_tag/:id
func DeleteTPTagHandler(c *gin.Context) {
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	ctx := c.Request.Context()
	if err := models.DeleteTPTagByID(ctx, ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// POST /travel_plans/{id}/participants
func AddParticipanToTPtHandler(c *gin.Context) {
	tpID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	ctx := c.Request.Context()

	var input models.TPParticipantInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	TPparticipant, err := models.AddParticipantToTP(ctx, tpID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, TPparticipant)
}

// DELETE /travel_plans/{id}/participants/{participant_id}
func DeleteParticipant(c *gin.Context) {
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	participantID, err := GetQueryParam(c, c.Param("participant_id"))
	if err != nil {
		return
	}
	log.Println(ID, participantID)
	ctx := c.Request.Context()
	if err := models.DeleteParticipantfromTP(ctx, ID, participantID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// POST /travel_plans/{id}/photos
func CreateTpPhotoHandler(c *gin.Context) {
	tpId, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	ctx := c.Request.Context()

	type CreateTpPhotoInput struct {
		ID  int    `json:"id"`
		URL string `json:"url"`
	}
	var input CreateTpPhotoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tpPhoto, err := models.CreateTpPhoto(ctx, tpId, input.ID, input.URL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tpPhoto)
}

// DELETE /travel_plans/{id}/photos/{photo_id}
func DeleteTPPhotoHandler(c *gin.Context) {
	ID, err := GetQueryParam(c, c.Param("id"))
	if err != nil {
		return
	}
	photoID, err := GetQueryParam(c, c.Param("photo_id"))
	if err != nil {
		return
	}
	ctx := c.Request.Context()
	if err := models.DeleteTpPhoto(ctx, ID, photoID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// GET /travel_plans/login
func GetActiveTPsByIdHandler(c *gin.Context) {
	ctx := c.Request.Context()
	Tps, err := models.GetActiveTPsById(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return 
	}
	c.JSON(http.StatusOK, Tps)
}