import { AnimatePresence, motion } from "framer-motion";

import { MoreHorizontal, Search } from "lucide-react";

import { EASE_OUT, headerVariants } from "../../../model/animations";
import { statusLabels } from "../../../model/config";
import type { HeaderChatProps } from "../../../model/types";

import styles from "../../styles/chat-panel.module.scss";

export const HeaderChat = ({ title, status }: HeaderChatProps) => {
    return (
        <motion.header className={styles["chat-header"]} variants={headerVariants}>
            <div className={styles["chat-user"]}>
                <motion.div
                    className={styles["chat-avatar"]}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 }}
                    whileHover={{ scale: 1.07 }}
                >
                    <span>{title[0].toUpperCase()}</span>

                    <AnimatePresence>
                        {status === "connected" && (
                            <motion.span
                                key="online"
                                className={styles["online-indicator"]}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className={styles["chat-user-info"]}>
                    <h2>{title}</h2>

                    <div className={styles["chat-status"]} data-status={status}>
                        <span className={styles["status-dot"]} />

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={status}
                                className={styles["status-text"]}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: EASE_OUT }}
                            >
                                {statusLabels[status]}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className={styles["chat-actions"]}>
                <motion.button
                    type="button"
                    aria-label="Поиск сообщений"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                    <Search />
                </motion.button>

                <motion.button
                    type="button"
                    aria-label="Дополнительные действия"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                    <MoreHorizontal />
                </motion.button>
            </div>
        </motion.header>
    )
}