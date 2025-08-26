import { Button, IconButton } from "@/components/shared/buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Muted } from "@/components/ui/typography";
import { downloadImage } from "@/utils/common";
import { Download, Expand } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ExpandedPreviewImage } from "@/components/shared/modals";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <motion.div 
            className="w-full flex justify-center relative cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={processedImage}
              alt="Processed image"
              className="rounded-lg border max-h-[300px] w-full object-contain"
            />
            <motion.div
              className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <IconButton
                onClick={() => setIsModalOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Expand className="h-6 w-6" />
              </IconButton>
            </motion.div>
          </motion.div>
          <Button
            className="w-full"
            onClick={() => downloadImage(processedImage, format, name)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </CardContent>
      </Card>
      
      <ExpandedPreviewImage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={processedImage}
      />
    </div>
  );
}
