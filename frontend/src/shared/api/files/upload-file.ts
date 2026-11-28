import type { UploadedFile } from "./file.type";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const uploadFile = async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/files`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`File upload failed: ${response.status}`);
    }

    const uploadedFile: UploadedFile = await response.json();

    return {
        ...uploadedFile,
        url: `${API_URL}${uploadedFile.url}`,
    };
};