import "server-only";

import { createClient } from "@supabase/supabase-js";
import { validateCountryPagePublication } from "@/lib/country-page-content";

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
  return validateCountryPagePublication(page).valid;
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

// ==========================================
// GEOGRAPHIC PAGE PUBLIC CONTENT TYPES
// ==========================================

export type PublicBlogProgramme = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  image_url: string | null;
  image_alt: string | null;
  programme_url: string;
  price_minor: number | null;
  original_price_minor: number | null;
  currency: string;
  duration: string | null;
  learning_format: string | null;
  skill_level: string | null;
  features: unknown;
  learning_outcomes: unknown;
  cta_label: string;
  sort_order: number;
};

export type PublicBlogMentor = {
  id: string;
  name: string;
  slug: string;
  professional_title: string;
  biography: string;
  image_url: string | null;
  image_alt: string | null;
  programme_id: string | null;
  expertise: unknown;
  years_of_experience: number | null;
  sort_order: number;
};

export type PublicBlogTestimonial = {
  id: string;
  student_name: string;
  professional_title: string | null;
  testimonial: string;
  image_url: string | null;
  image_alt: string | null;
  rating: number | null;
  programme_id: string | null;
  page_id: string | null;
  sort_order: number;
};

export type PublicBlogSharedContent = {
  id: string;
  section_key: string;
  heading: string;
  description: string;
  content: unknown;
};

export type PublicRelatedLocation = {
  id: string;
  name: string;
  slug: string;
  page_type: "COUNTRY" | "CITY";
  country_id: string;
};

// ==========================================
// GET ACTIVE PUBLIC PROGRAMMES
// ==========================================

export async function getPublicBlogProgrammes(): Promise<
  PublicBlogProgramme[]
> {
  const { data, error } = await blogPublic
    .from("blog_programmes")
    .select(
      `
      id,
      name,
      slug,
      short_description,
      description,
      image_url,
      image_alt,
      programme_url,
      price_minor,
      original_price_minor,
      currency,
      duration,
      learning_format,
      skill_level,
      features,
      learning_outcomes,
      cta_label,
      sort_order
    `,
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load public programmes.");
  }

  return (data ?? []) as PublicBlogProgramme[];
}

// ==========================================
// GET ACTIVE PUBLIC MENTORS
// ==========================================

export async function getPublicBlogMentors(): Promise<PublicBlogMentor[]> {
  const { data, error } = await blogPublic
    .from("blog_mentors")
    .select(
      `
      id,
      name,
      slug,
      professional_title,
      biography,
      image_url,
      image_alt,
   
      programme_id,
      expertise,
      years_of_experience,
      sort_order
    `,
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load public mentor profiles.");
  }

  return (data ?? []) as PublicBlogMentor[];
}

// ==========================================
// GET APPROVED PUBLIC TESTIMONIALS
// ==========================================

export async function getPublicBlogTestimonials(
  pageId: string,
): Promise<PublicBlogTestimonial[]> {
  const { data, error } = await blogPublic.rpc("get_public_blog_testimonials", {
    p_page_id: pageId,
  });

  if (error) {
    console.error("Public testimonial RPC error:", error);

    throw new Error("Unable to load public testimonials.");
  }

  return (data ?? []) as PublicBlogTestimonial[];
}

// ==========================================
// GET ACTIVE SHARED CONTENT
// ==========================================

export async function getPublicBlogSharedContent(): Promise<
  Record<string, PublicBlogSharedContent>
> {
  const { data, error } = await blogPublic
    .from("blog_shared_content")
    .select(
      `
      id,
      section_key,
      heading,
      description,
      content
    `,
    )
    .eq("is_active", true);

  if (error) {
    throw new Error("Unable to load shared geographic content.");
  }

  const sections: Record<string, PublicBlogSharedContent> = Object.create(null);

  for (const section of data ?? []) {
    sections[section.section_key] = section;
  }

  return sections;
}

// ==========================================
// GET RELATED GEOGRAPHIC LOCATIONS
// ==========================================

export async function getPublicRelatedLocations(
  currentPageId: string,
  countryId: string,
): Promise<PublicRelatedLocation[]> {
  const { data, error } = await blogPublic
    .from("blog_pages")
    .select("id,name,slug,page_type,country_id")
    .in("page_type", ["COUNTRY", "CITY"])
    .eq("status", "PUBLISHED")
    .eq("country_id", countryId)
    .neq("id", currentPageId)
    .order("page_type", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load related locations.");
  }

  return (data ?? []).filter((page) =>
    VALID_SLUG.test(page.slug),
  ) as PublicRelatedLocation[];
}

// ==========================================
// GET COMPLETE GEOGRAPHIC PAGE RESOURCES
// ==========================================

export async function getPublicGeographicResources(
  pageId: string,
  countryId: string,
) {
  const [programmes, mentors, testimonials, sharedContent, relatedLocations] =
    await Promise.all([
      getPublicBlogProgrammes(),
      getPublicBlogMentors(),
      getPublicBlogTestimonials(pageId),
      getPublicBlogSharedContent(),
      getPublicRelatedLocations(pageId, countryId),
    ]);

  return {
    programmes,
    mentors,
    testimonials,
    sharedContent,
    relatedLocations,
  };
}
