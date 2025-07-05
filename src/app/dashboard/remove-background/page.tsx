"use client";

import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Image from "next/image";

const schema = z
  .object({
    uploadedImage: z
      .any()
      .optional()
      .refine((files) => {
        if (typeof window === "undefined") return true; // Skip validation on server
        if (!files || files.length === 0) return true;
        return files[0]?.type.startsWith("image/");
      }, "Only image files are allowed"),
    imageUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (typeof window === "undefined") return true; // Skip validation on server
      const hasUploadedImage =
        data.uploadedImage && data.uploadedImage.length > 0;
      const hasImageUrl = data.imageUrl && data.imageUrl.trim().length > 0;
      return hasUploadedImage || hasImageUrl;
    },
    {
      message: "Either upload an image or provide an image URL",
      path: ["uploadedImage"], // This will show the error on the uploadedImage field
    }
  );

type Schema = z.infer<typeof schema>;

export default function RemoveBackgroundPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const onSubmit = async (data: Schema) => {
    const imageFile = data.uploadedImage?.[0];
    const imageUrl = data.imageUrl;
    console.log("Selected image:", imageFile);
    console.log("Image URL:", imageUrl);
    // TODO: Implement background removal logic
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Remove Background
      </h1>
      <p className="text-gray-600 mb-6">
        Upload an image to remove its background automatically.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md"
      >
        <Input
          type="file"
          accept="image/*"
          {...register("uploadedImage", {
            onChange: handleImageChange,
          })}
          isInvalid={!!errors.uploadedImage}
          errorMessage={errors.uploadedImage?.message as string}
          label="Select Image"
        />

        <Input
          type="url"
          {...register("imageUrl")}
          isInvalid={!!errors.imageUrl}
          errorMessage={errors.imageUrl?.message}
          label="Image URL"
          placeholder="https://example.com/image.jpg"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Image
            </label>
            <div className="w-128 h-80 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative">
              <Image
                src={selectedImage}
                alt="Selected Image"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
