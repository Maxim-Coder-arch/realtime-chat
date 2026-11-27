export interface ChatTheme {
    id: string;
    name: string;
    preview: string;

    colors: {
        primary: string;
        secondary: string;
        text: string;
        textSecondary: string;
        accent: string;
        border: string;
    };

    background: {
        type: "image";
        value: string;
        overlay?: string;
        blur?: number;
    };

    effects: {
        glass: boolean;
        snowfall: boolean;
        pattern?: string;
    };

    panel: {
        background: string;
        blur: number;
        border: string;
    };
}

export interface ThemesState {
    theme: ChatTheme;
}