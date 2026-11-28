import type { 
    ChatMessage, 
    ErrorListener, 
    MessageListener, 
    StatusListener, 
    WebSocketClientOptions,
    WebSocketStatus
 } from "./chat-message.type";

export class WebSocketClient {
    private socket: WebSocket | null = null;

    private readonly messageListeners = new Set<MessageListener>();
    private readonly statusListeners = new Set<StatusListener>();
    private readonly errorListeners = new Set<ErrorListener>();

    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private shouldReconnect = true;

    private readonly reconnect: boolean;
    private readonly reconnectDelay: number;

    private readonly url: string;

    constructor(url: string, options: WebSocketClientOptions = {}) {
        this.reconnect = options.reconnect ?? true;
        this.reconnectDelay = options.reconnectDelay ?? 3000;
        this.url = url;
    }

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) {
            return;
        }
        const socket = new WebSocket(this.url);

        this.shouldReconnect = true;
        this.clearReconnectTimer();
        this.setStatus("connecting");
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

    send(message: ChatMessage) {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            return false;
        }

        this.socket.send(JSON.stringify(message));

        return true;
    }

    disconnect() {
        this.shouldReconnect = false;

        this.clearReconnectTimer();

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        this.setStatus("disconnected");
    }

    onMessage(listener: MessageListener) {
        this.messageListeners.add(listener);

        return () => {
            this.messageListeners.delete(listener);
        };
    }

    onStatus(listener: StatusListener) {
        this.statusListeners.add(listener);

        return () => {
            this.statusListeners.delete(listener);
        };
    }

    onError(listener: ErrorListener) {
        this.errorListeners.add(listener);

        return () => {
            this.errorListeners.delete(listener);
        };
    }

    private handleMessage(data: unknown) {
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

    private isChatMessage(value: unknown) {
        if (typeof value !== "object" || value === null) {
            return false;
        }

        const message = value as Record<string, unknown>;

        if (
            typeof message.id !== "string" ||
            typeof message.text !== "string" ||
            (message.sender !== "a" && message.sender !== "b") ||
            typeof message.createdAt !== "string"
        ) {
            return false;
        }

        if (message.attachment !== undefined) {
            if (
                typeof message.attachment !== "object" ||
                message.attachment === null
            ) {
                return false;
            }

            const attachment = message.attachment as Record<string, unknown>;

            if (
                typeof attachment.name !== "string" ||
                typeof attachment.url !== "string" ||
                typeof attachment.contentType !== "string" ||
                typeof attachment.size !== "number"
            ) {
                return false;
            }
        }

        if (message.sticker !== undefined) {
            if (
                typeof message.sticker !== "object" ||
                message.sticker === null
            ) {
                return false;
            }

            const sticker = message.sticker as Record<string, unknown>;

            if (
                typeof sticker.id !== "string" ||
                typeof sticker.name !== "string" ||
                typeof sticker.imageUrl !== "string" ||
                typeof sticker.pageUrl !== "string" ||
                typeof sticker.credit !== "string"
            ) {
                return false;
            }
        }

        return true;
    };

    private setStatus(status: WebSocketStatus) {
        this.statusListeners.forEach((listener) => {
            listener(status);
        });
    }

    private scheduleReconnect() {
        if (this.reconnectTimer !== null) {
            return;
        }

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect();
        }, this.reconnectDelay);
    }

    private clearReconnectTimer() {
        if (this.reconnectTimer !== null) {
            clearTimeout(this.reconnectTimer);

            this.reconnectTimer = null;
        }
    }
}