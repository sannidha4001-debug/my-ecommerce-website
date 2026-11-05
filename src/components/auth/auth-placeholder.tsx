"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  KeyRound,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CHECKLIST = {
  login: [
    { icon: Mail, en: "Email & password sign-in", bn: "ইমেইল ও পাসওয়ার্ড লগইন" },
    { icon: KeyRound, en: "Forgot / reset password", bn: "পাসওয়ার্ড ভুলে গেলে রিসেট" },
    { icon: ShieldCheck, en: "Google sign-in option", bn: "গুগল সাইন-ইন সুবিধা" },
    { icon: LockKeyhole, en: "Separate admin control room", bn: "আলাদা অ্যাডমিন কন্ট্রোল রুম" },
  ],
  register: [
    { icon: Phone, en: "Phone number required", bn: "ফোন নম্বর আবশ্যক" },
    { icon: BadgeCheck, en: "18+ confirmation", bn: "১৮+ নিশ্চিতকরণ" },
    { icon: Mail, en: "Email verification", bn: "ইমেইল ভেরিফিকেশন" },
    { icon: UserCheck, en: "KYC for verified sellers", bn: "ভেরিফাইড বিক্রেতার জন্য KYC" },
  ],
};

export function AuthPlaceholder({ mode }: { mode: "login" | "register" }) {
  const { dict, isBangla } = useI18n();
  const reduceMotion = useReducedMotion();
  const items = CHECKLIST[mode];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="gradient-border glass-strong w-full max-w-md rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient-soft ring-1 ring-white/15">
          <span className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-lg" aria-hidden />
          <LockKeyhole className="relative h-6 w-6 text-violet-200" aria-hidden />
          <span
            className="absolute -inset-2 -z-10 rounded-3xl border border-violet-400/20 animate-pulse-glow"
            aria-hidden
          />
        </span>

        <Badge variant="gradient" className="mt-5">
          {dict.authPlaceholder.badge}
        </Badge>

        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
          {mode === "login"
            ? isBangla
              ? "লগ ইন শিগগিরই আসছে"
              : "Sign-in is being secured"
            : isBangla
              ? "রেজিস্ট্রেশন শিগগিরই আসছে"
              : "Registration is being secured"}
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {dict.authPlaceholder.subtitle}
        </p>
      </div>

      <div className="mt-6 space-y-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
        {items.map((item) => (
          <div key={item.en} className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
              <item.icon className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
            </span>
            <p className="text-[11px] text-foreground/80">{isBangla ? item.bn : item.en}</p>
            <BadgeCheck className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-400/70" aria-hidden />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button asChild>
          <Link href="/register">
            {dict.nav.getStarted}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href="/">{dict.authPlaceholder.back}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/marketplace">{dict.authPlaceholder.explore}</Link>
          </Button>
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[9px] text-muted-foreground/60">
        <ShieldCheck className="h-3 w-3" aria-hidden />
        {isBangla
          ? "তথ্য RLS ও সার্ভার-সাইড যাচাই দিয়ে সুরক্ষিত"
          : "Protected with Row Level Security and server-side checks"}
      </p>
    </motion.div>
  );
}
