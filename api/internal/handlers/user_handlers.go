package handlers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/Kandler3/JourneySquad/api/internal/models"
	"github.com/Kandler3/JourneySquad/api/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

// GET /users
func GetUsersHandler(c *gin.Context) {
	ctx := c.Request.Context()
	users, err := models.GetAllUsers(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// POST /users
func CreateUserHandler(c *gin.Context) {
	var input models.CreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()
	telegramID, ok := getTelegramIdFromCtx(ctx)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid init data: there is no telegram id"})
		return
	}
	input.TelegramID = telegramID

	user, err := models.CreateUser(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// GET /users/:id
func GetUserHandler(c *gin.Context) {
	idStr := c.Param("id")
	telegramID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user's telegram id"})
		return
	}

	ctx := c.Request.Context()
	user, err := models.GetUserByTelegramID(ctx, telegramID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// GET /users/login
func LoginUserHandler(c *gin.Context) {
	ctx := c.Request.Context()
	telegramID, ok := getTelegramIdFromCtx(ctx)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid init data: there is no telegram id"})
		return
	}

	user, err := models.GetUserByTelegramID(ctx, telegramID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// PATCH /users/:id
func UpdateUserHandler(c *gin.Context) {
	idStr := c.Param("id")
	telegramID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	var input models.UpdateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()
	senderTelegramId, ok := getTelegramIdFromCtx(ctx)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user's telegram id"})
		return
	}
	if senderTelegramId != telegramID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user can't update another user"})
		return
	}

	if err := models.UpdateUser(ctx, telegramID, input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// DELETE /users/:id
func DeleteUserHandler(c *gin.Context) {
	idStr := c.Param("id")
	telegramID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	ctx := c.Request.Context()
	senderTelegramId, ok := getTelegramIdFromCtx(ctx)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user's telegram id"})
		return
	}
	if senderTelegramId != telegramID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user can't delete another user"})
		return
	}

	if err := models.DeleteUser(ctx, telegramID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func getTelegramIdFromCtx(ctx context.Context) (int64, bool) {
	initData, ok := middlewares.CtxInitData(ctx)
	if !ok {
		return 0, false
	}
	return initData.User.ID, initData.User.ID != 0
}
