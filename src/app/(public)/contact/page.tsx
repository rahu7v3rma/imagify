"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { Button } from "@/components/buttons";
import { EmailInput, Textarea, ImageInput } from "@/components/inputs";
import { Loader2 } from "lucide-react";
import { P } from "@/components/ui/typography";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/constants/common";
import { Muted } from "@/components/ui/typography";
import PageTransition from "@/components/transitions";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  image: z.instanceof(File).optional(),
});

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

const useContactForm = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.contact.postFormData.useMutation({
    onSuccess: (data) => {
      setSuccessMessage(
        "Your message has been sent successfully! We'll get back to you soon.",
      );
      setErrorMessage(null);
      form.reset();
    },
    onError: (error) => {
      setErrorMessage("Failed to send message. Please try again.");
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: z.infer<typeof ContactSchema>) => {
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

function ContactForm() {
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

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="w-full">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <div className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
              <div className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbPage>Contact</BreadcrumbPage>
                </BreadcrumbItem>
              </div>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="space-y-12 flex flex-col items-center justify-center w-full">
          <Card className="flex flex-col items-center justify-center w-1/4">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Have a question or need help? Send us a message and we&apos;ll
                get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <ContactForm />
              <div className="mt-4 flex justify-center w-full">
                <Badge variant="outline" className="text-center w-full text-xs">
                  <Link href={`mailto:${CONTACT_EMAIL}`}>
                    <Muted className="text-xs">
                      If you&apos;re having trouble with the form, you can also
                      reach us directly at {CONTACT_EMAIL}
                    </Muted>
                  </Link>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
