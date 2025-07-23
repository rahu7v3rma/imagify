"use client";

import { PasswordInput, CustomInput } from "@/components/ui/input";
import { loginUser, logoutUser, sendVerificationEmail } from "@/lib/firebase";
import { Button, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

export default function RequestEmailVerificationPage() {
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

  const requestVerification = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Login first
      const userCredential = await loginUser(email, password);

      if (!userCredential.user.emailVerified) {
        // Send verification email
        await sendVerificationEmail(userCredential.user);
        addToast({
          title: "Verification email sent! Please check your email and verify your account.",
          color: "success",
        });
      } else {
        addToast({
          title: "Email already verified",
          color: "danger",
        });
      }

      // Logout after sending verification email
      await logoutUser();

      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-credential") {
          addToast({
            title: "User not found",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to send verification email",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await requestVerification(data.email, data.password);
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Request Email Verification</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <CustomInput
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
        <Button
          type="submit"
          isDisabled={!isValid}
          variant="solid"
          color="primary"
        >
          Send Verification Email
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