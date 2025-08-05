import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema } from "@/schemas/public/contact";
import { z } from "zod";

import { trpc } from "@/lib/trpc/client";

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
