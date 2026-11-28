import type { CSSProperties, FormEvent, ReactNode } from "react";

import type { statusLabels } from "./config";

import type { ChatMessage } from "../../../../shared/api/websocket/chat-message.type";

export interface ChatMessageProps {
    messages: ChatMessage[];
    side: "a" | "b";
}

export interface ChatPanelLayoutProps { 
    children: ReactNode;
    panelStyle: CSSProperties;
    title: string;
}

export interface FooterChatProps {
    messageText: string;
    canSend: boolean;
    onMessageTextChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export type ChatStatus = keyof typeof statusLabels;

export interface HeaderChatProps {
    title: string;
    status: ChatStatus;
}

export interface ChatPanelProps {
    title: string;
    side: "a" | "b";
}