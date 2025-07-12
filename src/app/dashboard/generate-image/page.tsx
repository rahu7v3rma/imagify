"use client";

import { Button } from "@heroui/react";
import { CustomTextarea } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { addToast } from "@heroui/react";
import { Controller } from "react-hook-form";
import { getUserCents } from "@/lib/firebase";
import { useLoader } from "@/context/loader";
import { useFirebase } from "@/context/firebase";

const schema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(500, "Prompt must be at most 500 characters"),
  generateType: z.string().min(1, "Generate type is required"),
});

type Schema = z.infer<typeof schema>;

export default function GenerateImagePage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { setIsLoading } = useLoader();
  const { user, setUserCents } = useFirebase();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      generateType: "standard",
    },
  });

  const generateType = watch("generateType");

  const handleGenerateTypeChange = (type: string) => {
    setValue("generateType", type, { shouldValidate: true });
  };

  const getCreditRequirement = (type: string) => {
    switch (type) {
      case "standard":
        return 2;
      case "pro":
        return 6;
      case "max":
        return 10;
      default:
        return 2;
    }
  };

  const onSubmit = async (data: Schema) => {
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please log in to generate image",
        color: "danger",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Make API call to generate image
      const response = await axios.post(
        "/dashboard/generate-image/process",
        {
          prompt: data.prompt,
          generateType: data.generateType,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setGeneratedImage(response.data.image_url);

        // Refresh user cents
        const updatedCents = await getUserCents(user.uid);
        setUserCents(updatedCents);

        addToast({
          title: "Image generated successfully",
          description: "Your image has been generated",
          color: "success",
        });
      } else {
        addToast({
          title: "Image generation failed",
          description: response.data.message || "Failed to generate image",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Image generation failed",
        description: "Failed to generate image. Please try again.",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Generate Image
      </h1>
      <p className="text-gray-600 dark:text-zinc-300 mb-2">
        Enter a prompt to generate an image using AI.
      </p>
      <div className="mb-6 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        💳 {getCreditRequirement(generateType)} {'cents'}
      </div>

      <div className="flex gap-8">
        {/* Left side - Form */}
        <div className="flex-1 max-w-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              control={control}
              name="prompt"
              render={({ field }) => (
                <CustomTextarea
                  {...field}
                  isInvalid={!!errors.prompt}
                  errorMessage={errors.prompt?.message}
                  label="Image Prompt"
                  placeholder="Describe the image you want to generate (e.g., 'A beautiful sunset over mountains with purple clouds')"
                  rows={4}
                />
              )}
            />

            {/* Generate Type Selection */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
                Generation Type
              </label>
              <div className="flex gap-2">
                {["standard", "pro", "max"].map((type) => (
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
              Generate Image
            </Button>
          </form>
        </div>

        {/* Right side - Generated image */}
        {generatedImage && (
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Generated Image
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              ℹ️ Download link will be available until midnight UTC
            </p>
            <div className="w-full h-80 border-2 border-gray-300 dark:border-zinc-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-zinc-800 flex items-center justify-center relative">
              <Image
                src={generatedImage}
                alt="Generated Image"
                fill
                className="object-contain"
              />
              <a
                href={generatedImage}
                download="generated-image.png"
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
