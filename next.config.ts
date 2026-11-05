import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Supabase Storage is the future home of listing screenshots and KYC files.
    // Restricting remote hosts keeps next/image from loading arbitrary URLs.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  poweredByHeader: false,
};

export default nextConfig;
