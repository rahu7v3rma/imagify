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
import { Slider } from "@/components/shared/slider";
import { CREDIT_REQUIREMENTS } from "@/constants/credits";
import { useUser } from "@/context/user/provider";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CompressImageSchema = z.object({
  imageBase64: z.string().min(1, "Please upload an image to compress"),
  quality: z.number().min(1).max(100),
});

type CompressImageFormValues = z.infer<typeof CompressImageSchema>;

export default function CompressImagePage() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedImageCompressedSize, setProcessedImageCompressedSize] =
    useState<string>();
  const [processedImageFormat, setProcessedImageFormat] = useState<string>();
  const [fileName, setFileName] = useState<string>("compressed-image");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>();
  const [sliderValue, setSliderValue] = useState<number[]>([75]);
  const { fetchUserProfile } = useUser();

  const form = useForm<CompressImageFormValues>({
    resolver: zodResolver(CompressImageSchema),
    mode: "onChange",
    defaultValues: {
      imageBase64: "",
      quality: 75,
    },
  });

  const { mutate: compressImage, isPending: isCompressImagePending } =
    trpc.compressImage.compressImage.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setProcessedImage(data.data.imageBase64);
          setProcessedImageCompressedSize(data.data.compressedSize);
          setProcessedImageFormat(data.data.format);
          setSuccessMessage(data.message || "Image compressed successfully!");
          setErrorMessage(null);
          fetchUserProfile();
        } else {
          setErrorMessage(
            data.message || "Failed to compress image. Please try again."
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || "Failed to compress image. Please try again."
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: CompressImageFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    compressImage({
      imageBase64: data.imageBase64,
      quality: data.quality,
    });
  };

  const setFormValue = (
    field: keyof CompressImageFormValues,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleFileUpload = (base64: string, fileSizeValue?: string, fileName?: string) => {
    setFormValue("imageBase64", base64);
    if (fileSizeValue) {
      setFileSize(fileSizeValue);
    }
    if (fileName) setFileName(fileName);
  };

  const handleUrlUpload = (base64: string, fileSizeValue?: string, fileName?: string) => {
    setFormValue("imageBase64", base64);
    if (fileSizeValue) {
      setFileSize(fileSizeValue);
    }
    if (fileName) setFileName(fileName);
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    form.setValue("quality", value[0], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
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
                    <H1>Compress Image</H1>
                    <Muted>Upload an image to compress it using AI</Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.COMPRESS_IMAGE} credits
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
                  <Slider
                    value={sliderValue}
                    onValueChange={handleSliderChange}
                    label={`Image Quality: ${sliderValue[0]}%`}
                    max={100}
                    min={1}
                    step={1}
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isCompressImagePending}
                  >
                    {WithLoader({
                      text: "Compress Image",
                      isLoading: isCompressImagePending,
                    })}
                  </Button>
                  {successMessage && <SuccessAlert message={successMessage} />}
                  {errorMessage && <ErrorAlert message={errorMessage} />}
                </form>
              </CardContent>
            </Card>
            <InputImagePreview imageBase64={imageBase64} fileSize={fileSize} />
          </div>

          {processedImage && (
            <ProcessedImage
              processedImage={processedImage}
              format={processedImageFormat}
              fileSize={processedImageCompressedSize}
              name={fileName}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
