"use client";

import { PasswordInput, EmailInput } from "@/components/inputs";
import { Button } from "@/components/buttons";
import { ErrorAlert, SuccessAlert } from "@/components/alerts";
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailVerifiedSuccess = searchParams.get("email_verified_success");
    const emailVerifiedFailed = searchParams.get("email_verified_failed");

    if (emailVerifiedSuccess === "1") {
      setSuccessMessage("Email verified successfully! You can now log in.");
      setErrorMessage(null);
    } else if (emailVerifiedFailed === "1") {
      setErrorMessage("Email verification failed. Please check your verification link or try again.");
      setSuccessMessage(null);
    }
  }, [searchParams]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-full w-full">
      <div className="mb-8"/>
      <div className="space-y-12 flex flex-col items-center justify-center w-full">
        <Card className="flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Welcome back! Please sign in to your account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
              <EmailInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="absolute top-2 right-0 text-[10px] text-primary hover:text-primary-600 transition-colors underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button type="submit" variant="default" className="mt-2 w-full">
                Submit
              </Button>
              {successMessage && <SuccessAlert message={successMessage} />}
              {errorMessage && <ErrorAlert message={errorMessage} />}
            </form>

            <div className="mt-4 text-center">
              <Link
                href={ROUTES.SIGNUP}
                className="text-xs text-primary hover:text-primary-600 transition-colors underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
