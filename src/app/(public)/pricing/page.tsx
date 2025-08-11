"use client";

import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { Button } from "@/components/buttons";
import { NumberInput } from "@/components/inputs";
import { WithLoader } from "@/components/loaders";
import PageTransition from "@/components/transitions";
import { MotionCardWrapper } from "@/components/cards";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H1, H4, P, Small } from "@/components/ui/typography";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
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
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAccessToken } from "@/utils/cookies";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

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
        <div className="text-center mb-12 mt-12">
          <H1>Simple, pay-as-you-go pricing</H1>
          <P>
            Purchase prepaid processing credits and use them across any tool.
          </P>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
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

          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
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

          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
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

          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
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

          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
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

          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
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

          <MotionCardWrapper>
            <Card className="h-[250px] w-[250px]">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg border-2 border-border bg-background">
                    <Edit className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-2 flex flex-col items-center gap-2">
                    <div>
                      <H4 className="font-bold text-sm">Edit Image</H4>
                      <Small className="text-xs text-muted-foreground">
                        Professional prompt based image editing
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
