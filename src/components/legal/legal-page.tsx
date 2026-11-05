"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Mail, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

type LegalKind = "terms" | "privacy" | "refunds";

const QUICK_LINKS: { kind: LegalKind; href: string; labelKey: "terms" | "privacy" | "refunds" }[] = [
  { kind: "terms", href: "/terms", labelKey: "terms" },
  { kind: "privacy", href: "/privacy", labelKey: "privacy" },
  { kind: "refunds", href: "/refund-policy", labelKey: "refunds" },
];

/** Shared renderer for Terms, Privacy and Refund policy documents. */
export function LegalPage({ kind }: { kind: LegalKind }) {
  const { dict, isBangla } = useI18n();
  const doc = dict.pages[kind];

  return (
    <div>
      <PageHero
        eyebrow={doc.eyebrow}
        title={doc.title}
        subtitle={doc.intro}
        homeLabel={dict.nav.home}
        currentLabel={doc.title}
      >
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-[10px] text-muted-foreground">
          <FileText className="h-3 w-3" aria-hidden />
          {doc.updated}
        </p>
      </PageHero>

      <div className="container grid gap-8 pb-16 lg:grid-cols-[240px_1fr] lg:gap-12">
        {/* Table of contents */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {isBangla ? "এই পেজে" : "On this page"}
            </p>
            <nav className="mt-3 space-y-1" aria-label="Document sections">
              {doc.sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index + 1}`}
                  className="block rounded-md px-2 py-1.5 text-[11px] leading-snug text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                >
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="mt-4 border-t border-border/60 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {dict.footer.legal}
              </p>
              <div className="mt-2 space-y-1">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-[11px] transition hover:bg-white/5 ${
                      link.kind === kind
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {dict.footer[link.labelKey]}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="glass mt-4 rounded-2xl p-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/10">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
            </span>
            <p className="mt-3 text-xs font-semibold">
              {isBangla ? "প্রশ্ন আছে?" : "Questions?"}
            </p>
            <a
              href="mailto:support@gamexchange.com.bd"
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
            >
              <Mail className="h-3 w-3" />
              support@gamexchange.com.bd
            </a>
          </div>
        </aside>

        {/* Document body */}
        <div className="min-w-0 space-y-4">
          <Reveal>
            <div className="gradient-border glass rounded-2xl p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-foreground/85">{doc.intro}</p>
            </div>
          </Reveal>

          {doc.sections.map((section, index) => (
            <Reveal key={section.title} delay={Math.min(index * 0.03, 0.2)}>
              <section
                id={`section-${index + 1}`}
                className="glass scroll-mt-28 rounded-2xl p-5 transition-colors hover:border-primary/20 sm:p-6"
              >
                <h2 className="font-display text-base font-semibold text-foreground sm:text-lg">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-xs leading-relaxed text-muted-foreground sm:text-[13px]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}

          <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] p-5">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {isBangla
                ? "নোট: এই নথিটি একটি যত্নসহকারে লেখা টেমপ্লেট, আইনি পরামর্শ নয়। প্ল্যাটফর্ম চালু করার আগে বাংলাদেশের একজন আইনজীবীর সাথে এটি যাচাই করে নিন।"
                : "Note: this document is a carefully written template, not legal advice. Have it reviewed by a qualified Bangladeshi lawyer before launch."}
            </p>
            <Button asChild variant="ghost" size="sm" className="mt-2 px-0 text-primary hover:bg-transparent">
              <Link href="/contact">
                {dict.footer.contact}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
