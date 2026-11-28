import type { Variants } from "framer-motion";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const headerVariants: Variants = {
    hidden: { opacity: 0, y: -14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const bodyVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT } },
};

export const footerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const sendIconVariants: Variants = {
    rest: { x: 0, y: 0, rotate: 0 },
    hover: { x: 2, y: -2, rotate: 8 },
};

export const panelVariants: Variants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: EASE_OUT,
            when: "beforeChildren",
            staggerChildren: 0.09,
        },
    },
};