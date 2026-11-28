import { useEffect, useRef } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { bodyVariants, EASE_OUT } from "../../../models/animations";
import type { ChatMessageProps } from "../../../models/types";

import { formatMessageTime } from "../../../lib/helpers/format-message-time";

import styles from "../../styles/chat-panel.module.scss";

export const ChatMessage = ({ messages, side }: ChatMessageProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages.length]);
    
    return (
        <motion.main className={styles["chat-messages"]} variants={bodyVariants}>
            <div className={styles["chat-date"]}>
                <span>Сегодня</span>
            </div>

            <AnimatePresence initial={false}>
                {messages.length === 0 && (
                    <motion.div
                        key="empty"
                        className={styles["chat-empty"]}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: EASE_OUT }}
                    >
                        <MessageCircle />
                        <p>Сообщений пока нет</p>
                        <span>Напишите первое — оно появится здесь</span>
                    </motion.div>
                )}

                {messages.map((message) => {
                    const isOutgoing = message.sender === side;

                    return (
                        <motion.div
                            key={message.id}
                            className={`${styles["message-row"]} ${
                                isOutgoing ? styles["outgoing"] : styles["incoming"]
                            }`}
                            initial={{ opacity: 0, y: 18, x: isOutgoing ? 22 : -22, scale: 0.92 }}
                            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 30,
                                mass: 0.8,
                            }}
                            style={{ transformOrigin: isOutgoing ? "bottom right" : "bottom left" }}
                        >
                            <div className={styles["message-bubble"]}>
                                <p>{message.text}</p>

                                <span className={styles["message-time"]}>
                                    {formatMessageTime(message.createdAt)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            <div ref={messagesEndRef} className={styles["messages-end"]} />
        </motion.main>
    )
}