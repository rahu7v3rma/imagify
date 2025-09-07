'use client';

import { ErrorAlert, SuccessAlert } from '@/components/shared/alerts';
import { Button } from '@/components/shared/buttons';
import { Textarea } from '@/components/shared/inputs';
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

const EditImageSchema = z.object({
  imageBase64: z.string().min(1, 'Please upload an image to edit'),
  prompt: z
    .string()
    .min(1, 'Please enter a prompt to edit the image')
    .max(1000, 'Prompt must be at most 1000 characters long'),
});

type EditImageFormValues = z.infer<typeof EditImageSchema>;

export default function EditImagePage() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('edited-image');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { refreshUser } = useUser();
  const [fileId, setFileId] = useState<number | null>(null);

  const form = useForm<EditImageFormValues>({
    resolver: zodResolver(EditImageSchema),
    mode: 'onChange',
    defaultValues: {
      imageBase64: '',
      prompt: '',
    },
  });

  const { mutate: editImage, isPending: isEditImagePending } =
    trpc.editImage.editImage.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setProcessedImage(data.data.imageBase64);
          setFileId(data.data.fileId);
          setSuccessMessage(data.message || 'Image edited successfully!');
          setErrorMessage(null);
          refreshUser();
        } else {
          setErrorMessage(
            data.message || 'Failed to edit image. Please try again.',
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || 'Failed to edit image. Please try again.',
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: EditImageFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    editImage({
      imageBase64: data.imageBase64,
      prompt: data.prompt,
    });
  };

  const setFormValue = (field: keyof EditImageFormValues, value: string) => {
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
  ) => {
    setFormValue('imageBase64', base64);
    if (fileName) setFileName(fileName);
  };

  const handleUrlUpload = (
    base64: string,
    fileSize?: string,
    fileName?: string,
  ) => {
    setFormValue('imageBase64', base64);
    if (fileName) setFileName(fileName);
  };

  const getEditBasedFileName = (originalName: string, prompt: string) => {
    const promptBasedName = prompt
      .slice(0, 20)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    return `${originalName}-${promptBasedName}`;
  };

  const values = form.watch();
  const imageBase64 = values.imageBase64;
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
                    <H1>Edit Image</H1>
                    <Muted>
                      Upload an image and describe the changes you want to make
                    </Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.EDIT_IMAGE} cents
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
                  <Textarea
                    label="Edit Prompt"
                    value={prompt}
                    onChange={(e) => setFormValue('prompt', e.target.value)}
                    error={promptError}
                    placeholder="Describe the changes you want to make to the image"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isEditImagePending}
                  >
                    {WithLoader({
                      text: 'Edit Image',
                      isLoading: isEditImagePending,
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
            <ProcessedImage
              processedImage={processedImage}
              name={getEditBasedFileName(fileName, prompt)}
              fileId={fileId}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
