import {
  Image,
  Edit,
  ArrowUp,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";

export const features = [
  {
    href: "/dashboard/generate-image",
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: "2-10 credits",
  },
  {
    href: "/dashboard/remove-background",
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: "2-4 credits",
  },
  {
    href: "/dashboard/extract-text",
    icon: FileText,
    title: "Extract Text",
    description: "Extract text from images using OCR",
    cost: "2 credits",
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enhance and upscale your images",
    cost: "2-3 credits",
  },
  {
    href: "/dashboard/compress-image",
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: "3 credits",
  },
  {
    href: "/dashboard/convert-format",
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: "3 credits",
  },
  {
    href: "/dashboard/edit-image",
    icon: Edit,
    title: "Edit Image",
    description: "Professional image editing tools",
    cost: "2-10 credits",
  },
];
