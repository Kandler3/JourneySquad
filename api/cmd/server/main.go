package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Kandler3/JourneySquad/api/internal/handlers"
	"github.com/Kandler3/JourneySquad/api/pkg/db"
	"github.com/Kandler3/JourneySquad/api/pkg/middlewares"
	"github.com/gin-gonic/gin"
)

func main() {
	if err := db.InitDB(); err != nil {
		log.Printf("Error initializing db: %v", err)
	}
	defer db.CloseDB()

	r := initServer()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.GET("/users", handlers.GetUsersHandler)

	token := os.Getenv("BOT_TOKEN") // secret bot token
	authorized := r.Group("/")
	authorized.Use(middlewares.AuthMiddleware(token))

	authorized.POST("/users", handlers.CreateUserHandler)
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
