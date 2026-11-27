package server

import (
	"context"
	"log"

	"github.com/coder/websocket"
)

type Client struct {
	conn 	*websocket.Conn
	send 	chan []byte
}

type Message struct {
	sender	*Client
	data	[]byte
}

type Hub struct {
	clients 	map[*Client]bool
	register 	chan *Client
	unregister 	chan *Client
	broadcast chan Message
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
        register:   make(chan *Client),
        unregister: make(chan *Client),
        broadcast:  make(chan Message),
	}
}

func (h *Hub) Run() {
	for {
		select {
			case client := <- h.register:
				h.clients[client] = true

			case client := <-h.unregister:
				if _, ok := h.clients[client]; ok {
					delete(h.clients, client)
					close(client.send)
				}

			case message := <-h.broadcast:
				for client := range h.clients {
					if client == message.sender {
						continue
					}

					select {
						case client.send <- message.data:
						default:
							delete(h.clients, client)
							close(client.send)

							client.conn.Close(
								websocket.StatusPolicyViolation,
								"client is too slow",
							)
						}
				}
		}
	}
}

func (c *Client) WritePump() {
	defer c.conn.Close(websocket.StatusNormalClosure, "connection closed")

	for message := range c.send {
		err := c.conn.Write(context.Background(), websocket.MessageText, message)

		if err != nil {
            log.Println("Message sending error:", err)

            return
        }
	}
}