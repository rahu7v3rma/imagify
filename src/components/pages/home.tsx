import { MotionCardWrapper } from "@/components/shared/cards";
import PageTransition from "@/components/shared/transitions";
import { Card, CardContent } from "@/components/ui/card";
import { H1, H4, Muted } from "@/components/ui/typography";
import { ROUTES } from "@/constants/routes";
import {
  Archive,
  ArrowUp,
  Crop,
  Edit,
  FileText,
  Image,
  Maximize,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import NextLink from "next/link";

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-12 mt-12">
          <H1>Image Processing Tools</H1>
          <Muted>
            Powerful AI-driven tools for all your image processing needs
          </Muted>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <NextLink href={ROUTES.REMOVE_BACKGROUND}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Image className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Remove Background</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Remove backgrounds from images instantly
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.EXTRACT_TEXT}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Extract Text</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Extract text from images using OCR
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.UPSCALE}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <ArrowUp className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Upscale Image</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Enhance and upscale your images
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.COMPRESS_IMAGE}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Archive className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Compress Image</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Reduce image file size without losing quality
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.CONVERT_FORMAT}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <RotateCcw className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Convert Format</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Convert images between different formats
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.RESIZE_IMAGE}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Maximize className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Resize Image</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Resize images to specific dimensions
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.EDIT_IMAGE}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Edit className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Edit Image</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Professional prompt based image editing
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.GENERATE_IMAGE}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Generate Image</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Create stunning images from text using AI
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>

          <NextLink href={ROUTES.DASHBOARD.CROP_ROTATE_FLIP}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Crop className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <H4 className="font-bold text-sm">Crop-Rotate-Flip Image</H4>
                      <Muted className="text-xs text-muted-foreground">
                        Crop, rotate, and flip your images
                      </Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCardWrapper>
          </NextLink>
        </div>
      </div>
    </PageTransition>
  );
}
