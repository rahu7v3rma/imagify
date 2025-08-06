import { Button } from "@/components/ui/button";
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
  LucideIcon,
} from "lucide-react";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";

function PricingTools({ tools }: {
  tools: {
    icon: LucideIcon;
    title: string;
    description: string;
    cost: string;
  }[];
}) {
  return (
    <div className="flex flex-row gap-4 flex-wrap justify-center w-3/4">
      {tools.map(({ icon: Icon, title, description, cost }) => (
        <Card key={title} className="h-full w-[300px]">
          <CardContent className="p-6 h-full">
            <div className="h-full flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <Icon />
              </div>
              <div className="text-center mt-4">
                <P>{title}</P>
                <Muted>{description}</Muted>
              </div>
              <div className="text-center mt-4">
                <P>💳 {cost}</P>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const PRICING_TOOLS = [
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
                    <Link href="/">Home</Link>
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

          <PricingTools tools={PRICING_TOOLS} />

          <div className="text-center space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center">
              <H2>Ready to get started?</H2>
              <Muted>
                Create a free account and top-up credits whenever you need them.
              </Muted>
            </div>
            <Button variant="default" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
