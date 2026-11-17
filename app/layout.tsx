import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://serphub.info"),
  icons: {
    icon: [{ url: "/serphub-favicon-v1.png", type: "image/png", sizes: "48x48" }],
    shortcut: "/serphub-favicon-v1.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  title: {
    default: "SerpHub — Premium Domains for Your Next Move",
    template: "%s | SerpHub",
  },
  description:
    "Discover curated domains for businesses, brands and SEO projects. Explore domain metrics, compare listings and submit purchase requests with SerpHub.",
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
