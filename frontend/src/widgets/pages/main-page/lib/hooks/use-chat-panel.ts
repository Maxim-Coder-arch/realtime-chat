import { useState, type CSSProperties, type FormEvent } from "react";

import { useTheme } from "../../../../../shared/config/themes/themes";

import { useChat } from "../../../../../features/chat/model/use-chat";
import type { Sticker } from "../../../../../entities/sticker";

export const useChatPanel = (side: "a" | "b") => {
    const theme = useTheme();

    const {
        messages,
        status,
        sendMessage,
        sendFile,
        sendSticker,
    } = useChat(side);

    const [messageText, setMessageText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

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

    const handleFileSelect = async (file: File) => {
        setUploadError(null);
        setIsUploading(true);

        try {
            const isSent = await sendFile(file);

            if (!isSent) {
                setUploadError("Не удалось отправить файл");
            }
        } catch {
            setUploadError("Произошла ошибка при загрузке файла");
        } finally {
            setIsUploading(false);
        }
    };

    const handleStickerSelect = (sticker: Sticker) => {
        if (status !== "connected") {
            return;
        }

        sendSticker(sticker);
    };

    return {
        messages,
        status,
        messageText,
        setMessageText,
        canSend,
        panelStyle,
        isUploading,
        uploadError,
        handleFileSelect,
        handleSubmit,
        handleStickerSelect,
    };
};