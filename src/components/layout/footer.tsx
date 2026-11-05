"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const { dict } = useI18n();
  const [email, setEmail] = useState("");

  function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error(dict.footer.emailPlaceholder);
      return;
    }
    toast.success(dict.footer.subscribed);
    setEmail("");
  }

  const exploreLinks = [
    { href: "/marketplace", label: dict.nav.marketplace },
    { href: "/marketplace?type=auction", label: dict.nav.auctions },
    { href: "/sell", label: dict.nav.sell },
    { href: "/how-it-works", label: dict.footer.howItWorks },
    { href: "/#faq", label: dict.footer.faq },
  ];

  const companyLinks = [
    { href: "/about", label: dict.footer.about },
    { href: "/contact", label: dict.footer.contact },
    { href: "/how-it-works#safety", label: dict.footer.safety },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin/login", label: "Admin console" },
  ];

  const legalLinks = [
    { href: "/terms", label: dict.footer.terms },
    { href: "/privacy", label: dict.footer.privacy },
    { href: "/refund-policy", label: dict.footer.refunds },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60">
      {/* soft footer glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]" />

      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + newsletter */}
          <div className="space-y-6">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>

            <div className="max-w-sm space-y-2">
              <p className="font-display text-sm font-semibold text-foreground">
                {dict.footer.newsletterTitle}
              </p>
              <p className="text-xs text-muted-foreground">{dict.footer.newsletterSubtitle}</p>
              <form onSubmit={subscribe} className="mt-3 flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={dict.footer.emailPlaceholder}
                  aria-label={dict.footer.emailPlaceholder}
                  className="h-10 bg-white/[0.04]"
                  required
                />
                <Button type="submit" size="icon" className="h-10 w-10 shrink-0" aria-label={dict.footer.subscribe}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/[0.03] text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <FooterColumn title={dict.footer.explore} links={exploreLinks} />
          <FooterColumn title={dict.footer.company} links={companyLinks} />
          <FooterColumn title={dict.footer.legal} links={legalLinks} />
        </div>

        <Separator className="my-10" />

        {/* Payment + contact strip */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {dict.footer.paymentTitle}
            </span>
            <span className="rounded-md border border-pink-400/25 bg-pink-500/10 px-2.5 py-1 text-[11px] font-bold text-pink-300">
              {dict.footer.bKash}
            </span>
            <span className="rounded-md border border-orange-400/25 bg-orange-500/10 px-2.5 py-1 text-[11px] font-bold text-orange-300">
              {dict.footer.nagad}
            </span>
            <span className="rounded-md border border-sky-400/25 bg-sky-500/10 px-2.5 py-1 text-[11px] font-bold text-sky-300">
              {dict.footer.bank}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <a href="mailto:support@gamexchange.com.bd" className="inline-flex items-center gap-1.5 transition hover:text-foreground">
              <Mail className="h-3.5 w-3.5" />
              support@gamexchange.com.bd
            </a>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Dhaka, Bangladesh
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-300/80">
              <ShieldCheck className="h-3.5 w-3.5" />
              Escrow protected
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 max-w-4xl text-[11px] leading-relaxed text-muted-foreground/70">
          {dict.footer.disclaimer}
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-border/50 pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} GameXchange. {dict.footer.rights}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            {dict.footer.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" aria-hidden />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
