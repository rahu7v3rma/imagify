"use client";

import { Button, Textarea } from "@heroui/react";
import { FormEvent, useState } from "react";
import { CREDIT_REQUIREMENT } from "@/constants/dashboard/generate-image";
import DisplayImage from "@/components/dashboard/display-image";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Generate Image
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Enter a prompt to generate an image using AI.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        💳 {CREDIT_REQUIREMENT} credits
      </div>

      <div className="flex gap-8">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              label="Image Prompt"
              placeholder="Describe the image you want to generate (e.g., 'A beautiful sunset over mountains with purple clouds')"
              rows={4}
            />

            <Button
              type="submit"
              isDisabled={!prompt.trim()}
              variant="solid"
              color="primary"
            >
              Generate Image
            </Button>
          </form>
        </div>

        {generatedImage && <DisplayImage imageSrc={generatedImage} />}
      </div>
    </div>
  );
}
