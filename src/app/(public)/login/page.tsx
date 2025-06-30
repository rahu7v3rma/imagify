"use client";

import { PasswordInput } from "@/components/ui/input";
import { useFirebase } from "@/context/firebase";
import { Button, Input, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useFirebase();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: Schema) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Input
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
