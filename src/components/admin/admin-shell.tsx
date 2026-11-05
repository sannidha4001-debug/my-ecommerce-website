"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Bell,
  ClipboardList,
  Gavel,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const ADMIN_NAV = [
  { key: "overview", href: "/admin", icon: LayoutDashboard, en: "Overview", bn: "ওভারভিউ", superOnly: false },
  { key: "listings", href: "/admin/listings", icon: ClipboardList, en: "Listings", bn: "লিস্টিং", superOnly: false },
  { key: "auctions", href: "/admin/auctions", icon: Gavel, en: "Auctions", bn: "নিলাম", superOnly: false },
  { key: "orders", href: "/admin/orders", icon: Package, en: "Orders & escrow", bn: "অর্ডার ও এস্ক্রো", superOnly: false },
  { key: "users", href: "/admin/users", icon: Users, en: "Users", bn: "ইউজার", superOnly: true },
  { key: "reports", href: "/admin/reports", icon: ShieldAlert, en: "Reports", bn: "রিপোর্ট", superOnly: false },
  { key: "finance", href: "/admin/finance", icon: Wallet, en: "Finance", bn: "ফিন্যান্স", superOnly: true },
  { key: "settings", href: "/admin/settings", icon: Settings, en: "Settings", bn: "সেটিংস", superOnly: true },
  { key: "audit", href: "/admin/audit", icon: Activity, en: "Audit log", bn: "অডিট লগ", superOnly: true },
] as const;

export type AdminSection = (typeof ADMIN_NAV)[number]["key"];

export function AdminShell({
  section,
  children,
}: {
  section: AdminSection;
  children: ReactNode;
}) {
  const router = useRouter();
  const { hydrated, adminUser, adminSignOut, orders, threads } = useAppStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (hydrated && !adminUser) {
      router.replace("/admin/login");
    }
  }, [hydrated, adminUser, router]);

  if (!hydrated || !adminUser) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#070714]">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 animate-pulse text-emerald-400" />
          Verifying admin session…
        </div>
      </div>
    );
  }

  const isSuper = adminUser.role === "super_admin";
  const nav = ADMIN_NAV.filter((item) => !item.superOnly || isSuper);
  const openReports = threads.filter((thread) => thread.status === "open").length;
  const escrowQueue = orders.filter((order) =>
    ["payment_submitted", "payment_confirmed", "delivered"].includes(order.status),
  ).length;

  const badgeFor: Partial<Record<AdminSection, number>> = {
    orders: escrowQueue,
    reports: openReports,
  };

  function logout() {
    adminSignOut();
    toast.success("Admin session closed");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="dark min-h-screen bg-[#070714] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        {/* ------------------------------ sidebar ----------------------------- */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.07] bg-[#08081a] p-3 lg:flex">
          <Link href="/admin" className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-black text-[#04120f]">
              GX
            </span>
            <span>
              <span className="block font-display text-sm font-bold leading-tight">Control Room</span>
              <span className="block text-[9px] uppercase tracking-[0.18em] text-emerald-300/70">Admin only</span>
            </span>
          </Link>

          <nav className="mt-4 flex-1 space-y-0.5" aria-label="Admin navigation">
            {nav.map((item) => {
              const active = section === item.key;
              const count = badgeFor[item.key] ?? 0;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium transition",
                    active
                      ? "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", active ? "text-emerald-300" : "text-slate-500")} />
                  <span className="flex-1">{item.en}</span>
                  {count > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded bg-emerald-400/15 px-1 text-[8px] font-bold text-emerald-300">
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-white/[0.07] pt-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                {adminUser.name}
              </p>
              <p className="mt-0.5 text-[9px] capitalize text-slate-500">
                {adminUser.role.replace("_", " ")} · TOTP {adminUser.twoFactor ? "on" : "off"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-start text-slate-400 hover:text-slate-100">
              <LogOut className="h-3.5 w-3.5" />
              Lock console
            </Button>
            <Link href="/" className="block rounded-lg px-2.5 py-1.5 text-[9px] text-slate-600 hover:text-slate-400">
              ← Back to public site
            </Link>
          </div>
        </aside>

        {/* ------------------------------- content --------------------------- */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#070714]/90 backdrop-blur-xl">
            <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
              <Link href="/admin" className="flex items-center gap-2 lg:hidden">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-500 text-[10px] font-black text-[#04120f]">GX</span>
                <span className="font-display text-xs font-bold">Admin</span>
              </Link>

              <div className="hidden flex-1 items-center gap-2 sm:flex">
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && search.trim()) {
                        toast.info(`Search queued for “${search.trim()}”`, {
                          description: "Demo search across users, orders and listings.",
                        });
                      }
                    }}
                    placeholder="Search orders, users, listings…"
                    className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-8 pr-3 text-[11px] text-slate-200 placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none"
                  />
                </div>
                <span className="hidden rounded-md border border-white/[0.07] px-1.5 py-0.5 text-[9px] text-slate-500 xl:inline">
                  ⌘K
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="hidden items-center gap-1 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] px-2 py-1 text-[9px] text-emerald-300 sm:inline-flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  All systems normal
                </span>
                <Link href="/admin/reports" className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-slate-100" aria-label="Admin notifications">
                  <Bell className="h-3.5 w-3.5" />
                  {openReports > 0 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-400" />}
                </Link>
                <Badge variant="outline" className="border-white/10 text-[9px] text-slate-400">
                  {adminUser.role === "super_admin" ? "Super admin" : "Moderator"}
                </Badge>
              </div>
            </div>

            {/* mobile nav */}
            <div className="flex gap-1 overflow-x-auto border-t border-white/[0.05] px-2 py-1.5 lg:hidden">
              {nav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-md px-2 py-1.5 text-[9px] font-medium",
                    section === item.key ? "bg-emerald-400/10 text-emerald-200" : "text-slate-500",
                  )}
                >
                  <item.icon className="h-3 w-3" />
                  {item.en}
                </Link>
              ))}
            </div>
          </header>

          <main className="p-3 sm:p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                  GameXchange operations
                </p>
                <h1 className="mt-0.5 font-display text-xl font-bold tracking-tight text-white">
                  {ADMIN_NAV.find((item) => item.key === section)?.en}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-500">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Every action is written to the audit log
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

/** Shared compact KPI card for the admin console. */
export function AdminStat({
  icon: Icon,
  label,
  value,
  hint,
  tone = "emerald",
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  hint?: string;
  tone?: "emerald" | "cyan" | "amber" | "rose" | "violet";
}) {
  const tones = {
    emerald: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
    cyan: "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300",
    amber: "border-amber-400/20 bg-amber-400/[0.06] text-amber-300",
    rose: "border-rose-400/20 bg-rose-400/[0.06] text-rose-300",
    violet: "border-violet-400/20 bg-violet-400/[0.06] text-violet-300",
  };
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[9px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <span className={cn("grid h-7 w-7 place-items-center rounded-md border", tones[tone])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className="mt-1.5 font-display text-lg font-bold tabular-nums text-white">{value}</p>
      {hint && <p className="mt-0.5 text-[9px] text-slate-500">{hint}</p>}
    </div>
  );
}

/** Admin table shell keeps every section visually consistent. */
export function AdminPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/[0.07] px-3.5 py-2.5">
        <div>
          <h2 className="text-[11px] font-semibold text-slate-100">{title}</h2>
          {description && <p className="mt-0.5 text-[9px] text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
