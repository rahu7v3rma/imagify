import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateEmailVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
