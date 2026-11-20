import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://serphub.info"),
  title: {
    default: "SerpHub — Premium Domains for Your Next Move",
    template: "%s | SerpHub",
  },
  description:
    "Discover curated domains for businesses, brands and SEO projects. Explore domain metrics, compare listings and submit purchase requests with SerpHub.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon.png?v=2", type: "image/png", sizes: "64x64" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "SerpHub — Premium Domains for Your Next Move",
    description: "A curated marketplace for valuable digital assets.",
    url: "https://serphub.info",
    siteName: "SerpHub",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
