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
    href: "/dashboard/remove-background",
    icon: PhotoIcon,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
  },
  {
    href: "/dashboard/extract-text",
    icon: DocumentTextIcon,
    title: "Extract Text",
    description: "Extract text from images using OCR",
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUpIcon,
    title: "Upscale Image",
    description: "Enhance and upscale your images",
  },
  {
    href: "/dashboard/compress-image",
    icon: ArchiveBoxArrowDownIcon,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
  },
  {
    href: "/dashboard/convert-format",
    icon: ArrowPathIcon,
    title: "Convert Format",
    description: "Convert images between different formats",
  },
  {
    href: "/dashboard/edit-image",
    icon: PencilIcon,
    title: "Edit Image",
    description: "Professional image editing tools",
  },
  {
    href: "/dashboard/generate-image",
    icon: SparklesIcon,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
  },
];