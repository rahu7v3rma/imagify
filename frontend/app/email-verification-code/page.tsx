"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";
import { useRouter } from "next/navigation";
import { EmailVerificationCodeSchema } from "../../utils/formsSchema";

export default function EmailVerificationCodePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmailVerificationCodeSchema),
  });

  const emailVerificationCodeApi = useApi({
    url: "/user/email-verification-code",
    method: "POST",
  });

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof EmailVerificationCodeSchema>) => {
    emailVerificationCodeApi({
      email: data.email,
    }).then(() => {
      router.push("/verify-email");
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="heading-1">Request Email Verification Code</h1>
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
