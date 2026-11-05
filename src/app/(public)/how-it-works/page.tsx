import type { Metadata } from "next";
import { HowItWorksContent } from "@/components/marketing/how-it-works-content";

export const metadata: Metadata = {
  title: "How Escrow Works",
  description:
    "The six-step GameXchange escrow process: order, pay, verification, private handover, 48-hour inspection and payout.",
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
