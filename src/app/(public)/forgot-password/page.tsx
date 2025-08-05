"use client";

import { Button } from "@/components/buttons";
import Link from "next/link";
import { EmailInput } from "@/components/inputs";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="default">
          Send Reset Email
        </Button>
        <div className="text-center mt-2">
          <Link
            href="/login"
            className="text-xs text-primary hover:text-primary-600 transition-colors underline"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
