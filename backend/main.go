package main

import (
	"api/email"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

//go mod tidy incase imports get funky

var db *gorm.DB

// initialize db
func initENVVar() {
	err := godotenv.Load("C:\\Users\\tyler\\OneDrive\\Desktop\\Projects\\Portfolio\\.env")
	if err != nil {
		log.Fatal("Error loading .env fie. Error message: ", err)
	}

}

func sendEmailHandler(c *gin.Context) {
	var form email.FormData
	if err := c.ShouldBindBodyWithJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		log.Printf("SMTP_USER or SMTP_PASS not set")
		return
	}

	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	if smtpUser == "" || smtpPass == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server configuration error"})
		log.Println("SMTP_USER or SMTP_PASS not set")
		return
	}

	err := email.SendEmail(form, smtpUser, smtpPass)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

// main function
func main() {
	//initialize env variables
	initENVVar()

	//Create Router
	router := gin.Default()

	//CORS Configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-type", "Authorization"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.POST("/send-email", sendEmailHandler)
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Backend is running!"})
	})
	//run on localhost:8080
	router.Run(":8080")
}
