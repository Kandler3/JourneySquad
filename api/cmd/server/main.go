package main

import (
	"log"
	"net/http"
	"os"

	docs "github.com/Kandler3/JourneySquad/api/cmd/docs"
	"github.com/Kandler3/JourneySquad/api/internal/handlers"
	"github.com/Kandler3/JourneySquad/api/pkg/db"
	"github.com/Kandler3/JourneySquad/api/pkg/middlewares"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

//	@title			Users API
//	@version		1.0
//	@description	API для управления пользователями.
//	@host			localhost:8080
//	@BasePath		/

//	@securityDefinitions.apikey	ApiKeyAuth
//	@in							header
//	@name						Authorization

func main() {
	if err := db.InitDB(); err != nil {
		log.Printf("Error initializing db: %v", err)
	}
	defer db.CloseDB()

	r := initServer()

	docs.SwaggerInfo.BasePath = "/"
	r.GET("/users/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))
	r.GET("/users/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.POST("/users", handlers.CreateUserHandler)

	token := os.Getenv("BOT_TOKEN") // secret bot token
	authorized := r.Group("/")
	authorized.Use(middlewares.AuthMiddleware(token))

	authorized.GET("/users", handlers.GetUsersHandler)
	authorized.GET("/users/login", handlers.LoginUserHandler)
	authorized.GET("/users/:id", handlers.GetUserHandler)
	authorized.PATCH("/users/:id", handlers.UpdateUserHandler)
	authorized.DELETE("/users/:id", handlers.DeleteUserHandler)

	r.Run()
}

func initServer() *gin.Engine {
	r := gin.Default()
	return r
}
