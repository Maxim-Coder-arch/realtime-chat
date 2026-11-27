package server

import (
	"context"
	"log"
	"net/http"

	"github.com/coder/websocket"
)

func NewServer() *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			OriginPatterns: []string{"localhost:*"},
		})

		if err != nil {
			log.Println("WebSocket connection error:", err)
			return
		}

		defer conn.Close(websocket.StatusNormalClosure, "connection closed")

		ctx := context.Background()

		for {
			 messageType, data, err := conn.Read(ctx)

			if err != nil {
				log.Println("Connection closed:", err)
				return
			}

			log.Println("Received:", string(data))

			err = conn.Write(ctx, messageType, data)

        	if err != nil {
				log.Println("Message sending error:", err)
				return
        	}
		}
	})

	return mux
}