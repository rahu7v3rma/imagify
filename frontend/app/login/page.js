"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isStrongPassword } from "validator";
import { useApi } from "../../utils/api";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .refine(
      isStrongPassword,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const loginApi = useApi("/user/login", "POST");

  const onSubmit = (data) => {
    loginApi({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <Input
          label="Email"
          type="text"
          className="w-[300px]"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          className="w-[300px]"
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />
        <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register">
            <span className="underline">Register</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
