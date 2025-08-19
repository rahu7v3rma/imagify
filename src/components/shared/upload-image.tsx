"use client";

import {
  ImageInput,
  TextActionInput,
  DragDropImageInput,
} from "@/components/shared/inputs";
import { convertImageUrlToBase64, fileToBase64 } from "@/utils/common";
import { formatFileSize } from "@/utils/image";
import { Muted } from "@/components/ui/typography";
import { useState } from "react";

interface UploadImageProps {
  onUploadFile: (
    base64: string,
    fileSize?: string,
    fileName?: string,
    format?: string
  ) => void;
  onUploadUrl: (
    base64: string,
    fileSize?: string,
    fileName?: string,
    format?: string
  ) => void;
}

export const UploadImage = ({
  onUploadFile,
  onUploadUrl,
}: UploadImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageInputError, setImageInputError] = useState<string | null>(null);
  const [urlInputError, setUrlInputError] = useState<string | null>(null);
  const [dragDropError, setDragDropError] = useState<string | null>(null);
  const [isUrlConversionLoading, setIsUrlConversionLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        setImageInputError("File size must be less than 10MB");
        setUrlInputError(null);
        // Clear the input
        e.target.value = "";
        return;
      }

      // Check if file is a supported image type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setImageInputError("Please select a JPG, PNG, or WebP image file");
        setUrlInputError(null);
        // Clear the input
        e.target.value = "";
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        const fileSize = formatFileSize(file.size);
        const fileName = file.name
          .replace(".webp", "")
          .replace(".jpg", "")
          .replace(".jpeg", "")
          .replace(".png", "")
          .slice(0, 20)
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase();
        const format = file.type.replace("image/", "");
        onUploadFile(base64, fileSize, fileName, format);
        setImageInputError(null);
        setUrlInputError(null);
        setDragDropError(null);
      } catch (error) {
        setImageInputError(
          "Failed to process the image file. Please try another file."
        );
        setUrlInputError(null);
        setDragDropError(null);
      }
    }
  };

  const handleUrlToBase64 = async () => {
    try {
      if (!imageUrl.trim()) {
        setUrlInputError("Please enter a valid image URL");
        setImageInputError(null);
        return;
      }

      setIsUrlConversionLoading(true);
      const result = await convertImageUrlToBase64(imageUrl);
      const urlFileName = imageUrl
        .replace(/http/, "")
        .replace(/https/, "")
        .replace(/www/, "")
        .slice(0, 20)
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();
      onUploadUrl(result.base64, result.fileSize, urlFileName, result.format);
      setImageInputError(null);
      setUrlInputError(null);
      setDragDropError(null);
    } catch (error) {
      setUrlInputError(
        "Failed to load image from URL. Please check the URL and try again."
      );
      setImageInputError(null);
      setDragDropError(null);
    } finally {
      setIsUrlConversionLoading(false);
    }
  };

  const handleDragDropUpload = (
    base64: string,
    fileSize?: string,
    fileName?: string,
    format?: string
  ) => {
    onUploadFile(base64, fileSize, fileName, format);
    setImageInputError(null);
    setUrlInputError(null);
    setDragDropError(null);
  };

  const handleDragDropError = (error: string) => {
    setDragDropError(error);
    setImageInputError(null);
    setUrlInputError(null);
  };

  return (
    <div className="space-y-4">
      <ImageInput
        label="Upload Image"
        onChange={handleFileChange}
        error={imageInputError}
      />

      <DragDropImageInput
        onUpload={handleDragDropUpload}
        onError={handleDragDropError}
        error={dragDropError}
      />

      <TextActionInput
        label="Or use image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        actionButton={{
          text: "Use",
          onPress: handleUrlToBase64,
          disabled: !imageUrl.trim(),
          isLoading: isUrlConversionLoading,
        }}
        error={urlInputError}
      />

      <div className="mt-2 space-y-0">
        <Muted>Maximum allowed file size: 10MB</Muted>
        <Muted>Allowed image types: JPEG, JPG, PNG, WebP</Muted>
      </div>
    </div>
  );
};
