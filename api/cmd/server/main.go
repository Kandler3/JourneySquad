package main

import (
	"net/http"
	"os"

	"github.com/Kandler3/JourneySquad/api/internal/db"
	"github.com/gin-gonic/gin"
)

var dbConf = db.DBConfig{
	Host:     os.Getenv("DATABASE_URL"),
	Port:     5432,
	User:     "postgres",
	Password: "password",
	DBName:   "mydb",
	SSLMode:  "disable",
}

func main() {
	db.InitDB(dbConf)
	defer db.CloseDB()

	r := initServer()
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
