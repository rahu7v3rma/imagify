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

export const TOOLS = [
  {
    icon: Sparkles,
    title: "Generate Image",
    description: "Create stunning images from text using AI",
    cost: `${GENERATE_IMAGE_CREDITS} credits`,
  },
  {
    icon: Image,
    title: "Remove Background",
    description: "Remove backgrounds from images instantly",
    cost: `${REMOVE_BACKGROUND_CREDITS} credits`,
  },
  {
    icon: FileText,
    title: "Extract Text (OCR)",
    description: "Extract text from screenshots or scanned documents",
    cost: `${EXTRACT_TEXT_CREDITS} credits`,
  },
  {
    icon: ArrowUp,
    title: "Upscale Image",
    description: "Enlarge images up to 4× while preserving detail",
    cost: `${UPSCALE_CREDITS} credits`,
  },
  {
    icon: Archive,
    title: "Compress Image",
    description: "Reduce image file size without losing quality",
    cost: `${COMPRESS_IMAGE_CREDITS} credits`,
  },
  {
    icon: RotateCcw,
    title: "Convert Format",
    description: "Convert images between different formats",
    cost: `${CONVERT_FORMAT_CREDITS} credits`,
  },
  {
    icon: Edit,
    title: "Edit Image",
    description: "Smart adjustments and transformations",
    cost: `${EDIT_IMAGE_CREDITS} credits`,
  },
];
