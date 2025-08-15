"use client";

import { Button } from "@/components/buttons";
import { Textarea } from "@/components/inputs";
import { useState } from "react";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import PageTransition from "@/components/transitions";
import { H1, Muted } from "@/components/ui/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { downloadImage } from "@/utils/common";
import { trpc } from "@/lib/trpc/client";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { WithLoader } from "@/components/loaders";
import { useUser } from "@/context/user/provider";

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

          {generatedImage && (
            <div className="flex-1">
              <Card className="max-w-[500px] max-h-[500px]">
                <CardHeader>
                  <CardTitle>Generated Image</CardTitle>
                  <CardDescription>
                    Your AI-generated image is ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full flex justify-center">
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="rounded-lg border"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => downloadImage(generatedImage)}
                  >
                    Download Image
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
