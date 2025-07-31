"use client";

import { Button, Link } from "@heroui/react";
import { EmailInput } from "@/components/input";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold dark:text-white">Reset Password</h1>
      <p className="text-sm text-gray-600 dark:text-zinc-300 mb-2">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="solid" color="primary">
          Send Reset Email
        </Button>
        <div className="text-center mt-2">
          <Link
            href="/login"
            size="sm"
            color="primary"
            underline="hover"
            className="text-xs"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
