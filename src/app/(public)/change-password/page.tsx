"use client";

import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { Button } from "@/components/buttons";
import { PasswordInput } from "@/components/inputs";
import { WithLoader } from "@/components/loaders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "@/lib/trpc/client";
import { useSearchParams } from "next/navigation";
import { isStrongPassword } from "validator";

export const metadata = {
  title: "Change Password - Imagify",
  description: "Update your Imagify account password. Create a strong new password to secure your account.",
};

const ChangePasswordSchema = z
  .object({
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

export default function ChangePasswordPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email and code from search params
    const emailParam = searchParams.get("email");
    const codeParam = searchParams.get("code");
    
    if (emailParam && codeParam) {
      setEmail(emailParam);
      setCode(codeParam);
    } else {
      setErrorMessage("Invalid or missing verification parameters");
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.changePassword.changePassword.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage(data.message || "Password changed successfully!");
        setErrorMessage(null);
        form.reset();
      } else {
        setErrorMessage(data.message || "Failed to change password. Please try again.");
        setSuccessMessage(null);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to change password. Please try again.");
      setSuccessMessage(null);
    },
  });

  const onSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!email || !code) {
      setErrorMessage("Missing verification parameters");
      return;
    }

    mutate({
      email,
      code,
      password: data.password,
    });
  };

  const setFormValue = (
    field: keyof z.infer<typeof ChangePasswordSchema>,
    value: string
  ) => {
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const setPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue("password", e.target.value);
  };

  const setConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue("confirmPassword", e.target.value);
  };

  const values = form.watch();
  const password = values.password;
  const confirmPassword = values.confirmPassword;
  const errors = form.formState.errors;
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;
  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="h-full w-full">
      <div className="mb-8" />
      <div className="space-y-12 flex flex-col items-center justify-center w-full">
        <Card className="flex flex-col items-center justify-center w-full max-w-md">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Enter your new password below to update your account password.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <PasswordInput
                label="New Password"
                value={password || ""}
                onChange={setPassword}
                error={passwordError}
              />
              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword || ""}
                onChange={setConfirmPassword}
                error={confirmPasswordError}
              />
              <Button
                type="submit"
                variant="default"
                className="mt-2 w-full"
                disabled={!isFormValid || isPending || !email || !code}
              >
                {WithLoader({ text: "Change Password", isLoading: isPending })}
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
