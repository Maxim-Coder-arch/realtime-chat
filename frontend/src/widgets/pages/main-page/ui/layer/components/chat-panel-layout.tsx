import { motion, MotionConfig } from "framer-motion";

import { panelVariants } from "../../../model/animations";
import type { ChatPanelLayoutProps } from "../../../model/types";

import styles from "../../styles/chat-panel.module.scss";

export const ChatPanelLayout = ({ panelStyle, title, children }: ChatPanelLayoutProps) => {
    return (
        <MotionConfig reducedMotion="user">
            <section id={`chat-${title[0]}`} className={styles["chat-section"]}>
                <motion.div
                    style={panelStyle}
                    className={styles["chat-panel"]}
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                >
                    { children }
                </motion.div>
            </section>
        </MotionConfig>
    )
}