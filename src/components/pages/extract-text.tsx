'use client';

import { ErrorAlert, SuccessAlert } from '@/components/shared/alerts';
import { Button } from '@/components/shared/buttons';
import { InputImagePreview } from '@/components/shared/input-image-preview';
import { WithLoader } from '@/components/shared/loaders';
import PageTransition from '@/components/shared/transitions';
import { UploadImage } from '@/components/shared/upload-image';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { H1, Muted } from '@/components/ui/typography';
import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { useUser } from '@/context/user/provider';
import { trpc } from '@/lib/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ExtractTextSchema = z.object({
  imageBase64: z.string().min(1, 'Please upload an image to extract text from'),
});

type ExtractTextFormValues = z.infer<typeof ExtractTextSchema>;

export default function ExtractTextPage() {
  const [processedText, setProcessedText] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { fetchUserProfile } = useUser();

  const form = useForm<ExtractTextFormValues>({
    resolver: zodResolver(ExtractTextSchema),
    mode: 'onChange',
    defaultValues: {
      imageBase64: '',
    },
  });

  const { mutate: extractText, isPending: isExtractTextPending } =
    trpc.extractText.extractText.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.extractedText) {
          setProcessedText(data.data.extractedText);
          setSuccessMessage(data.message || 'Text extracted successfully!');
          setErrorMessage(null);
          fetchUserProfile();
        } else {
          setErrorMessage(
            data.message || 'Failed to extract text. Please try again.',
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || 'Failed to extract text. Please try again.',
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: ExtractTextFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    extractText({
      imageBase64: data.imageBase64,
    });
  };

  const setFormValue = (field: keyof ExtractTextFormValues, value: string) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleFileUpload = (base64: string) => {
    setFormValue('imageBase64', base64);
  };

  const handleUrlUpload = (base64: string) => {
    setFormValue('imageBase64', base64);
  };

  const handleCopyText = () => {
    if (processedText) {
      navigator.clipboard.writeText(processedText);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
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
                    <H1>Extract Text</H1>
                    <Muted>Upload an image to extract text using OCR</Muted>
                  </div>
                </CardTitle>
                <Badge variant="default" className="w-fit">
                  💳 {CREDIT_REQUIREMENTS.EXTRACT_TEXT} credits
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
                    disabled={!isFormValid || isExtractTextPending}
                  >
                    {WithLoader({
                      text: 'Extract Text',
                      isLoading: isExtractTextPending,
                    })}
                  </Button>
                  {successMessage && <SuccessAlert message={successMessage} />}
                  {errorMessage && <ErrorAlert message={errorMessage} />}
                </form>
              </CardContent>
            </Card>
            <InputImagePreview imageBase64={imageBase64} />
          </div>

          {processedText && (
            <div className="flex-1 max-w-md">
              <Card>
                <CardHeader>
                  <CardTitle>Processed Text</CardTitle>
                  <CardDescription>
                    Your extracted text is ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-full h-80 border-2 border-gray-300 rounded-lg bg-gray-50 p-4 overflow-y-auto">
                    <div className="text-gray-900 whitespace-pre-wrap text-sm">
                      {processedText}
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleCopyText}>
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </>
                    )}
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
