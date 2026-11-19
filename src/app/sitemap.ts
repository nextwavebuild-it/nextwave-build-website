import type { MetadataRoute } from "next";

import { blogPublic } from "@/lib/blog-public";

const BASE_URL = "https://nextwavebuild.com";

// Refresh the sitemap every hour when supported
// by the Next.js deployment/cache configuration.
export const revalidate = 3600;

const BATCH_SIZE = 500;
const CATEGORY_BATCH_SIZE = 100;

// Country landing pages intentionally excluded
// from the sitemap, including /uae.
// Publishing a country page does not automatically
// make it appear in sitemap.xml.
const INCLUDE_COUNTRY_PAGES_IN_SITEMAP = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ==========================================
  // 1. STATIC WEBSITE PAGES
  // ==========================================

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
    },
    {
      url: `${BASE_URL}/programmes/technology-ai`,
    },
    {
      url: `${BASE_URL}/programmes/ecommerce-dropshipping`,
    },
    {
      url: `${BASE_URL}/programmes/freelancing-online-work`,
    },
    {
      url: `${BASE_URL}/blog`,
    },
  ];

  // ==========================================
  // 2. FIND THE PUBLISHED GLOBAL BLOG
  // ==========================================

  const { data: globalPage, error: pageError } = await blogPublic
    .from("blog_pages")
    .select("id")
    .eq("page_type", "GLOBAL")
    .eq("status", "PUBLISHED")
    .single();

  if (pageError || !globalPage) {
    throw new Error(
      "Cannot generate sitemap: Global Blog destination unavailable.",
    );
  }

  // ==========================================
  // 3. COLLECT PUBLISHED BLOG ARTICLES
  // ==========================================

  const articlePages: MetadataRoute.Sitemap = [];

  const publishedCategoryIds = new Set<string>();

  const now = new Date().toISOString();

  for (let offset = 0; ; offset += BATCH_SIZE) {
    const { data: posts, error } = await blogPublic
      .from("blog_posts")
      .select("id,slug,updated_at,category_id,blog_post_pages!inner(page_id)")
      .eq("status", "PUBLISHED")
      .lte("published_at", now)
      .eq("blog_post_pages.page_id", globalPage.id)
      .order("id", { ascending: true })
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      throw new Error(`Cannot generate blog sitemap: ${error.message}`);
    }

    if (!posts?.length) {
      break;
    }

    for (const post of posts) {
      articlePages.push({
        url: `${BASE_URL}/blog/${post.slug}`,

        ...(post.updated_at
          ? {
              lastModified: new Date(post.updated_at),
            }
          : {}),
      });

      if (post.category_id) {
        publishedCategoryIds.add(post.category_id);
      }
    }

    if (posts.length < BATCH_SIZE) {
      break;
    }
  }

  // ==========================================
  // 4. COLLECT PUBLISHED BLOG CATEGORIES
  // ==========================================

  const categoryPages: MetadataRoute.Sitemap = [];

  const categoryIds = Array.from(publishedCategoryIds);

  for (
    let offset = 0;
    offset < categoryIds.length;
    offset += CATEGORY_BATCH_SIZE
  ) {
    const ids = categoryIds.slice(offset, offset + CATEGORY_BATCH_SIZE);

    const { data: categories, error } = await blogPublic
      .from("blog_categories")
      .select("id,slug")
      .in("id", ids)
      .order("slug", { ascending: true });

    if (error) {
      throw new Error(`Cannot generate category sitemap: ${error.message}`);
    }

    for (const category of categories ?? []) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) {
        continue;
      }

      categoryPages.push({
        url: `${BASE_URL}/blog/category/${category.slug}`,
      });
    }
  }

  categoryPages.sort((a, b) => a.url.localeCompare(b.url));

  // ==========================================
  // 5. COUNTRY LANDING PAGES
  // ==========================================

  const countryPages: MetadataRoute.Sitemap = [];

  // Country sitemap inclusion is deliberately disabled.
  // UAE and all other country landing pages can be
  // published independently without being added here.
  //
  // When we decide to enable country sitemap entries,
  // we'll add a verified published-country query.
  if (INCLUDE_COUNTRY_PAGES_IN_SITEMAP) {
    // Intentionally reserved for future implementation.
  }

  // ==========================================
  // 6. RETURN COMPLETE SITEMAP
  // ==========================================

  return [...staticPages, ...categoryPages, ...articlePages, ...countryPages];
}
