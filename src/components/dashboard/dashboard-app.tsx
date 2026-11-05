"use client";

import {
  DASHBOARD_NAV,
  DashboardShell,
  type DashboardSection,
} from "@/components/dashboard/dashboard-shell";
import {
  ListingsSection,
  OffersSection,
  OrdersSection,
  OverviewSection,
} from "@/components/dashboard/dashboard-sections-a";
import {
  ReviewsSection,
  SupportSection,
  VerifySection,
  WalletSection,
  WishlistSection,
} from "@/components/dashboard/dashboard-sections-b";

const VALID = new Set<string>(DASHBOARD_NAV.map((item) => item.key));

/** Maps the URL segment to the correct dashboard panel. */
export function DashboardApp({ section }: { section?: string }) {
  const key = (section && VALID.has(section) ? section : "overview") as DashboardSection;

  return (
    <DashboardShell section={key}>
      {key === "overview" && <OverviewSection />}
      {key === "orders" && <OrdersSection />}
      {key === "offers" && <OffersSection />}
      {key === "listings" && <ListingsSection />}
      {key === "support" && <SupportSection />}
      {key === "wishlist" && <WishlistSection />}
      {key === "wallet" && <WalletSection />}
      {key === "verify" && <VerifySection />}
      {key === "reviews" && <ReviewsSection />}
    </DashboardShell>
  );
}
