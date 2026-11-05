"use client";

import {
  ADMIN_NAV,
  AdminShell,
  type AdminSection,
} from "@/components/admin/admin-shell";
import {
  AdminAuctions,
  AdminListings,
  AdminOrders,
  AdminOverview,
} from "@/components/admin/admin-sections-a";
import {
  AdminAudit,
  AdminFinance,
  AdminReports,
  AdminSettings,
  AdminUsers,
} from "@/components/admin/admin-sections-b";

const VALID = new Set<string>(ADMIN_NAV.map((item) => item.key));

/** Maps the admin URL segment to its panel. */
export function AdminApp({ section }: { section?: string }) {
  const key = (section && VALID.has(section) ? section : "overview") as AdminSection;

  return (
    <AdminShell section={key}>
      {key === "overview" && <AdminOverview />}
      {key === "listings" && <AdminListings />}
      {key === "auctions" && <AdminAuctions />}
      {key === "orders" && <AdminOrders />}
      {key === "users" && <AdminUsers />}
      {key === "reports" && <AdminReports />}
      {key === "finance" && <AdminFinance />}
      {key === "settings" && <AdminSettings />}
      {key === "audit" && <AdminAudit />}
    </AdminShell>
  );
}
