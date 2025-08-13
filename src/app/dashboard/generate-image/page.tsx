"use client";

import { Button } from "@/components/buttons";
import { Textarea } from "@/components/inputs";
import { FormEvent, useState } from "react";
import DisplayImage from "@/components/dashboard/display-image";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import PageTransition from "@/components/transitions";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageTransition>
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Generate Image</h1>
        <p className="text-gray-600 mb-2">
          Enter a prompt to generate an image using AI.
        </p>
        <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits
        </div>

        <div className="flex gap-8">
          <div className="flex-1 max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                label="Image Prompt"
              />

              <Button type="submit" disabled={!prompt.trim()}>
                Generate Image
              </Button>
            </form>
          </div>

          {generatedImage && <DisplayImage imageSrc={generatedImage} />}
        </div>
      </div>
    </PageTransition>
  );
}
