"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useApi } from "../../utils/api";
import { setAuthToken } from "../../utils/localStorage";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const loginApi = useApi({
    url: "/user/login",
    method: "POST",
  });

  const router = useRouter();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    loginApi({
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res?.message == "Email not verified") {
        router.push("/verify-email");
      }
      if (res?.success) {
        setAuthToken(res.data.token);
        router.push("/");
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="heading-1">Login</h1>
        <Input
          label="Email"
          type="text"
          className="w-[300px]"
          {...register("email")}
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          className="w-[300px]"
          {...register("password")}
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        />
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/register">
            <span className="underline">Register</span>
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          <Link href="/forgot-password">
            <span className="underline">Forgot Password?</span>
          </Link>
        </p>
        <p className="text-sm text-gray-500">
          <Link href="/email-verification-code">
            <span className="underline">Resend Email Verification Code</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
