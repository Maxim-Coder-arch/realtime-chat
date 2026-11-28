import { FooterChat } from "./components/footer-chat";
import { ChatMessage } from "./components/chat-messaged";
import { HeaderChat } from "./components/header-chat";
import { ChatPanelLayout } from "./components/chat-panel-layout";

import { useChatPanel } from "../../lib/hooks/use-chat-panel";

import type { ChatPanelProps } from "../../models/types";

export const ChatPanel = ({ title, side }: ChatPanelProps) => {
    const {
        messages,
        status,
        messageText,
        setMessageText,
        canSend,
        panelStyle,
        handleSubmit,
    } = useChatPanel(side);

    return (
        <ChatPanelLayout panelStyle={panelStyle} title={title}>
            <HeaderChat title={title} status={status} />
            <ChatMessage messages={messages} side={side} />
            <FooterChat
                messageText={messageText}
                canSend={canSend}
                onMessageTextChange={setMessageText}
                onSubmit={handleSubmit}
            />
        </ChatPanelLayout>
    );
};