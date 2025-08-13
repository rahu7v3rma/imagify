"use client";

import { Button } from "@/components/buttons";
import { Textarea } from "@/components/inputs";
import { FormEvent, useState } from "react";
import DisplayImage from "@/components/dashboard/display-image";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import PageTransition from "@/components/transitions";
import { H1, Muted, P } from "@/components/ui/typography";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <PageTransition>
      <div className="w-full">
        <div className="mb-4 flex flex-col items-start">
          <H1>Generate Image</H1>
          <Muted>Enter a prompt to generate an image using AI.</Muted>
        </div>
        <div className="mb-6 inline-flex items-center px-2 py-1 rounded border text-xs font-medium">
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
