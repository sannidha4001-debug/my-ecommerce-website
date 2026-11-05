import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a GameXchange account to buy or sell game accounts with escrow protection.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
