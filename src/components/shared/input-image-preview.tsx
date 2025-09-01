'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Muted } from '@/components/ui/typography';

interface InputImagePreviewProps {
  imageBase64: string;
  fileSize?: string;
  format?: string | null;
  dimensions?: string;
}

export const InputImagePreview = ({
  imageBase64,
  fileSize,
  format,
  dimensions,
}: InputImagePreviewProps) => {
  if (!imageBase64) return null;

  return (
    <Card className="w-full mb-6 mt-6">
      <CardHeader>
        <CardTitle>Input Image</CardTitle>
        <div className="mt-1 space-y-1">
          {fileSize && <Muted>{fileSize}</Muted>}
          {format && <Muted>{format.toUpperCase()}</Muted>}
          {dimensions && <Muted>{dimensions}</Muted>}
        </div>
        <CardDescription>
          Your uploaded image ready for processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
