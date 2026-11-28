import { MainPageLayout } from "./components/main-page-layout";

import { ChatPanel } from "./chat-panel/chat-panel";
import { useEffect } from "react";
import { WebSocketClient } from "../../../../../shared/api/websocket/websocket-client";

const WS_URL = import.meta.env.VITE_WS_URL;

export const MainPage = () => {

    useEffect(() => {
        const client = new WebSocketClient(WS_URL);

        const unsubscribeStatus = client.onStatus((status) => {
            console.log("WebSocket status:", status);
        });

        const unsubscribeMessage = client.onMessage((message) => {
            console.log("Received message:", message);
        });

        client.connect();

        return () => {
            unsubscribeMessage();
            unsubscribeStatus();

            client.disconnect();
        };
    }, []);
    
    return (
        <MainPageLayout>
            <ChatPanel title="chat a" />
            <ChatPanel title="chat b" />
        </MainPageLayout>
    )
}