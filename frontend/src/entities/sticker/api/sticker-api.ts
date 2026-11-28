import type {
    GetStickersParams,
    StickersResponse,
} from "../model/sticker.type";

const API_URL =
    import.meta.env.VITE_STICKERS_API_URL ??
    "https://mssgs-stickers.com/api/v1";

const API_KEY = import.meta.env.VITE_STICKERS_API_KEY;

const getHeaders = (): HeadersInit => {
    if (!API_KEY) {
        throw new Error("Stickers API key is not configured");
    }

    return {
        Authorization: `Bearer ${API_KEY}`,
    };
};

export const getStickers = async (
    params: GetStickersParams = {},
    signal?: AbortSignal,
): Promise<StickersResponse> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
            searchParams.set(key, String(value));
        }
    });

    const response = await fetch(
        `${API_URL}/stickers?${searchParams.toString()}`,
        {
            signal,
            method: "GET",
            headers: getHeaders(),
        },
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Invalid Stickers API key");
        }

        if (response.status === 429) {
            throw new Error("Stickers API rate limit exceeded");
        }

        throw new Error(
            `Failed to fetch stickers: ${response.status}`,
        );
    }

    return response.json();
};