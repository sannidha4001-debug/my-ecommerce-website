import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Refund & Dispute Policy",
  description:
    "How GameXchange handles inspection windows, disputes, evidence, refunds and appeals.",
};

export default function RefundPolicyPage() {
  return <LegalPage kind="refunds" />;
}
