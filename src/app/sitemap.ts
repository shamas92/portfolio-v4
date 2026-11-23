import type { MetadataRoute } from "next";
import { projects, siteUrl } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-23");
  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${siteUrl}/work/${p.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
