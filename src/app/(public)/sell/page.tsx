import type { Metadata } from "next";
import { SellPageContent } from "@/components/sell/sell-page-content";

export const metadata: Metadata = {
  title: "Sell a Game Account",
  description:
    "Create a game account listing with screenshots and a short video. Get paid through GameXchange escrow after buyer inspection.",
};

export default function SellPage() {
  return <SellPageContent />;
}
