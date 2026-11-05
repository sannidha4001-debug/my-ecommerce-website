"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldAlert,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

/** Seconds remaining on an admin lockout, updated once a second. */
function useLockCountdown(until: number) {
  const [remaining, setRemaining] = useState(Math.max(0, until - Date.now()));
  useEffect(() => {
    if (!until) return;
    const tick = () => setRemaining(Math.max(0, until - Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [until]);
  return Math.ceil(remaining / 1000);
}

export function AdminLogin() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { adminSignIn, adminVerifyTotp, adminUser } = useAppStore();
  const [stage, setStage] = useState<"credentials" | "totp">("credentials");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [code, setCode] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);
  const lockedSeconds = useLockCountdown(lockedUntil);

  useEffect(() => {
    if (adminUser) router.replace("/admin");
  }, [adminUser, router]);

  useEffect(() => {
    if (stage === "totp") codeRef.current?.focus();
  }, [stage]);

  function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");

    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setError("Enter the admin email and password.");
      return;
    }

    setBusy(true);
    const result = adminSignIn(parsed.data.email, parsed.data.password);
    setBusy(false);

    if (!result.ok) {
      if (result.error === "locked" && result.lockedUntil) {
        setLockedUntil(result.lockedUntil);
        setError("Too many failed attempts. The console is temporarily locked.");
      } else {
        setAttempts((value) => value + 1);
        setError(`Invalid credentials. ${Math.max(0, 4 - attempts)} attempt(s) left before a lock.`);
      }
      return;
    }

    setEmail(parsed.data.email.trim().toLowerCase());

    if (result.needsTotp) {
      setStage("totp");
      toast.info("Password accepted", { description: "Enter your authenticator code to finish." });
      return;
    }

    toast.success("Admin session opened");
    router.push("/admin");
    router.refresh();
  }

  function submitTotp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit authenticator code.");
      return;
    }

    const result = adminVerifyTotp(code);
    if (!result.ok) {
      setError(
        result.error === "missing"
          ? "Your sign-in attempt expired. Please start again."
          : "Enter the 6-digit authenticator code.",
      );
      return;
    }

    toast.success("Two-factor verified", { description: "Welcome to the control room." });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-12">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px]" />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-white/[0.09] bg-[#0a0a1d]/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-black text-[#04120f]">
              GX
            </span>
            <div>
              <p className="font-display text-sm font-bold text-white">GameXchange Control Room</p>
              <p className="text-[9px] uppercase tracking-[0.18em] text-emerald-300/70">
                Separate admin access
              </p>
            </div>
          </div>

          {stage === "credentials" ? (
            <>
              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-400/20 bg-rose-400/[0.07] px-2 py-1 text-[9px] text-rose-300">
                  <ShieldAlert className="h-3 w-3" />
                  Restricted · admin credentials only
                </span>
                <h1 className="mt-3 font-display text-xl font-bold tracking-tight text-white">
                  Sign in to the admin console
                </h1>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  This portal is separate from the public marketplace. Five failed attempts lock
                  the console for five minutes.
                </p>
              </div>

              <form onSubmit={submitCredentials} className="mt-5 space-y-3.5" noValidate>
                <div>
                  <Label htmlFor="admin-email" className="text-[11px] text-slate-300">
                    Admin email
                  </Label>
                  <div className="relative mt-1.5">
                    <Fingerprint className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@gamexchange.com.bd"
                      className="h-10 border-white/10 bg-white/[0.03] pl-9 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="admin-password" className="text-[11px] text-slate-300">
                    Password
                  </Label>
                  <div className="relative mt-1.5">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-10 border-white/10 bg-white/[0.03] pl-9 pr-10 text-xs text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {(error || lockedSeconds > 0) && (
                  <p className="flex items-start gap-1.5 rounded-lg border border-rose-400/20 bg-rose-400/[0.06] px-2.5 py-2 text-[10px] leading-relaxed text-rose-300">
                    <LockKeyhole className="mt-0.5 h-3 w-3 shrink-0" />
                    {lockedSeconds > 0
                      ? `Console locked. Try again in ${Math.floor(lockedSeconds / 60)}:${String(
                          lockedSeconds % 60,
                        ).padStart(2, "0")}.`
                      : error}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={busy || lockedSeconds > 0}
                  className="h-10 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#04120f] hover:brightness-110"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Continue securely
                </Button>
              </form>

              <div className="mt-4 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-2.5">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Demo admin accounts
                </p>
                <div className="mt-1.5 space-y-1 font-mono text-[9px] text-slate-400">
                  <p>admin@gamexchange.com.bd · admin1234</p>
                  <p>mod@gamexchange.com.bd · admin1234</p>
                </div>
                <p className="mt-1 text-[8px] text-slate-600">
                  Super admin requires TOTP · any 6 digits work in demo mode.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mt-6">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/20 bg-emerald-400/[0.07] px-2 py-1 text-[9px] text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  Password accepted · {email}
                </span>
                <h1 className="mt-3 font-display text-xl font-bold tracking-tight text-white">
                  Two-factor verification
                </h1>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                  Open your authenticator app and enter the current 6-digit code. Demo mode accepts
                  any six digits.
                </p>
              </div>

              <form onSubmit={submitTotp} className="mt-5 space-y-3.5">
                <div>
                  <Label htmlFor="totp" className="text-[11px] text-slate-300">
                    Authenticator code
                  </Label>
                  <Input
                    ref={codeRef}
                    id="totp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"
                    className="mt-1.5 h-12 border-white/10 bg-white/[0.03] text-center text-lg tracking-[0.4em] text-white"
                    maxLength={6}
                  />
                  {error && <p className="mt-1.5 text-[10px] text-rose-300">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="h-10 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#04120f] hover:brightness-110"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Enter control room
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStage("credentials");
                    setCode("");
                    setError("");
                  }}
                  className="flex w-full items-center justify-center gap-1 text-[10px] text-slate-500 hover:text-slate-300"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Use a different account
                </button>
              </form>

              <p className="mt-4 flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-2 text-[9px] text-slate-500">
                <Timer className="h-3 w-3 shrink-0 text-cyan-400" />
                Sessions expire after inactivity. Every action is written to the audit log.
              </p>
            </>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[9px] text-slate-600">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-300">
              <ArrowLeft className="h-3 w-3" />
              Public site
            </Link>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              RLS · audit · lockout
            </span>
          </div>
        </div>

        <p className={cn("mt-3 text-center text-[9px] text-slate-600")}>
          Unauthorized access is prohibited. IP addresses are recorded.
        </p>
      </motion.div>
    </div>
  );
}
