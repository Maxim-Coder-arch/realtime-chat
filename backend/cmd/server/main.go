package main

import (
	"log"
	"net/http"
	"realtime-chat/internal/server"
)

func main() {
	mux := server.NewServer()

	log.Println("Server started on :8080")

	err := http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal(err)
	}
}