import type { Metadata } from "next";
import { Playfair_Display, Titillium_Web } from "next/font/google";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/utils";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { Providers } from "@/components/providers/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  variable: "--font-titillium",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: siteUrl() }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl(),
    siteName: site.name,
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.role}`,
    description: site.description,
    images: [site.ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${titillium.variable} ${playfair.variable}`}>
      <body className="text-foreground antialiased">
        <JsonLd />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
