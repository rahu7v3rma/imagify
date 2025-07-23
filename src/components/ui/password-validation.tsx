"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface PasswordValidationProps {
  password: string;
  className?: string;
}

interface ValidationRule {
  label: string;
  isValid: boolean;
}

export function PasswordValidation({ password, className }: PasswordValidationProps) {
  const rules: ValidationRule[] = [
    {
      label: "At least 8 characters",
      isValid: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "Contains lowercase letter",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "Contains number",
      isValid: /\d/.test(password),
    },
    {
      label: "Contains special character",
      isValid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];

  return (
    <div className={clsx("space-y-2", className)}>
      {rules.map((rule, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          {rule.isValid ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <XMarkIcon className="w-4 h-4 text-red-500" />
          )}
          <span
            className={clsx(
              rule.isValid
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}