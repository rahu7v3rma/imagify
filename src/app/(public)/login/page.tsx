"use client";

import { PasswordInput, CustomInput } from "@/components/ui/input";
import { loginUser, logoutUser, handleActionCode, applyAuthActionCode, sendVerificationEmail } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { Button, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

export default function LoginPage() {
  const { setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEmailVerificationCodeExpired, setIsEmailVerificationCodeExpired] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userCredential = await loginUser(email, password);

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        if (isEmailVerificationCodeExpired) {
          await sendVerificationEmail(userCredential.user);
          setIsEmailVerificationCodeExpired(false);
          addToast({
            title: "Email verification link sent",
            color: "success",
          });
        } else {
          addToast({
            title: "Please verify your email before logging in",
            color: "danger",
          });
        }
        await logoutUser();
        return false;
      }

      setUser(userCredential.user);

      // Set the imagify.user.id cookie
      Cookies.set("imagify.user.id", userCredential.user.uid, {
        expires: 30, // 30 days
      });

      addToast({
        title: "Logged in successfully!",
        color: "success",
      });
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
        title: "Failed to login",
        color: "danger",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: Schema) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    const oobCode = searchParams.get('oobCode');

    if (oobCode) {
      const handleOobCode = async () => {
        try {
          setIsLoading(true);

          const actionCodeInfo = await handleActionCode(oobCode);

          if (actionCodeInfo.operation === 'VERIFY_EMAIL') {
            await applyAuthActionCode(oobCode);
            addToast({
              title: "Email verified successfully!",
              color: "success",
            });
          }

        } catch (error) {
          setIsEmailVerificationCodeExpired(true);
          addToast({
            title: "Invalid or expired link, Try logging in for verification link",
            color: "danger",
          });
        } finally {
          setIsLoading(false);
          router.replace('/login');
        }
      };

      handleOobCode();
    }
  }, [searchParams, router, setIsLoading]);

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Login</h1>
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
          Submit
        </Button>
        <div className="text-center mt-2">
          <Link
            href="/forgot-password"
            size="sm"
            color="primary"
            underline="hover"
            className="text-xs"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  );
}
