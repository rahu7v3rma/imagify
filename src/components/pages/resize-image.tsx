"use client";

import { ErrorAlert, SuccessAlert } from "@/components/shared/alerts";
import { Button } from "@/components/shared/buttons";
import { InputImagePreview } from "@/components/shared/input-image-preview";
import { NumberInput } from "@/components/shared/inputs";
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

const ResizeImageSchema = z.object({
  imageBase64: z.string().min(1, "Please upload an image to resize"),
  width: z.number().min(1, "Width must be at least 1 pixel").max(5000, "Width cannot exceed 5000 pixels"),
  height: z.number().min(1, "Height must be at least 1 pixel").max(5000, "Height cannot exceed 5000 pixels"),
});

type ResizeImageFormValues = z.infer<typeof ResizeImageSchema>;

export default function ResizeImagePage() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { fetchUserProfile } = useUser();

  const form = useForm<ResizeImageFormValues>({
    resolver: zodResolver(ResizeImageSchema),
    mode: "onChange",
    defaultValues: {
      imageBase64: "",
      width: 800,
      height: 600,
    },
  });

  const { mutate: resizeImage, isPending: isResizeImagePending } =
    trpc.resizeImage.resizeImage.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setProcessedImage(data.data.imageBase64);
          setSuccessMessage(data.message || "Image resized successfully!");
          setErrorMessage(null);
          fetchUserProfile();
        } else {
          setErrorMessage(
            data.message || "Failed to resize image. Please try again."
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to resize image. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: ResizeImageFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    resizeImage({
      imageBase64: data.imageBase64,
      width: data.width,
      height: data.height,
    });
  };

  const setFormValue = (
    field: keyof ResizeImageFormValues,
    value: string | number
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value) : 1;
    setFormValue("width", numValue);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value) : 1;
    setFormValue("height", numValue);
  };

  const handleFileUpload = (base64: string) => {
    setFormValue("imageBase64", base64);
  };

  const handleUrlUpload = (base64: string) => {
    setFormValue("imageBase64", base64);
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
                    <H1>Resize Image</H1>
                    <Muted>Upload an image and set custom dimensions</Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.RESIZE_IMAGE} credits
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
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <NumberInput
                        label="Width (px)"
                        value={values.width.toString()}
                        onChange={handleWidthChange}
                        min={1}
                        max={5000}
                        placeholder="800"
                        error={form.formState.errors.width?.message}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <NumberInput
                        label="Height (px)"
                        value={values.height.toString()}
                        onChange={handleHeightChange}
                        min={1}
                        max={5000}
                        placeholder="600"
                        error={form.formState.errors.height?.message}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isResizeImagePending}
                  >
                    {WithLoader({
                      text: "Resize Image",
                      isLoading: isResizeImagePending,
                    })}
                  </Button>
                  {successMessage && <SuccessAlert message={successMessage} />}
                  {errorMessage && <ErrorAlert message={errorMessage} />}
                </form>
              </CardContent>
            </Card>
            <InputImagePreview imageBase64={imageBase64} />
          </div>

          {processedImage && <ProcessedImage processedImage={processedImage} />}
        </div>
      </div>
    </PageTransition>
  );
}