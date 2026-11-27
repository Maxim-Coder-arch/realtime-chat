package server

import (
	"context"
	"log"
	"net/http"

	"github.com/coder/websocket"
)

func NewServer() *http.ServeMux {
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
			send: make(chan []byte),
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

			hub.broadcast <- message
		}
	})

	return mux
}