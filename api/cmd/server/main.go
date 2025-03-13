package main

import (
	"log"
	"net/http"

	"github.com/Kandler3/JourneySquad/api/internal/handlers"
	"github.com/Kandler3/JourneySquad/api/pkg/db"
	"github.com/gin-gonic/gin"
)

func main() {
	if err := db.InitDB(1); err != nil {
		log.Printf("Error initializing db: %v", err)
	}
	defer db.CloseDB(1)

	r := initServer()

	// secret bot token.
	//token := os.Getenv("BOT_TOKEN")
	//r.Use(middlewares.AuthMiddleware(token))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.GET("/users", handlers.GetUsersHandler)
	r.POST("/users", handlers.CreateUserHandler)
	r.GET("/users/:id", handlers.GetUserHandler)
	r.PATCH("/users/:id", handlers.UpdateUserHandler)
	r.DELETE("/users/:id", handlers.DeleteUserHandler)

	r.Run()
}

func initServer() *gin.Engine {
	r := gin.Default()
	return r
}
