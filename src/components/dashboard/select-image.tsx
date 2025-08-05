"use client";

import { ActionInput, ImageInput } from "@/components/inputs";
import { ChangeEvent, useEffect, useState } from "react";
import DisplayImage from "./display-image";
export interface SelectImageProps {
  onChangeImageUrl: (imageUrl: string) => void;
}

export default function SelectImage({ onChangeImageUrl }: SelectImageProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // axios post to upload image
      const imageSrc = "";
      setSelectedImageUrl(imageSrc);
    }
  };

  useEffect(() => {
    if (selectedImageUrl) {
      onChangeImageUrl(selectedImageUrl);
    }
  }, [selectedImageUrl]);

  return (
    <div className="flex flex-col gap-4">
      <ImageInput onChange={handleUploadImage} label="Upload Image" />

      <ActionInput
        value={selectedImageUrl || ""}
        onChange={(e) => setSelectedImageUrl(e.target.value)}
        label="Image URL"
        actionButton={{
          text: "Use",
          onPress: () => {
            if (selectedImageUrl) {
              onChangeImageUrl(selectedImageUrl);
            }
          },
        }}
      />

      {selectedImageUrl && <DisplayImage imageSrc={selectedImageUrl} />}
    </div>
  );
}
