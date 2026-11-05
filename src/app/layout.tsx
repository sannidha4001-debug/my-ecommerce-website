import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Hind_Siliguri, Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { AppStoreProvider } from "@/lib/store";
import { AppToaster } from "@/components/providers/app-toaster";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GameXchange — Trusted Game Account Escrow Marketplace in Bangladesh",
    template: "%s · GameXchange",
  },
  description:
    "Buy and sell Free Fire, eFootball, PUBG and other game accounts safely. GameXchange holds the payment in escrow until the deal is complete.",
  applicationName: "GameXchange",
  keywords: [
    "game account marketplace Bangladesh",
    "Free Fire account buy",
    "eFootball account",
    "PUBG account",
    "escrow marketplace",
    "bKash game account",
    "GameXchange",
  ],
  authors: [{ name: "GameXchange" }],
  creator: "GameXchange",
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: siteUrl,
    siteName: "GameXchange",
    title: "GameXchange — Trusted Game Account Escrow Marketplace",
    description:
      "Buy and sell game accounts safely in Bangladesh. Money held in escrow until the deal is done.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameXchange — Trade game accounts without the risk",
    description:
      "Bangladesh's trusted escrow marketplace for game accounts. Verified sellers, live auctions, real protection.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a1f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f5ff" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${hindSiliguri.variable}`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>
            <AppStoreProvider>
              <LoadingScreen />
              {children}
              <AppToaster />
            </AppStoreProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
