"use client";

import { Button, Checkbox, addToast } from "@heroui/react";
import { PasswordInput, EmailInput } from "@/components/input";
import { FormEvent, useState } from "react";
import { signup } from "@/lib/api";
import { requestCodes } from "@/constants/request";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    try {
      const response = await signup({
        email,
        password,
        confirmPassword,
      });
    } catch (error: any) {
      if (error.response.data.code === requestCodes.INVALID_REQUEST_BODY) {
        const { formErrors, fieldErrors } = error.response.data.data;
        if (formErrors.length > 0) {
          addToast({
            title: "Error",
            description: formErrors[0],
            color: "danger",
          });
        }
        addToast({
          title: "Error",
          description: "Something went wrong",
          color: "danger",
        });
      }
    }
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
        <Button type="submit" variant="solid" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
