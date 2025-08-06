"use client";

import { Button } from "@/components/buttons";
import { PasswordInput, EmailInput } from "@/components/inputs";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ROUTES } from "@/constants/routes";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Signup</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="default">
          Submit
        </Button>
        <div className="text-center mt-2">
          <Link
            href={ROUTES.LOGIN}
            className="text-xs text-primary hover:text-primary-600 transition-colors underline"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
}
