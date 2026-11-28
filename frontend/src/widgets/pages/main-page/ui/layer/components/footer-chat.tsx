import { motion } from "framer-motion";

import { Paperclip, Send, Smile } from "lucide-react";

import { footerVariants, sendIconVariants } from "../../../models/animations";
import type { FooterChatProps } from "../../../models/types";

import styles from "../../styles/chat-panel.module.scss";

export const FooterChat = ({
    messageText,
    canSend,
    onMessageTextChange,
    onSubmit,
}: FooterChatProps) => {
    return (
        <motion.form
            className={styles["chat-footer"]}
            onSubmit={onSubmit}
            variants={footerVariants}
        >
            <motion.button
                type="button"
                className={styles["attachment-button"]}
                aria-label="Прикрепить файл"
                whileHover={{ scale: 1.08, rotate: -12 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                <Paperclip />
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
                    aria-label="Эмодзи"
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
        </motion.form>
    )
}