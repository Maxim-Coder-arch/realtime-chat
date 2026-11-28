import { useState, type CSSProperties, type FormEvent } from "react";

import { useTheme } from "../../../../../shared/config/themes/themes";

import { useChat } from "../../../../../features/chat/model/use-chat";

export const useChatPanel = (side: "a" | "b") => {
    const theme = useTheme();

    const { messages, status, sendMessage } = useChat(side);

    const [messageText, setMessageText] = useState("");

    const canSend = Boolean(messageText.trim()) && status === "connected";

    const panelStyle: CSSProperties = {
        background: theme.panel.background,
        backdropFilter: `blur(${theme.panel.blur}px)`,
        border: `1px solid ${theme.panel.border}`,
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSend) return;

        const isSent = sendMessage(messageText);

        if (isSent) {
            setMessageText("");
        }
    };

    return {
        messages,
        status,
        messageText,
        setMessageText,
        canSend,
        panelStyle,
        handleSubmit,
    };
};