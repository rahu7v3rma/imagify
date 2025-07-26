"use client";

import { PasswordInput } from "@/components/ui/input";
// import { confirmPasswordResetFunc } from "@/lib/firebase";
import { Button } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";

const schema = z
  .object({
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

export default function ChangePasswordPage() {
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const changePassword = async (newPassword: string) => {
    const oobCode = searchParams.get('oobCode');
    
    if (!oobCode) {
      addToast({
        title: "Invalid reset link",
        color: "danger",
      });
      router.push("/login");
      return false;
    }

    try {
      setIsLoading(true);
      // await confirmPasswordResetFunc(oobCode, newPassword);
      
      addToast({
        title: "Password changed successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/expired-action-code") {
          addToast({
            title: "Reset link has expired",
            color: "danger",
          });
        } else if (error.code === "auth/invalid-action-code") {
          addToast({
            title: "Invalid reset link",
            color: "danger",
          });
        } else {
          addToast({
            title: "Failed to change password",
            color: "danger",
          });
        }
      } else {
        addToast({
          title: "Failed to change password",
          color: "danger",
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await changePassword(data.password);
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Change Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <PasswordInput
          placeholder="New Password"
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />
        <PasswordInput
          placeholder="Confirm New Password"
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
          Change Password
        </Button>
      </form>
    </div>
  );
}