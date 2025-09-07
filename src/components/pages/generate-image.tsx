'use client';

import { ErrorAlert, SuccessAlert } from '@/components/shared/alerts';
import { Button } from '@/components/shared/buttons';
import { TextareaAction, SelectSingle } from '@/components/shared/inputs';
import { WithLoader } from '@/components/shared/loaders';
import { ProcessedImage } from '@/components/shared/processed-image';
import PageTransition from '@/components/shared/transitions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1, Muted, P } from '@/components/ui/typography';
import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { useUser } from '@/context/user/provider';
import { trpc } from '@/lib/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const GenerateImageSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Please enter a prompt to generate an image')
    .max(1000, 'Prompt must be at most 1000 characters long'),
  generateType: z.enum(['standard', 'pro']),
  outputFormat: z.string(),
  aspectRatio: z.string(),
});

type GenerateImageFormValues = z.infer<typeof GenerateImageSchema>;

export default function GenerateImagePage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { refreshUser } = useUser();
  const [fileId, setFileId] = useState<number | null>(null);

  const form = useForm<GenerateImageFormValues>({
    resolver: zodResolver(GenerateImageSchema),
    mode: 'onChange',
    defaultValues: {
      prompt: '',
      generateType: 'standard',
      outputFormat: 'png',
      aspectRatio: '1:1',
    },
  });

  const { mutate: generateImage, isPending: isGenerateImagePending } =
    trpc.generateImage.generateImage.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.imageBase64) {
          setGeneratedImage(data.data.imageBase64);
          setFileId(data.data.fileId);
          setSuccessMessage(data.message || 'Image generated successfully!');
          setErrorMessage(null);
          refreshUser();
        } else {
          setErrorMessage(
            data.message || 'Failed to generate image. Please try again.',
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || 'Failed to generate image. Please try again.',
        );
        setSuccessMessage(null);
      },
    });

  const { mutate: enhancePrompt, isPending: isEnhancePromptPending } =
    trpc.generateImage.enhancePrompt.useMutation({
      onSuccess: (data) => {
        if (data.success && data.data?.enhancedPrompt) {
          setFormValue('prompt', data.data.enhancedPrompt);
          refreshUser();
        } else {
          setErrorMessage(
            data.message || 'Failed to enhance prompt. Please try again.',
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || 'Failed to enhance prompt. Please try again.',
        );
        setSuccessMessage(null);
      },
    });

  const onSubmit = async (data: GenerateImageFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    generateImage({
      prompt: data.prompt,
      generateType: data.generateType,
      outputFormat: data.outputFormat,
      aspectRatio: data.aspectRatio,
    });
  };

  const handleEnhancePrompt = () => {
    if (prompt.trim()) {
      setSuccessMessage(null);
      setErrorMessage(null);
      enhancePrompt({ prompt: prompt.trim() });
    }
  };

  const setFormValue = (
    field: keyof GenerateImageFormValues,
    value: string,
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

  const getOutputFormatOptions = () => {
    if (values.generateType === 'standard') {
      return ['png', 'jpg', 'webp'];
    } else {
      return ['png', 'jpg'];
    }
  };

  const getAspectRatioOptions = () => {
    if (values.generateType === 'standard') {
      return [
        '1:1',
        '16:9',
        '21:9',
        '3:2',
        '2:3',
        '4:5',
        '5:4',
        '3:4',
        '4:3',
        '8:16',
        '9:16',
      ];
    } else {
      return [
        '1:1',
        '16:9',
        '9:16',
        '4:3',
        '3:4',
        '3:2',
        '2:3',
        '1:0',
        '5:4',
        '21:9',
        '9:21',
        '2:1',
        '1:2',
      ];
    }
  };

  const getPromptBasedFileName = (prompt: string) => {
    return prompt
      .slice(0, 20)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
  };
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
                  💳 {CREDIT_REQUIREMENTS.GENERATE_IMAGE[values.generateType]}{' '}
                  credits
                </Badge>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 w-full"
                >
                  <TextareaAction
                    label="Image Prompt"
                    value={prompt}
                    onChange={(e) => setFormValue('prompt', e.target.value)}
                    error={promptError}
                    placeholder="Describe the image you want to generate"
                    actionButtonNode={
                      <div className="flex flex-col items-end justify-center leading-none">
                        <P className="text-[12px] font-medium m-0 p-0 leading-none">
                          Enhance
                        </P>
                        <P className="text-[8px] m-0 p-0 leading-none text-gray-300">
                          {CREDIT_REQUIREMENTS.ENHANCE_PROMPT} credits
                        </P>
                      </div>
                    }
                    onActionButtonClick={handleEnhancePrompt}
                    isActionButtonLoading={isEnhancePromptPending}
                    actionButtonVisible={!!prompt.trim()}
                    actionButtonLoadingText="Enhancing..."
                  />
                  <SelectSingle
                    label="Output Format"
                    value={values.outputFormat}
                    onChange={(value) => setFormValue('outputFormat', value)}
                    options={getOutputFormatOptions()}
                  />
                  <SelectSingle
                    label="Aspect Ratio"
                    value={values.aspectRatio}
                    onChange={(value) => setFormValue('aspectRatio', value)}
                    options={getAspectRatioOptions()}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={
                        values.generateType === 'standard'
                          ? 'default'
                          : 'outline'
                      }
                      onClick={() => setFormValue('generateType', 'standard')}
                      className="flex-1"
                    >
                      Standard
                    </Button>
                    <Button
                      type="button"
                      variant={
                        values.generateType === 'pro' ? 'default' : 'outline'
                      }
                      onClick={() => setFormValue('generateType', 'pro')}
                      className="flex-1"
                    >
                      Pro
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full"
                    disabled={!isFormValid || isGenerateImagePending}
                  >
                    {WithLoader({
                      text: 'Generate',
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
            <ProcessedImage
              processedImage={generatedImage}
              name={getPromptBasedFileName(prompt)}
              fileId={fileId}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
