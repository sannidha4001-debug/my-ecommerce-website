"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { z } from "zod";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailRule = z.string().trim().email();
const passwordRule = z
  .string()
  .min(8)
  .regex(/[0-9]/, "Password needs a number");

const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1),
});

const registerSchema = z
  .object({
    name: z.string().trim().min(2),
    email: emailRule,
    phone: z.string().trim().regex(/^(\+?880|0)1[3-9]\d{8}$/),
    password: passwordRule,
    confirm: z.string(),
    terms: z.literal(true),
    age: z.literal(true),
  })
  .refine((value) => value.password === value.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

type Errors = Record<string, string>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { isBangla } = useI18n();
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const { signIn, signUp } = useAppStore();

  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [nextPath, setNextPath] = useState("/dashboard");

  const t = (en: string, bn: string) => (isBangla ? bn : en);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) setNextPath(next);
  }, []);

  function fillDemo(kind: "buyer" | "seller") {
    const email =
      kind === "buyer" ? "buyer@gamexchange.demo" : "seller@gamexchange.demo";
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const passwordInput = document.getElementById("password") as HTMLInputElement | null;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = "demo1234";
    toast.info(t("Demo credentials filled", "ডেমো তথ্য বসানো হয়েছে"), {
      description: `${email} · demo1234`,
    });
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setErrors({});
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      setErrors({ email: t("Enter a valid email and password.", "সঠিক ইমেইল ও পাসওয়ার্ড দিন।") });
      return;
    }

    setBusy(true);
    const result = signIn(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (!result.ok) {
      setErrors({
        email: t(
          "Email or password is incorrect. Try the demo buttons below.",
          "ইমেইল বা পাসওয়ার্ড ভুল। নিচের ডেমো বাটন ব্যবহার করুন।",
        ),
      });
      return;
    }
    toast.success(t("Welcome back", "স্বাগতম"), {
      description: t("Your escrow dashboard is ready.", "আপনার এস্ক্রো ড্যাশবোর্ড প্রস্তুত।"),
    });
    router.push(nextPath);
    router.refresh();
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setErrors({});
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = registerSchema.safeParse({
      ...raw,
      terms: raw.terms === "on",
      age: raw.age === "on",
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setBusy(true);
    const result = signUp({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
    });
    setBusy(false);
    if (!result.ok) {
      setErrors({
        email: t("An account already exists with this email.", "এই ইমেইলে ইতিমধ্যে অ্যাকাউন্ট আছে।"),
      });
      return;
    }
    toast.success(t("Account created", "অ্যাকাউন্ট তৈরি হয়েছে"), {
      description: t(
        "Verify your phone to unlock bidding and selling.",
        "বিড ও বিক্রি শুরু করতে ফোন ভেরিফাই করুন।",
      ),
    });
    router.push(nextPath === "/dashboard" ? "/dashboard/verify" : nextPath);
    router.refresh();
  }

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="mt-1 text-[11px] text-rose-400">{errors[key]}</p>
    ) : null;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="gradient-border glass-strong w-full max-w-md rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-col items-center text-center">
        <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient-soft ring-1 ring-white/15">
          <LockKeyhole className="h-5 w-5 text-violet-200" aria-hidden />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
          {mode === "login"
            ? t("Sign in to your dashboard", "আপনার ড্যাশবোর্ডে লগ ইন করুন")
            : t("Create your GameXchange account", "আপনার GameXchange অ্যাকাউন্ট তৈরি করুন")}
        </h1>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
          {mode === "login"
            ? t(
                "Escrow orders, offers, support tickets and verification in one place.",
                "এস্ক্রো অর্ডার, অফার, সাপোর্ট টিকিট ও ভেরিফিকেশন এক জায়গায়।",
              )
            : t(
                "One member account buys and sells. Phone verification is required before listing or bidding.",
                "একটি মেম্বার অ্যাকাউন্টেই কেনা ও বিক্রি। লিস্টিং বা বিডের আগে ফোন ভেরিফিকেশন আবশ্যক।",
              )}
        </p>
      </div>

      <form
        onSubmit={mode === "login" ? handleLogin : handleRegister}
        noValidate
        className="mt-6 space-y-4"
      >
        {mode === "register" && (
          <>
            <div>
              <Label htmlFor="name">{t("Full name", "পুরো নাম")}</Label>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input id="name" name="name" autoComplete="name" placeholder="Rafi Hasan" className="pl-9" />
              </div>
              {fieldError("name")}
            </div>

            <div>
              <Label htmlFor="phone">{t("Phone number", "ফোন নম্বর")}</Label>
              <div className="relative mt-1.5">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+880 17 1100 0111"
                  className="pl-9"
                />
              </div>
              {fieldError("phone")}
            </div>
          </>
        )}

        <div>
          <Label htmlFor="email">{t("Email", "ইমেইল")}</Label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="pl-9"
              defaultValue={mode === "login" ? "" : undefined}
            />
          </div>
          {fieldError("email")}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("Password", "পাসওয়ার্ড")}</Label>
            {mode === "login" && (
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    t("Password reset", "পাসওয়ার্ড রিসেট"),
                    {
                      description: t(
                        "Demo mode: use one of the demo accounts below.",
                        "ডেমো মোড: নিচের ডেমো অ্যাকাউন্ট ব্যবহার করুন।",
                      ),
                    },
                  )
                }
                className="text-[11px] font-medium text-primary hover:underline"
              >
                {t("Forgot password?", "পাসওয়ার্ড ভুলে গেছেন?")}
              </button>
            )}
          </div>
          <div className="relative mt-1.5">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? t("Hide password", "পাসওয়ার্ড লুকান") : t("Show password", "পাসওয়ার্ড দেখান")}
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {fieldError("password")}
        </div>

        {mode === "register" && (
          <>
            <div>
              <Label htmlFor="confirm">{t("Confirm password", "পাসওয়ার্ড নিশ্চিত করুন")}</Label>
              <Input id="confirm" name="confirm" type="password" autoComplete="new-password" className="mt-1.5" />
              {fieldError("confirm")}
            </div>

            <div className="rounded-xl border border-violet-400/20 bg-violet-400/[0.06] px-3 py-2.5">
              <p className="text-[11px] font-semibold text-foreground">
                {t("One account · buy and sell", "একটি অ্যাকাউন্ট · কেনা ও বিক্রি")}
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                {t(
                  "There is no buyer/seller split. After phone verification you can buy with escrow, list accounts and bid in auctions from the same profile.",
                  "ক্রেতা/বিক্রেতা আলাদা নয়। ফোন ভেরিফাই করার পর একই প্রোফাইল থেকে এস্ক্রোতে কেনা, অ্যাকাউন্ট লিস্টিং ও নিলামে বিড—সব করতে পারবেন।",
                )}
              </p>
            </div>

            <div className="space-y-2 rounded-xl border border-border bg-white/[0.02] p-3">
              <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <input type="checkbox" name="terms" className="mt-0.5 h-3.5 w-3.5 accent-violet-500" />
                <span>
                  {t("I agree to the ", "আমি সম্মত ")}
                  <Link href="/terms" className="text-primary hover:underline">{t("Terms", "শর্তাবলি")}</Link>
                  {t(" and ", " ও ")}
                  <Link href="/privacy" className="text-primary hover:underline">{t("Privacy Policy", "গোপনীয়তা নীতি")}</Link>
                  {t(".", "।")}
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <input type="checkbox" name="age" className="mt-0.5 h-3.5 w-3.5 accent-violet-500" />
                <span>{t("I confirm I am 18 or older.", "আমি নিশ্চিত করছি আমার বয়স ১৮ বা তার বেশি।")}</span>
              </label>
              {(errors.terms || errors.age) && (
                <p className="text-[11px] text-rose-400">
                  {t("Please accept both confirmations.", "দুটি নিশ্চিতকরণেই টিক দিন।")}
                </p>
              )}
            </div>
          </>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden />
          )}
          {mode === "login"
            ? t("Sign in securely", "নিরাপদে লগ ইন করুন")
            : t("Create account", "অ্যাকাউন্ট তৈরি করুন")}
        </Button>
      </form>

      {mode === "login" && (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3">
          <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("Demo accounts", "ডেমো অ্যাকাউন্ট")}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("buyer")}
              className="rounded-lg border border-border px-2 py-2 text-[10px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {t("Member demo · Ayaan", "মেম্বার ডেমো · আয়ান")}
            </button>
            <button
              type="button"
              onClick={() => fillDemo("seller")}
              className="rounded-lg border border-border px-2 py-2 text-[10px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {t("Member demo · Rafi", "মেম্বার ডেমো · রাফি")}
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] text-muted-foreground/70">
            {t("Password for both: demo1234", "দুটিরই পাসওয়ার্ড: demo1234")}
          </p>
        </div>
      )}

      <p className="mt-5 text-center text-xs text-muted-foreground">
        {mode === "login" ? (
          <>
            {t("New here? ", "নতুন? ")}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              {t("Create an account", "অ্যাকাউন্ট তৈরি করুন")}
            </Link>
          </>
        ) : (
          <>
            {t("Already have an account? ", "আগেই অ্যাকাউন্ট আছে? ")}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              {t("Sign in", "লগ ইন")}
            </Link>
          </>
        )}
      </p>

      <div className="mt-4 flex items-center justify-center gap-3 text-[9px] text-muted-foreground/70">
        <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" />{t("Escrow protected", "এস্ক্রো সুরক্ষিত")}</span>
        <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3 w-3" />{t("RLS enforced", "RLS সক্রিয়")}</span>
      </div>

      <p className="mt-3 text-center text-[10px] text-muted-foreground">
        <Link href="/admin/login" className="text-muted-foreground/70 hover:text-primary">
          {t("Admin console →", "অ্যাডমিন কনসোল →")}
        </Link>
      </p>
    </motion.div>
  );
}
