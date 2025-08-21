import { Button } from "@/components/shared/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Muted } from "@/components/ui/typography";
import { downloadImage } from "@/utils/common";
import { Download } from "lucide-react";

interface ProcessedImageProps {
  processedImage: string;
  format?: string;
  fileSize?: string;
  name?: string;
  dimensions?: string;
}

export function ProcessedImage({
  processedImage,
  format,
  fileSize,
  name = "processed-image",
  dimensions,
}: ProcessedImageProps) {
  return (
    <div className="flex-1">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Processed Image</CardTitle>
          <div className="mt-1 space-y-1">
            {fileSize && <Muted>{fileSize}</Muted>}
            {format && <Muted>{format.toUpperCase()}</Muted>}
            {dimensions && <Muted>{dimensions}</Muted>}
          </div>
          <CardDescription>
            Your background-removed image is ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex justify-center">
            <img
              src={processedImage}
              alt="Processed image"
              className="rounded-lg border max-h-[300px] w-full object-contain"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => downloadImage(processedImage, format, name)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
