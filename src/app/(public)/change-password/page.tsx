"use client";

import { PasswordInput } from "@/components/inputs";
import { Button } from "@/components/buttons";
import { useState, FormEvent } from "react";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Change Password</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" variant="default">
          Change Password
        </Button>
      </form>
    </div>
  );
}
