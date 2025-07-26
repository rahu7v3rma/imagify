"use client";

import { useFirebase } from "@/context/firebase";
import { Button, Checkbox } from "@heroui/react";
import { PasswordInput, CustomInput } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addToast } from "@heroui/react";
import { useLoader } from "@/context/loader";
import axios from "axios";
import { useState } from "react";

export default function SignupPage() {
  const { setUser } = useFirebase();
  const { setIsLoading } = useLoader();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const signup = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/signup/api', {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      });

      if (response.data.success) {
        addToast({
          title: response.data.message,
          color: "success",
        });
        router.push("/login");
      } else {
        addToast({
          title: response.data.message,
          color: "danger",
        });
      }
    } catch (error: any) {
      let errorMessage = "Failed to create account";
      
      if (error.response?.data?.code === "validation_failed") {
        const fieldErrors = error.response.data.data;
        const errorMessages = [];
        
        if (fieldErrors.email) errorMessages.push(`Email: ${fieldErrors.email[0]}`);
        if (fieldErrors.password) errorMessages.push(`Password: ${fieldErrors.password[0]}`);
        if (fieldErrors.confirmPassword) errorMessages.push(`Confirm Password: ${fieldErrors.confirmPassword[0]}`);
        if (fieldErrors.agreeToTerms) errorMessages.push(`Terms: ${fieldErrors.agreeToTerms[0]}`);
        
        errorMessage = errorMessages.join(", ");
      } else {
        errorMessage = error.response?.data?.message || "Failed to create account";
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
    await signup();
  };

  return (
    <div className="flex flex-col gap-2 w-60">
      <h1 className="text-2xl font-bold">Signup</h1>
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
        <PasswordInput
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              isSelected={formData.agreeToTerms}
              onValueChange={(checked) => handleInputChange("agreeToTerms", checked)}
              size="sm"
            />
            <span>
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
        </div>
        <Button
          type="submit"
          variant="solid"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
