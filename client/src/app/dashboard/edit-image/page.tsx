"use client";

import { Button } from "@/components/buttons";
import { FormEvent, useState, ChangeEvent } from "react";
import SelectImage from "@/components/dashboard/select-image";
import DisplayImage from "@/components/dashboard/display-image";
import { Textarea } from "@/components/inputs";
import { CREDIT_REQUIREMENT } from "@/constants/dashboard/edit-image";

export default function EditImagePage() {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  const [editedImage, setEditedImage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Edit Image</h1>
      <p className="text-gray-600 mb-2">
        Upload an image or provide an image URL, then describe the changes you
        want to make.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        💳 {CREDIT_REQUIREMENT} credits
      </div>

      <div className="flex gap-8">
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <SelectImage onChangeImageUrl={(url) => setSelectedImageUrl(url)} />

            <Textarea
              value={prompt}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setPrompt(e.target.value)
              }
              label="Edit Prompt"
            />

            <Button
              type="submit"
              disabled={!selectedImageUrl || !prompt.trim()}
            >
              Edit Image
            </Button>
          </form>
        </div>

        {editedImage && <DisplayImage imageSrc={editedImage} />}
      </div>
    </div>
  );
}
