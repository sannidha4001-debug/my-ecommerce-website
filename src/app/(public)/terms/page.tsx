import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The rules for using GameXchange's escrow marketplace, including game publisher rules, payments, commission and dispute outcomes.",
};

export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
