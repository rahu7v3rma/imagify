import {
  Image,
  Edit,
  ArrowUp,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";
import { CREDIT_REQUIREMENT as GENERATE_IMAGE_CREDITS } from "./generate-image";
import { CREDIT_REQUIREMENT as REMOVE_BACKGROUND_CREDITS } from "./remove-background";
import { CREDIT_REQUIREMENT as EXTRACT_TEXT_CREDITS } from "./extract-text";
import { CREDIT_REQUIREMENT as UPSCALE_CREDITS } from "./upscale";
import { CREDIT_REQUIREMENT as COMPRESS_IMAGE_CREDITS } from "./compress-image";
import { CREDIT_REQUIREMENT as CONVERT_FORMAT_CREDITS } from "./convert-format";
import { CREDIT_REQUIREMENT as EDIT_IMAGE_CREDITS } from "./edit-image";

export const FEATURES = [
  {
    href: "/dashboard/generate-image",
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: `${GENERATE_IMAGE_CREDITS} credits`,
  },
  {
    href: "/dashboard/remove-background",
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: `${REMOVE_BACKGROUND_CREDITS} credits`,
  },
  {
    href: "/dashboard/extract-text",
    icon: FileText,
    title: "Extract Text",
    description: "Extract text from images using OCR",
    cost: `${EXTRACT_TEXT_CREDITS} credits`,
  },
  {
    href: "/dashboard/upscale",
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enhance and upscale your images",
    cost: `${UPSCALE_CREDITS} credits`,
  },
  {
    href: "/dashboard/compress-image",
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: `${COMPRESS_IMAGE_CREDITS} credits`,
  },
  {
    href: "/dashboard/convert-format",
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: `${CONVERT_FORMAT_CREDITS} credits`,
  },
  {
    href: "/dashboard/edit-image",
    icon: Edit,
    title: "Edit Image",
    description: "Professional image editing tools",
    cost: `${EDIT_IMAGE_CREDITS} credits`,
  },
];
