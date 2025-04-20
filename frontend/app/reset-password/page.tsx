"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";
import { useRouter } from "next/navigation";
import { isStrongPassword } from "validator";

const formSchema = z
  .object({
    email: z.string().email("Invalid email"),
    emailVerificationCode: z
      .string()
      .min(1, "Email verification code is required"),
    password: z
      .string()
      .refine(
        isStrongPassword,
        "Password must have at least 8 characters, one uppercase, one lowercase, one number and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const resetPasswordApi = useApi({
    url: "/user/reset-password",
    method: "POST",
  });

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    resetPasswordApi({
      email: data.email,
      email_verification_code: data.emailVerificationCode,
      password: data.password,
    }).then(() => {
      router.push("/login");
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="heading-1">Reset Password</h1>
        <Input
          label="Email"
          type="text"
          className="w-[300px]"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Input
          label="Email Verification Code"
          type="text"
          className="w-[300px]"
          {...register("emailVerificationCode")}
          isInvalid={!!errors.emailVerificationCode}
          errorMessage={errors.emailVerificationCode?.message}
        />
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
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </div>
  );
}
