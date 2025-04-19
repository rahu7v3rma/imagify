"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  emailVerificationCode: z.string(),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const verifyEmailApi = useApi("/user/verify-email", "POST");

  const onSubmit = (data) => {
    verifyEmailApi({
      email: data.email,
      email_verification_code: data.emailVerificationCode,
    }).then(() => {
      router.push("/login");
    });
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold">Verify Email</h1>
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
        <Button onPress={handleSubmit(onSubmit)}>Submit</Button>
      </div>
    </div>
  );
}
