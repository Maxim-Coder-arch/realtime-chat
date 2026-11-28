export type ChatSide = "a" | "b";

export interface ChatMessage {
    id: string;
    text: string;
    sender: ChatSide;
    createdAt: string;
}

export type WebSocketStatus =
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

export type MessageListener = (message: ChatMessage) => void;
export type StatusListener = (status: WebSocketStatus) => void;
export type ErrorListener = (error: Event) => void;

export interface WebSocketClientOptions {
    reconnect?: boolean;
    reconnectDelay?: number;
}