"use client";

import { Button } from "@/components/buttons";
import { FormEvent, useState } from "react";
import SelectImage from "@/components/dashboard/select-image";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { Copy } from "lucide-react";
import clsx from "clsx";

interface DisplayTextProps {
  text: string;
  className?: string;
}

function DisplayText({ text, className }: DisplayTextProps) {
  return (
    <div className={clsx("flex-1 max-w-md", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Extracted Text
      </label>
      <div className="w-full h-80 border-2 border-gray-300 rounded-lg bg-gray-50 p-4 relative overflow-y-auto">
        <div className="text-gray-900 whitespace-pre-wrap text-sm">{text}</div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
          className="absolute top-2 right-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200 z-10 flex items-center gap-1"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
      </div>
    </div>
  );
}

export default function ExtractTextPage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Extract Text</h1>
      <p className="text-gray-600 mb-2">
        Upload an image or provide an image URL to extract text using OCR
        technology.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        💳 {CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits
      </div>

      <div className="flex gap-8">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <SelectImage onChangeImageUrl={(url) => setSelectedImageUrl(url)} />

            <Button type="submit" disabled={!selectedImageUrl}>
              Extract Text
            </Button>
          </form>
        </div>

        {extractedText && <DisplayText text={extractedText} />}
      </div>
    </div>
  );
}
