import { H1, P, H4, Small } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { MotionCardWrapper } from "@/components/links";
import NextLink from "next/link";
import {
  Image,
  Edit,
  ArrowUp,
  FileText,
  Sparkles,
  Archive,
  RotateCcw,
} from "lucide-react";
import PageTransition from "@/components/page-transition";

const HOME_TOOLS = [
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

function HomeToolsGrid() {
  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      {HOME_TOOLS.map(({ icon: Icon, href, title, description }) => (
        <NextLink key={href} href={href}>
          <MotionCardWrapper key={href}>
            <Card key={href} className="h-[220px] w-[250px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2">
                    <H4 className="font-bold text-sm">{title}</H4>
                    <Small className="text-xs text-muted-foreground">
                      {description}
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </NextLink>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-12 mt-12">
          <H1>Image Processing Tools</H1>
          <P>Powerful AI-driven tools for all your image processing needs</P>
        </div>

        <HomeToolsGrid />
      </div>
    </PageTransition>
  );
}
