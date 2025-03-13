package email

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
	"os"
	//"github.com/emersion/go-smtp"
)

type FormData struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"LastName"`
	Email     string `json:"email"`
	Message   string `json:"message"`
}

func (f *FormData) FullName() string {
	fullName := f.FirstName + " " + f.LastName
	return fullName
}

func SendEmail(form FormData, smtpUser, smtpPass string) error {
	//Email content as raw string
	subject := fmt.Sprintf("Contact Form Submission from %s ", form.FullName())
	body := fmt.Sprintf(
		"From: %s\r\n"+
			"To: %s\r\n"+
			"Subject: %s\r\n"+
			"\r\n"+
			"First Name: %s\r\n"+
			"Last Name: %s\r\n"+
			"Email: %s\r\n"+
			"Message: %s\r\n",
		os.Getenv("PERSONAL_EMAIL"),
		form.Email,
		subject,
		form.FirstName,
		form.LastName,
		form.Email,
		form.Message,
	)

	//SMTP auth
	auth := smtp.PlainAuth("", smtpUser, smtpPass, "smtp.gmail.com")

	//Connect to Gmail SMTP Server
	client, err := smtp.Dial("smtp.gmail.com:587")
	if err != nil {
		log.Printf("Failed to connect to SMTP server: %v", err)
	}
	defer client.Close()

	tlsConfig := &tls.Config{
		ServerName: "smtp.gmail.com",
	}

	//Start TLS (required by Gmail)
	if err = client.StartTLS(tlsConfig); err != nil {
		log.Printf("Failed to start TLS %v", err)
		return err
	}

	//Auth
	if err = client.Auth(auth); err != nil {
		log.Printf("SMTP authentication failed: %v", err)
		return err
	}

	//Set the sender and recipient
	if err = client.Mail("noreply@portfolio.com"); err != nil {
		log.Printf("Failed to set sender: %v", err)
		return err
	}

	if err = client.Rcpt(os.Getenv("PERSONAL_EMAIL")); err != nil {
		log.Printf("Failed to set recipient: %v", err)
		return err
	}

	//Send email body
	wc, err := client.Data()
	if err != nil {
		log.Panicf("Failed to open data connection: %v", err)
		return err
	}
	defer wc.Close()

	_, err = wc.Write([]byte(body))
	if err != nil {
		log.Printf("Failed to send email body: %v", err)
		return err
	}

	log.Printf("Email sent successfully from %v", form.FullName())

	return nil
}
