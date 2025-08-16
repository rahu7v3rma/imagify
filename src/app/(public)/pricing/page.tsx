"use client";

import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { Button } from "@/components/buttons";
import { MotionCardWrapper } from "@/components/cards";
import { NumberInput } from "@/components/inputs";
import PageTransition from "@/components/transitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1, H4, Muted, P } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { ROUTES } from "@/constants/routes";
import { getAccessToken } from "@/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Archive,
  ArrowUp,
  Edit,
  FileText,
  Image,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import NextLink from "next/link";

export const metadata = {
  title: "Pricing - Imagify",
  description: "Simple, pay-as-you-go pricing for AI image processing tools. Purchase prepaid credits and use them across any tool.",
};

const PurchaseSchema = z.object({
  amount: z
    .number()
    .min(1, "Amount must be at least $1")
    .max(100, "Amount must be at most $100"),
  credits: z
    .number()
    .min(100, "Credits must be at least 100")
    .max(10000, "Credits must be at most 10000"),
});

export default function PricingPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    mode: "onChange",
    defaultValues: {
      amount: 1,
      credits: 100,
    },
  });

  const onSubmit = async (data: z.infer<typeof PurchaseSchema>) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    handleBuyCredits();
  };

  const handleBuyCredits = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      router.push(ROUTES.DASHBOARD.BILLING);
    } else {
      router.push(ROUTES.SIGNUP);
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseFloat(value) : 0;
    form.setValue("amount", numValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("credits", Math.round(numValue * 100), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleCreditsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value) : 0;
    form.setValue("credits", numValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue("amount", parseFloat((numValue / 100).toFixed(2)), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const values = form.watch();
  const amount = values.amount;
  const credits = values.credits;
  const errors = form.formState.errors;
  const amountError = errors.amount?.message;
  const creditsError = errors.credits?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center mb-12">
          <H1>Simple, pay-as-you-go pricing</H1>
          <Muted>
            Purchase prepaid processing credits and use them across any tool.
          </Muted>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.GENERATE_IMAGE}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>

          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.REMOVE_BACKGROUND}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>

          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.EXTRACT_TEXT}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>

          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.UPSCALE}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.UPSCALE} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>

          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.COMPRESS_IMAGE}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>

          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.CONVERT_FORMAT}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>

          <MotionCardWrapper>
            <NextLink href={ROUTES.DASHBOARD.EDIT_IMAGE}>
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
                    <Badge variant="default" className="text-xs">
                      💳 {CREDIT_REQUIREMENTS.EDIT_IMAGE} credits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </NextLink>
          </MotionCardWrapper>
        </div>

        <div className="mt-12">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
              <CardDescription>
                Buy processing credits to use across all tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <NumberInput
                  label="Amount (USD)"
                  value={amount.toString()}
                  onChange={handleAmountChange}
                  min={1}
                  step={1}
                  placeholder="Enter amount in USD"
                  error={amountError}
                />
                <NumberInput
                  label="Credits"
                  value={credits.toString()}
                  onChange={handleCreditsChange}
                  min={100}
                  step={100}
                  placeholder="Enter number of credits"
                  error={creditsError}
                />
                <Button
                  type="button"
                  variant="default"
                  className="w-full"
                  onClick={handleBuyCredits}
                >
                  Buy Credits
                </Button>
                {successMessage && <SuccessAlert message={successMessage} />}
                {errorMessage && <ErrorAlert message={errorMessage} />}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
