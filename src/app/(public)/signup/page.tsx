"use client";

import { createUser, sendVerificationEmail, logoutUser } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { Button, Checkbox } from "@heroui/react";
import { PasswordInput, CustomInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import validator from "validator";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import Cookies from "js-cookie";

const schema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .refine((password) => validator.isStrongPassword(password), {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol",
      }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and privacy policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Schema = z.infer<typeof schema>;

export default function SignupPage() {
  const { setUser } = useFirebase();
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

  const signup = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUser(email, password);

      // Send verification email
      await sendVerificationEmail(userCredential.user);

      // Logout immediately after creating account
      await logoutUser();

      addToast({
        title: "Email sent for verification",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          addToast({
            title: "Email already in use",
            color: "danger",
          });
          return false;
        }
        if (error.code === "auth/invalid-email") {
          addToast({
            title: "Invalid email",
            color: "danger",
          });
          return false;
        }
      }
      addToast({
        title: "Failed to create account",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await signup(data.email, data.password);
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Signup</h1>
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
        <PasswordInput
          placeholder="Confirm Password"
          {...register("confirmPassword")}
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              {...register("agreeToTerms")}
              isInvalid={!!errors.agreeToTerms}
              size="sm"
            />
            <span className={errors.agreeToTerms ? "text-red-500" : ""}>
              I agree to the{" "}
              <Link
                href="/terms-of-service"
                target="_blank"
                className="text-primary-600 underline hover:text-primary-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-primary-600 underline hover:text-primary-700"
              >
                Privacy Policy
              </Link>
            </span>
          </div>
          {errors.agreeToTerms && (
            <span className="text-red-500 text-xs">
              {errors.agreeToTerms.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          isDisabled={!isValid}
          variant="solid"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
