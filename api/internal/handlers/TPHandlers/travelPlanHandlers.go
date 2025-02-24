package tphandlers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/Kandler3/JourneySquad/api/internal/models"
	"github.com/gin-gonic/gin"
)

func GetQueryParam(c *gin.Context, s string) (int, error) {
	ParamStr := c.Param(s)
	Param, err := strconv.Atoi(ParamStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error":  fmt.Sprintf("invalid %s", s)})
		return 0, errors.New("smth wrong")
	}
	return Param, nil
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
func CreateTravelPlan(c *gin.Context) {
	var input models.CreateTPInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx := c.Request.Context()
	travelPlan, err := models.UserCreateTravelPlan(ctx, input.ID, input)
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
	userTP, err := models.UserGetTravelPlans(ctx, map[string]any{"user_id" : userID})
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