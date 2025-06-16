"use client";

import { useFirebase } from "@/context/firebase";
import { Button, Input, addToast } from "@heroui/react";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup } = useFirebase();
  const router = useRouter();

  const handleSignup = async () => {
    if (!/^.+@.+\..+$/.test(email)) {
      addToast({
        title: "Invalid email",
        color: "danger",
      });
      return;
    }
    if (password.length < 6) {
      addToast({
        title: "Password must be at least 6 characters",
        color: "danger",
      });
      return;
    }
    if (password !== confirmPassword) {
      addToast({
        title: "Passwords do not match",
        color: "danger",
      });
      return;
    }
    const success = await signup(email, password);
    if (success) {
      router.push("/dashboard");
    }
  };

  const isSubmitDisabled =
    !email.trim() || !password.trim() || !confirmPassword.trim();

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Signup</h1>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
      />
      <PasswordInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
      />
      <PasswordInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSignup()}
      />
      <Button
        onPress={handleSignup}
        isDisabled={isSubmitDisabled}
        variant="solid"
        color="primary"
      >
        Submit
      </Button>
    </div>
  );
}
