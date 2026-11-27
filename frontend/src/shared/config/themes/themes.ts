import { create, type StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ChatTheme, ThemesState } from "./themes.type";

const initialTheme: ChatTheme = {
    id: "default",
    name: "Default",
    preview: "#17191E",

    colors: {
        primary: "#17191E",
        secondary: "#22252D",
        text: "#FFFFFF",
        textSecondary: "#A0A5B1",
        accent: "#8B78C5",
        border: "rgba(255, 255, 255, 0.1)",
    },

    background: {
        type: "image",
        value: "/images/themes/default.jpg",
        overlay: "rgba(0, 0, 0, 0.2)",
        blur: 0,
    },

    effects: {
        glass: false,
        snowfall: false,
    },
};

const themesStore: StateCreator<ThemesState> = () => ({
    theme: initialTheme,
});

export const useThemesStore = create<ThemesState>()(
    persist(themesStore, {
        name: "themes-storage",
        storage: createJSONStorage(() => localStorage),
    }),
);

export const useTheme = () => useThemesStore(state => state.theme);