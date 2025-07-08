"use client";

import { CustomInput, CustomTextarea } from "@/components/ui/input";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addToast } from "@heroui/react";
import { useLoader } from "@/context/loader";
import { contactUs } from "@/lib/firebase";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type Schema = z.infer<typeof schema>;

export default function ContactPage() {
  const { setIsLoading } = useLoader();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const sendContactMessage = async (email: string, message: string) => {
    try {
      setIsLoading(true);
      await contactUs(email, message);

      return true;
    } catch (error) {
      console.error("Error sending contact message:", error);
      addToast({
        title: "Failed to send message",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await sendContactMessage(data.email, data.message);
    if (success) {
      reset();
      addToast({
        title: "Thank you for your message! We'll get back to you soon.",
        color: "success",
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold dark:text-white">Contact Us</h1>
      <p className="text-sm text-gray-600 dark:text-zinc-300 mb-2">
        Have a question or need help? Send us a message and we&apos;ll get back
        to you as soon as possible.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <CustomInput
          type="email"
          placeholder="Your email address"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <CustomTextarea
          placeholder="Your message..."
          {...register("message")}
          isInvalid={!!errors.message}
          errorMessage={errors.message?.message}
          rows={4}
        />
        <Button
          type="submit"
          isDisabled={!isValid}
          variant="solid"
          color="primary"
        >
          Send Message
        </Button>
      </form>
    </div>
  );
}
