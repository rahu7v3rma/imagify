import {
  PhotoIcon,
  PencilIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const tools = [
  {
    icon: SparklesIcon,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: "2–10 credits",
  },
  {
    icon: PhotoIcon,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: "2–4 credits",
  },
  {
    icon: DocumentTextIcon,
    title: "Extract Text (OCR)",
    description: "Extract text from screenshots or scanned documents",
    cost: "2 credits",
  },
  {
    icon: ArrowUpIcon,
    title: "Upscale Image",
    description: "Enlarge images up to 4× while preserving detail",
    cost: "2–3 credits",
  },
  {
    icon: ArchiveBoxArrowDownIcon,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: "3 credits",
  },
  {
    icon: ArrowPathIcon,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: "3 credits",
  },
  {
    icon: PencilIcon,
    title: "Edit Image",
    description: "Smart adjustments and transformations",
    cost: "2–10 credits",
  },
];
