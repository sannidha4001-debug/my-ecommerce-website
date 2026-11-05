import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";

/**
 * Minimal shell for authentication screens (Phase 2 adds the real forms).
 * Separate from the public navbar/footer so sign-in feels focused.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]" />

      <header className="relative z-10">
        <div className="container flex h-20 items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16 pt-4">
        {children}
      </main>

      <footer className="relative z-10 pb-6 text-center text-[10px] text-muted-foreground/60">
        © {new Date().getFullYear()} GameXchange · Escrow protected
      </footer>
    </div>
  );
}
