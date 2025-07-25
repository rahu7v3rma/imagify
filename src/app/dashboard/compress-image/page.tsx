"use client";

import { Button } from "@heroui/react";
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
        return files[0]?.type.startsWith("image/");
      }, "Only image files are allowed"),
    imageUrl: z.string().optional(),
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

export default function CompressImagePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number | null>(null);
  const [compressedFileSize, setCompressedFileSize] = useState<number | null>(
    null,
  );
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
  });

  const imageUrl = watch("imageUrl");

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
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

        setOriginalFileSize(file.size);
        const reader = new FileReader();
        reader.onload = async (e) => {
          setSelectedImage(e.target?.result as string);
          setValue("imageUrl", "");
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedImage(null);
        setOriginalFileSize(null);
        e.target.value = "";
      }
    } else {
      setSelectedImage(null);
      setOriginalFileSize(null);
    }
  };

  const validateImageUrl = async (
    url: string,
  ): Promise<{ isValid: boolean; size?: number }> => {
    try {
      const urlObj = new URL(url);

      const response = await axios.head(urlObj.toString(), {
        timeout: 10000,
      });

      const contentType = response.headers["content-type"];

      if (!contentType || !contentType.startsWith("image/")) {
        return { isValid: false };
      }

      const contentLength = response.headers["content-length"];
      const size = contentLength ? parseInt(contentLength, 10) : undefined;

      // Check file size for URL images too
      if (size && size > MAX_FILE_SIZE) {
        return { isValid: false, size };
      }

      return { isValid: true, size };
    } catch {
      return { isValid: false };
    }
  };

  const handleUseImageUrl = async () => {
    if (imageUrl && imageUrl.trim()) {
      setIsValidatingUrl(true);

      try {
        const { isValid, size } = await validateImageUrl(imageUrl.trim());

        if (!isValid) {
          const errorMessage =
            size && size > MAX_FILE_SIZE
              ? "Image file must be smaller than 10MB"
              : "The URL does not point to a valid image file";

          addToast({
            title: "Invalid image URL",
            description: errorMessage,
            color: "danger",
          });
          return;
        }

        setSelectedImage(imageUrl.trim());
        setOriginalFileSize(size || null);
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
    setOriginalFileSize(null);
    setCompressedFileSize(null);
    setCompressedImage(null);
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async () => {
    if (!selectedImage) return;
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please log in to compress image",
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
        const filename = `reference/image-${timestamp}.jpg`;

        await uploadFileString(selectedImage, filename, "data_url");
        finalImageUrl = await getFileDownloadURL(filename);
      }

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Make API call to compress image
      const response = await axios.post(
        "/dashboard/compress-image/process",
        {
          imageUrl: finalImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setCompressedImage(response.data.image_url);
        setCompressedFileSize(response.data.compressed_size);

        // Refresh user credits
        const updatedCredits = await getUserCredits(user.uid);
        setUserCredits(updatedCredits);

        addToast({
          title: "Image compressed successfully",
          description: "Your image has been compressed",
          color: "success",
        });
      } else {
        addToast({
          title: "Image compression failed",
          description: response.data.message || "Failed to compress image",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Image compression failed",
        description: "Failed to compress image. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Compress Image
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Upload an image or provide an image URL to compress it and reduce file
        size.
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
              accept="image/*"
              {...register("uploadedImage", {
                onChange: handleImageChange,
              })}
              isInvalid={!!errors.uploadedImage}
              errorMessage={errors.uploadedImage?.message as string}
              description="Maximum file size: 10MB"
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

            <Button
              type="submit"
              isDisabled={!isValid}
              variant="solid"
              color="primary"
            >
              Compress Image
            </Button>
          </form>

          {selectedImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Selected Image{" "}
                {originalFileSize && `(${formatFileSize(originalFileSize)})`}
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

        {/* Right side - Compressed image */}
        {compressedImage && (
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Compressed Image{" "}
              {compressedFileSize && `(${formatFileSize(compressedFileSize)})`}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              ℹ️ Download link will be available until midnight UTC
            </p>
            <div className="w-full h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center relative">
              <Image
                src={compressedImage}
                alt="Compressed Image"
                fill
                className="object-contain"
              />
              <a
                href={compressedImage}
                download="compressed-image.png"
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
