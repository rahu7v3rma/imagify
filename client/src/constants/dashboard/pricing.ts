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
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: "2–10 credits",
  },
  {
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: "2–4 credits",
  },
  {
    icon: FileText,
    title: "Extract Text (OCR)",
    description: "Extract text from screenshots or scanned documents",
    cost: "2 credits",
  },
  {
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enlarge images up to 4× while preserving detail",
    cost: "2–3 credits",
  },
  {
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: "3 credits",
  },
  {
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: "3 credits",
  },
  {
    icon: Edit,
    title: "Edit Image",
    description: "Smart adjustments and transformations",
    cost: "2–10 credits",
  },
];
