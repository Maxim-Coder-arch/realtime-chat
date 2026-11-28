import { useRef, useState } from "react";

import { motion } from "framer-motion";

import { Paperclip, Send, Smile, LoaderCircle } from "lucide-react";

import { footerVariants, sendIconVariants } from "../../../model/animations";
import type { FooterChatProps } from "../../../model/types";

import styles from "../../styles/chat-panel.module.scss";
import { StickerPicker } from "../../../../../sticker-picker";

export const FooterChat = ({
    messageText,
    canSend,
    isUploading,
    uploadError,
    onMessageTextChange,
    onFileSelect,
    onSubmit,
    onStickerSelect,
}: FooterChatProps) => {
    const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            onFileSelect(file);
        }

        event.target.value = "";
    };

    return (
        <motion.form
            className={styles["chat-footer"]}
            onSubmit={onSubmit}
            variants={footerVariants}
        >
            <input
                ref={fileInputRef}
                type="file"
                className={styles["file-input"]}
                onChange={handleFileChange}
            />

            <motion.button
                type="button"
                className={styles["attachment-button"]}
                aria-label="Прикрепить файл"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.08, rotate: -12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                {isUploading ? <LoaderCircle className={styles["upload-spinner"]} /> : <Paperclip />}
            </motion.button>

            <div className={styles["message-input-wrapper"]}>
                <input
                    type="text"
                    placeholder="Написать сообщение..."
                    aria-label="Текст сообщения"
                    value={messageText}
                    onChange={(event) => onMessageTextChange(event.target.value)}
                />

                <motion.button
                    type="button"
                    className={styles["emoji-button"]}
                    aria-label="Открыть стикеры"
                    aria-expanded={isStickerPickerOpen}
                    onClick={() => setIsStickerPickerOpen((previous) => !previous)}
                    whileHover={{ scale: 1.2, rotate: 12 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <Smile />
                </motion.button>
            </div>

            <motion.button
                type="submit"
                className={styles["send-button"]}
                aria-label="Отправить сообщение"
                disabled={!canSend}
                initial="rest"
                animate={{ scale: canSend ? 1 : 0.92, opacity: canSend ? 1 : 0.5 }}
                whileHover={canSend ? "hover" : undefined}
                whileTap={canSend ? { scale: 0.9 } : undefined}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
                <motion.span
                    className={styles["send-icon"]}
                    variants={sendIconVariants}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                    <Send />
                </motion.span>
            </motion.button>

            {uploadError && (
                <span className={styles["upload-error"]}>
                    {uploadError}
                </span>
            )}

            {isStickerPickerOpen && (
                <StickerPicker
                    onClose={() => setIsStickerPickerOpen(false)}
                    onSelect={(sticker) => {
                        onStickerSelect(sticker);
                        setIsStickerPickerOpen(false);
                    }}
                />
            )}
        </motion.form>
    );
};