"use client";

import { ErrorAlert, SuccessAlert } from "@/components/shared/alerts";
import { Button } from "@/components/shared/buttons";
import { EmailInput, ImageInput, Textarea } from "@/components/shared/inputs";
import { WithLoader } from "@/components/shared/loaders";
import PageTransition from "@/components/shared/transitions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Small } from "@/components/ui/typography";
import { CONTACT_EMAIL } from "@/constants/common";
import { trpc } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@/components/shared/links";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const metadata = {
  title: "Contact Us - Imagify",
  description: "Get in touch with the Imagify team. Have questions or need help with our AI image processing tools? We're here to assist you.",
};

const ContactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
  image: z.instanceof(File).optional(),
});

export default function ContactPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.contact.sendMessage.useMutation({
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

  return (
    <PageTransition>
      <div className="h-full w-full">
        <div className="mb-8" />
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
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-full"
              >
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
                  value={image}
                  onChange={(e) => setImage(e.target.files?.[0])}
                />
                <Button
                  variant="default"
                  className="mt-2 w-full"
                  disabled={!isFormValid || isPending}
                  type="submit"
                >
                  {WithLoader({ text: "Send Message", isLoading: isPending })}
                </Button>
                {successMessage && <SuccessAlert message={successMessage} />}
                {errorMessage && <ErrorAlert message={errorMessage} />}
              </form>
              <div className="mt-4 flex justify-center w-full">
                <Badge variant="outline" className="text-center w-full text-xs">
                  <Link href={`mailto:${CONTACT_EMAIL}`}>
                    <Small className="text-xs">
                      If you&apos;re having trouble with the form, you can also
                      reach us directly at {CONTACT_EMAIL}
                    </Small>
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
