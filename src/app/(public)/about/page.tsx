import type { Metadata } from "next";
import { AboutContent } from "@/components/marketing/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Why GameXchange exists, how we protect Bangladeshi gamers, and the values behind our escrow marketplace.",
};

export default function AboutPage() {
  return <AboutContent />;
}
