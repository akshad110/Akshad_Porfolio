import type { NextConfig } from "next";

function siteHosts() {
  const hosts = new Set<string>(["localhost:3000", "localhost:3001", "akshadvengurlekar.onrender.com"]);
  for (const value of [process.env.NEXT_PUBLIC_SITE_URL, process.env.AUTH_URL]) {
    if (!value) continue;
    try {
      hosts.add(new URL(value).host);
    } catch {
      // ignore invalid env URLs
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
      allowedOrigins: siteHosts(),
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  serverExternalPackages: ["mongoose", "sharp"],
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: "/api/legacy-uploads/:path*" }];
  },
};

export default nextConfig;
