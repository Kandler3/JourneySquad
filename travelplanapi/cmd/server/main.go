package main

import (
	"log"
	"net/http"
	"os"

	"github.com/Kandler3/JourneySquad/api/pkg/db"
	"github.com/Kandler3/JourneySquad/api/pkg/middlewares"
	"github.com/Kandler3/JourneySquad/travelplanapi/internal/handlers"
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

	r.GET("/travel_plans/", handlers.UserGetTPHandler)
	r.POST("/travel_plans/:user_id", handlers.CreateTravelPlan)

	r.GET("/travel_plans/:id", handlers.GetTPByIdHandler)
	r.PATCH("/travel_plans/:id", handlers.GetTPByIdHandler) //
	r.DELETE("/travel_plans/:id", handlers.GetTPByIdHandler) //

	r.GET("/travel_plan_tags", handlers.GetTravelPlanTags) 
	r.POST("/travel_plan_tags", handlers.CreateTPTagHandler) //

	r.GET("/travel_plan_tags/:id", handlers.GetTPTagByID)
	r.PATCH("/travel_plan_tags/:id", handlers.UpdateTPTagHandler) //
	r.DELETE("/travel_plan_tags/:id", handlers.DeleteTPTagHandler) //

	r.POST("travel_plans/:id/participants", handlers.AddParticipantHandler)
	r.DELETE("travel_plans/:id/participants/:participant_id", handlers.DeleteParticipant) //

	r.POST("travel_plan/:id/photos", handlers.CreateTpPhotoHandler) //
	r.DELETE("travel_plan/:id/photos/:photo_id", handlers.DeleteTPPhotoHandler) //

	r.Run()
}

func initServer() *gin.Engine {
	r := gin.Default()
	return r
}
