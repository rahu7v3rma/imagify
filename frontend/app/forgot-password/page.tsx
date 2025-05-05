"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";
import { useRouter } from "next/navigation";
import { ForgotPasswordSchema } from "../../utils/formsSchema";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const forgotPasswordApi = useApi({
    url: "/user/forgot-password",
    method: "POST",
  });

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof ForgotPasswordSchema>) => {
    forgotPasswordApi({
      email: data.email,
    }).then(() => {
      router.push("/reset-password");
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="heading-1">Forgot Password</h1>
        <Input
          label="Email"
          type="text"
          className="w-[300px]"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </div>
  );
}
