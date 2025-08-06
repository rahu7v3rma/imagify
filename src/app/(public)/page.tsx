import { H1, P, H4, Small } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { MotionCardWrapper } from "@/components/cards";
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
import PageTransition from "@/components/transitions";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-12 mt-12">
          <H1>Image Processing Tools</H1>
          <P>Powerful AI-driven tools for all your image processing needs</P>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <NextLink href={ROUTES.DASHBOARD.REMOVE_BACKGROUND}>
            <MotionCardWrapper>
              <Card className="h-[220px] w-[250px]">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                      <Image className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Remove Background</H4>
                      <Small className="text-xs text-muted-foreground">
                        Remove backgrounds from images instantly
                      </Small>
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
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Extract Text</H4>
                      <Small className="text-xs text-muted-foreground">
                        Extract text from images using OCR
                      </Small>
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
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Upscale Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Enhance and upscale your images
                      </Small>
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
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Compress Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Reduce image file size without losing quality
                      </Small>
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
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Convert Format</H4>
                      <Small className="text-xs text-muted-foreground">
                        Convert images between different formats
                      </Small>
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
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Edit Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Professional image editing tools
                      </Small>
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
                    <div className="text-center space-y-2">
                      <H4 className="font-bold text-sm">Generate Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Create stunning images from text using AI
                      </Small>
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
