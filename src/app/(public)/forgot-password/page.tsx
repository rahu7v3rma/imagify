"use client";

import { EmailInput } from "@/components/inputs";
import { Button } from "@/components/buttons";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { WithLoader } from "@/components/loaders";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
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
import { ROUTES } from "@/constants/routes";

const ForgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (_data: z.infer<typeof ForgotPasswordSchema>) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsPending(true);

    try {
      // TODO: Implement forgot password API call
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage(
        "Password reset email sent! Check your inbox for instructions."
      );
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Failed to send password reset email. Please try again.");
      setSuccessMessage(null);
    } finally {
      setIsPending(false);
    }
  };

  const setFormValue = (
    field: keyof z.infer<typeof ForgotPasswordSchema>,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue("email", e.target.value);
  };

  const values = form.watch();
  const email = values.email;
  const errors = form.formState.errors;
  const emailError = errors.email?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="h-full w-full">
      <div className="mb-8" />
      <div className="space-y-12 flex flex-col items-center justify-center w-full">
        <Card className="flex flex-col items-center justify-center w-full max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <EmailInput
                value={email || ""}
                onChange={setEmail}
                error={emailError}
              />
              <Button
                type="submit"
                variant="default"
                className="mt-2 w-full"
                disabled={!isFormValid || isPending}
              >
                {WithLoader({ text: "Send Reset Email", isLoading: isPending })}
              </Button>
              {successMessage && <SuccessAlert message={successMessage} />}
              {errorMessage && <ErrorAlert message={errorMessage} />}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
