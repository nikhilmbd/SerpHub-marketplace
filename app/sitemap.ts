import type { MetadataRoute } from "next";

const SITE_URL = "https://serphub.info";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/link-building`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
