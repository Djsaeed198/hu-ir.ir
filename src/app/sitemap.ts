import type { MetadataRoute } from "next";
import { db } from "@/db";
import { articles, services } from "@/db/schema";
import { HUNGARY_PAGES, CITIES, LEGAL_PAGES } from "@/lib/upgrade-content";
import { articleImage, cityImage, serviceImage } from "@/lib/media";

export const dynamic = "force-dynamic";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hu-ir.ir";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: { r: string; p: number; f: "weekly" | "monthly" | "yearly" }[] = [
    { r: "", p: 1, f: "weekly" },
    { r: "/about", p: 0.7, f: "monthly" },
    { r: "/services", p: 0.9, f: "weekly" },
    { r: "/hungary", p: 0.9, f: "weekly" },
    { r: "/process", p: 0.8, f: "weekly" },
    { r: "/tools", p: 0.8, f: "weekly" },
    { r: "/assess", p: 0.9, f: "weekly" },
    { r: "/tools/calculator", p: 0.8, f: "monthly" },
    { r: "/tools/checklist", p: 0.8, f: "monthly" },
    { r: "/tools/comparison", p: 0.8, f: "monthly" },
    { r: "/tools/calendar", p: 0.7, f: "monthly" },
    { r: "/process/steps", p: 0.7, f: "monthly" },
    { r: "/process/documents", p: 0.7, f: "monthly" },
    { r: "/process/costs", p: 0.7, f: "monthly" },
    { r: "/process/timeline", p: 0.7, f: "monthly" },
    { r: "/process/faq", p: 0.7, f: "monthly" },
    { r: "/process/checklist", p: 0.7, f: "monthly" },
    { r: "/news", p: 0.8, f: "weekly" },
    { r: "/testimonials", p: 0.7, f: "monthly" },
    { r: "/contact", p: 0.8, f: "yearly" },
    { r: "/partnership", p: 0.6, f: "monthly" },
    { r: "/faq", p: 0.8, f: "monthly" },
    { r: "/track", p: 0.5, f: "yearly" },
    { r: "/mobile", p: 0.6, f: "monthly" },
  ];

  let serviceSlugs: string[] = [];
  let articleSlugs: string[] = [];
  try {
    const [svc, art] = await Promise.all([db.select({ slug: services.slug }).from(services), db.select({ slug: articles.slug }).from(articles)]);
    serviceSlugs = svc.map((s) => s.slug);
    articleSlugs = art.map((a) => a.slug);
  } catch {
    /* build without DB */
  }

  const urls: MetadataRoute.Sitemap = [
    ...staticRoutes.map((s) => ({ url: `${BASE}${s.r || "/"}`, lastModified: now, changeFrequency: s.f, priority: s.p })),
    ...HUNGARY_PAGES.map((p) => ({ url: `${BASE}/hungary/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...CITIES.map((c) => ({
      url: `${BASE}/hungary/cities/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
      images: [cityImage(c.slug).src],
    })),
    ...LEGAL_PAGES.map((p) => ({ url: `${BASE}/legal/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
    ...serviceSlugs.map((s) => ({
      url: `${BASE}/services/${s}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: [serviceImage(s).src],
    })),
    ...articleSlugs.map((s, i) => ({
      url: `${BASE}/news/${s}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: [articleImage(s, i).src],
    })),
  ];

  return urls;
}
