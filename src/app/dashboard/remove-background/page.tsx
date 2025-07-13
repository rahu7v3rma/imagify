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
    generateType: z.string().min(1, "Generate type is required"),
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

export default function RemoveBackgroundPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
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
      generateType: "standard",
    },
  });

  const imageUrl = watch("imageUrl");
  const generateType = watch("generateType");

  const handleGenerateTypeChange = (type: string) => {
    setValue("generateType", type, { shouldValidate: true });
  };

  const getCreditRequirement = (type: string) => {
    switch (type) {
      case "fast":
        return 2;
      case "standard":
        return 3;
      case "pro":
        return 4;
      default:
        return 2;
    }
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

        const reader = new FileReader();
        reader.onload = async (e) => {
          setSelectedImage(e.target?.result as string);
          setValue("imageUrl", "");
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedImage(null);
        e.target.value = "";
      }
    } else {
      setSelectedImage(null);
    }
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const urlObj = new URL(url);

      const response = await axios.head(urlObj.toString(), {
        timeout: 10000,
      });

      const contentType = response.headers["content-type"];

      if (!contentType || !contentType.startsWith("image/")) {
        return false;
      }

      // Check file size for URL images too
      const contentLength = response.headers["content-length"];
      if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (size > MAX_FILE_SIZE) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  };

  const handleUseImageUrl = async () => {
    if (imageUrl && imageUrl.trim()) {
      setIsValidatingUrl(true);

      try {
        const isValidImage = await validateImageUrl(imageUrl.trim());

        if (!isValidImage) {
          addToast({
            title: "Invalid image URL",
            description:
              "The URL does not point to a valid image file or the file is larger than 10MB",
            color: "danger",
          });
          return;
        }

        setSelectedImage(imageUrl.trim());
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
        description: "Please log in to remove background",
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

      // Make API call to remove background
      const response = await axios.post(
        "/dashboard/remove-background/process",
        {
          imageUrl: finalImageUrl,
          generateType: generateType,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setProcessedImage(response.data.image_url);

        // Refresh user cents
        const updatedCredits = await getUserCredits(user.uid);
        setUserCredits(updatedCredits);

        addToast({
          title: "Background removed successfully",
          description: "Your image background has been removed",
          color: "success",
        });
      } else {
        addToast({
          title: "Background removal failed",
          description: response.data.message || "Failed to remove background",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Background removal failed",
        description: "Failed to remove background. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Remove Background
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Upload an image or provide an image URL to remove its background
        automatically.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        💳 {getCreditRequirement(generateType)} {"cents"}
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

            {/* Generate Type Selection */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Generation Type
              </label>
              <div className="flex gap-2">
                {["fast", "standard", "pro"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={generateType === type ? "solid" : "bordered"}
                    color={generateType === type ? "primary" : "default"}
                    size="sm"
                    onClick={() => handleGenerateTypeChange(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              isDisabled={!isValid}
              variant="solid"
              color="primary"
            >
              Remove Background
            </Button>
          </form>

          {selectedImage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                Selected Image
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

        {/* Right side - Processed image */}
        {processedImage && (
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Processed Image
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              ℹ️ Download link will be available until midnight UTC
            </p>
            <div className="w-full h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center relative">
              <Image
                src={processedImage}
                alt="Processed Image"
                fill
                className="object-contain"
              />
              <a
                href={processedImage}
                download="background-removed.png"
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
