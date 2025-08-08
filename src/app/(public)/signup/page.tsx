"use client";

import { PasswordInput, EmailInput } from "@/components/inputs";
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
import { trpc } from "@/lib/trpc/client";
import { isStrongPassword } from "validator";

const SignupSchema = z
  .object({
    email: z.email(),
    password: z.string().refine(isStrongPassword, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.signup.createUser.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage(
          data.message ||
            "Account created successfully! Please check your email to verify your account."
        );
        setErrorMessage(null);
        form.reset();
      } else {
        setErrorMessage(
          data.message || "Failed to create account. Please try again."
        );
        setSuccessMessage(null);
      }
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Failed to create account. Please try again."
      );
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    mutate({
      email: data.email,
      password: data.password,
    });
  };

  const values = form.watch();
  const email = values.email;
  const password = values.password;
  const confirmPassword = values.confirmPassword;

  const setEmail = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue("email", e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setPassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue("password", e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue("confirmPassword", e.target.value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const errors = form.formState.errors;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;

  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="h-full w-full">
      <div className="mb-8" />
      <div className="space-y-12 flex flex-col items-center justify-center w-full">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create an account to get started with our service.
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
              <PasswordInput
                label="Password"
                value={password || ""}
                onChange={setPassword}
                error={passwordError}
              />
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword || ""}
                onChange={setConfirmPassword}
                error={confirmPasswordError}
              />
              <Button
                type="submit"
                variant="default"
                className="mt-2 w-full"
                disabled={!isFormValid || isPending}
              >
                {WithLoader({ text: "Create Account", isLoading: isPending })}
              </Button>
              {successMessage && <SuccessAlert message={successMessage} />}
              {errorMessage && <ErrorAlert message={errorMessage} />}
            </form>

            <div className="mt-4 text-center">
              <Link
                href={ROUTES.LOGIN}
                className="text-xs text-primary hover:text-primary-600 transition-colors underline"
              >
                Already have an account? Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
