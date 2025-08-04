import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactFormData } from "@/types/app/public/contact";
import { ContactSchema } from "@/schemas/public/contact";
import { trpc } from "@/lib/trpc/client";

export const useContactForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.contact.post.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(
        "Your message has been sent successfully! We'll get back to you soon."
      );
      setErrorMessage(null);
      form.reset();
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to send message. Please try again."
      );
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    mutate({ email: data.email, message: data.message });
  };

  const values = form.watch();
  const email = values.email;
  const message = values.message;

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
    setEmail,
    setMessage,
    emailError,
    messageError,
    isFormValid,
    handleSubmit,
  };
};
