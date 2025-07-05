"use client";

import { createUser } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { Button, Input } from "@heroui/react";
import { PasswordInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";

const schema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .refine((password) => validator.isStrongPassword(password), {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

export default function SignupPage() {
  const { setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUser(email, password);
      setUser(userCredential.user);
      addToast({
        title: "Account created successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          addToast({
            title: "Email already in use",
            color: "danger",
          });
          return false;
        }
        if (error.code === "auth/invalid-email") {
          addToast({
            title: "Invalid email",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to create account",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await signup(data.email, data.password);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Signup</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="Email"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <PasswordInput
          placeholder="Password"
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />
        <PasswordInput
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />
        <Button
          type="submit"
          isDisabled={!isValid}
          variant="solid"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
