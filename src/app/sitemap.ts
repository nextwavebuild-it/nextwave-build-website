import type { MetadataRoute } from "next";

import { blogPublic } from "@/lib/blog-public";
import { getCountryBodyText } from "@/lib/country-page-content";

const BASE_URL = "https://nextwavebuild.com";

// Refresh the sitemap every hour when supported
// by the Next.js deployment/cache configuration.
export const revalidate = 3600;

const BATCH_SIZE = 500;
const CATEGORY_BATCH_SIZE = 100;
const DESTINATION_BATCH_SIZE = 100;

// Automatic sitemap inclusion configuration.
const INCLUDE_COUNTRY_PAGES_IN_SITEMAP = true;
const INCLUDE_CITY_PAGES_IN_SITEMAP = true;

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  // 3. COLLECT PUBLISHED COUNTRY AND CITY PAGES
  // ==========================================

  const countryPages: MetadataRoute.Sitemap = [];
  const cityPages: MetadataRoute.Sitemap = [];

  const eligibleDestinationIds = new Set<string>([globalPage.id]);

  const enabledDestinationTypes: string[] = [];

  if (INCLUDE_COUNTRY_PAGES_IN_SITEMAP) {
    enabledDestinationTypes.push("COUNTRY");
  }

  if (INCLUDE_CITY_PAGES_IN_SITEMAP) {
    enabledDestinationTypes.push("CITY");
  }

  if (enabledDestinationTypes.length > 0) {
    for (let offset = 0; ; offset += BATCH_SIZE) {
      const { data: destinations, error } = await blogPublic
        .from("blog_pages")
        .select(
          "id,slug,page_type,heading,description,seo_title,seo_description,content,updated_at,blog_countries!inner(is_active)",
        )
        .in("page_type", enabledDestinationTypes)
        .eq("status", "PUBLISHED")
        .eq("blog_countries.is_active", true)
        .order("id", { ascending: true })
        .range(offset, offset + BATCH_SIZE - 1);

      if (error) {
        throw new Error(
          `Cannot generate destination sitemap: ${error.message}`,
        );
      }

      if (!destinations?.length) {
        break;
      }

      for (const destination of destinations) {
        // Exclude invalid URL slugs.
        if (!VALID_SLUG.test(destination.slug)) {
          continue;
        }

        // Validate landing-page content and SEO metadata.
        // These checks match the existing CMS publishing requirements.
        const validContent =
          (destination.heading?.trim().length ?? 0) >= 10 &&
          (destination.description?.trim().length ?? 0) >= 100 &&
          (destination.seo_title?.trim().length ?? 0) >= 10 &&
          (destination.seo_description?.trim().length ?? 0) >= 50 &&
          getCountryBodyText(destination.content).length >= 300;

        if (!validContent) {
          continue;
        }

        const entry: MetadataRoute.Sitemap[number] = {
          url: `${BASE_URL}/${destination.slug}`,

          ...(destination.updated_at
            ? {
                lastModified: new Date(destination.updated_at),
              }
            : {}),
        };

        // Include published country landing pages.
        if (
          destination.page_type === "COUNTRY" &&
          INCLUDE_COUNTRY_PAGES_IN_SITEMAP
        ) {
          countryPages.push(entry);
          eligibleDestinationIds.add(destination.id);
        }

        // Include published city landing pages.
        if (destination.page_type === "CITY" && INCLUDE_CITY_PAGES_IN_SITEMAP) {
          cityPages.push(entry);
          eligibleDestinationIds.add(destination.id);
        }
      }

      if (destinations.length < BATCH_SIZE) {
        break;
      }
    }
  }

  // ==========================================
  // 4. COLLECT PUBLISHED BLOG ARTICLES
  // ==========================================

  // Use a Map to prevent duplicate article URLs when
  // an article belongs to multiple destinations.
  const articlePages = new Map<string, MetadataRoute.Sitemap[number]>();

  // Categories must remain based on Global Blog articles.
  const publishedCategoryIds = new Set<string>();

  const destinationIds = Array.from(eligibleDestinationIds);

  const now = new Date().toISOString();

  // Process destination IDs in batches to avoid
  // excessively large Supabase query URLs.
  for (
    let destinationOffset = 0;
    destinationOffset < destinationIds.length;
    destinationOffset += DESTINATION_BATCH_SIZE
  ) {
    const ids = destinationIds.slice(
      destinationOffset,
      destinationOffset + DESTINATION_BATCH_SIZE,
    );

    for (let offset = 0; ; offset += BATCH_SIZE) {
      const { data: posts, error } = await blogPublic
        .from("blog_posts")
        .select("id,slug,updated_at,category_id,blog_post_pages!inner(page_id)")
        .eq("status", "PUBLISHED")
        .lte("published_at", now)
        .in("blog_post_pages.page_id", ids)
        .order("id", { ascending: true })
        .range(offset, offset + BATCH_SIZE - 1);

      if (error) {
        throw new Error(`Cannot generate blog sitemap: ${error.message}`);
      }

      if (!posts?.length) {
        break;
      }

      for (const post of posts) {
        // Exclude invalid article slugs.
        if (!VALID_SLUG.test(post.slug)) {
          continue;
        }

        // All articles retain one canonical URL,
        // regardless of their publishing destinations.
        const articleUrl = `${BASE_URL}/blog/${post.slug}`;

        articlePages.set(articleUrl, {
          url: articleUrl,

          ...(post.updated_at
            ? {
                lastModified: new Date(post.updated_at),
              }
            : {}),
        });

        // Preserve existing Global Blog category behaviour.
        const belongsToGlobalBlog =
          post.blog_post_pages?.some(
            (placement) => placement.page_id === globalPage.id,
          ) ?? false;

        if (belongsToGlobalBlog && post.category_id) {
          publishedCategoryIds.add(post.category_id);
        }
      }

      if (posts.length < BATCH_SIZE) {
        break;
      }
    }
  }

  // ==========================================
  // 5. COLLECT PUBLISHED BLOG CATEGORIES
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
      if (!VALID_SLUG.test(category.slug)) {
        continue;
      }

      categoryPages.push({
        url: `${BASE_URL}/blog/category/${category.slug}`,
      });
    }
  }

  // ==========================================
  // 6. SORT SITEMAP ENTRIES
  // ==========================================

  categoryPages.sort((a, b) => a.url.localeCompare(b.url));

  countryPages.sort((a, b) => a.url.localeCompare(b.url));

  cityPages.sort((a, b) => a.url.localeCompare(b.url));

  const sortedArticlePages = Array.from(articlePages.values()).sort((a, b) =>
    a.url.localeCompare(b.url),
  );

  // ==========================================
  // 7. RETURN COMPLETE SITEMAP
  // ==========================================

  const allPages = [
    ...staticPages,
    ...categoryPages,
    ...sortedArticlePages,
    ...countryPages,
    ...cityPages,
  ];

  // Final protection against duplicate URLs.
  return Array.from(new Map(allPages.map((page) => [page.url, page])).values());
}
