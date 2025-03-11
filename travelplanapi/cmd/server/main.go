package main

import (
	"log"
	"net/http"
	"os"

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

	// secret bot token.
	token := os.Getenv("BOT_TOKEN")
	r.Use(middlewares.AuthMiddleware(token))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.Run()
}

func initServer() *gin.Engine {
	r := gin.Default()
	return r
}
