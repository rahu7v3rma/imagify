import {
  Image,
  Edit,
  ArrowUp,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";

export const tools = [
  {
    href: "/dashboard/remove-background",
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
  },
  {
    href: "/dashboard/extract-text",
    icon: FileText,
    title: "Extract Text",
    description: "Extract text from images using OCR",
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enhance and upscale your images",
  },
  {
    href: "/dashboard/compress-image",
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
  },
  {
    href: "/dashboard/convert-format",
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
  },
  {
    href: "/dashboard/edit-image",
    icon: Edit,
    title: "Edit Image",
    description: "Professional image editing tools",
  },
  {
    href: "/dashboard/generate-image",
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
  },
];