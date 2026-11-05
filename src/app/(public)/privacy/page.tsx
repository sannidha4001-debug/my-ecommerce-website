import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What data GameXchange collects, why we collect it, how we protect it, and what we never store.",
};

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
