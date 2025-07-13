"use client";

import { Button, Select, SelectItem } from "@heroui/react";
import { CustomInput, FileInput } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Controller } from "react-hook-form";
import {
  uploadFileString,
  getFileDownloadURL,
  getUserCredits,
} from "@/lib/firebase";
import { useLoader } from "@/context/loader";
import { useFirebase } from "@/context/firebase";

const schema = z
  .object({
    uploadedImage: z
      .any()
      .optional()
      .refine((files) => {
        if (typeof window === "undefined") return true;
        if (!files || files.length === 0) return true;
        const file = files[0];
        return (
          file?.type.startsWith("image/") &&
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type,
          )
        );
      }, "Only JPEG, JPG, PNG, and WebP files are allowed"),
    imageUrl: z.string().optional(),
    outputFormat: z.enum(["png", "jpeg", "jpg", "webp"], {
      required_error: "Please select an output format",
    }),
  })
  .refine(
    (data) => {
      if (typeof window === "undefined") return true;
      const hasUploadedImage =
        data.uploadedImage && data.uploadedImage.length > 0;
      const hasImageUrl = data.imageUrl && data.imageUrl.trim().length > 0;
      return hasUploadedImage || hasImageUrl;
    },
    {
      message: "Either upload an image or provide an image URL",
      path: ["uploadedImage"],
    },
  );

type Schema = z.infer<typeof schema>;

// File size limit: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export default function ConvertFormatPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputFormat, setInputFormat] = useState<string | null>(null);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const { setIsLoading } = useLoader();
  const { user, setUserCredits } = useFirebase();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      outputFormat: "png",
    },
  });

  const imageUrl = watch("imageUrl");
  const outputFormat = watch("outputFormat");

  const getFormatFromMimeType = (mimeType: string): string => {
    const formats: { [key: string]: string } = {
      "image/jpeg": "JPEG",
      "image/jpg": "JPG",
      "image/png": "PNG",
      "image/webp": "WEBP",
    };
    return formats[mimeType] || mimeType.replace("image/", "").toUpperCase();
  };

  const isValidImageFormat = (mimeType: string): boolean => {
    const supportedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    return supportedFormats.includes(mimeType);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/") && isValidImageFormat(file.type)) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          addToast({
            title: "File too large",
            description: "Image file must be smaller than 10MB",
            color: "danger",
          });
          e.target.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          setSelectedImage(e.target?.result as string);
          setInputFormat(getFormatFromMimeType(file.type));
          setValue("imageUrl", "");
        };
        reader.readAsDataURL(file);
      } else {
        addToast({
          title: "Unsupported file format",
          description: "Only JPEG, JPG, PNG, and WebP files are supported",
          color: "danger",
        });
        setSelectedImage(null);
        setInputFormat(null);
        e.target.value = "";
      }
    } else {
      setSelectedImage(null);
      setInputFormat(null);
    }
  };

  const validateImageUrl = async (
    url: string,
  ): Promise<{ isValid: boolean; size?: number; contentType?: string }> => {
    try {
      const urlObj = new URL(url);

      const response = await axios.head(url, {
        timeout: 10000,
      });

      const contentType = response.headers["content-type"];

      if (
        !contentType ||
        !contentType.startsWith("image/") ||
        !isValidImageFormat(contentType)
      ) {
        return { isValid: false };
      }

      // Check file size for URL images too
      const contentLength = response.headers["content-length"];
      if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (size > MAX_FILE_SIZE) {
          return { isValid: false };
        }
        return { isValid: true, size, contentType };
      }

      return { isValid: true, contentType };
    } catch {
      return { isValid: false };
    }
  };

  const handleUseImageUrl = async () => {
    if (imageUrl && imageUrl.trim()) {
      setIsValidatingUrl(true);

      try {
        const { isValid, size, contentType } = await validateImageUrl(
          imageUrl.trim(),
        );

        if (!isValid) {
          addToast({
            title: "Invalid image URL",
            description:
              "The URL does not point to a valid image file (JPEG, JPG, PNG, WebP) or the file is larger than 10MB",
            color: "danger",
          });
          return;
        }

        setSelectedImage(imageUrl.trim());
        setInputFormat(contentType ? getFormatFromMimeType(contentType) : null);
        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } catch {
        addToast({
          title: "Validation failed",
          description: "Unable to validate the image URL. Please try again.",
          color: "danger",
        });
      } finally {
        setIsValidatingUrl(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setInputFormat(null);
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: Schema) => {
    if (!selectedImage) return;
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please log in to convert image format",
        color: "danger",
      });
      return;
    }

    setIsLoading(true);

    try {
      let finalImageUrl = selectedImage;

      // If it's a data URL, upload to Firebase storage first
      if (selectedImage.startsWith("data:image")) {
        const timestamp = Date.now();
        const filename = `public/reference/image-${timestamp}.jpg`;

        await uploadFileString(selectedImage, filename, "data_url");
        finalImageUrl = await getFileDownloadURL(filename);
      }

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Make API call to convert image format
      const response = await axios.post(
        "/dashboard/convert-format/process",
        {
          imageUrl: finalImageUrl,
          outputFormat: data.outputFormat,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setConvertedImage(response.data.image_url);

        // Refresh user credits
        const updatedCredits = await getUserCredits(user.uid);
        setUserCredits(updatedCredits);

        addToast({
          title: "Image format converted successfully",
          description: `Your image has been converted to ${data.outputFormat.toUpperCase()}`,
          color: "success",
        });
      } else {
        addToast({
          title: "Image conversion failed",
          description:
            response.data.message || "Failed to convert image format",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Image conversion failed",
        description: "Failed to convert image format. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Convert Image Format
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Upload an image or provide an image URL to convert it to a different
        format.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        💳 3 credits
      </div>

      <div className="flex gap-8">
        {/* Left side - Form and selected image */}
        <div className="flex-1 max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FileInput
              accept="image/jpeg,image/jpg,image/png,image/webp"
              {...register("uploadedImage", {
                onChange: handleImageChange,
              })}
              isInvalid={!!errors.uploadedImage}
              errorMessage={errors.uploadedImage?.message as string}
              description="Maximum file size: 10MB • Supported formats: JPEG, JPG, PNG, WebP"
            />

            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <CustomInput
                  type="url"
                  {...field}
                  isInvalid={!!errors.imageUrl}
                  errorMessage={errors.imageUrl?.message}
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  actionButton={{
                    text: isValidatingUrl ? "Validating..." : "Use",
                    onClick: handleUseImageUrl,
                    disabled:
                      !field.value || !field.value.trim() || isValidatingUrl,
                  }}
                />
              )}
            />

            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="outputFormat"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Output Format"
                    placeholder="Select output format"
                    selectedKeys={field.value ? [field.value] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;
                      field.onChange(selectedKey);
                    }}
                    isInvalid={!!errors.outputFormat}
                    errorMessage={errors.outputFormat?.message}
                    classNames={{
                      base: "w-full",
                      mainWrapper: "w-full",
                      trigger: [
                        "border-2 border-default-200 hover:border-default-300 focus-within:border-primary-500",
                        "dark:border-zinc-600 dark:hover:border-zinc-500 dark:focus-within:border-primary-400",
                        "bg-default-50 dark:bg-zinc-800/50",
                        "transition-colors duration-200",
                        "data-[focus=true]:border-primary-500 dark:data-[focus=true]:border-primary-400",
                        "data-[hover=true]:border-default-300 dark:data-[hover=true]:border-zinc-500",
                        "data-[open=true]:border-primary-500 dark:data-[open=true]:border-primary-400",
                      ],
                      innerWrapper: "bg-transparent",
                      value: "text-default-900 dark:text-white",
                      label: "text-default-600 dark:text-zinc-300",
                      description: "text-default-500 dark:text-zinc-400",
                      errorMessage: "text-danger-500 dark:text-danger-400",
                      selectorIcon: "text-default-500 dark:text-zinc-400",
                    }}
                  >
                    <SelectItem key="png">PNG</SelectItem>
                    <SelectItem key="jpeg">JPEG</SelectItem>
                    <SelectItem key="jpg">JPG</SelectItem>
                    <SelectItem key="webp">WebP</SelectItem>
                  </Select>
                )}
              />
            </div>

            <Button
              type="submit"
              isDisabled={!isValid}
              variant="solid"
              color="primary"
            >
              Convert Format
            </Button>
          </form>

          {selectedImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Selected Image{inputFormat && ` (${inputFormat})`}
              </label>
              <div className="w-full h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center relative">
                <Image
                  src={selectedImage}
                  alt="Selected Image"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                  aria-label="Remove image"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Converted image */}
        {convertedImage && (
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Converted Image ({outputFormat.toUpperCase()})
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              ℹ️ Download link will be available until midnight UTC
            </p>
            <div className="w-full h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center relative">
              <Image
                src={convertedImage}
                alt="Converted Image"
                fill
                className="object-contain"
              />
              <a
                href={convertedImage}
                download={`converted-image.${outputFormat}`}
                className="absolute top-2 right-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors duration-200 z-10"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
