"use client";

import { BadgeCheck, Quote, Star } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";

const AVATARS = [
  "from-orange-500 to-rose-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-fuchsia-500 to-purple-600",
];

export function Testimonials() {
  const { dict } = useI18n();
  const t = dict.home.testimonials;

  const testimonials = [
    { name: t.t1Name, role: t.t1Role, quote: t.t1Quote, initials: "RH" },
    { name: t.t2Name, role: t.t2Role, quote: t.t2Quote, initials: "NJ" },
    { name: t.t3Name, role: t.t3Role, quote: t.t3Quote, initials: "AC" },
    { name: t.t4Name, role: t.t4Role, quote: t.t4Quote, initials: "SI" },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-24" id="testimonials">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[110px]" />
      <div className="container">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
        />

        <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={testimonial.name} className="h-full">
              <figure className="glass group relative flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-glow sm:p-6">
                <Quote
                  className="absolute right-5 top-5 h-8 w-8 text-white/[0.06] transition-colors group-hover:text-violet-400/20"
                  aria-hidden
                />
                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star
                      key={star}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-[11px] font-bold text-white ${AVATARS[index]}`}
                  >
                    {testimonial.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 truncate text-xs font-semibold text-foreground">
                      {testimonial.name}
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-label={t.verifiedBuyer} />
                    </p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                  <Badge variant="success" className="hidden shrink-0 sm:inline-flex">
                    {t.dealCompleted}
                  </Badge>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
