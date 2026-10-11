import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import LoginBranding from "@/components/layout/LoginBranding";

export const metadata: Metadata = {
  title: "Forgot password | School Portal",
  description:
    "Reset your school portal password using your registered email or ID.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
