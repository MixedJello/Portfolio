package ping

import (
	"log"
	"net/http"
	"time"
)

func KeepAlive() {
	url := "https://portfolio-353g.onrender.com"
	res, err := http.Get(url)
	if err != nil {
		log.Printf("Error getting %s. Error: %s. Response: %s", url, err, res.Status)
	}

	defer res.Body.Close()

	log.Printf("Pinged server at %s.\n Response: %s", time.Now().String(), res.Status)
}

func SetInterval(min int) {
	ticker := time.NewTicker(time.Duration(min) * time.Minute)

	for t := range ticker.C {
		KeepAlive()
		log.Printf("Ticker pinged at: %s", t)
	}
}
