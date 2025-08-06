import { Button } from "@/components/buttons";
import Link from "next/link";
import { H1, H2, Muted, P } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/transitions";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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

export default async function PricingPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="w-full">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <div className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={ROUTES.HOME}>Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
              <div className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbPage>Pricing</BreadcrumbPage>
                </BreadcrumbItem>
              </div>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="space-y-12 flex flex-col items-center justify-center">
          <div className="text-center space-y-2 max-w-4xl mx-auto">
            <H1>Simple, pay-as-you-go pricing</H1>
            <P>
              Purchase prepaid processing credits and use them across any tool.
              No subscriptions, surprise bills, or hidden fees—just
              straight-forward pricing that scales with your creativity.
            </P>
          </div>

          <div className="flex flex-row gap-4 flex-wrap justify-center w-3/4">
            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Sparkles />
                  </div>
                  <div className="text-center mt-4">
                    <P>Generate Image</P>
                    <Muted>Create stunning images from text using AI</Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Image />
                  </div>
                  <div className="text-center mt-4">
                    <P>Remove Background</P>
                    <Muted>Remove backgrounds from images instantly</Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <FileText />
                  </div>
                  <div className="text-center mt-4">
                    <P>Extract Text (OCR)</P>
                    <Muted>
                      Extract text from screenshots or scanned documents
                    </Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <ArrowUp />
                  </div>
                  <div className="text-center mt-4">
                    <P>Upscale Image</P>
                    <Muted>
                      Enlarge images up to 4× while preserving detail
                    </Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.UPSCALE} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Archive />
                  </div>
                  <div className="text-center mt-4">
                    <P>Compress Image</P>
                    <Muted>Reduce image file size without losing quality</Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <RotateCcw />
                  </div>
                  <div className="text-center mt-4">
                    <P>Convert Format</P>
                    <Muted>Convert images between different formats</Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full w-[300px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    <Edit />
                  </div>
                  <div className="text-center mt-4">
                    <P>Edit Image</P>
                    <Muted>Smart adjustments and transformations</Muted>
                  </div>
                  <div className="text-center mt-4">
                    <P>💳 {CREDIT_REQUIREMENTS.EDIT_IMAGE} credits</P>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center">
              <H2>Ready to get started?</H2>
              <Muted>
                Create a free account and top-up credits whenever you need them.
              </Muted>
            </div>
            <Button variant="default" asChild>
              <Link href={ROUTES.SIGNUP}>Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
