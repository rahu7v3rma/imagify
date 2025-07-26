"use client";

import { PasswordInput, CustomInput } from "@/components/ui/input";
// import { loginUser, logoutUser, getUserRole } from "@/lib/firebase";
import { useUser } from "@/context/user";
import { Button, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addToast } from "@heroui/react";
import { FirebaseError } from "firebase/app";
import { useLoader } from "@/context/loader";
import Cookies from "js-cookie";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { setUser } = useUser();
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // const userCredential = await loginUser(email, password);
      
      // Check if user has admin role
      // const userRole = await getUserRole(userCredential.user.uid);
      
      // if (!userRole || userRole.role_name !== "admin") {
      //   // Log out the user and show error
      //   // await logoutUser();
      //   addToast({
      //     title: "Access denied. User is not an admin.",
      //     color: "danger",
      //   });
      //   return false;
      // }

      // setUser(userCredential.user);

      // Set the imagify.user.id cookie
      // Cookies.set("imagify.user.id", userCredential.user.uid, {
      //   expires: 30, // 30 days
      // });

      // Set the imagify.user.role.name cookie
      // Cookies.set("imagify.user.role.name", userRole.role_name, {
      //   expires: 30, // 30 days
      // });

      addToast({
        title: "Admin logged in successfully!",
        color: "success",
      });
      return true;
    } catch (error: unknown) {
      // Log out user on any error for security
      // await logoutUser();
      // Clear cookies on error
      Cookies.remove("imagify.user.id");
      Cookies.remove("imagify.user.role.name");
      // Clear user state
      setUser(null);
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
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Admin Login</h1>
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
      </form>
    </div>
  );
}
