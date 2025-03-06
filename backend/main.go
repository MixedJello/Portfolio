package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//go mod tidy incase imports get funky

var db *gorm.DB

// initialize db
func initDB() {
	err := godotenv.Load("C:\\Users\\tyler\\OneDrive\\Desktop\\Projects\\Portfolio\\.env")
	if err != nil {
		log.Fatal("Error loading .env fie. Error message: ", err)
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var errDB error
	db, errDB = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if errDB != nil {
		log.Fatal("Failed to connect to database:", errDB)
	}

	fmt.Println("Database connected!")

}

// main function
func main() {
	//initialize db
	initDB()

	//Create Router
	router := gin.Default()

	//CORS Configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-type", "Authorization"},
		AllowCredentials: true,
	}))
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Backend is running!"})
	})
	//run on localhost:8080
	router.Run(":8080")
}
