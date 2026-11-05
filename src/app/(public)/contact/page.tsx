import type { Metadata } from "next";
import { ContactContent } from "@/components/marketing/contact-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GameXchange support for payment issues, stuck orders, disputes or suspicious listings.",
};

export default function ContactPage() {
  return <ContactContent />;
}
