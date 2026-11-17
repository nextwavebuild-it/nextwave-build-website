import type { MetadataRoute } from "next";

const BASE_URL = "https://nextwavebuild.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/programmes/technology-ai",
    "/programmes/ecommerce-dropshipping",
    "/programmes/freelancing-online-work",
  ];

  return pages.map((path) => ({
    url: `${BASE_URL}${path}`,
  }));
}
