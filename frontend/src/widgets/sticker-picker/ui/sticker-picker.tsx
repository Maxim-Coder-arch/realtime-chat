import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, Search, X } from "lucide-react";

import type { Sticker } from "../../../entities/sticker";

import { useStickers } from "../lib/hooks/use-stickers";

import styles from "./sticker-picker.module.scss";

interface StickerPickerProps {
    onClose: () => void;
    onSelect: (sticker: Sticker) => void;
}

const categories = [
    { label: "Все", value: "" },
    { label: "Котики", value: "cat" },
    { label: "Любовь", value: "love" },
    { label: "Радость", value: "happy" },
    { label: "Злость", value: "angry" },
];

export const StickerPicker = ({
    onClose,
    onSelect,
}: StickerPickerProps) => {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("");

    const { stickers, isLoading, error } = useStickers({
        search,
        limit: 40,
    });

    const handleCategoryChange = (value: string) => {
        setActiveCategory(value);
        setSearch(value);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setActiveCategory("");
    };

    return (
        <AnimatePresence>
            <motion.section
                className={styles["sticker-picker"]}
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 28,
                }}
                aria-label="Выбор стикера"
            >
                <header className={styles["picker-header"]}>
                    <div className={styles["picker-title"]}>
                        <h3>Стикеры</h3>
                        <span>Выбери настроение</span>
                    </div>

                    <button
                        type="button"
                        className={styles["close-button"]}
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        <X />
                    </button>
                </header>

                <div className={styles["picker-search"]}>
                    <Search />

                    <input
                        type="search"
                        placeholder="Найти стикер..."
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(event.target.value)
                        }
                    />
                </div>

                <nav className={styles["picker-categories"]}>
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            type="button"
                            className={
                                activeCategory === category.value
                                    ? styles["active"]
                                    : ""
                            }
                            onClick={() =>
                                handleCategoryChange(category.value)
                            }
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>

                <div className={styles["picker-content"]}>
                    {isLoading && (
                        <div className={styles["picker-state"]}>
                            <LoaderCircle className={styles["loader"]} />
                            <span>Загружаем стикеры...</span>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className={styles["picker-state"]}>
                            <span>{error}</span>
                        </div>
                    )}

                    {!isLoading && !error && stickers.length === 0 && (
                        <div className={styles["picker-state"]}>
                            <span>Ничего не найдено</span>
                        </div>
                    )}

                    {!isLoading && !error && stickers.length > 0 && (
                        <div className={styles["sticker-grid"]}>
                            {stickers.map((sticker) => (
                                <button
                                    key={sticker.id}
                                    type="button"
                                    className={styles["sticker-item"]}
                                    title={sticker.name}
                                    onClick={() => onSelect(sticker)}
                                >
                                    <img
                                        src={sticker.thumbnail.url}
                                        alt={sticker.name}
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <footer className={styles["picker-footer"]}>
                    <a
                        href="https://mssgs-stickers.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Stickers by mssgs-stickers.com
                    </a>
                </footer>
            </motion.section>
        </AnimatePresence>
    );
};