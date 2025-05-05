"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";
import { RegisterSchema } from "../../utils/formsSchema";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const registerApi = useApi({
    url: "/user/register",
    method: "POST",
  });

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    registerApi({
      name: data.name,
      email: data.email,
      password: data.password,
    }).then((response) => {
      if (response.success) {
        router.push("/verify-email");
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="heading-1">Register</h1>
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
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
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
