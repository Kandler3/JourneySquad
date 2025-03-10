package tphandlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/Kandler3/JourneySquad/api/internal/models"
	"github.com/gin-gonic/gin"
)

func GetQueryParam(c *gin.Context, s string) (int, error) {
	ParamStr := c.Param(s)
	Param, err := strconv.Atoi(ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  fmt.Sprintf("invalid %s", s)})
		return 0, errors.New("smth wrong with query param")
	}
	return Param, nil
}

func GetBoolQueryParam(c *gin.Context, s string) (bool, error) {
	ParamStr := c.Param(s)
	Param, err := strconv.ParseBool(ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  fmt.Sprintf("invalid %s", s)})
		return false, errors.New("smth wrong with query param")
	}
	return Param, nil
}

func GetDateQueryParam(c *gin.Context, s string) (time.Time, error) {
	ParamStr := c.Param(s)
	Param, err := time.Parse("2006-01-01", ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  fmt.Sprintf("invalid %s", s)})
		return time.Time{}, errors.New("smth wrong with query param")
	}
	return Param, nil
}

func GetArrayQueryParam(c *gin.Context, s string) ([]int, error) {
	ParamStrArr := c.QueryArray(s)
	ParamArr := make([]int, 0)
	for _, el := range ParamStrArr {
		elem, err := strconv.Atoi(el)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error":  fmt.Sprintf("invalid %s", s)})
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

// POST /travel_plans/:user_id
func CreateTravelPlan(c *gin.Context) {
	userID, err := GetQueryParam(c, "user_id")
	if err != nil {
		return
	}
	var input models.CreateTPInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx := c.Request.Context()
	travelPlan, err := models.UserCreateTravelPlan(ctx, userID, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, travelPlan)
}

// GET /travel_plans/:user_id
func UserGetTPHandler(c *gin.Context) {
	ctx := c.Request.Context()
	userID, err := GetQueryParam(c, "user_id")
	if err != nil {
		return
	}
	sortBy := c.Param("sort_by")
	ascending, err := GetBoolQueryParam(c, "ascending")
	if err != nil {
		return
	}
	startDate, err := GetDateQueryParam(c, "start_date")
	if err != nil {
		return
	}
	endDate, err := GetDateQueryParam(c, "end_date")
	if err != nil {
		return
	}

	tags, err := GetArrayQueryParam(c, "tag")
	if err != nil {
		return
	}

	userTP, err := models.UserGetTravelPlans(ctx, map[string]any{"user_id" : userID, "ascending" : ascending, "sort_by" : sortBy, "start_date" : startDate, "end_date" : endDate, "tag_id" : tags})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, userTP) 
}

// GET /travel_plans/:id
func GetTPByIdHandler(c *gin.Context) {
	ctx := c.Request.Context()
	ID, err := GetQueryParam(c, "id")
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
	ID, err := GetQueryParam(c, "id")
	if err != nil {
		return
	}
	var input models.UpdateTPInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx := c.Request.Context()
	if err := models.UpdateTravelPlan(ctx, ID, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// DELETE /travel_plan/:id
func DeleteTPHandler(c *gin.Context) {
	ID, err := GetQueryParam(c, "id")
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
func GetAllPlanTags(c *gin.Context) {
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
	ID, err := GetQueryParam(c, "id")
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
	ID, err := GetQueryParam(c, "id")
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
	ID, err := GetQueryParam(c, "id")
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
func AddParticipantHandler(c *gin.Context) {
	tpID, err := GetQueryParam(c, "id")
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
	ID, err := GetQueryParam(c, "id")
	if err != nil {
		return
	}
	participantID, err := GetQueryParam(c, "participant_id") 
	if err != nil {
		return
	}

	ctx := c.Request.Context()
	if err := models.DeleteParticipantfromTP(ctx, ID, participantID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}