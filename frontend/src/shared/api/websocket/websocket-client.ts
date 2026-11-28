import type { ChatMessage } from "./chat-message.type";

export type WebSocketStatus =
    | "connecting"
    | "connected"
    | "disconnected"
    | "error";

type MessageListener = (message: ChatMessage) => void;
type StatusListener = (status: WebSocketStatus) => void;
type ErrorListener = (error: Event) => void;

interface WebSocketClientOptions {
    reconnect?: boolean;
    reconnectDelay?: number;
}

export class WebSocketClient {
    private socket: WebSocket | null = null;

    private readonly messageListeners = new Set<MessageListener>();
    private readonly statusListeners = new Set<StatusListener>();
    private readonly errorListeners = new Set<ErrorListener>();

    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private shouldReconnect = true;

    private readonly reconnect: boolean;
    private readonly reconnectDelay: number;

    constructor(
        url: string,
        options: WebSocketClientOptions = {},
    ) {
        this.reconnect = options.reconnect ?? true;
        this.reconnectDelay = options.reconnectDelay ?? 3000;
    }

    connect(): void {
        if (
            this.socket?.readyState === WebSocket.OPEN ||
            this.socket?.readyState === WebSocket.CONNECTING
        ) {
            return;
        }

        this.shouldReconnect = true;
        this.clearReconnectTimer();

        this.setStatus("connecting");

        const socket = new WebSocket(this.url);

        this.socket = socket;

        socket.onopen = () => {
            if (this.socket !== socket) return;

            this.setStatus("connected");
        };

        socket.onmessage = (event: MessageEvent) => {
            if (this.socket !== socket) return;

            this.handleMessage(event.data);
        };

        socket.onerror = (event: Event) => {
            if (this.socket !== socket) return;

            this.setStatus("error");

            this.errorListeners.forEach((listener) => {
                listener(event);
            });
        };

        socket.onclose = () => {
            if (this.socket !== socket) return;

            this.socket = null;

            this.setStatus("disconnected");

            if (this.shouldReconnect && this.reconnect) {
                this.scheduleReconnect();
            }
        };
    }

    send(message: ChatMessage): boolean {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            return false;
        }

        this.socket.send(JSON.stringify(message));

        return true;
    }

    disconnect(): void {
        this.shouldReconnect = false;

        this.clearReconnectTimer();

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        this.setStatus("disconnected");
    }

    onMessage(listener: MessageListener): () => void {
        this.messageListeners.add(listener);

        return () => {
            this.messageListeners.delete(listener);
        };
    }

    onStatus(listener: StatusListener): () => void {
        this.statusListeners.add(listener);

        return () => {
            this.statusListeners.delete(listener);
        };
    }

    onError(listener: ErrorListener): () => void {
        this.errorListeners.add(listener);

        return () => {
            this.errorListeners.delete(listener);
        };
    }

    private handleMessage(data: unknown): void {
        if (typeof data !== "string") {
            return;
        }

        try {
            const message: unknown = JSON.parse(data);

            if (!this.isChatMessage(message)) {
                console.warn("Invalid chat message:", message);
                return;
            }

            this.messageListeners.forEach((listener) => {
                listener(message);
            });
        } catch {
            console.error("Failed to parse WebSocket message:", data);
        }
    }

    private isChatMessage(value: unknown): value is ChatMessage {
        if (typeof value !== "object" || value === null) {
            return false;
        }

        const message = value as Record<string, unknown>;

        return (
            typeof message.id === "string" &&
            typeof message.text === "string" &&
            (message.sender === "a" || message.sender === "b") &&
            typeof message.createdAt === "string"
        );
    }

    private setStatus(status: WebSocketStatus): void {
        this.statusListeners.forEach((listener) => {
            listener(status);
        });
    }

    private scheduleReconnect(): void {
        if (this.reconnectTimer !== null) {
            return;
        }

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, this.reconnectDelay);
    }

    private clearReconnectTimer(): void {
        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }
}