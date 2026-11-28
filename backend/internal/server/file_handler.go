package server

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

const (
	uploadDir     = "uploads"
	maxUploadSize = 10 << 20
)

type FileResponse struct {
	Name        string `json:"name"`
	URL         string `json:"url"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxUploadSize)

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Invalid file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		http.Error(w, "Failed to create upload directory", http.StatusInternalServerError)
		return
	}

	randomBytes := make([]byte, 16)

	if _, err := rand.Read(randomBytes); err != nil {
		http.Error(w, "Failed to generate filename", http.StatusInternalServerError)
		return
	}

	extension := filepath.Ext(header.Filename)
	filename := hex.EncodeToString(randomBytes) + extension
	filePath := filepath.Join(uploadDir, filename)

	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to create file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	written, err := io.Copy(dst, file)
	if err != nil {
		os.Remove(filePath)
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	buffer := make([]byte, 512)

	n, err := dst.Seek(0, io.SeekStart)
	if err != nil {
		os.Remove(filePath)
		http.Error(w, "Failed to read file", http.StatusInternalServerError)
		return
	}
	_ = n

	read, err := dst.Read(buffer)
	if err != nil && err != io.EOF {
		os.Remove(filePath)
		http.Error(w, "Failed to detect file type", http.StatusInternalServerError)
		return
	}

	contentType := http.DetectContentType(buffer[:read])

	response := FileResponse{
		Name:        header.Filename,
		URL:         "/uploads/" + filename,
		ContentType: contentType,
		Size:        written,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		fmt.Println("Failed to encode file response:", err)
	}
}