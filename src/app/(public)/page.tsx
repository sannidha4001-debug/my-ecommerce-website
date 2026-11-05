import { Hero } from "@/components/marketing/hero";
import { StatsBand } from "@/components/marketing/stats-band";
import { FeaturedAuctions } from "@/components/marketing/featured-auctions";
import { TrendingGames } from "@/components/marketing/trending-games";
import { EscrowSteps } from "@/components/marketing/escrow-steps";
import { Features } from "@/components/marketing/features";
import { Testimonials } from "@/components/marketing/testimonials";
import { FAQ } from "@/components/marketing/faq";
import { FinalCTA } from "@/components/marketing/final-cta";

/**
 * Public landing page.
 * Each section is its own client component so animation code stays isolated
 * and the page shell can remain a server component.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <FeaturedAuctions />
      <TrendingGames />
      <EscrowSteps />
      <Features />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
