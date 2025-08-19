"use client";

import { ErrorAlert, SuccessAlert } from "@/components/shared/alerts";
import { Button } from "@/components/shared/buttons";
import { InputImagePreview } from "@/components/shared/input-image-preview";
import { WithLoader } from "@/components/shared/loaders";
import { ProcessedImage } from "@/components/shared/processed-image";
import PageTransition from "@/components/shared/transitions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1, Muted } from "@/components/ui/typography";
import { UploadImage } from "@/components/shared/upload-image";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { useUser } from "@/context/user/provider";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RemoveBackgroundSchema = z.object({
  imageBase64: z
    .string()
    .min(1, "Please upload an image to remove its background"),
});

type RemoveBackgroundFormValues = z.infer<typeof RemoveBackgroundSchema>;

export default function RemoveBackgroundPage() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("removed-background");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const handleFileUpload = (
    base64: string,
    fileSize?: string,
    fileName?: string
  ) => {
    setFormValue("imageBase64", base64);
    if (fileName) setFileName(fileName);
  };

  const handleUrlUpload = (
    base64: string,
    fileSize?: string,
    fileName?: string
  ) => {
    setFormValue("imageBase64", base64);
    if (fileName) setFileName(fileName);
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
                  <UploadImage
                    onUploadFile={handleFileUpload}
                    onUploadUrl={handleUrlUpload}
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
            <InputImagePreview imageBase64={imageBase64} />
          </div>

          {processedImage && (
            <ProcessedImage processedImage={processedImage} name={fileName} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
