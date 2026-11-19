import "server-only";

import { createClient } from "@supabase/supabase-js";

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

export async function getPublicBlogPost(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
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

  if (error) throw new Error("Unable to load blog article.");
  if (!post) return null;

  // Require at least one published destination.
  // Draft country pages do not count as public destinations.
  const { data: placements, error: placementError } = await blogPublic
    .from("blog_post_pages")
    .select("page_id,blog_pages!inner(id)")
    .eq("post_id", post.id)
    .eq("blog_pages.status", "PUBLISHED")
    .limit(1);

  if (placementError) {
    throw new Error("Unable to verify article visibility.");
  }

  if (!placements?.length) return null;

  return post as PublicBlogPost;
}

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
