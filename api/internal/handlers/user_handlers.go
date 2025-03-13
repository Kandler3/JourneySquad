package handlers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/Kandler3/JourneySquad/api/internal/models"
	"github.com/Kandler3/JourneySquad/api/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

// GetUsersHandler godoc
//
//	@Summary		Получить список всех пользователей
//	@Description	Возвращает список всех пользователей.
//	@Tags			users
//
//	@Security		ApiKeyAuth
//
//	@Produce		json
//	@Success		200	{array}		models.UserView
//
//	@Failure		401	{object}	models.UnauthorisedResponse	"Неавторизованный запрос"
//
//	@Failure		500	{object}	models.ErrorResponse		"Ошибка сервера"
//	@Router			/users [get]
func GetUsersHandler(c *gin.Context) {
	ctx := c.Request.Context()
	users, err := models.GetAllUsers(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// CreateUserHandler godoc
//
//	@Summary		Создать нового пользователя
//	@Description	Создает пользователя с предоставленными данными.
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			input	body		models.CreateUserInput	true	"Данные для создания пользователя"
//	@Success		201		{object}	models.UserView
//	@Failure		400		{object}	models.ErrorResponse	"Неверный запрос"
//	@Failure		500		{object}	models.ErrorResponse	"Ошибка сервера"
//	@Router			/users [post]
func CreateUserHandler(c *gin.Context) {
	var input models.CreateUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := c.Request.Context()

	user, err := models.CreateUser(ctx, input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// GetUserHandler godoc
//
//	@Summary		Получить пользователя по ID в telegram
//	@Description	Возвращает пользователя по его telegram ID.
//	@Tags			users
//
//	@Security		ApiKeyAuth
//
//	@Produce		json
//	@Param			id	path		int	true	"Telegram ID пользователя"
//	@Success		200	{object}	models.UserView
//	@Failure		400	{object}	models.ErrorResponse		"Неверный запрос"
//
//	@Failure		401	{object}	models.UnauthorisedResponse	"Неавторизованный запрос"
//
//	@Failure		404	{object}	models.ErrorResponse		"Пользователь не найден"
//	@Failure		500	{object}	models.ErrorResponse		"Ошибка сервера"
//	@Router			/users/{id} [get]
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

// LoginUserHandler godoc
//
//	@Summary		Возвращает текущего авторизованного пользователя
//	@Description	Авторизует пользователя, используя telegram ID из контекста.
//	@Tags			users
//
//	@Security		ApiKeyAuth
//
//	@Produce		json
//	@Success		200	{object}	models.UserView
//	@Failure		400	{object}	models.ErrorResponse		"Неверный запрос"
//
//	@Failure		401	{object}	models.UnauthorisedResponse	"Неавторизованный запрос"
//
//	@Failure		404	{object}	models.ErrorResponse		"Пользователь не найден"
//	@Failure		500	{object}	models.ErrorResponse		"Ошибка сервера"
//	@Router			/users/login [get]
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

// UpdateUserHandler godoc
//
//	@Summary		Обновить данные пользователя
//	@Description	Обновляет информацию о пользователе по telegram ID.
//	@Tags			users
//
//	@Security		ApiKeyAuth
//
//	@Accept			json
//	@Param			id		path	int						true	"Telegram ID пользователя"
//	@Param			input	body	models.UpdateUserInput	true	"Данные для обновления пользователя"
//	@Success		204		"No Content"
//	@Failure		400		{object}	models.ErrorResponse		"Неверный запрос"
//
//	@Failure		401		{object}	models.UnauthorisedResponse	"Неавторизованный запрос"
//
//	@Failure		500		{object}	models.ErrorResponse		"Ошибка сервера"
//	@Router			/users/{id} [patch]
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

// DeleteUserHandler godoc
//
//	@Summary		Удалить пользователя
//	@Description	Удаляет пользователя по telegram ID.
//	@Tags			users
//
//	@Security		ApiKeyAuth
//
//	@Param			id	path	int	true	"Telegram ID пользователя"
//	@Success		204	"No Content"
//	@Failure		400	{object}	models.ErrorResponse		"Неверный запрос"
//
//	@Failure		401	{object}	models.UnauthorisedResponse	"Неавторизованный запрос"
//
//	@Failure		500	{object}	models.ErrorResponse		"Ошибка сервера"
//	@Router			/users/{id} [delete]
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
