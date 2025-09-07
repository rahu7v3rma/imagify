'use client';

import { ErrorAlert, SuccessAlert } from '@/components/shared/alerts';
import { Button } from '@/components/shared/buttons';
import { WithLoader } from '@/components/shared/loaders';
import { ProcessedImage } from '@/components/shared/processed-image';
import { Slider } from '@/components/shared/slider';
import { UploadImage } from '@/components/shared/upload-image';
import PageTransition from '@/components/shared/transitions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H1, Muted } from '@/components/ui/typography';
import { CREDIT_REQUIREMENTS } from '@/constants/credits';
import { useUser } from '@/context/user/provider';
import { trpc } from '@/lib/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FlipHorizontal, FlipVertical, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Cropper from 'react-easy-crop';
import { getOrientation } from 'get-orientation/browser';

// Canvas utility functions
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const detectImageFormat = (dataUrl: string): string => {
  if (dataUrl.startsWith('data:image/png')) return 'image/png';
  if (dataUrl.startsWith('data:image/webp')) return 'image/webp';
  if (dataUrl.startsWith('data:image/jpg')) return 'image/jpg';
  if (dataUrl.startsWith('data:image/jpeg')) return 'image/jpeg';
  return 'image/jpeg'; // default to JPEG for unknown formats
};

// const getFileExtension = (format: string): string => {
//   switch (format) {
//     case 'image/png':
//       return 'png';
//     case 'image/webp':
//       return 'webp';
//     case 'image/jpg':
//       return 'jpg';
//     case 'image/jpeg':
//       return 'jpeg';
//     default:
//       return 'jpg';
//   }
// };

const getRadianAngle = (degreeValue: number): number => {
  return (degreeValue * Math.PI) / 180;
};

const rotateSize = (width: number, height: number, rotation: number) => {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
};

interface CropPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CropPixels,
  rotation = 0,
  flipHorizontal = false,
  flipVertical = false,
  format?: string,
): Promise<string> => {
  const image = await createImage(imageSrc);

  // First, create a canvas for the full transformed image
  const fullCanvas = document.createElement('canvas');
  const fullCtx = fullCanvas.getContext('2d');

  if (!fullCtx) {
    throw new Error('Canvas context is not available');
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  // set full canvas size to match the bounding box
  fullCanvas.width = bBoxWidth;
  fullCanvas.height = bBoxHeight;

  // translate canvas context to a central location
  fullCtx.translate(bBoxWidth / 2, bBoxHeight / 2);

  // apply flip transformations
  if (flipHorizontal) fullCtx.scale(-1, 1);
  if (flipVertical) fullCtx.scale(1, -1);

  // rotate the canvas context
  fullCtx.rotate(rotRad);
  fullCtx.translate(-image.width / 2, -image.height / 2);

  // draw the transformed image
  fullCtx.drawImage(image, 0, 0);

  // Now create final canvas for the cropped result
  const finalCanvas = document.createElement('canvas');
  const finalCtx = finalCanvas.getContext('2d');

  if (!finalCtx) {
    throw new Error('Canvas context is not available');
  }

  // Set final canvas to crop size
  finalCanvas.width = pixelCrop.width;
  finalCanvas.height = pixelCrop.height;

  // Adjust crop coordinates based on flip transformations
  const adjustedCrop = { ...pixelCrop };

  if (flipHorizontal) {
    adjustedCrop.x = bBoxWidth - pixelCrop.x - pixelCrop.width;
  }

  if (flipVertical) {
    adjustedCrop.y = bBoxHeight - pixelCrop.y - pixelCrop.height;
  }

  // Draw the cropped area from the transformed image
  finalCtx.drawImage(
    fullCanvas,
    adjustedCrop.x,
    adjustedCrop.y,
    adjustedCrop.width,
    adjustedCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Detect format if not provided, preserve original format
  const outputFormat = format || detectImageFormat(imageSrc);

  // return the final canvas as base64 string with preserved format
  return finalCanvas.toDataURL(outputFormat);
};

const getRotatedImage = async (
  imageSrc: string,
  rotation: number,
  format?: string,
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context is not available');
  }

  const orientationChanged =
    rotation === 90 ||
    rotation === -90 ||
    rotation === 270 ||
    rotation === -270;
  if (orientationChanged) {
    canvas.width = image.height;
    canvas.height = image.width;
  } else {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  // Detect format if not provided, preserve original format
  const outputFormat = format || detectImageFormat(imageSrc);

  return canvas.toDataURL(outputFormat);
};

const CropRotateFlipSchema = z.object({
  ready: z.boolean(),
});

type CropRotateFlipFormValues = z.infer<typeof CropRotateFlipSchema>;

const ORIENTATION_TO_ANGLE: Record<string, number> = {
  '3': 180,
  '6': 90,
  '8': -90,
};

export default function CropRotateFlipPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('crop-rotate-flip-image');

  // Crop-Rotate-Flip State
  const [imageSrc, setImageSrc] = useState<string>('');
  const [imageFormat, setImageFormat] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const { refreshUser } = useUser();

  const form = useForm<CropRotateFlipFormValues>({
    resolver: zodResolver(CropRotateFlipSchema),
    mode: 'onChange',
    defaultValues: {
      ready: false,
    },
  });

  const { mutate: cropRotateFlip, isPending: isCropRotateFlipPending } =
    trpc.cropRotateFlip.cropRotateFlip.useMutation({
      onSuccess: async (data) => {
        if (data.success) {
          // setSuccessMessage(data.message || "Credits deducted successfully!");
          setErrorMessage(null);

          // Process the image after credit deduction
          try {
            const croppedImg = await getCroppedImg(
              imageSrc,
              croppedAreaPixels,
              rotation,
              flipHorizontal,
              flipVertical,
              imageFormat,
            );
            setProcessedImage(croppedImg);
          } catch {
            setErrorMessage('Failed to process image. Please try again.');
          }

          refreshUser();
        } else {
          setErrorMessage(
            data.message || 'Failed to process image. Please try again.',
          );
          setSuccessMessage(null);
        }
      },
      onError: (error) => {
        setErrorMessage(
          error.message || 'Failed to process image. Please try again.',
        );
        setSuccessMessage(null);
      },
    });

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: CropRotateFlipFormValues) => {
    if (!croppedAreaPixels) return;

    setSuccessMessage(null);
    setErrorMessage(null);
    cropRotateFlip({}); // No data needed, just deduct credits
  };

  const handleFileUpload = async (
    base64: string,
    _?: string,
    fileName?: string,
    format?: string,
    file?: File,
  ) => {
    form.setValue('ready', true, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    let imageDataUrl = base64;
    const detectedFormat = detectImageFormat(base64);
    setImageFormat(detectedFormat);

    // Handle orientation correction for uploaded files
    if (file) {
      try {
        const orientation = await getOrientation(file);
        const rotationAngle = ORIENTATION_TO_ANGLE[orientation.toString()] || 0;
        if (rotationAngle) {
          imageDataUrl = await getRotatedImage(
            imageDataUrl,
            rotationAngle,
            detectedFormat,
          );
        }
      } catch {
        console.warn('Failed to detect orientation');
      }
    }

    setImageSrc(imageDataUrl);
    if (fileName) setFileName(fileName);
  };

  const handleUrlUpload = (base64: string) => {
    form.setValue('ready', true, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    const detectedFormat = detectImageFormat(base64);
    setImageFormat(detectedFormat);
    setImageSrc(base64);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setRotation(0);
    setZoom(1);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setProcessedImage(null);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <PageTransition>
      <div className="w-full">
        <div className="mb-8 flex flex-col items-start">
          <H1>Crop-Rotate-Flip Image</H1>
          <Muted>Upload an image to crop, rotate, and flip it</Muted>
          <Badge variant="default" className="w-fit mt-2">
            💳 {CREDIT_REQUIREMENTS.CROP_ROTATE_FLIP} credits
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Upload and Result Section */}
          <div className="flex gap-8">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <UploadImage
                  onUploadFile={handleFileUpload}
                  onUploadUrl={handleUrlUpload}
                />
              </CardContent>
            </Card>

            {processedImage && (
              <ProcessedImage
                processedImage={processedImage}
                name={`${fileName}-processed`}
              />
            )}
          </div>

          {/* Editor Section - Only show when image is uploaded */}
          {imageSrc && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Cropper Section */}
              <div className="flex-shrink-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Image</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="relative mx-auto w-full max-w-[480px] h-[360px] max-h-[75vw] aspect-[4/3]">
                      <div
                        className={`w-full h-full ${
                          flipHorizontal ? '-scale-x-100' : ''
                        } ${flipVertical ? '-scale-y-100' : ''}`}
                      >
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          rotation={rotation}
                          zoom={zoom}
                          aspect={4 / 3}
                          onCropChange={setCrop}
                          onRotationChange={setRotation}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                          style={{
                            containerStyle: {
                              width: '100%',
                              height: '100%',
                              backgroundColor: '#fafafa',
                              borderRadius: '0.5rem',
                              padding: '1.25rem',
                            },
                            cropAreaStyle: {
                              border: '2px solid hsl(var(--primary))',
                            },
                            mediaStyle: {
                              objectFit: 'contain',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Controls Section */}
              <div className="flex-shrink-0 w-full lg:w-[340px]">
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      label={`Zoom: ${Math.round(zoom * 100)}%`}
                      max={3}
                      min={1}
                      step={0.1}
                    />

                    <Slider
                      value={[rotation]}
                      onValueChange={(value) => setRotation(value[0])}
                      label={`Rotation: ${rotation}°`}
                      max={360}
                      min={0}
                      step={1}
                    />

                    <div className="space-y-2">
                      <Muted>Flip Options</Muted>
                      <div className="flex gap-2">
                        <Button
                          variant={flipHorizontal ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFlipHorizontal(!flipHorizontal)}
                          type="button"
                        >
                          <FlipHorizontal className="w-4 h-4 mr-2" />
                          Flip Horizontal
                        </Button>
                        <Button
                          variant={flipVertical ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFlipVertical(!flipVertical)}
                          type="button"
                        >
                          <FlipVertical className="w-4 h-4 mr-2" />
                          Flip Vertical
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      type="button"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All
                    </Button>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Button
                        type="submit"
                        variant="default"
                        className="w-full"
                        disabled={
                          !isFormValid ||
                          isCropRotateFlipPending ||
                          !croppedAreaPixels
                        }
                      >
                        {WithLoader({
                          text: 'Process Image',
                          isLoading: isCropRotateFlipPending,
                        })}
                      </Button>
                    </form>

                    {successMessage && (
                      <SuccessAlert message={successMessage} />
                    )}
                    {errorMessage && <ErrorAlert message={errorMessage} />}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
