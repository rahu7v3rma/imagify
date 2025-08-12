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
import { MotionCardWrapper } from "@/components/cards";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { H1, H4, Muted, Small } from "@/components/ui/typography";

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col items-start">
        <H1>Dashboard</H1>
        <Muted>
          Welcome back! Choose a tool to get started with your image processing
          needs.
        </Muted>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href={ROUTES.DASHBOARD.GENERATE_IMAGE}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Generate Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Create stunning images from text using AI
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>

        <Link href={ROUTES.DASHBOARD.REMOVE_BACKGROUND}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Image className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Remove Background</H4>
                      <Small className="text-xs text-muted-foreground">
                        Remove backgrounds from images instantly
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>

        <Link href={ROUTES.DASHBOARD.EXTRACT_TEXT}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Extract Text</H4>
                      <Small className="text-xs text-muted-foreground">
                        Extract text from images using OCR
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>

        <Link href={ROUTES.DASHBOARD.UPSCALE}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <ArrowUp className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Upscale Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Enhance and upscale your images
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.UPSCALE} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>

        <Link href={ROUTES.DASHBOARD.COMPRESS_IMAGE}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Archive className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Compress Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Reduce image file size without losing quality
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>

        <Link href={ROUTES.DASHBOARD.CONVERT_FORMAT}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <RotateCcw className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Convert Format</H4>
                      <Small className="text-xs text-muted-foreground">
                        Convert images between different formats
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>

        <Link href={ROUTES.DASHBOARD.EDIT_IMAGE}>
          <MotionCardWrapper>
            <Card className="h-[250px] w-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Edit className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Edit Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Professional image editing tools
                      </Small>
                    </div>
                    <Small className="text-xs font-medium border rounded px-2 py-1">
                      💳 {CREDIT_REQUIREMENTS.EDIT_IMAGE} credits
                    </Small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionCardWrapper>
        </Link>
      </div>
    </div>
  );
}
