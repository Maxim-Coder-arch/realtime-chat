import { useCallback, useEffect, useRef, useState } from "react";

import {
    WebSocketClient,
} from "../../../shared/api/websocket/websocket-client";
import { uploadFile } from "../../../shared/api/files/upload-file";

import type { 
    ChatMessage, 
    ChatSide, 
    WebSocketStatus
 } from "../../../shared/api/websocket/chat-message.type";

const WS_URL = import.meta.env.VITE_WS_URL;

export const useChat = (side: ChatSide) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<WebSocketStatus>("disconnected");

    const clientRef = useRef<WebSocketClient | null>(null);

    useEffect(() => {
        const client = new WebSocketClient(WS_URL);

        clientRef.current = client;

        const unsubscribeMessage = client.onMessage((message) => {
            setMessages((previousMessages) => [
                ...previousMessages,
                message,
            ]);
        });

        const unsubscribeStatus = client.onStatus(setStatus);

        client.connect();

        return () => {
            unsubscribeMessage();
            unsubscribeStatus();

            client.disconnect();

            clientRef.current = null;
        };
    }, []);

    const sendFile = useCallback(async (file: File): Promise<boolean> => {
        if (status !== "connected") {
            return false;
        }

        try {
            const attachment = await uploadFile(file);

            const message: ChatMessage = {
                id: crypto.randomUUID(),
                text: "",
                sender: side,
                createdAt: new Date().toISOString(),
                attachment,
            };

            const isSent = clientRef.current?.send(message) ?? false;

            if (!isSent) {
                return false;
            }

            setMessages((previousMessages) => [
                ...previousMessages,
                message,
            ]);

            return true;
        } catch (error) {
            console.error("Failed to send file:", error);

            return false;
        }
    }, [side, status]);

    const sendMessage = useCallback((text: string): boolean => {
        const normalizedText = text.trim();

        if (!normalizedText) {
            return false;
        }

        const message: ChatMessage = {
            id: crypto.randomUUID(),
            text: normalizedText,
            sender: side,
            createdAt: new Date().toISOString(),
        };

        const isSent = clientRef.current?.send(message) ?? false;

        if (!isSent) {
            return false;
        }

        setMessages((previousMessages) => [
            ...previousMessages,
            message,
        ]);

        return true;
    }, [side]);

    return {
        messages,
        status,
        sendMessage,
        sendFile,
    };
};