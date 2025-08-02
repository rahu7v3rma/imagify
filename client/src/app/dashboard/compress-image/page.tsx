"use client";

import { Button } from "@/components/button";
import { FormEvent, useState } from "react";
import ImageInput from "@/components/dashboard/select-image";
import DisplayImage from "@/components/dashboard/display-image";
import { CREDIT_REQUIREMENT } from "@/constants/dashboard/compress-image";

export default function CompressImagePage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Compress Image</h1>
      <p className="text-gray-600 mb-2">
        Upload an image or provide an image URL to compress it and reduce file
        size.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        💳 {CREDIT_REQUIREMENT} credits
      </div>

      <div className="flex gap-8">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ImageInput onChangeImageUrl={(url) => setSelectedImageUrl(url)} />

            <Button type="submit" disabled={!selectedImageUrl} variant="default">
              Compress Image
            </Button>
          </form>
        </div>

        {compressedImage && <DisplayImage imageSrc={compressedImage} />}
      </div>
    </div>
  );
}
