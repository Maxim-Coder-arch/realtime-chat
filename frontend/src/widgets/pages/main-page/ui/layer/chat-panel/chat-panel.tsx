import type { CSSProperties } from "react";

import { useTheme } from "../../../../../../shared/config/themes/themes";

import styles from "../../styles/chat-panel.module.scss";

export const ChatPanel = ({ title }: { title: string }) => {
    const theme = useTheme();

    const panelStyle: CSSProperties = {
        background: theme.panel.background,
        backdropFilter: `blur(${theme.panel.blur}px)`,
        border: `1px solid ${theme.panel.border}`,
    };

    return (
        <section id={`chat-${title[0]}`} className={styles["chat-section"]}>
            <div style={panelStyle} className={styles["chat-panel"]}>


                <header className={styles["chat-header"]}>
                    <div className={styles["chat-user"]}>
                        <div className={styles["chat-avatar"]}>
                            <span>{title[0].toUpperCase()}</span>
                            <span className={styles["online-indicator"]} />
                        </div>

                        <div className={styles["chat-user-info"]}>
                            <h2>{title}</h2>
                            <span>В сети</span>
                        </div>
                    </div>

                    <div className={styles["chat-actions"]}>
                        <button aria-label="Поиск сообщений">
                            <span>⌕</span>
                        </button>

                        <button aria-label="Дополнительные действия">
                            <span>···</span>
                        </button>
                    </div>
                </header>


                <main className={styles["chat-messages"]}>
                    <div className={styles["chat-date"]}>
                        <span>Сегодня</span>
                    </div>

                    <div className={`${styles["message-row"]} ${styles["incoming"]}`}>
                        <div className={styles["message-bubble"]}>
                            <p>Привет! Как тебе новый интерфейс?</p>
                            <span className={styles["message-time"]}>12:40</span>
                        </div>
                    </div>

                    <div className={`${styles["message-row"]} ${styles["outgoing"]}`}>
                        <div className={styles["message-bubble"]}>
                            <p>Выглядит довольно неплохо. Особенно нравится оформление.</p>
                            <span className={styles["message-time"]}>
                                12:41 <span className={styles["message-check"]}>✓✓</span>
                            </span>
                        </div>
                    </div>

                    <div className={`${styles["message-row"]} ${styles["incoming"]}`}>
                        <div className={styles["message-bubble"]}>
                            <p>Тогда продолжим в том же духе :)</p>
                            <span className={styles["message-time"]}>12:42</span>
                        </div>
                    </div>
                </main>


                <footer className={styles["chat-footer"]}>
                    <button className={styles["attachment-button"]} aria-label="Прикрепить файл">
                        +
                    </button>

                    <div className={styles["message-input-wrapper"]}>
                        <input
                            type="text"
                            placeholder="Написать сообщение..."
                            aria-label="Текст сообщения"
                        />

                        <button className={styles["emoji-button"]} aria-label="Эмодзи">
                            ☺
                        </button>
                    </div>

                    <button className={styles["send-button"]} aria-label="Отправить сообщение">
                        ↑
                    </button>
                </footer>

            </div>
        </section>
    );
};