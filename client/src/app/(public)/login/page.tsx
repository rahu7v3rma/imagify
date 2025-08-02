"use client";

import { PasswordInput, EmailInput } from "@/components/inputs";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/button";
import Link from "next/link";
import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="default">
          Submit
        </Button>
        <div className="text-center mt-2">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-primary hover:text-primary-600 transition-colors underline"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
