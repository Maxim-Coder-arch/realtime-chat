package server

import (
	"log"
	"net/http"

	"github.com/coder/websocket"
)

func NewServer() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {

	})

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			OriginPatterns: []string{"localhost:*"},
		})

		if err != nil {
			log.Fatal("WebSocket connection error:", err)
			return
		}

		defer conn.Close(websocket.StatusNormalClosure, "connection closed")
	})

	return mux
}