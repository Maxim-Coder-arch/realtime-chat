export type ChatSide = "a" | "b";

export interface ChatMessage {
    id: string;
    text: string;
    sender: ChatSide;
    createdAt: string;
    attachment?: ChatAttachment;
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

export interface ChatAttachment {
    name: string;
    url: string;
    contentType: string;
    size: number;
}