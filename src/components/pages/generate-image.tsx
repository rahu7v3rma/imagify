"use client";

import { ErrorAlert, SuccessAlert } from "@/components/shared/alerts";
import { Button } from "@/components/shared/buttons";
import { Textarea } from "@/components/shared/inputs";
import { WithLoader } from "@/components/shared/loaders";
import { ProcessedImage } from "@/components/shared/processed-image";
import PageTransition from "@/components/shared/transitions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, Muted } from "@/components/ui/typography";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { useUser } from "@/context/user/provider";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const GenerateImageSchema = z.object({
  prompt: z
    .string()
    .min(1, "Please enter a prompt to generate an image")
    .max(1000, "Prompt must be at most 1000 characters long"),
});

type GenerateImageFormValues = z.infer<typeof GenerateImageSchema>;

export default function GenerateImagePage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { fetchUserProfile } = useUser();

  const form = useForm<GenerateImageFormValues>({
    resolver: zodResolver(GenerateImageSchema),
    mode: "onChange",
    defaultValues: {
      prompt: "",
    },
  });

  const { mutate: generateImage, isPending: isGenerateImagePending } =
    trpc.generateImage.generateImage.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setGeneratedImage(data.data.imageBase64);
          setSuccessMessage(data.message || "Image generated successfully!");
          setErrorMessage(null);
          fetchUserProfile();
        } else {
          setErrorMessage(
            data.message || "Failed to generate image. Please try again."
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to generate image. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: GenerateImageFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    generateImage({
      prompt: data.prompt,
    });
  };

  const setFormValue = (
    field: keyof GenerateImageFormValues,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const values = form.watch();
  const prompt = values.prompt;
  const errors = form.formState.errors;
  const promptError = errors.prompt?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <PageTransition>
      <div className="w-full">
        <div className="flex gap-8">
          <div className="flex-1 max-w-md">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <div className="flex flex-col items-start">
                    <H1>Generate Image</H1>
                    <Muted>Enter a prompt to generate an image using AI</Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE} credits
                </Badge>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 w-full"
                >
                  <Textarea
                    label="Image Prompt"
                    value={prompt}
                    onChange={(e) => setFormValue("prompt", e.target.value)}
                    error={promptError}
                    placeholder="Describe the image you want to generate"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isGenerateImagePending}
                  >
                    {WithLoader({
                      text: "Generate",
                      isLoading: isGenerateImagePending,
                    })}
                  </Button>
                  {successMessage && <SuccessAlert message={successMessage} />}
                  {errorMessage && <ErrorAlert message={errorMessage} />}
                </form>
              </CardContent>
            </Card>
          </div>

          {generatedImage && <ProcessedImage processedImage={generatedImage} />}
        </div>
      </div>
    </PageTransition>
  );
}
