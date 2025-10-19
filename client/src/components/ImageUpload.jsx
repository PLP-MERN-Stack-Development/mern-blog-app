import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUpload = ({ onImageUpload, multiple = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true);
    setError("");

    try {
      for (const file of acceptedFiles) {
        // Convert image to base64
        const base64Image = await convertToBase64(file);

        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (data.success) {
          onImageUpload(data.imageUrl);
        } else {
          setError(data.error || "Upload failed");
        }
      }
    } catch (error) {
      setError("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"]
    },
    multiple: multiple,
    maxSize: 2 * 1024 * 1024, // 2MB limit for base64
  });

  return (
    <div className="image-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""} ${uploading ? "uploading" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="upload-status">
            <div className="spinner"></div>
            <p>Processing image...</p>
          </div>
        ) : (
          <div className="dropzone-content">
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <div>
                <p>Drag & drop an image here, or click to select</p>
                <small>Supports: JPEG, PNG, GIF, WebP (Max 2MB)</small>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImageUpload;
