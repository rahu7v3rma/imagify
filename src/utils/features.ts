import {
  Image,
  Edit,
  ArrowUp,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";
import { CREDIT_REQUIREMENTS } from "@/utils/credits";

export const DASHBOARD_FEATURES = [
  {
    href: "/dashboard/generate-image",
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: `${CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits`,
  },
  {
    href: "/dashboard/remove-background",
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: `${CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits`,
  },
  {
    href: "/dashboard/extract-text",
    icon: FileText,
    title: "Extract Text",
    description: "Extract text from images using OCR",
    cost: `${CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits`,
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enhance and upscale your images",
    cost: `${CREDIT_REQUIREMENTS.UPSCALE} credits`,
  },
  {
    href: "/dashboard/compress-image",
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: `${CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits`,
  },
  {
    href: "/dashboard/convert-format",
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: `${CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits`,
  },
  {
    href: "/dashboard/edit-image",
    icon: Edit,
    title: "Edit Image",
    description: "Professional image editing tools",
    cost: `${CREDIT_REQUIREMENTS.EDIT_IMAGE} credits`,
  },
];

export const PRICING_TOOLS = [
  {
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: `${CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits`,
  },
  {
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: `${CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits`,
  },
  {
    icon: FileText,
    title: "Extract Text (OCR)",
    description: "Extract text from screenshots or scanned documents",
    cost: `${CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits`,
  },
  {
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enlarge images up to 4× while preserving detail",
    cost: `${CREDIT_REQUIREMENTS.UPSCALE} credits`,
  },
  {
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: `${CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits`,
  },
  {
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: `${CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits`,
  },
  {
    icon: Edit,
    title: "Edit Image",
    description: "Smart adjustments and transformations",
    cost: `${CREDIT_REQUIREMENTS.EDIT_IMAGE} credits`,
  },
];

export const HOME_TOOLS = [
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