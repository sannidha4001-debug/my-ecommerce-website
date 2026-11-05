/**
 * TEMPORARY demo data for Phase 1.
 *
 * Phase 3 replaces these objects with real Supabase queries. The shapes are
 * intentionally close to the future database rows so components won't need a
 * big rewrite later.
 */

export type GameSlug =
  | "free-fire"
  | "efootball"
  | "pubg-mobile"
  | "valorant"
  | "clash-of-clans"
  | "cod-mobile"
  | "mobile-legends"
  | "genshin-impact";

export type Game = {
  slug: GameSlug;
  name: string;
  short: string;
  /** Tailwind gradient classes used by the generated cover art. */
  gradient: string;
  glow: string;
  listings: number;
};

export type Seller = {
  username: string;
  rating: number;
  deals: number;
  joined: string;
  verified: boolean;
};

export type Listing = {
  id: string;
  title: string;
  game: Game;
  price: number;
  originalPrice?: number;
  type: "fixed" | "auction";
  level: number;
  rank: string;
  platform: string;
  seller: Seller;
  tags: string[];
  description: string;
  bids: number;
  /** Auction length from "now", so the demo never expires. */
  endsInHours?: number;
  featured?: boolean;
  createdAt: string;
};

export const games: Game[] = [
  {
    slug: "free-fire",
    name: "Free Fire",
    short: "FF",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    glow: "rgba(249,115,22,0.35)",
    listings: 1840,
  },
  {
    slug: "efootball",
    name: "eFootball",
    short: "eFB",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    glow: "rgba(20,184,166,0.35)",
    listings: 1120,
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    short: "PUBG",
    gradient: "from-amber-400 via-orange-500 to-red-600",
    glow: "rgba(245,158,11,0.35)",
    listings: 960,
  },
  {
    slug: "valorant",
    name: "Valorant",
    short: "VAL",
    gradient: "from-rose-500 via-red-500 to-pink-600",
    glow: "rgba(244,63,94,0.35)",
    listings: 420,
  },
  {
    slug: "clash-of-clans",
    name: "Clash of Clans",
    short: "CoC",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    glow: "rgba(234,179,8,0.32)",
    listings: 310,
  },
  {
    slug: "cod-mobile",
    name: "Call of Duty: Mobile",
    short: "COD",
    gradient: "from-lime-400 via-emerald-500 to-teal-600",
    glow: "rgba(132,204,22,0.3)",
    listings: 280,
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    short: "MLBB",
    gradient: "from-sky-500 via-blue-600 to-indigo-600",
    glow: "rgba(14,165,233,0.32)",
    listings: 240,
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    short: "GI",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    glow: "rgba(168,85,247,0.34)",
    listings: 190,
  },
];

export function getGame(slug: GameSlug) {
  return games.find((game) => game.slug === slug) ?? games[0];
}

const sellers: Record<string, Seller> = {
  rafi: {
    username: "rafi_gamer",
    rating: 4.9,
    deals: 214,
    joined: "2024",
    verified: true,
  },
  nusrat: {
    username: "nusrat_ff",
    rating: 5.0,
    deals: 168,
    joined: "2023",
    verified: true,
  },
  ahnaf: {
    username: "ahnaf_x",
    rating: 4.8,
    deals: 97,
    joined: "2024",
    verified: true,
  },
  sadia: {
    username: "sadia_plays",
    rating: 4.9,
    deals: 141,
    joined: "2023",
    verified: true,
  },
  tanvir: {
    username: "tanvir_pro",
    rating: 4.7,
    deals: 63,
    joined: "2025",
    verified: true,
  },
  mehedi: {
    username: "mehedi_gg",
    rating: 4.6,
    deals: 38,
    joined: "2025",
    verified: false,
  },
};

export const listings: Listing[] = [
  {
    id: "gx-1001",
    title: "Grandmaster · 12 Mythic Skins · Full Email Access",
    game: getGame("free-fire"),
    price: 24500,
    originalPrice: 27000,
    type: "auction",
    level: 78,
    rank: "Grandmaster",
    platform: "Android · Asia",
    seller: sellers.rafi,
    tags: ["12 Mythic", "Full access", "Asia server"],
    description:
      "Seasoned Free Fire account with 12 mythic outfits, every elite pass since 2022 and a clean, full-access email. Rank reset available on request.",
    bids: 23,
    endsInHours: 2.4,
    featured: true,
    createdAt: "2 hours ago",
  },
  {
    id: "gx-1002",
    title: "Legendary Squad · 105 Rated Players · 45K Coins",
    game: getGame("efootball"),
    price: 18500,
    type: "auction",
    level: 62,
    rank: "Legendary",
    platform: "Mobile · Global",
    seller: sellers.nusrat,
    tags: ["105 OVR", "45K coins", "Epic squad"],
    description:
      "Stacked eFootball squad with 105-rated legends, deep bench and 45,000 coins for your own signings. Linked to a fresh email you control.",
    bids: 11,
    endsInHours: 6.5,
    featured: true,
    createdAt: "5 hours ago",
  },
  {
    id: "gx-1003",
    title: "Conqueror · Glacier M416 Lv.7 · Season 4 Badge",
    game: getGame("pubg-mobile"),
    price: 32000,
    originalPrice: 36000,
    type: "auction",
    level: 84,
    rank: "Conqueror",
    platform: "Android · Asia",
    seller: sellers.ahnaf,
    tags: ["Glacier Lv.7", "Season 4", "Conqueror"],
    description:
      "OG account with the Season 4 Conqueror badge and a level-7 Glacier M416. Includes several mythic outfits and a verified clean history.",
    bids: 34,
    endsInHours: 1.2,
    featured: true,
    createdAt: "8 hours ago",
  },
  {
    id: "gx-1004",
    title: "Immortal 3 · 28 Skins · Reaver Vandal",
    game: getGame("valorant"),
    price: 15000,
    type: "fixed",
    level: 210,
    rank: "Immortal 3",
    platform: "PC · Asia Pacific",
    seller: sellers.sadia,
    tags: ["Reaver Vandal", "28 skins", "APAC"],
    description:
      "Clean Immortal 3 Valorant account with 28 skins including Reaver Vandal, Prime Phantom and Elderflame Operator. Region-locked to APAC.",
    bids: 0,
    createdAt: "1 day ago",
  },
  {
    id: "gx-1005",
    title: "Town Hall 15 · Max Heroes · 6 Builders",
    game: getGame("clash-of-clans"),
    price: 28000,
    type: "fixed",
    level: 245,
    rank: "TH15",
    platform: "Supercell ID",
    seller: sellers.tanvir,
    tags: ["Max heroes", "6 builders", "High trophies"],
    description:
      "Nearly maxed TH15 with level 90 heroes, six builders and a strong war log. Supercell ID transfers with full email access.",
    bids: 0,
    createdAt: "2 days ago",
  },
  {
    id: "gx-1006",
    title: "Legendary Rank · 40 Mythic Weapons · Clean Account",
    game: getGame("cod-mobile"),
    price: 9200,
    type: "auction",
    level: 150,
    rank: "Legendary",
    platform: "Mobile · Garena",
    seller: sellers.mehedi,
    tags: ["40 mythic", "Legendary", "Clean"],
    description:
      "Legendary-rank CODM account with 40 mythic weapons, multiple legendary characters and a clean Garena login ready to rebind.",
    bids: 6,
    endsInHours: 18,
    createdAt: "10 hours ago",
  },
  {
    id: "gx-1007",
    title: "Rare Elite Pass Bundle · 2019–2023 · Collector's Pick",
    game: getGame("free-fire"),
    price: 6800,
    type: "fixed",
    level: 54,
    rank: "Heroic",
    platform: "Android · Global",
    seller: sellers.rafi,
    tags: ["Elite passes", "Collector", "Global"],
    description:
      "Collector's account with elite pass rewards from 2019 through 2023, rare emotes and a short, clean login history.",
    bids: 0,
    createdAt: "1 day ago",
  },
  {
    id: "gx-1008",
    title: "Epic Squad · 92 Rated · 20K Coins · Starter Ready",
    game: getGame("efootball"),
    price: 4500,
    type: "fixed",
    level: 31,
    rank: "Epic",
    platform: "Mobile · Global",
    seller: sellers.nusrat,
    tags: ["92 OVR", "20K coins", "Budget"],
    description:
      "Affordable eFootball starter with a balanced 92-rated squad, 20,000 coins and plenty of room to grow. Perfect first account.",
    bids: 0,
    createdAt: "3 days ago",
  },
  {
    id: "gx-1009",
    title: "Mythic Glory · 180 Skins · Collector Account",
    game: getGame("mobile-legends"),
    price: 12500,
    type: "fixed",
    level: 120,
    rank: "Mythic Glory",
    platform: "Moonton · Global",
    seller: sellers.sadia,
    tags: ["180 skins", "Mythic Glory", "Global"],
    description:
      "Mobile Legends collector account with 180 skins, all heroes unlocked and a Mythic Glory peak. Moonton account with changeable binding.",
    bids: 0,
    createdAt: "2 days ago",
  },
];

export const featuredAuctions = listings.filter(
  (listing) => listing.type === "auction",
);

export const trendingGames = games.slice(0, 6);

export const stats = [
  { value: 12480, decimals: 0, suffix: "+", labelKey: "deals" },
  { value: 3260, decimals: 0, suffix: "+", labelKey: "sellers" },
  { value: 4.2, decimals: 1, prefix: "৳", suffix: " Cr", labelKey: "protected" },
  { value: 4.9, decimals: 1, suffix: "/5", labelKey: "rating" },
] as const;

export const commissionConfig = {
  percent: 7,
  minimum: 50,
  examplePrice: 10000,
};

/** Four-step escrow explainer used on the home page. */
export const escrowStepIcons = ["mouse", "wallet", "message", "shield"] as const;

export const trustPoints = [
  { icon: "shield", titleKey: "trust1", fallback: "" },
  { icon: "badge", titleKey: "trust2", fallback: "" },
  { icon: "clock", titleKey: "trust3", fallback: "" },
] as const;
