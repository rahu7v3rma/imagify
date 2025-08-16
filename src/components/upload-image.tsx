"use client";

import { ImageInput, TextActionInput } from "@/components/inputs";
import { convertImageUrlToBase64, fileToBase64 } from "@/utils/common";
import { useState } from "react";

interface UploadImageProps {
  onUploadFile: (base64: string) => void;
  onUploadUrl: (base64: string) => void;
}

export const UploadImage = ({ onUploadFile, onUploadUrl }: UploadImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageInputError, setImageInputError] = useState<string | null>(null);
  const [urlInputError, setUrlInputError] = useState<string | null>(null);
  const [isUrlConversionLoading, setIsUrlConversionLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        onUploadFile(base64);
        setImageInputError(null);
        setUrlInputError(null);
      } catch (error) {
        setImageInputError("Failed to process the image file. Please try another file.");
        setUrlInputError(null);
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
      const base64 = await convertImageUrlToBase64(imageUrl);
      onUploadUrl(base64);
      setImageInputError(null);
      setUrlInputError(null);
    } catch (error) {
      setUrlInputError(
        "Failed to load image from URL. Please check the URL and try again."
      );
      setImageInputError(null);
    } finally {
      setIsUrlConversionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageInput
        label="Upload Image"
        onChange={handleFileChange}
        error={imageInputError}
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
    </div>
  );
};