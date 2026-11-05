import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your GameXchange escrow marketplace account.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
