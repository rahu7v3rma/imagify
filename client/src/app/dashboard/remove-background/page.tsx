"use client";

import { Button } from "@heroui/react";
import { FormEvent, useState } from "react";
import SelectImage from "@/components/dashboard/select-image";
import { CREDIT_REQUIREMENT } from "@/constants/dashboard/remove-background";
import DisplayImage from "@/components/dashboard/display-image";

export default function RemoveBackgroundPage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Remove Background
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Upload an image or provide an image URL to remove its background
        automatically.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        💳 {CREDIT_REQUIREMENT} credits
      </div>

      <div className="flex gap-8">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <SelectImage onChangeImageUrl={(url) => setSelectedImageUrl(url)} />

            <Button
              type="submit"
              isDisabled={!selectedImageUrl}
              variant="solid"
              color="primary"
            >
              Remove Background
            </Button>
          </form>
        </div>

        {processedImage && <DisplayImage imageSrc={processedImage} />}
      </div>
    </div>
  );
}
