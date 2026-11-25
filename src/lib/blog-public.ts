import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getCountryBodyText } from "@/lib/country-page-content";

const url = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_BLOG_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Blog Supabase configuration is missing.");
}

export const blogPublic = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  featured_image: string | null;
  featured_image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
  category_id: string | null;
};

// ==========================================
// DESTINATION CONTENT VALIDATION
// ==========================================

function hasValidDestinationContent(page: {
  heading: string | null;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  content: unknown;
}): boolean {
  return (
    (page.heading?.trim().length ?? 0) >= 10 &&
    (page.description?.trim().length ?? 0) >= 100 &&
    (page.seo_title?.trim().length ?? 0) >= 10 &&
    (page.seo_description?.trim().length ?? 0) >= 50 &&
    getCountryBodyText(page.content).length >= 300
  );
}

// ==========================================
// VERIFY PUBLIC ARTICLE DESTINATIONS
// ==========================================

async function hasPublicDestination(postId: string): Promise<boolean> {
  // Retrieve the article's visible publishing assignments.
  const { data: placements, error: placementError } = await blogPublic
    .from("blog_post_pages")
    .select("page_id")
    .eq("post_id", postId);

  if (placementError) {
    throw new Error("Unable to verify article publishing assignments.");
  }

  const pageIds = [
    ...new Set((placements ?? []).map((placement) => placement.page_id)),
  ];

  if (!pageIds.length) {
    return false;
  }

  // Only supported, published public destinations are eligible.
  const { data: pages, error: pageError } = await blogPublic
    .from("blog_pages")
    .select(
      "id,slug,page_type,country_id,heading,description,seo_title,seo_description,content",
    )
    .in("id", pageIds)
    .in("page_type", ["GLOBAL", "COUNTRY", "CITY"])
    .eq("status", "PUBLISHED");

  if (pageError) {
    throw new Error("Unable to verify article publishing destinations.");
  }

  if (!pages?.length) {
    return false;
  }

  // A published Global Blog assignment is sufficient.
  const hasGlobalDestination = pages.some(
    (page) => page.page_type === "GLOBAL",
  );

  if (hasGlobalDestination) {
    return true;
  }

  // Validate country and city landing pages.
  const geographicalPages = pages.filter(
    (page) =>
      ["COUNTRY", "CITY"].includes(page.page_type) &&
      Boolean(page.country_id) &&
      VALID_SLUG.test(page.slug) &&
      hasValidDestinationContent(page),
  );

  if (!geographicalPages.length) {
    return false;
  }

  // Retrieve unique parent countries.
  const countryIds = [
    ...new Set(
      geographicalPages
        .map((page) => page.country_id)
        .filter((id): id is string => typeof id === "string"),
    ),
  ];

  if (!countryIds.length) {
    return false;
  }

  // Country and city destinations require an active parent country.
  const { data: activeCountries, error: countryError } = await blogPublic
    .from("blog_countries")
    .select("id")
    .in("id", countryIds)
    .eq("is_active", true);

  if (countryError) {
    throw new Error("Unable to verify destination country status.");
  }

  const activeCountryIds = new Set(
    (activeCountries ?? []).map((country) => country.id),
  );

  // At least one eligible country or city is sufficient.
  return geographicalPages.some(
    (page) => Boolean(page.country_id) && activeCountryIds.has(page.country_id),
  );
}

// ==========================================
// GET INDIVIDUAL PUBLIC BLOG ARTICLE
// ==========================================

export async function getPublicBlogPost(slug: string) {
  if (!VALID_SLUG.test(slug)) {
    return null;
  }

  const { data: post, error } = await blogPublic
    .from("blog_posts")
    .select(
      "id,title,slug,excerpt,content,featured_image,featured_image_alt,seo_title,seo_description,published_at,updated_at,category_id",
    )
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load blog article.");
  }

  if (!post) {
    return null;
  }

  // Require at least one eligible public destination.
  const isPublic = await hasPublicDestination(post.id);

  if (!isPublic) {
    return null;
  }

  return post as PublicBlogPost;
}

// ==========================================
// GET GLOBAL BLOG ARTICLES
// ==========================================

export async function getGlobalBlogPosts(
  page = 1,
  pageSize = 9,
  categoryId?: string,
) {
  const { data: globalPage, error: pageError } = await blogPublic
    .from("blog_pages")
    .select("id")
    .eq("page_type", "GLOBAL")
    .eq("status", "PUBLISHED")
    .single();

  if (pageError || !globalPage) {
    throw new Error("Global Blog destination unavailable.");
  }

  const currentPage = Math.max(1, Math.floor(page));
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = blogPublic
    .from("blog_posts")
    .select(
      `id,title,slug,excerpt,featured_image,
       featured_image_alt,published_at,category_id,
       blog_post_pages!inner(page_id)`,
      { count: "exact" },
    )
    .eq("status", "PUBLISHED")
    .lte("published_at", new Date().toISOString())
    .eq("blog_post_pages.page_id", globalPage.id);

  // Optional category filtering.
  // Global Blog publication rules still apply.
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, count, error } = await query
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Unable to load blog articles: ${error.message}`);
  }

  return {
    posts: data ?? [],
    total: count ?? 0,
    page: currentPage,
    pageSize,
  };
}
