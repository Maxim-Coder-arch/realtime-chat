export interface StickerAsset {
    url: string;
    type: string;
    bytes?: number;
    width?: number;
    height?: number;
}

export interface Sticker {
    id: string;
    name: string;
    pack: string;
    tags: string[];
    description?: string;

    width: number;
    height: number;

    animated: boolean;
    frames?: number;
    fps?: number;
    duration_ms?: number;

    poster: StickerAsset;
    thumbnail: StickerAsset;

    page: string;
    credit: string;
}

export interface StickersResponse {
    total: number;
    next: string | null;
    stickers: Sticker[];
}

export interface GetStickersParams {
    q?: string;
    limit?: number;
    offset?: number;
    pack?: string;
    tag?: string;
}