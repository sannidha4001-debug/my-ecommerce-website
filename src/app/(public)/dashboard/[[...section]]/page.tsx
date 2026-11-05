import type { Metadata } from "next";
import { DashboardApp } from "@/components/dashboard/dashboard-app";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage escrow orders, price offers, support tickets, wallet, verification and reviews.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  return <DashboardApp section={section?.[0]} />;
}
