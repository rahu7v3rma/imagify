"use client";

import { PasswordInput } from "@/components/ui/input";
import { useFirebase } from "@/context/firebase";
import { addToast, Button, Input } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useFirebase();
  const router = useRouter();

  const handleLogin = async () => {
    if (!/^.+@.+\..+$/.test(email)) {
      addToast({
        title: "Invalid email",
        color: "danger",
      });
      return;
    }
    const success = await login(email, password);
    if (success) {
      router.push("/profile");
    }
  };

  const isSubmitDisabled = !email.trim() || !password.trim();

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Login</h1>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <PasswordInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
      />
      <Button
        onPress={handleLogin}
        isDisabled={isSubmitDisabled}
        variant="solid"
        color="primary"
      >
        Submit
      </Button>
    </div>
  );
}
