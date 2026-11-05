"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Copy,
  Download,
  Fingerprint,
  KeyRound,
  Landmark,
  LockKeyhole,
  Mail,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  UserCog,
  UserX,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPanel, AdminStat } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminAudit,
  adminReports,
  adminUsers,
  bidDepositFor,
  commissionFor,
  formatDateTime,
  timeAgo,
} from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { cn, formatBDT } from "@/lib/utils";

/* ==================================================================== */
/* Users                                                                */
/* ==================================================================== */

const RISK_TONE: Record<string, "success" | "warning" | "danger"> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

export function AdminUsers() {
  const { orders, adminUser } = useAppStore();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [kyc, setKyc] = useState<Record<string, string>>({});
  const [strikes, setStrikes] = useState<Record<string, number>>({});
  const [suspended, setSuspended] = useState<string[]>([]);

  const isSuper = adminUser?.role === "super_admin";

  const visible = useMemo(
    () =>
      adminUsers.filter((user) => {
        if (role !== "all" && user.role.toLowerCase() !== role) return false;
        return `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(query.toLowerCase());
      }),
    [query, role],
  );

  function verifyKyc(id: string, name: string) {
    if (!isSuper) {
      toast.error("Only a super admin can verify KYC.");
      return;
    }
    setKyc((current) => ({ ...current, [id]: "Verified" }));
    toast.success(`KYC verified · ${name}`);
  }

  function addStrike(id: string, name: string) {
    if (!isSuper) {
      toast.error("Only a super admin can issue strikes.");
      return;
    }
    setStrikes((current) => {
      const next = (current[id] ?? 0) + 1;
      if (next >= 3) {
        setSuspended((list) => [...new Set([...list, id])]);
        toast.error(`${name} suspended`, { description: "Three strikes reached." });
      } else {
        toast.warning(`Strike ${next}/3 issued · ${name}`);
      }
      return { ...current, [id]: next };
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or ID…"
            className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-8 pr-3 text-[10px] text-slate-200 placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {["all", "member"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              aria-pressed={role === option}
              className={cn(
                "rounded-md border px-2 py-1 text-[9px] capitalize",
                role === option
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-white/[0.07] text-slate-500",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <Badge variant="outline" className="border-white/10 text-[9px] text-slate-400">
          {isSuper ? "Super admin access" : "Moderator · read only"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <AdminStat icon={Users} label="Total users" value={String(adminUsers.length)} hint="Demo directory" tone="emerald" />
        <AdminStat icon={BadgeCheck} label="KYC verified" value={String(adminUsers.filter((user) => (kyc[user.id] ?? user.kyc) === "Verified").length)} hint="Can receive payouts" tone="cyan" />
        <AdminStat icon={ShieldAlert} label="High risk" value={String(adminUsers.filter((user) => user.risk === "High").length)} hint="Manual review" tone="rose" />
        <AdminStat icon={UserX} label="Suspended" value={String(suspended.length)} hint="Three-strike policy" tone="amber" />
      </div>

      <AdminPanel title={`Users (${visible.length})`} description="Verify identities, monitor risk and apply the three-strike policy.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-[8px] uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Role</th>
                <th className="px-3 py-2 font-medium">KYC</th>
                <th className="px-3 py-2 font-medium">Orders</th>
                <th className="px-3 py-2 font-medium">Risk</th>
                <th className="px-3 py-2 font-medium">Strikes</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visible.map((user) => {
                const kycStatus = kyc[user.id] ?? user.kyc;
                const strikeCount = strikes[user.id] ?? 0;
                const blocked = suspended.includes(user.id);
                return (
                  <tr key={user.id} className="text-[10px] text-slate-300 hover:bg-white/[0.02]">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400/30 to-cyan-500/30 text-[9px] font-bold text-emerald-200">
                          {user.name.slice(0, 2)}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1 truncate font-medium text-slate-200">
                            {user.name}
                            {blocked && <Badge variant="danger" className="px-1 py-0 text-[7px]">Suspended</Badge>}
                          </span>
                          <span className="block truncate text-[8px] text-slate-600">{user.email} · joined {user.joined}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="border-white/10 text-[8px] text-slate-400">{user.role}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={kycStatus === "Verified" ? "success" : kycStatus === "Pending" ? "warning" : "outline"} className="text-[8px]">
                        {kycStatus}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 tabular-nums text-slate-400">{user.orders}</td>
                    <td className="px-3 py-2">
                      <Badge variant={RISK_TONE[user.risk]} className="text-[8px]">{user.risk}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <span className={cn("font-semibold tabular-nums", strikeCount >= 2 ? "text-rose-300" : "text-slate-400")}>
                        {strikeCount}/3
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {kycStatus !== "Verified" && (
                          <button type="button" onClick={() => verifyKyc(user.id, user.name)} className="rounded border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] text-emerald-300 hover:bg-emerald-400/20">
                            Verify KYC
                          </button>
                        )}
                        <button type="button" onClick={() => addStrike(user.id, user.name)} className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-amber-300 hover:bg-amber-400/10">
                          Strike
                        </button>
                        <Link href={`/admin/orders?user=${user.id}`} className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-slate-400 hover:text-white">
                          Orders
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminPanel>

      <div className="grid gap-3 sm:grid-cols-3">
        <AdminPanel title="KYC queue" description="Documents waiting for a decision.">
          <div className="space-y-1.5 p-2.5">
            {adminUsers.filter((user) => (kyc[user.id] ?? user.kyc) !== "Verified").slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-2.5 py-2">
                <Fingerprint className="h-3.5 w-3.5 text-cyan-300" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] text-slate-200">{user.name}</span>
                  <span className="block text-[8px] text-slate-600">{user.kyc} · {user.orders} orders</span>
                </span>
                <button type="button" onClick={() => verifyKyc(user.id, user.name)} className="text-[8px] text-emerald-300 hover:underline">Review</button>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Order activity" description="Most recent marketplace orders.">
          <div className="space-y-1.5 p-2.5">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-2.5 py-2">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[10px] text-slate-200">{order.buyer} → {order.seller}</span>
                  <span className="block text-[8px] text-slate-600">{order.id} · {order.game}</span>
                </span>
                <span className="text-[9px] font-semibold text-white tabular-nums">{formatBDT(order.amount)}</span>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Super admin only" description="Sensitive actions stay behind a second gate.">
          <div className="space-y-1.5 p-2.5 text-[9px] text-slate-400">
            <p className="flex items-center gap-1.5"><LockKeyhole className="h-3 w-3 text-emerald-400" />KYC approvals and strikes require the super admin role.</p>
            <p className="flex items-center gap-1.5"><LockKeyhole className="h-3 w-3 text-emerald-400" />Every action is written to the append-only audit log.</p>
            <p className="flex items-center gap-1.5"><LockKeyhole className="h-3 w-3 text-emerald-400" />Three strikes automatically suspend an account.</p>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Reports                                                              */
/* ==================================================================== */

const REPORT_STATUSES = ["all", "Open", "Investigating", "Waiting on seller", "Resolved"];

export function AdminReports() {
  const { openThread, threads } = useAppStore();
  const [filter, setFilter] = useState("all");
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>("RPT-91");

  const visible = adminReports.filter((report) => {
    const status = statuses[report.id] ?? report.status;
    return filter === "all" || status === filter;
  });

  function setStatus(id: string, status: string) {
    setStatuses((current) => ({ ...current, [id]: status }));
    toast.success(`${id} · ${status}`);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <AdminStat icon={ShieldAlert} label="Open reports" value={String(adminReports.filter((report) => (statuses[report.id] ?? report.status) !== "Resolved").length)} hint="Across orders and users" tone="rose" />
        <AdminStat icon={AlertTriangle} label="High severity" value={String(adminReports.filter((report) => report.severity === "High").length)} hint="Review first" tone="amber" />
        <AdminStat icon={CheckCircle2} label="Resolved" value={String(adminReports.filter((report) => (statuses[report.id] ?? report.status) === "Resolved").length)} hint="Closed with a reason" tone="emerald" />
        <AdminStat icon={Activity} label="Support threads" value={String(threads.filter((thread) => thread.status === "open").length)} hint="Admin-mediated only" tone="cyan" />
      </div>

      <div className="flex flex-wrap gap-1">
        {REPORT_STATUSES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={cn(
              "rounded border px-2 py-1 text-[8px]",
              filter === option
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-white/[0.07] text-slate-500",
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((report) => {
          const status = statuses[report.id] ?? report.status;
          const open = expanded === report.id;
          return (
            <article key={report.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <button type="button" onClick={() => setExpanded(open ? null : report.id)} aria-expanded={open} className="w-full px-3 py-2.5 text-left">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-emerald-300">{report.id}</span>
                  <Badge variant={report.severity === "High" ? "danger" : "warning"} className="px-1.5 py-0 text-[7px]">{report.severity}</Badge>
                  <Badge variant={status === "Resolved" ? "success" : status === "Open" ? "warning" : "outline"} className="px-1.5 py-0 text-[7px]">{status}</Badge>
                  <span className="ml-auto text-[8px] text-slate-600">{timeAgo(report.at)}</span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-slate-200">{report.type}</p>
                <p className="text-[8px] text-slate-500">Target {report.target} · reported by {report.reporter}</p>
              </button>

              {open && (
                <div className="border-t border-white/[0.06] px-3 py-2.5">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="space-y-1.5 text-[9px] leading-relaxed text-slate-400">
                      <p className="flex items-start gap-1.5">
                        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                        Evidence is stored privately. Members can only submit it through an admin-mediated thread.
                      </p>
                      <p className="flex items-start gap-1.5">
                        <Copy className="mt-0.5 h-3 w-3 shrink-0 text-cyan-400" />
                        Any refund or release needs a written reason before the status changes.
                      </p>
                      <Link href={`/admin/orders`} className="inline-flex items-center gap-1 text-emerald-300 hover:underline">
                        Open orders & escrow <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="space-y-1.5">
                      <button type="button" onClick={() => setStatus(report.id, "Investigating")} className="w-full rounded-md bg-emerald-500 px-2 py-1.5 text-[9px] font-semibold text-[#04120f] hover:bg-emerald-400">
                        Start investigation
                      </button>
                      <button type="button" onClick={() => setStatus(report.id, "Resolved")} className="w-full rounded-md border border-white/10 px-2 py-1.5 text-[9px] text-slate-300 hover:bg-white/5">
                        Resolve with reason
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const id = openThread({
                            subject: `Report ${report.id} follow-up`,
                            topic: "other",
                            context: `${report.type} · target ${report.target}`,
                            message: `Admin follow-up for report ${report.id}.`,
                          });
                          toast.success("Support thread opened", { description: id });
                        }}
                        className="w-full rounded-md border border-white/10 px-2 py-1.5 text-[9px] text-slate-300 hover:bg-white/5"
                      >
                        Contact parties via thread
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Finance                                                              */
/* ==================================================================== */

const financeSeries = [12, 18, 14, 22, 19, 27, 31, 26, 35, 30, 38, 42];

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell).replace(/"/g, '""');
          return /[",\n]/.test(value) ? `"${value}"` : value;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${filename}`);
}

export function AdminFinance() {
  const { orders, settings } = useAppStore();
  const [tab, setTab] = useState<"revenue" | "payouts" | "refunds">("revenue");

  const gmv = orders.reduce((total, order) => total + order.amount, 0);
  const commission = orders.reduce(
    (total, order) => total + commissionFor(order.amount, settings).fee,
    0,
  );
  const payouts = orders
    .filter((order) => ["payment_confirmed", "delivered", "completed"].includes(order.status))
    .reduce((total, order) => total + order.payout, 0);
  const refunds = orders
    .filter((order) => order.status === "refunded" || order.status === "cancelled")
    .reduce((total, order) => total + order.amount, 0);
  const max = Math.max(...financeSeries);

  function exportOrders() {
    downloadCsv(`gamexchange-orders-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Order", "Listing", "Buyer", "Seller", "Amount", "Fee", "Payout", "Method", "Status", "Created"],
      ...orders.map((order) => [
        order.id,
        order.title,
        order.buyer,
        order.seller,
        order.amount,
        order.fee,
        order.payout,
        order.method,
        order.status,
        order.createdAt,
      ]),
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <AdminStat icon={CircleDollarSign} label="Gross volume" value={formatBDT(gmv)} hint="All demo orders" tone="emerald" />
        <AdminStat icon={Wallet} label="Commission earned" value={formatBDT(commission)} hint={`${settings.commissionRate}% · min ${formatBDT(settings.minFee)}`} tone="cyan" />
        <AdminStat icon={Landmark} label="Seller payouts" value={formatBDT(payouts)} hint="Queued + released" tone="violet" />
        <AdminStat icon={AlertTriangle} label="Refunded" value={formatBDT(refunds)} hint="Disputes and cancellations" tone="rose" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {(["revenue", "payouts", "refunds"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              aria-pressed={tab === option}
              className={cn(
                "rounded border px-2 py-1 text-[9px] capitalize",
                tab === option
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-white/[0.07] text-slate-500",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <Button size="sm" variant="secondary" className="h-8 border-white/10 bg-white/[0.04] text-[10px] text-slate-200" onClick={exportOrders}>
          <Download className="h-3 w-3" />
          Export CSV
        </Button>
      </div>

      {tab === "revenue" && (
        <AdminPanel title="Revenue" description={`Commission at ${settings.commissionRate}% with a ${formatBDT(settings.minFee)} floor.`}>
          <div className="p-3.5">
            <div className="flex h-40 items-end gap-1.5">
              {financeSeries.map((value, index) => (
                <div key={index} className="group flex flex-1 flex-col items-center gap-1">
                  <span className="text-[7px] text-slate-600 opacity-0 transition group-hover:opacity-100">
                    {(value / 10).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-emerald-500/40 to-cyan-400/80 transition-all duration-500 group-hover:from-emerald-400/60"
                    style={{ height: `${(value / max) * 100}%` }}
                  />
                  <span className="text-[7px] text-slate-600">{index + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-2 border-t border-white/[0.06] pt-2.5 text-[9px] sm:grid-cols-4">
              <p><span className="block text-slate-500">Platform commission</span><span className="mt-0.5 block text-sm font-bold text-emerald-300">{formatBDT(commission)}</span></p>
              <p><span className="block text-slate-500">Average order</span><span className="mt-0.5 block text-sm font-bold text-white">{formatBDT(Math.round(gmv / Math.max(1, orders.length)))}</span></p>
              <p><span className="block text-slate-500">Take rate</span><span className="mt-0.5 block text-sm font-bold text-white">{((commission / Math.max(1, gmv)) * 100).toFixed(1)}%</span></p>
              <p><span className="block text-slate-500">Payout ratio</span><span className="mt-0.5 block text-sm font-bold text-white">{((payouts / Math.max(1, gmv)) * 100).toFixed(1)}%</span></p>
            </div>
          </div>
        </AdminPanel>
      )}

      {tab === "payouts" && (
        <AdminPanel title="Payout queue" description="Completed inspections release the seller payout minus commission." action={<Badge variant="outline" className="border-white/10 text-[9px] text-slate-400">{orders.length} orders</Badge>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06] text-[8px] uppercase tracking-wider text-slate-500">
                  <th className="px-3 py-2 font-medium">Order</th>
                  <th className="px-3 py-2 font-medium">Seller</th>
                  <th className="px-3 py-2 font-medium">Buyer pays</th>
                  <th className="px-3 py-2 font-medium">Commission</th>
                  <th className="px-3 py-2 font-medium">Payout</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {orders.map((order) => {
                  const split = commissionFor(order.amount, settings);
                  return (
                    <tr key={order.id} className="text-[10px] text-slate-300 hover:bg-white/[0.02]">
                      <td className="px-3 py-2">
                        <span className="block font-semibold text-slate-200">{order.id}</span>
                        <span className="block text-[8px] text-slate-600">{order.game} · {order.method}</span>
                      </td>
                      <td className="px-3 py-2 text-[9px]">{order.seller}</td>
                      <td className="px-3 py-2 tabular-nums">{formatBDT(order.amount)}</td>
                      <td className="px-3 py-2 tabular-nums text-cyan-300">{formatBDT(split.fee)}</td>
                      <td className="px-3 py-2 font-semibold text-white tabular-nums">{formatBDT(split.payout)}</td>
                      <td className="px-3 py-2"><Badge variant={order.status === "completed" ? "success" : "outline"} className="text-[8px]">{order.status.replace(/_/g, " ")}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminPanel>
      )}

      {tab === "refunds" && (
        <AdminPanel title="Refunds & cancellations" description="Every refund needs a written reason in the audit log.">
          <div className="divide-y divide-white/[0.05]">
            {orders.filter((order) => order.status === "refunded" || order.status === "cancelled" || order.status === "disputed").map((order) => (
              <div key={order.id} className="flex flex-wrap items-center gap-2 px-3.5 py-2.5 text-[9px]">
                <span className="font-bold text-emerald-300">{order.id}</span>
                <span className="min-w-0 flex-1 truncate text-slate-300">{order.title}</span>
                <Badge variant={order.status === "disputed" ? "danger" : "outline"} className="text-[8px]">{order.status}</Badge>
                <span className="font-semibold text-white tabular-nums">{formatBDT(order.amount)}</span>
              </div>
            ))}
            {orders.every((order) => !["refunded", "cancelled", "disputed"].includes(order.status)) && (
              <p className="px-3.5 py-6 text-center text-[10px] text-slate-500">No refunds recorded.</p>
            )}
          </div>
        </AdminPanel>
      )}

      <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3 text-[9px] leading-relaxed text-slate-400">
        <strong className="text-emerald-300">Reconciliation:</strong> commission is {settings.commissionRate}% with a minimum of {formatBDT(settings.minFee)}. Buyer pays the listed price — never a hidden markup. CSV exports contain order totals, fee split and payout status only; no game credentials.
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Settings                                                             */
/* ==================================================================== */

export function AdminSettings() {
  const { settings, updateSettings, adminUser, deposit } = useAppStore();
  const [draft, setDraft] = useState(settings);
  const [twoFactor, setTwoFactor] = useState(adminUser?.twoFactor ?? false);
  const isSuper = adminUser?.role === "super_admin";

  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!isSuper) {
      toast.error("Only a super admin can change platform settings.");
      return;
    }
    if (!/^0\d{4}-?\d{6}$/.test(draft.bkashNumber.replace(/\s/g, ""))) {
      toast.error("Enter a valid bKash merchant number.");
      return;
    }
    if (!/^0\d{4}-?\d{6}$/.test(draft.nagadNumber.replace(/\s/g, ""))) {
      toast.error("Enter a valid Nagad merchant number.");
      return;
    }
    updateSettings(draft);
    toast.success("Settings saved", { description: "Checkout, escrow and auction rules updated." });
  }

  function seedDemoFunds() {
    deposit(25000);
    toast.success("Demo wallet credited", { description: "৳25,000 added to your user wallet." });
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <AdminPanel title="Payment instructions" description="Shown on every awaiting-payment order.">
          <div className="grid gap-3 p-3.5 sm:grid-cols-2">
            <div>
              <Label htmlFor="bkash" className="text-[10px] text-slate-300">bKash merchant</Label>
              <Input id="bkash" value={draft.bkashNumber} onChange={(event) => setDraft({ ...draft, bkashNumber: event.target.value })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div>
              <Label htmlFor="nagad" className="text-[10px] text-slate-300">Nagad merchant</Label>
              <Input id="nagad" value={draft.nagadNumber} onChange={(event) => setDraft({ ...draft, nagadNumber: event.target.value })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div>
              <Label htmlFor="support-phone" className="text-[10px] text-slate-300">Support hotline</Label>
              <Input id="support-phone" value={draft.supportPhone} onChange={(event) => setDraft({ ...draft, supportPhone: event.target.value })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div>
              <Label htmlFor="support-email" className="text-[10px] text-slate-300">Support email</Label>
              <Input id="support-email" type="email" value={draft.supportEmail} onChange={(event) => setDraft({ ...draft, supportEmail: event.target.value })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Fees" description="Applied to new orders only; existing orders keep their snapshot.">
          <div className="grid gap-3 p-3.5 sm:grid-cols-2">
            <div>
              <Label htmlFor="rate" className="text-[10px] text-slate-300">Commission rate (%)</Label>
              <Input id="rate" inputMode="decimal" value={draft.commissionRate} onChange={(event) => setDraft({ ...draft, commissionRate: Math.min(25, Number(event.target.value.replace(/[^\d.]/g, "")) || 0) })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div>
              <Label htmlFor="min-fee" className="text-[10px] text-slate-300">Minimum fee (৳)</Label>
              <Input id="min-fee" inputMode="numeric" value={draft.minFee} onChange={(event) => setDraft({ ...draft, minFee: Number(event.target.value.replace(/[^\d]/g, "")) || 0 })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div className="sm:col-span-2 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2 text-[9px] text-slate-400">
              Example: a ৳10,000 sale → commission {formatBDT(commissionFor(10000, draft).fee)}, seller receives {formatBDT(commissionFor(10000, draft).payout)}.
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Escrow & auctions" description="Inspection length, anti-sniping and the bid deposit bidders must pay before a bid is placed.">
          <div className="grid gap-3 p-3.5 sm:grid-cols-2">
            <div>
              <Label htmlFor="inspection" className="text-[10px] text-slate-300">Inspection window (hours)</Label>
              <Input id="inspection" inputMode="numeric" value={draft.inspectionHours} onChange={(event) => setDraft({ ...draft, inspectionHours: Number(event.target.value.replace(/[^\d]/g, "")) || 0 })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div>
              <Label htmlFor="anti-snipe" className="text-[10px] text-slate-300">Anti-snipe extension (minutes)</Label>
              <Input id="anti-snipe" inputMode="numeric" value={draft.antiSnipeMinutes} onChange={(event) => setDraft({ ...draft, antiSnipeMinutes: Number(event.target.value.replace(/[^\d]/g, "")) || 0 })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div>
              <Label htmlFor="bid-deposit-percent" className="text-[10px] text-slate-300">Bid deposit (%)</Label>
              <Input
                id="bid-deposit-percent"
                inputMode="decimal"
                value={draft.bidDepositPercent}
                onChange={(event) => setDraft({ ...draft, bidDepositPercent: Math.min(100, Number(event.target.value.replace(/[^\d.]/g, "")) || 0) })}
                className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs"
              />
            </div>
            <div>
              <Label htmlFor="deposit" className="text-[10px] text-slate-300">Legacy flat deposit (৳)</Label>
              <Input id="deposit" inputMode="numeric" value={draft.auctionDeposit} onChange={(event) => setDraft({ ...draft, auctionDeposit: Number(event.target.value.replace(/[^\d]/g, "")) || 0 })} className="mt-1.5 h-9 border-white/10 bg-white/[0.03] text-xs" />
            </div>
            <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-2.5 py-2 text-[9px] leading-relaxed text-slate-400 sm:col-span-2">
              Bidders send the deposit to the bKash/Nagad numbers above, then submit their sender number and TrxID. <span className="text-cyan-300">No bid reaches the auction until an admin confirms the transaction.</span> Example: a ৳20,000 bid at {draft.bidDepositPercent}% requires {formatBDT(bidDepositFor(20000, draft.bidDepositPercent))}.
            </div>
          </div>
        </AdminPanel>

        <AdminPanel title="Security" description="Admin-only policies. Production uses Supabase Auth + RLS.">
          <div className="space-y-2 p-3.5">
            {[
              {
                key: "totp" as const,
                label: "Require TOTP for admins",
                hint: "Authenticator app required after password",
                value: draft.requireTotp,
                onChange: (value: boolean) => setDraft({ ...draft, requireTotp: value }),
              },
              {
                key: "auto" as const,
                label: "Auto-approve new listings",
                hint: "Skip manual review (not recommended)",
                value: draft.autoApproveListings,
                onChange: (value: boolean) => setDraft({ ...draft, autoApproveListings: value }),
              },
              {
                key: "maintenance" as const,
                label: "Maintenance mode",
                hint: "Pause new orders and bids",
                value: draft.maintenanceMode,
                onChange: (value: boolean) => setDraft({ ...draft, maintenanceMode: value }),
              },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <div>
                  <p className="text-[10px] font-medium text-slate-200">{toggle.label}</p>
                  <p className="text-[8px] text-slate-600">{toggle.hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle.onChange(!toggle.value)}
                  aria-pressed={toggle.value}
                  className={cn("relative h-5 w-9 shrink-0 rounded-full transition", toggle.value ? "bg-emerald-500" : "bg-white/15")}
                >
                  <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition", toggle.value ? "left-[18px]" : "left-0.5")} />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
              <div>
                <p className="text-[10px] font-medium text-slate-200">Your TOTP</p>
                <p className="text-[8px] text-slate-600">{twoFactor ? "Enabled for this admin" : "Disabled for this demo session"}</p>
              </div>
              <button type="button" onClick={() => { setTwoFactor((value) => !value); toast.success(twoFactor ? "TOTP disabled (demo)" : "TOTP enabled (demo)"); }} className={cn("relative h-5 w-9 shrink-0 rounded-full transition", twoFactor ? "bg-emerald-500" : "bg-white/15")}>
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition", twoFactor ? "left-[18px]" : "left-0.5")} />
              </button>
            </div>
          </div>
        </AdminPanel>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
        <p className="flex items-center gap-1.5 text-[9px] text-slate-500">
          <ShieldCheck className="h-3 w-3 text-emerald-400" />
          Settings are validated and written to the audit log. {isSuper ? "You have super admin access." : "Moderator access is read-only."}
        </p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="secondary" className="h-8 border-white/10 bg-white/[0.04] text-[10px] text-slate-300" onClick={seedDemoFunds}>
            <Wallet className="h-3 w-3" />
            Credit demo wallet
          </Button>
          <Button type="submit" size="sm" className="h-8 bg-emerald-500 text-[10px] text-[#04120f] hover:bg-emerald-400">
            <Settings2 className="h-3 w-3" />
            Save settings
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ==================================================================== */
/* Audit log                                                            */
/* ==================================================================== */

export function AdminAudit() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");

  const visible = useMemo(
    () =>
      adminAudit.filter((entry) => {
        if (role !== "all" && entry.role !== role) return false;
        return `${entry.actor} ${entry.action} ${entry.target} ${entry.id}`.toLowerCase().includes(query.toLowerCase());
      }),
    [query, role],
  );

  function exportAudit() {
    downloadCsv(`gamexchange-audit-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["ID", "Actor", "Role", "Action", "Target", "IP", "Time"],
      ...adminAudit.map((entry) => [entry.id, entry.actor, entry.role, entry.action, entry.target, entry.ip, entry.at]),
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, action or target…" className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-8 pr-3 text-[10px] text-slate-200 placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {["all", "Super admin", "Moderator", "Automation"].map((option) => (
            <button key={option} type="button" onClick={() => setRole(option)} aria-pressed={role === option} className={cn("rounded-md border px-2 py-1 text-[9px]", role === option ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/[0.07] text-slate-500")}>
              {option}
            </button>
          ))}
        </div>
        <Button size="sm" variant="secondary" className="h-8 border-white/10 bg-white/[0.04] text-[10px] text-slate-200" onClick={exportAudit}>
          <Download className="h-3 w-3" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <AdminStat icon={Activity} label="Events" value={String(adminAudit.length)} hint="Append-only demo log" tone="emerald" />
        <AdminStat icon={UserCog} label="Super admin" value={String(adminAudit.filter((entry) => entry.role === "Super admin").length)} hint="Full access actions" tone="cyan" />
        <AdminStat icon={ShieldCheck} label="Moderator" value={String(adminAudit.filter((entry) => entry.role === "Moderator").length)} hint="Limited actions" tone="violet" />
        <AdminStat icon={TrendingUp} label="Automation" value={String(adminAudit.filter((entry) => entry.role === "Automation").length)} hint="System events" tone="amber" />
      </div>

      <AdminPanel title={`Audit log (${visible.length})`} description="Every sensitive action is recorded with actor, role, IP and time.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-[8px] uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">Event</th>
                <th className="px-3 py-2 font-medium">Actor</th>
                <th className="px-3 py-2 font-medium">Action</th>
                <th className="px-3 py-2 font-medium">Target</th>
                <th className="px-3 py-2 font-medium">IP</th>
                <th className="px-3 py-2 font-medium">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visible.map((entry) => (
                <tr key={entry.id} className="text-[10px] text-slate-300 hover:bg-white/[0.02]">
                  <td className="px-3 py-2 font-semibold text-emerald-300">{entry.id}</td>
                  <td className="px-3 py-2">
                    <span className="block text-slate-200">{entry.actor}</span>
                    <span className="block text-[8px] capitalize text-slate-600">{entry.role}</span>
                  </td>
                  <td className="max-w-[280px] px-3 py-2 text-[9px] text-slate-400">{entry.action}</td>
                  <td className="px-3 py-2 text-[9px]">{entry.target}</td>
                  <td className="px-3 py-2 font-mono text-[8px] text-slate-600">{entry.ip}</td>
                  <td className="px-3 py-2 text-[8px] text-slate-500">{formatDateTime(entry.at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && <p className="px-3.5 py-6 text-center text-[10px] text-slate-500">No events match this search.</p>}
      </AdminPanel>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[9px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><KeyRound className="h-3 w-3 text-emerald-400" />Append-only: no delete or edit endpoint exists.</span>
        <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3 text-cyan-400" />Critical events also email the super admin.</span>
        <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3 w-3 text-violet-400" />Admin sessions expire after inactivity.</span>
      </div>
    </div>
  );
}
