"use client";

import { PasswordInput, CustomInput } from "@/components/ui/input";
// import { loginUser, logoutUser, handleActionCode, applyAuthActionCode, verifyPasswordResetCodeFunc } from "@/lib/firebase";
import { useFirebase } from "@/context/firebase";
import { Button, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import { useEffect } from "react";
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
      // const userCredential = await loginUser(email, password);

      // Check if email is verified
      // if (!userCredential.user.emailVerified) {
      //   // await logoutUser();
      //   addToast({
      //     title: "Please verify your email before logging in",
      //     color: "danger",
      //   });
      //   return false;
      // }

      // setUser(userCredential.user);

      // Set the imagify.user.id cookie
      // Cookies.set("imagify.user.id", userCredential.user.uid, {
      //   expires: 30, // 30 days
      // });

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
    const mode = searchParams.get('mode');

    if (oobCode) {
      const handleOobCode = async () => {
        try {
          setIsLoading(true);

          if (mode === 'resetPassword') {
            // Verify the password reset code
            // await verifyPasswordResetCodeFunc(oobCode);
            // Redirect to change-password page with the oobCode
            router.replace(`/change-password?oobCode=${oobCode}`);
            return;
          }

          // const actionCodeInfo = await handleActionCode(oobCode);
          // await applyAuthActionCode(oobCode);

          // if (actionCodeInfo.operation === 'VERIFY_EMAIL') {
          //   addToast({
          //     title: "Email verified successfully!",
          //     color: "success",
          //   });
          // }

          // if(actionCodeInfo.operation === 'VERIFY_AND_CHANGE_EMAIL'){
          //   addToast({
          //     title: "Email changed successfully!",
          //     color: "success",
          //   });
          // }

          // if(actionCodeInfo.operation === 'RECOVER_EMAIL'){
          //   addToast({
          //     title: "Email reverted successfully!",
          //     color: "success",
          //   });
          // }

        } catch (error) {
          addToast({
            title: "Invalid or expired link.",
            color: "danger",
          });
          if (mode === 'resetPassword') {
            router.replace('/forgot-password');
          } 
          if (mode === 'verifyEmail') {
            router.replace('/request-email-verification');
          }
        } finally {
          setIsLoading(false);
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
