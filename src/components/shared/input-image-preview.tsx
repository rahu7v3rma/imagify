"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface InputImagePreviewProps {
  imageBase64: string;
}

export const InputImagePreview = ({ imageBase64 }: InputImagePreviewProps) => {
  if (!imageBase64) return null;

  return (
    <Card className="w-full mb-6 mt-6">
      <CardHeader>
        <CardTitle>Input Image</CardTitle>
        <CardDescription>
          Your uploaded image ready for processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center">
          <img
            src={imageBase64}
            alt="Preview image"
            className="rounded-lg border max-h-64 object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
};