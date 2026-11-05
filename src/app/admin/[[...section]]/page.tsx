import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Admin Control Room",
  description: "GameXchange operations console.",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  return <AdminApp section={section?.[0]} />;
}
