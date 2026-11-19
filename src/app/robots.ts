import type { MetadataRoute } from "next";

const BASE_URL = "https://nextwavebuild.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/leads/", "/blog-admin", "/admin/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
