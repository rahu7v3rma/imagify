"use client";

import { Button } from "@/components/buttons";
import { FormEvent, useState } from "react";
import SelectImage from "@/components/dashboard/select-image";
import DisplayImage from "@/components/dashboard/display-image";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import PageTransition from "@/components/transitions";

export default function RemoveBackgroundPage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageTransition>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Remove Background
        </h1>
        <p className="text-gray-600 mb-2">
          Upload an image or provide an image URL to remove its background
          automatically.
        </p>
        <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits
        </div>

        <div className="flex gap-8">
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <SelectImage onChangeImageUrl={(url) => setSelectedImageUrl(url)} />

              <Button type="submit" disabled={!selectedImageUrl}>
                Remove Background
              </Button>
            </form>
          </div>

          {processedImage && <DisplayImage imageSrc={processedImage} />}
        </div>
      </div>
    </PageTransition>
  );
}
