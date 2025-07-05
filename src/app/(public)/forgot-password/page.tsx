"use client";

import { resetPasswordEmail } from "@/lib/firebase";
import { Button, Input, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addToast } from "@heroui/react";
import { useLoader } from "@/context/loader";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type Schema = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
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

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      await resetPasswordEmail(email);
      addToast({
        title: "Password reset email sent!",
        color: "success",
      });
      return true;
    } catch {
      addToast({
        title: "Failed to send password reset email",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await forgotPassword(data.email);
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <p className="text-sm text-gray-600 mb-2">
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="Email"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(onSubmit)()}
        />
        <Button
          type="submit"
          isDisabled={!isValid}
          variant="solid"
          color="primary"
        >
          Send Reset Email
        </Button>
        <div className="text-center mt-2">
          <Link
            href="/login"
            size="sm"
            color="primary"
            underline="hover"
            className="text-xs"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}
