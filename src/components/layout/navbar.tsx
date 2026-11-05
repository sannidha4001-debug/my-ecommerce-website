"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Shield,
  X,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Magnetic } from "@/components/animations/magnetic";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/marketplace", key: "marketplace" as const },
  { href: "/marketplace?type=auction", key: "auctions" as const },
  { href: "/sell", key: "sell" as const },
  { href: "/how-it-works", key: "howItWorks" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function Navbar() {
  const { dict } = useI18n();
  const pathname = usePathname();
  const { user, signOut } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Solid glass after leaving the very top of the page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer when the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll + support Escape + move focus into the drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href.includes("?")) return false;
    if (href === "/marketplace") return pathname === "/marketplace";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-strong border-b border-white/10"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center gap-3">
        <Logo />

        {/* Desktop navigation */}
        <nav
          className="ml-3 hidden items-center gap-0.5 xl:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {dict.nav[link.key]}
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-lg border border-primary/20 bg-primary/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/marketplace"
            aria-label={dict.nav.search}
            className="hidden h-9 w-9 place-items-center rounded-lg border border-border bg-white/[0.04] text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:grid"
          >
            <Search className="h-4 w-4" />
          </Link>
          <LanguageToggle className="hidden sm:flex" />
          <ThemeToggle />
          <div className="hidden h-5 w-px bg-border lg:block" />

          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </Button>
              <Magnetic className="hidden lg:inline-flex">
                <Button asChild size="sm" className="pr-3">
                  <Link href="/sell">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Sell
                  </Link>
                </Button>
              </Magnetic>
              <Link
                href="/dashboard"
                aria-label="Open dashboard"
                title={user.name}
                className="hidden h-9 items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 pl-1 pr-2.5 text-[11px] font-semibold text-emerald-200 transition hover:bg-emerald-400/20 lg:flex"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-[10px] font-black text-[#04120f]">
                  {initials}
                </span>
                {user.name.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Sign out"
                title="Sign out"
                className="hidden h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition hover:border-rose-400/40 hover:text-rose-300 lg:grid"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href="/login">{dict.nav.signIn}</Link>
              </Button>
              <Magnetic className="hidden sm:inline-flex">
                <Button asChild size="sm" className="pr-4">
                  <Link href="/register">
                    {dict.nav.getStarted}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </Magnetic>
            </>
          )}

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/[0.04] text-foreground transition hover:border-primary/40 xl:hidden"
            aria-label={dict.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={dict.nav.openMenu}
              className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-[#0a0a1f]/95 p-6 backdrop-blur-2xl xl:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                  aria-label={dict.nav.closeMenu}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav
                className="mt-8 flex flex-col gap-1"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + index * 0.04, duration: 0.32 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "group flex items-center justify-between rounded-xl border border-transparent px-3 py-3 font-display text-base font-medium transition",
                        isActive(link.href)
                          ? "border-primary/20 bg-primary/10 text-white"
                          : "text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {dict.nav[link.key]}
                      <ArrowUpRight className="h-4 w-4 opacity-40 transition group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.32 }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-3 font-display text-base font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </span>
                      <ArrowUpRight className="h-4 w-4 opacity-40 transition group-hover:opacity-100" />
                    </Link>
                  </motion.div>
                )}
              </nav>

              <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                <LanguageToggle />
                <ThemeToggle />
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-[11px] font-black text-[#04120f]">
                        {initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-white">
                          {user.name}
                        </span>
                        <span className="block truncate text-[10px] text-emerald-200/70">
                          {user.email}
                        </span>
                      </span>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/sell" onClick={() => setMenuOpen(false)}>
                        <PlusCircle className="h-4 w-4" />
                        Sell an account
                      </Link>
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/login" onClick={() => setMenuOpen(false)}>
                        {dict.nav.signIn}
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/register" onClick={() => setMenuOpen(false)}>
                        {dict.nav.getStarted}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <Link
                href="/admin/login"
                className="mt-4 inline-flex items-center justify-center gap-1.5 text-[10px] text-slate-600 transition hover:text-slate-400"
              >
                <Shield className="h-3 w-3" />
                Admin console
              </Link>

              <p className="mt-auto pt-8 text-[11px] leading-relaxed text-slate-500">
                {dict.footer.disclaimer}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
