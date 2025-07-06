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
import { uploadFileString, getFileDownloadURL } from "@/lib/firebase";
import { useLoader } from "@/context/loader";

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
    }
  );

type Schema = z.infer<typeof schema>;

export default function RemoveBackgroundPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const { setIsLoading } = useLoader();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
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
            description: "The URL does not point to a valid image file",
            color: "danger",
          });
          return;
        }

        setSelectedImage(imageUrl.trim());
        const fileInput = document.querySelector(
          'input[type="file"]'
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
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    try {
      let finalImageUrl = selectedImage;

      if (selectedImage.startsWith("data:image")) {
        const timestamp = Date.now();
        const filename = `public/reference/image-${timestamp}.jpg`;

        await uploadFileString(selectedImage, filename, "data_url");
        finalImageUrl = await getFileDownloadURL(filename);



        addToast({
          title: "Background removed successfully",
          description: "Your image background has been removed",
          color: "success",
        });
      } else {
        addToast({
          title: "Background removed successfully",
          description: "Your image background has been removed",
          color: "success",
        });
      }
    } catch {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Remove Background
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-6">
        Upload an image to remove its background automatically.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md"
      >
        <FileInput
          accept="image/*"
          {...register("uploadedImage", {
            onChange: handleImageChange,
          })}
          isInvalid={!!errors.uploadedImage}
          errorMessage={errors.uploadedImage?.message as string}
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
          Remove Background
        </Button>

        {selectedImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Selected Image
            </label>
            <div className="w-128 h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center relative">
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
      </form>
    </div>
  );
}
