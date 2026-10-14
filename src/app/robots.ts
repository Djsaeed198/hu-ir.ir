import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hu-ir.ir";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/expert", "/dashboard", "/api/"] }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
