"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  Store,
  Tag,
  Wallet,
  CheckCheck,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { timeAgo } from "@/lib/account";
import { cn, formatBDT } from "@/lib/utils";
import { toast } from "sonner";

export const DASHBOARD_NAV = [
  { key: "overview", href: "/dashboard", icon: LayoutDashboard, en: "Overview", bn: "ওভারভিউ" },
  { key: "orders", href: "/dashboard/orders", icon: Package, en: "Orders", bn: "অর্ডার" },
  { key: "offers", href: "/dashboard/offers", icon: Tag, en: "Offers", bn: "অফার" },
  { key: "listings", href: "/dashboard/listings", icon: Store, en: "My listings", bn: "আমার লিস্টিং" },
  { key: "support", href: "/dashboard/support", icon: MessageSquare, en: "Support", bn: "সাপোর্ট" },
  { key: "wishlist", href: "/dashboard/wishlist", icon: Heart, en: "Wishlist", bn: "উইশলিস্ট" },
  { key: "wallet", href: "/dashboard/wallet", icon: Wallet, en: "Wallet & payouts", bn: "ওয়ালেট ও পেআউট" },
  { key: "verify", href: "/dashboard/verify", icon: BadgeCheck, en: "Verification", bn: "ভেরিফিকেশন" },
  { key: "reviews", href: "/dashboard/reviews", icon: Star, en: "Reviews", bn: "রিভিউ" },
] as const;

export type DashboardSection = (typeof DASHBOARD_NAV)[number]["key"];

export function DashboardShell({
  section,
  children,
}: {
  section: DashboardSection;
  children: ReactNode;
}) {
  const { isBangla } = useI18n();
  const tr = (en: string, bn: string) => (isBangla ? bn : en);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const {
    hydrated,
    user,
    signOut,
    notifications,
    unreadNotifications,
    markNotificationsRead,
    orders,
    offers,
    threads,
  } = useAppStore();
  const [bellOpen, setBellOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?next=/dashboard");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div className="container py-12">
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="glass h-80 animate-pulse rounded-2xl" />
          <div className="glass h-[420px] animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  const openTickets = threads.filter((thread) => thread.status === "open").length;
  const activeOrders = orders.filter(
    (order) => !["completed", "cancelled", "refunded"].includes(order.status),
  ).length;
  const pendingOffers = offers.filter((offer) => offer.status === "pending").length;

  const badgeFor: Partial<Record<DashboardSection, number>> = {
    orders: activeOrders,
    offers: pendingOffers,
    support: openTickets,
  };

  function handleSignOut() {
    signOut();
    toast.success(tr("Signed out safely", "নিরাপদে লগ আউট হয়েছে"));
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container py-6">
      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* ----------------------------- sidebar ---------------------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass hidden rounded-2xl p-3 lg:block">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold uppercase text-white">
                {user.name.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{user.name}</p>
                <p className="text-[9px] capitalize text-muted-foreground">
                  {tr("Member", "মেম্বার")} · {user.kyc}
                </p>
              </div>
              <BadgeCheck className={cn("h-4 w-4", user.kyc === "verified" ? "text-cyan-400" : "text-muted-foreground/40")} />
            </div>

            <nav className="mt-3 space-y-0.5" aria-label="Dashboard">
              {DASHBOARD_NAV.map((item) => {
                const active = section === item.key;
                const count = badgeFor[item.key] ?? 0;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition",
                      active
                        ? "bg-primary/12 text-foreground ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active ? "text-primary" : "")} aria-hidden />
                    <span className="flex-1">{isBangla ? item.bn : item.en}</span>
                    {count > 0 && (
                      <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary/20 px-1 text-[9px] font-bold text-primary">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
              <div className="rounded-xl bg-white/[0.03] p-2.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{tr("Wallet", "ওয়ালেট")}</p>
                <p className="mt-0.5 font-display text-base font-bold tabular-nums">{formatBDT(user.balance)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" />
                {tr("Sign out", "লগ আউট")}
              </Button>
            </div>
          </div>

          {/* mobile nav */}
          <div className="glass -mx-1 flex gap-1 overflow-x-auto rounded-xl p-1.5 lg:hidden">
            {DASHBOARD_NAV.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-medium transition",
                  section === item.key
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="h-3.5 w-3.5" aria-hidden />
                {isBangla ? item.bn : item.en}
              </Link>
            ))}
          </div>
        </aside>

        {/* ------------------------------ main ----------------------------- */}
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                {tr("Your workspace", "আপনার ওয়ার্কস্পেস")}
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
                {section === "overview"
                  ? tr(`Welcome back, ${user.name.split(" ")[0]}`, `স্বাগতম, ${user.name.split(" ")[0]}`)
                  : (() => {
                      const item = DASHBOARD_NAV.find((nav) => nav.key === section);
                      return item ? (isBangla ? item.bn : item.en) : "";
                    })()}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setBellOpen((value) => !value);
                    if (!bellOpen) markNotificationsRead();
                  }}
                  aria-expanded={bellOpen}
                  aria-label={tr("Notifications", "নোটিফিকেশন")}
                  className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/[0.03] text-muted-foreground transition hover:text-foreground"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="glass-strong absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
                        <p className="text-xs font-semibold">{tr("Notifications", "নোটিফিকেশন")}</p>
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.slice(0, 5).map((item) => (
                          <Link
                            key={item.id}
                            href={item.href ?? "/dashboard"}
                            onClick={() => setBellOpen(false)}
                            className="block border-b border-border/40 px-3 py-2.5 transition last:border-0 hover:bg-white/[0.04]"
                          >
                            <p className="text-[11px] font-medium">
                              {isBangla ? item.title.bn : item.title.en}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">
                              {isBangla ? item.body.bn : item.body.en}
                            </p>
                            <p className="mt-1 text-[9px] text-muted-foreground/70">{timeAgo(item.at)}</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button asChild size="sm" variant="secondary">
                <Link href="/sell">
                  <Store className="h-3.5 w-3.5" />
                  {tr("Sell", "বিক্রি")}
                </Link>
              </Button>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-violet-400/15 bg-violet-400/[0.05] px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-violet-300" />
            {tr(
              "All conversations are moderated by GameXchange. Members cannot contact each other directly.",
              "সব কথোপকথন GameXchange মডারেট করে। ক্রেতা ও বিক্রেতা সরাসরি যোগাযোগ করতে পারবেন না।",
            )}
            <Link href="/dashboard/support" className="ml-auto inline-flex shrink-0 items-center gap-0.5 font-medium text-primary hover:underline">
              {tr("Support", "সাপোর্ট")}
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {children}

          <p className="mt-6 flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground/60">
            <ShieldCheck className="h-3 w-3" />
            {tr(
              "Signed in as",
              "লগ ইন আছেন",
            )} {user.email} · {tr("session auto-locks after 30 min", "৩০ মিনিট নিষ্ক্রিয়তায় সেশন লক হয়")}
          </p>
        </div>
      </div>
    </div>
  );
}
