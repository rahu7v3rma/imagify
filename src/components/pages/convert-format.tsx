'use client';

import { ErrorAlert, SuccessAlert } from '@/components/shared/alerts';
import { Button } from '@/components/shared/buttons';
import { SelectSingle } from '@/components/shared/inputs';
import { InputImagePreview } from '@/components/shared/input-image-preview';
import { WithLoader } from '@/components/shared/loaders';
import { ProcessedImage } from '@/components/shared/processed-image';
import PageTransition from '@/components/shared/transitions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1, Muted } from '@/components/ui/typography';
import { UploadImage } from '@/components/shared/upload-image';
import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { useUser } from '@/context/user/provider';
import { trpc } from '@/lib/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ConvertFormatSchema = z.object({
  imageBase64: z.string().min(1, 'Please upload an image to convert'),
  format: z.string().min(1, 'Please select a format'),
});

type ConvertFormatFormValues = z.infer<typeof ConvertFormatSchema>;

export default function ConvertFormatPage() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('converted-image');
  const [inputFormat, setInputFormat] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { fetchUserProfile } = useUser();

  const form = useForm<ConvertFormatFormValues>({
    resolver: zodResolver(ConvertFormatSchema),
    mode: 'onChange',
    defaultValues: {
      imageBase64: '',
      format: 'png',
    },
  });

  const { mutate: convertFormat, isPending: isConvertFormatPending } =
    trpc.convertFormat.convertFormat.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setProcessedImage(data.data.imageBase64);
          setSuccessMessage(
            data.message || 'Image format converted successfully!',
          );
          setErrorMessage(null);
          fetchUserProfile();
        } else {
          setErrorMessage(
            data.message || 'Failed to convert image format. Please try again.',
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || 'Failed to convert image format. Please try again.',
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: ConvertFormatFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    convertFormat({
      imageBase64: data.imageBase64,
      format: data.format,
    });
  };

  const setFormValue = (
    field: keyof ConvertFormatFormValues,
    value: string,
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
    fileName?: string,
    format?: string,
  ) => {
    setFormValue('imageBase64', base64);
    if (fileName) setFileName(fileName);
    if (format) setInputFormat(format);
  };

  const handleUrlUpload = (
    base64: string,
    fileSize?: string,
    fileName?: string,
    format?: string,
  ) => {
    setFormValue('imageBase64', base64);
    if (fileName) setFileName(fileName);
    if (format) setInputFormat(format);
  };

  const values = form.watch();
  const imageBase64 = values.imageBase64;
  const format = values.format;
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
                    <H1>Convert Image Format</H1>
                    <Muted>
                      Upload an image to convert it to a different format
                    </Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.CONVERT_FORMAT} credits
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
                  <SelectSingle
                    label="Output Format"
                    value={format}
                    onChange={(value) => setFormValue('format', value)}
                    options={['png', 'jpeg', 'jpg', 'webp']}
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isConvertFormatPending}
                  >
                    {WithLoader({
                      text: 'Convert Format',
                      isLoading: isConvertFormatPending,
                    })}
                  </Button>
                  {successMessage && <SuccessAlert message={successMessage} />}
                  {errorMessage && <ErrorAlert message={errorMessage} />}
                </form>
              </CardContent>
            </Card>
            <InputImagePreview imageBase64={imageBase64} format={inputFormat} />
          </div>

          {processedImage && (
            <ProcessedImage
              processedImage={processedImage}
              format={format}
              name={fileName}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
