import { useEffect, useState } from "react";
import { getStickers, type Sticker } from "../../../../entities/sticker";

interface UseStickersOptions {
    search?: string;
    limit?: number;
}

export const useStickers = ({
    search = "",
    limit = 40,
}: UseStickersOptions = {}) => {
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchStickers = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getStickers({
                    q: search || undefined,
                    limit,
                });

                if (!controller.signal.aborted) {
                    setStickers(response.stickers);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load stickers",
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        fetchStickers();

        return () => controller.abort();
    }, [search, limit]);

    return {
        stickers,
        isLoading,
        error,
    };
};