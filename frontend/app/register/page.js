"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isStrongPassword } from "validator";
import { useApi } from "../../utils/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .refine(
        isStrongPassword,
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const registerApi = useApi("/user/register", "POST");

  const router = useRouter();

  const onSubmit = (data) => {
    registerApi({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then(() => {
      router.push("/verify-email");
    });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold">Register</h1>
        <div className="flex flex-row gap-2">
          <Input
            label="Name"
            type="text"
            className="w-[300px]"
            {...register("name")}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <Input
            label="Email"
            type="text"
            className="w-[300px]"
            {...register("email")}
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </div>
        <div className="flex flex-row gap-2">
          <Input
            label="Password"
            type="password"
            className="w-[300px]"
            {...register("password")}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Input
            label="Confirm Password"
            type="password"
            className="w-[300px]"
            {...register("confirmPassword")}
            isInvalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
        </div>
        <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login">
            <span className="underline">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
