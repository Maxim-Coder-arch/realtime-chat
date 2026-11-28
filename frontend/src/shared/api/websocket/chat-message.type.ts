export type ChatSide = "a" | "b";

export interface ChatMessage {
    id: string;
    text: string;
    sender: ChatSide;
    createdAt: string;
}