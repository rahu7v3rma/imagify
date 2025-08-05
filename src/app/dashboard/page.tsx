import Link from "next/link";
import {
  Image,
  Edit,
  ArrowUp,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";

const DASHBOARD_FEATURES = [
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

export default function DashboardPage() {
  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Choose a tool to get started with your image processing
          needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DASHBOARD_FEATURES.map(({ icon: Icon, href, title, description, cost }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                💳 {cost}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
