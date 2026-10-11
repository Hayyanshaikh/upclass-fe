import type { Metadata } from "next";
import LoginForm from "@/components/forms/LoginForm";
import LoginBranding from "@/components/layout/LoginBranding";

export const metadata: Metadata = {
  title: "Sign in | School Portal",
  description: "Sign in to your school portal.",
};

export default function LoginPage() {
  return <LoginForm />;
}
