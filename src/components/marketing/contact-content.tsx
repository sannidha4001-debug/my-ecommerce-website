"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactContent() {
  const { dict, isBangla } = useI18n();
  const page = dict.pages.contact;
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "payment",
    message: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);

    // Phase 6 connects this form to a rate-limited server route/email service.
    window.setTimeout(() => {
      setSending(false);
      toast.success(page.success);
      setForm({ name: "", email: "", subject: "payment", message: "" });
    }, 900);
  }

  const contactCards = [
    { icon: Mail, label: page.email, value: page.emailValue, href: `mailto:${page.emailValue}` },
    { icon: Clock3, label: page.hours, value: page.hoursValue },
    { icon: MapPin, label: isBangla ? "অবস্থান" : "Location", value: "Dhaka, Bangladesh" },
    { icon: MessageCircle, label: page.response, value: page.responseValue },
  ];

  return (
    <div>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.contact}
      />

      <div className="container grid gap-6 pb-16 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Info column */}
        <div className="space-y-4">
          {contactCards.map((card, index) => (
            <Reveal key={card.label} delay={index * 0.05}>
              <div className="glass flex items-start gap-3 rounded-2xl p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <card.icon className="h-4 w-4 text-violet-300" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {card.label}
                  </p>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="mt-0.5 block truncate text-sm font-medium text-foreground transition hover:text-primary"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium text-foreground">{card.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {isBangla
                    ? "পেমেন্ট, TrxID বা KYC তথ্য কখনো পাবলিক চ্যাটে শেয়ার করবেন না। শুধুমাত্র অর্ডার পেজ বা এই ফর্মের মাধ্যমে পাঠান।"
                    : "Never share payment proofs, TrxIDs or KYC documents in public groups. Send them only through your order page or this form."}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="px-1 text-[11px] text-muted-foreground">
              {page.faqPrompt}{" "}
              <Link href="/#faq" className="inline-flex items-center gap-0.5 text-primary hover:underline">
                {page.faqLink}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="glass gradient-border rounded-2xl p-5 sm:p-7">
            <h2 className="font-display text-lg font-semibold">{page.formTitle}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {isBangla
                ? "সাধারণত এক কর্মদিবসের মধ্যে উত্তর দিই।"
                : "We usually reply within one business day."}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="contact-name">{page.name}</Label>
                <Input
                  id="contact-name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Rafiul Hasan"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">{page.emailField}</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contact-subject">{page.subject}</Label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={(event) => update("subject", event.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-white/[0.04] px-3.5 text-sm text-foreground outline-none transition focus-visible:border-primary/60"
                >
                  <option value="payment">{page.subjectOptions.payment}</option>
                  <option value="order">{page.subjectOptions.order}</option>
                  <option value="listing">{page.subjectOptions.listing}</option>
                  <option value="account">{page.subjectOptions.account}</option>
                  <option value="other">{page.subjectOptions.other}</option>
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="contact-message">{page.message}</Label>
                <Textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(event) => update("message", event.target.value)}
                  required
                  minLength={10}
                  placeholder={
                    isBangla
                      ? "অর্ডার নম্বর বা বিস্তারিত লিখুন…"
                      : "Include your order number and as much detail as possible…"
                  }
                />
              </div>
            </div>

            <Button type="submit" className="mt-5 w-full sm:w-auto" disabled={sending}>
              <Send className="h-4 w-4" />
              {sending ? page.sending : page.submit}
            </Button>

            <p className="mt-3 text-[9px] leading-relaxed text-muted-foreground/60">
              {isBangla
                ? "ডেমো ফর্ম: বার্তা ডেলিভারি ব্যাকএন্ড ধাপে যুক্ত হবে। জরুরি প্রয়োজনে সরাসরি ইমেইল করুন।"
                : "Demo form: message delivery is connected in the backend phase. For urgent help, email us directly."}
            </p>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
