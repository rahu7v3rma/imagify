"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema } from "@/schemas/public/contact";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { Button } from "@/components/buttons";
import { EmailInput, Textarea, ImageInput } from "@/components/inputs";
import { Loader2 } from "lucide-react";
import { P } from "@/components/ui/typography";

const withLoader = ({
  text,
  isLoading,
}: {
  text: string;
  isLoading: boolean;
}) => {
  return isLoading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <P>Loading...</P>
    </div>
  ) : (
    <P>{text}</P>
  );
};

export type ContactFormData = z.infer<typeof ContactSchema>;

export const useContactForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.contact.postFormData.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(
        "Your message has been sent successfully! We'll get back to you soon."
      );
      setErrorMessage(null);
      form.reset();
    },
    onError: (error) => {
      setErrorMessage("Failed to send message. Please try again.");
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("message", data.message);
    if (data.image) {
      formData.append("image", data.image);
    }

    mutate(formData);
  };

  const values = form.watch();
  const email = values.email;
  const message = values.message;
  const image = values.image;

  const setEmail = (email: string) => {
    form.setValue("email", email, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setMessage = (message: string) => {
    form.setValue("message", message, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setImage = (image: File | undefined) => {
    form.setValue("image", image, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const errors = form.formState.errors;
  const emailError = errors.email?.message;
  const messageError = errors.message?.message;

  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    successMessage,
    errorMessage,
    isPending,
    email,
    message,
    image,
    setEmail,
    setMessage,
    setImage,
    emailError,
    messageError,
    isFormValid,
    handleSubmit,
  };
};

export default function ContactForm() {
  const {
    successMessage,
    errorMessage,
    isPending,
    setEmail,
    setMessage,
    setImage,
    emailError,
    messageError,
    email,
    message,
    isFormValid,
    handleSubmit,
  } = useContactForm();

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <EmailInput
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <Textarea
          label="Your message"
          value={message || ""}
          onChange={(e) => setMessage(e.target.value)}
          error={messageError}
        />
        <ImageInput
          label="Attach image (optional)"
          onChange={(e) => setImage(e.target.files?.[0])}
        />
        <Button
          variant="default"
          className="mt-2"
          disabled={!isFormValid || isPending}
          type="submit"
        >
          {withLoader({ text: "Send Message", isLoading: isPending })}
        </Button>
        {successMessage && <SuccessAlert message={successMessage} />}
        {errorMessage && <ErrorAlert message={errorMessage} />}
      </form>
    </>
  );
}
