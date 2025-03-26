package main

import (
	"api/email"
	"api/ping"
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

func initENVVar() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}
}

func sendEmailHandler(c *gin.Context) {
	var form email.FormData
	if err := c.ShouldBindBodyWithJSON(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		log.Printf("Error binding JSON SMTP User or SMTP Pass not set: %v", err)
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
		log.Printf("Error sending email: %v", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}

// main function
func main() {
	// initialize env variables
	initENVVar()

	ping.SetInterval(14)

	// Create Router
	router := gin.Default()

	// CORS Configuration - simplified for same-origin setup
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins since we're using path-based routing
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.POST("/send-email", sendEmailHandler)
	}

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Backend is running!"})
	})

	// Get port from environment variable or use default
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		log.Fatal("Port is an empty string")
	}

	log.Printf("Server starting on port %s", port)
	router.Run(":" + port)

}
