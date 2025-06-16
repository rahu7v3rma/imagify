"use client";

import { useFirebase } from "@/context/firebase";
import { addToast, Button, Input, Link } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useFirebase();
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!/^.+@.+\..+$/.test(email)) {
      addToast({
        title: "Invalid email",
        color: "danger",
      });
      return;
    }
    const success = await forgotPassword(email);
    if (success) {
      router.push("/login");
    }
  };

  const isSubmitDisabled = !email.trim();

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <p className="text-sm text-gray-600 mb-2">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
      />
      <Button
        onPress={handleForgotPassword}
        isDisabled={isSubmitDisabled}
        variant="solid"
        color="primary"
      >
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
    </div>
  );
}
