"use client";

import { PasswordInput, CustomInput } from "@/components/ui/input";
import { useFirebase } from "@/context/firebase";
import { Button, Link } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/react";
import { useLoader } from "@/context/loader";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const { setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const login = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/login/api', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        addToast({
          title: response.data.message,
          color: "success",
        });
        
        // Set user context if needed
        // setUser(response.data.data.user);
        
        router.push("/dashboard");
      } else {
        addToast({
          title: response.data.message,
          color: "danger",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to login";
      
      if (error.response?.data?.code === "validation_failed") {
        const fieldErrors = error.response.data.data;
        const errorMessages = [];
        
        if (fieldErrors.email) errorMessages.push(`Email: ${fieldErrors.email[0]}`);
        if (fieldErrors.password) errorMessages.push(`Password: ${fieldErrors.password[0]}`);
        
        errorMessage = errorMessages.join(", ");
      } else {
        errorMessage = error.response?.data?.message || "Failed to login";
      }
      
      addToast({
        title: errorMessage,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <CustomInput
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        <PasswordInput
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        <Button
          type="submit"
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
