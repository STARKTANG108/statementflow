import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site.config";
import { seoPagesConfig } from "@/config/seoPages.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = "2026-10-31";

  const corePages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.siteUrl}/tools/qbo-viewer`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/tools/csv-to-qbo`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteConfig.siteUrl}/pricing`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.siteUrl}/security`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.siteUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.siteUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.siteUrl}/refund`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const converterRoutes: MetadataRoute.Sitemap = seoPagesConfig.map((p) => ({
    url: `${siteConfig.siteUrl}/convert/${p.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  return [...corePages, ...converterRoutes];
}
