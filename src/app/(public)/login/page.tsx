"use client";

import { PasswordInput, EmailInput } from "@/components/inputs";
import { Button } from "@/components/buttons";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import { WithLoader } from "@/components/loaders";
import { Link } from "@/components/links";
import { ChangeEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { useUser } from "@/context/user/provider";
import { Small } from "@/components/ui/typography";

const LoginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { login } = useUser();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = trpc.login.authenticateUser.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage(data.message || "Login successful!");
        setErrorMessage(null);
        if (data.data?.accessToken) {
          login(data.data.accessToken);
        }
      } else {
        setErrorMessage(data.message || "Failed to login. Please try again.");
        setSuccessMessage(null);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to login. Please try again.");
      setSuccessMessage(null);
    },
  });

  useEffect(() => {
    const emailVerifiedSuccess = searchParams.get("email_verified_success");
    const emailVerifiedFailed = searchParams.get("email_verified_failed");

    if (emailVerifiedSuccess === "1") {
      setSuccessMessage("Email verified successfully! You can now log in.");
      setErrorMessage(null);
    } else if (emailVerifiedFailed === "1") {
      setErrorMessage(
        "Email verification failed. Please check your verification link or try again."
      );
      setSuccessMessage(null);
    }
  }, [searchParams]);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
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

  const errors = form.formState.errors;
  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  const isFormValid = form.formState.isValid;
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="h-full w-full">
      <div className="mb-8" />
      <div className="space-y-12 flex flex-col items-center justify-center w-full">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Welcome back! Please sign in to your account to continue.
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
              <Button
                type="submit"
                variant="default"
                className="mt-2 w-full"
                disabled={!isFormValid || isPending}
              >
                {WithLoader({ text: "Sign In", isLoading: isPending })}
              </Button>
              {successMessage && <SuccessAlert message={successMessage} />}
              {errorMessage && <ErrorAlert message={errorMessage} />}
            </form>

            <div className="mt-4 text-center space-y-2">
              <div>
                <Link href={ROUTES.SIGNUP}>
                  <Small>Don't have an account? Sign up</Small>
                </Link>
              </div>
              <div>
                <Link href={ROUTES.FORGOT_PASSWORD}>
                  <Small>Forgot your password?</Small>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
