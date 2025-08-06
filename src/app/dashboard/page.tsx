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
import { ROUTES } from "@/constants/routes";

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
        <Link
          href={ROUTES.DASHBOARD.GENERATE_IMAGE}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Generate Image
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create stunning images from text using AI
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.DASHBOARD.REMOVE_BACKGROUND}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <Image className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Remove Background
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Remove backgrounds from images instantly
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.DASHBOARD.EXTRACT_TEXT}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Extract Text
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Extract text from images using OCR
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.DASHBOARD.UPSCALE}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <ArrowUp className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Upscale Image
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enhance and upscale your images
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.UPSCALE} credits
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.DASHBOARD.COMPRESS_IMAGE}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <Archive className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Compress Image
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Reduce image file size without losing quality
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.DASHBOARD.CONVERT_FORMAT}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <RotateCcw className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Convert Format
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Convert images between different formats
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits
            </div>
          </div>
        </Link>

        <Link
          href={ROUTES.DASHBOARD.EDIT_IMAGE}
          className="group flex flex-col items-center space-y-3 rounded-lg border border-accent p-6 shadow-sm transition-all hover:shadow-md hover:scale-105"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
            <Edit className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Edit Image
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Professional image editing tools
            </p>
            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              💳 {CREDIT_REQUIREMENTS.EDIT_IMAGE} credits
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
