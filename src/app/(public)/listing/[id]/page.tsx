import type { Metadata } from "next";
import { ListingDetail } from "@/components/listing/listing-detail";
import { findListing } from "@/lib/account";
import { formatBDT } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = findListing(id);
  if (!listing) {
    return { title: "Listing not found" };
  }
  return {
    title: `${listing.title} — ${listing.game.name}`,
    description: `${listing.description.slice(0, 150)} Buy safely for ${formatBDT(
      listing.price,
    )} with GameXchange escrow.`,
    openGraph: {
      title: listing.title,
      description: `Escrow-protected ${listing.game.name} account · ${formatBDT(listing.price)}`,
    },
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  return <ListingDetail listingId={id} />;
}
