"use client";

import { Button } from "@heroui/react";
import { FormEvent, useState } from "react";
import SelectImage from "@/components/dashboard/select-image";
import DisplayImage from "@/components/dashboard/display-image";
import { SelectSingle } from "@/components/input";
import { CREDIT_REQUIREMENT } from "@/constants/dashboard/convert-format";

export default function ConvertFormatPage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Convert Image Format
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Upload an image or provide an image URL to convert it to a different
        format.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        💳 {CREDIT_REQUIREMENT} credits
      </div>

      <div className="flex gap-8">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <SelectImage onChangeImageUrl={(url) => setSelectedImageUrl(url)} />

            <SelectSingle
              label="Output Format"
              value={outputFormat}
              onChange={setOutputFormat}
              options={["PNG", "JPEG", "JPG", "WebP"]}
            />

            <Button
              type="submit"
              isDisabled={!selectedImageUrl}
              variant="solid"
              color="primary"
            >
              Convert Format
            </Button>
          </form>
        </div>

        {convertedImage && <DisplayImage imageSrc={convertedImage} />}
      </div>
    </div>
  );
}
