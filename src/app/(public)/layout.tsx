import { WarningBanner } from "@/components/layout/warning-banner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SkipLink } from "@/components/layout/skip-link";

/**
 * Public + user-facing shell.
 * The admin portal deliberately lives outside this route group and uses its
 * own layout, visual language and authentication.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SkipLink />
      <ScrollProgress />
      <WarningBanner />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
