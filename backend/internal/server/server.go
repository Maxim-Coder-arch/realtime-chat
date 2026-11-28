package server

import (
	"context"
	"log"
	"net/http"

	"github.com/coder/websocket"
)

func NewServer() http.Handler {
	mux := http.NewServeMux()
	hub := NewHub()

	go hub.Run()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			OriginPatterns: []string{"localhost:*"},
		})

		if err != nil {
			log.Println("WebSocket connection error:", err)
			return
		}

		client := &Client{
			conn: conn,
			send: make(chan []byte, 16),
		}

		hub.register <- client

		go client.WritePump()

		defer func() {
			hub.unregister <- client
		}()

		ctx := context.Background()

		for {
			_, message, err := conn.Read(ctx)

			if err != nil {
				log.Println("Connection closed:", err)

				return
			}

			hub.broadcast <- Message{
				sender: client,
				data:   message,
			}
		}
	})

	mux.HandleFunc("/api/files", UploadFile)

	mux.Handle("/uploads/", http.StripPrefix(
		"/uploads/",
		http.FileServer(http.Dir(uploadDir)),
	))

	return corsMiddleware(mux)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		if origin == "http://localhost:5173" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Vary", "Origin")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}