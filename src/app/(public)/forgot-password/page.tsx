import ForgotPasswordComponent from "@/components/pages/forgot-password";

export const metadata = {
  title: "Forgot Password - Imagify",
  description:
    "Reset your Imagify account password. Enter your email address and we'll send you a link to reset your password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordComponent />;
}
