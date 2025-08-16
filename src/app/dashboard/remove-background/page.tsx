"use client";

import { Button } from "@/components/buttons";
import { ImageInput, TextActionInput } from "@/components/inputs";
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
import {
  downloadImage,
  fileToBase64,
  convertImageUrlToBase64,
} from "@/utils/common";
import { trpc } from "@/lib/trpc/client";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { WithLoader } from "@/components/loaders";
import { useUser } from "@/context/user/provider";

const RemoveBackgroundSchema = z.object({
  imageBase64: z
    .string()
    .min(1, "Please upload an image to remove its background"),
});

type RemoveBackgroundFormValues = z.infer<typeof RemoveBackgroundSchema>;

export default function RemoveBackgroundPage() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageInputError, setImageInputError] = useState<string | null>(null);
  const [urlInputError, setUrlInputError] = useState<string | null>(null);
  const [isUrlConversionLoading, setIsUrlConversionLoading] = useState(false);
  const { fetchUserProfile } = useUser();

  const form = useForm<RemoveBackgroundFormValues>({
    resolver: zodResolver(RemoveBackgroundSchema),
    mode: "onChange",
    defaultValues: {
      imageBase64: "",
    },
  });

  const { mutate: removeBackground, isPending: isRemoveBackgroundPending } =
    trpc.removeBackground.removeBackground.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setProcessedImage(data.data.imageBase64);
          setSuccessMessage(data.message || "Background removed successfully!");
          setErrorMessage(null);
          fetchUserProfile();
        } else {
          setErrorMessage(
            data.message || "Failed to remove background. Please try again."
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to remove background. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: RemoveBackgroundFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    removeBackground({
      imageBase64: data.imageBase64,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a supported image type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setImageInputError("Please select a JPG, PNG, or WebP image file");
        setUrlInputError(null);
        // Clear the input and form value
        e.target.value = "";
        return;
      }

      const base64 = await fileToBase64(file);
      setFormValue("imageBase64", base64);
      setImageInputError(null);
      setUrlInputError(null);
    }
  };

  const setFormValue = (
    field: keyof RemoveBackgroundFormValues,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleUrlToBase64 = async () => {
    try {
      if (!imageUrl.trim()) {
        setUrlInputError("Please enter a valid image URL");
        setImageInputError(null);
        return;
      }

      setIsUrlConversionLoading(true);
      const base64 = await convertImageUrlToBase64(imageUrl);
      setFormValue("imageBase64", base64);
      setImageInputError(null);
      setUrlInputError(null);
    } catch (error) {
      setUrlInputError(
        "Failed to load image from URL. Please check the URL and try again."
      );
      setImageInputError(null);
    } finally {
      setIsUrlConversionLoading(false);
    }
  };

  const values = form.watch();
  const imageBase64 = values.imageBase64;
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
                    <H1>Remove Background</H1>
                    <Muted>
                      Upload an image to remove its background using AI
                    </Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.REMOVE_BACKGROUND} credits
                </Badge>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 w-full"
                >
                  <ImageInput
                    label="Upload Image"
                    onChange={handleFileChange}
                    error={imageInputError}
                  />
                  <TextActionInput
                    label="Or use image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    actionButton={{
                      text: "Use",
                      onPress: handleUrlToBase64,
                      disabled: !imageUrl.trim(),
                      isLoading: isUrlConversionLoading,
                    }}
                    error={urlInputError}
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isRemoveBackgroundPending}
                  >
                    {WithLoader({
                      text: "Remove Background",
                      isLoading: isRemoveBackgroundPending,
                    })}
                  </Button>
                  {successMessage && <SuccessAlert message={successMessage} />}
                  {errorMessage && <ErrorAlert message={errorMessage} />}
                </form>
              </CardContent>
            </Card>
            {imageBase64 && (
              <Card className="w-full mb-6 mt-6">
                <CardHeader>
                  <CardTitle>Input Image</CardTitle>
                  <CardDescription>
                    Your uploaded image ready for background removal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full flex justify-center">
                    <img
                      src={imageBase64}
                      alt="Preview image"
                      className="rounded-lg border max-h-64 object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {processedImage && (
            <div className="flex-1">
              <Card className="max-w-[500px] max-h-[500px]">
                <CardHeader>
                  <CardTitle>Processed Image</CardTitle>
                  <CardDescription>
                    Your background-removed image is ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full flex justify-center">
                    <img
                      src={processedImage}
                      alt="Processed image"
                      className="rounded-lg border"
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => downloadImage(processedImage)}
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
