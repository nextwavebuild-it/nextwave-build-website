"use server";

import { parseBlogDocument } from "@/lib/blog-admin/content";
import {
  parseCountryPageContentV3,
  validateCountryPagePublication,
  type CountryPageContentV3,
} from "@/lib/country-page-content";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

import { createBlogServerClient } from "@/lib/blog-supabase/server";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

// Reserved root-level website routes and public namespaces.
const RESERVED_DESTINATION_SLUGS = new Set([
  "global",
  "blog",
  "blog-admin",
  "programmes",
  "leads",
  "assets",
  "documents",
  "pages",
  "api",
  "admin",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "logo.png",
  "logo-color.png",
  "nextwavebuild_horizontal_ondark_1200px.png",
]);

function field(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function slugify(value: string) {
  return value

    .toLowerCase()

    .normalize("NFKD")

    .replace(/[\u0300-\u036f]/g, "")

    .replace(/[^a-z0-9]+/g, "-")

    .replace(/^-|-$/g, "");
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function revalidatePublishingDestinations(
  supabase: Awaited<ReturnType<typeof requireBlogAdmin>>["supabase"],
  pageIds: string[],
) {
  const uniqueIds = [...new Set(pageIds)];

  if (!uniqueIds.length) return;

  const { data: pages, error } = await supabase
    .from("blog_pages")
    .select("id,slug,page_type")
    .in("id", uniqueIds);

  if (error) {
    console.error(
      "Could not load destinations for revalidation:",
      error.message,
    );

    // Fallback: invalidate all country and city landing pages.
    revalidatePath("/[country]", "page");
    revalidatePath("/blog");
    return;
  }

  const paths = new Set<string>();

  for (const page of pages ?? []) {
    if (page.page_type === "GLOBAL") {
      paths.add("/blog");
      continue;
    }

    if (
      ["COUNTRY", "CITY"].includes(page.page_type) &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.slug)
    ) {
      paths.add(`/${page.slug}`);
    }
  }

  for (const publicPath of paths) {
    revalidatePath(publicPath);
  }
}

export async function blogLogin(form: FormData) {
  const email = field(form, "email");

  const password = String(form.get("password") ?? "");

  if (!email || !password)
    fail("/blog-admin/login", "Email and password are required");

  const supabase = await createBlogServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,

    password,
  });

  if (error || !data.user)
    fail("/blog-admin/login", "Invalid email or password");

  const { data: staff } = await supabase

    .from("blog_staff")

    .select("role,is_active")

    .eq("user_id", data.user.id)

    .single();

  if (!staff || staff.role !== "ADMIN" || !staff.is_active) {
    await supabase.auth.signOut();

    fail("/blog-admin/login", "This account is not authorized for Blog Admin");
  }

  redirect("/blog-admin/dashboard");
}

export async function blogLogout() {
  const supabase = await createBlogServerClient();

  await supabase.auth.signOut();

  redirect("/blog-admin/login");
}

export async function createBlogPost(form: FormData) {
  const { supabase, user } = await requireBlogAdmin();

  const path = "/blog-admin/posts/new";

  const title = field(form, "title");

  const slug = slugify(field(form, "slug") || title);

  const excerpt = field(form, "excerpt");

  const body = String(form.get("body") ?? "");

  const seoTitle = field(form, "seo_title");

  const seoDescription = field(form, "seo_description");

  const featuredImage = field(form, "featured_image");

  const featuredImageAlt = field(form, "featured_image_alt");

  const categoryId = field(form, "category_id") || null;

  const status = field(form, "status");

  const pageIds = [...new Set(form.getAll("page_ids").map(String))];

  if (title.length < 5 || title.length > 180 || !slug || slug.length > 180)
    fail(path, "Provide a title (5–180 characters) and valid slug");

  if (body.length < 50 || body.length > 150000)
    fail(path, "Article body must be between 50 and 150,000 characters");

  let richContent: ReturnType<typeof parseBlogDocument>;

  try {
    richContent = parseBlogDocument(body);
  } catch (error) {
    fail(
      path,

      error instanceof Error ? error.message : "Invalid article content",
    );
  }

  if (
    excerpt.length > 500 ||
    seoTitle.length > 180 ||
    seoDescription.length > 300
  )
    fail(path, "Excerpt or SEO field is too long");

  if (featuredImage) {
    let imageUrl: URL;

    try {
      imageUrl = new URL(featuredImage);
    } catch {
      fail(path, "Invalid featured image URL");
    }

    if (imageUrl.protocol !== "https:") {
      fail(path, "Featured image must use HTTPS");
    }
  }

  if (!["DRAFT", "PUBLISHED"].includes(status))
    fail(path, "Invalid publishing status");

  if (pageIds.length === 0) fail(path, "Select at least one publishing page");

  if (pageIds.length > 50 || pageIds.some((id) => !/^[0-9a-f-]{36}$/i.test(id)))
    fail(path, "Invalid publishing destinations");

  const { data: foundPages, error: pageError } = await supabase

    .from("blog_pages")

    .select("id")

    .in("id", pageIds);

  if (pageError || !foundPages || foundPages.length !== pageIds.length)
    fail(path, "One or more publishing destinations no longer exist");

  if (categoryId) {
    if (!validUUID(categoryId)) {
      fail(path, "Invalid category");
    }

    const { data: category, error: categoryError } = await supabase
      .from("blog_categories")
      .select("id")
      .eq("id", categoryId)
      .single();

    if (categoryError || !category) {
      fail(path, "Category not found");
    }
  }

  const { data: post, error } = await supabase

    .from("blog_posts")

    .insert({
      title,

      slug,

      excerpt: excerpt || null,

      content: richContent,

      category_id: categoryId,

      audience: "GLOBAL", // Historical field; placements are now source of truth.

      featured_image: featuredImage || null,

      featured_image_alt: featuredImageAlt || null,

      seo_title: seoTitle || null,

      seo_description: seoDescription || null,

      author_id: user.id,

      status,

      published_at: status === "PUBLISHED" ? new Date().toISOString() : null,
    })

    .select("id")

    .single();

  if (error || !post)
    fail(
      path,

      error?.code === "23505"
        ? "This article slug is already in use"
        : "Could not save article",
    );

  const { error: placementError } = await supabase

    .from("blog_post_pages")

    .insert(pageIds.map((page_id) => ({ post_id: post.id, page_id })));

  if (placementError) {
    // Compensating delete; use an atomic database RPC before high-volume production use.

    await supabase.from("blog_posts").delete().eq("id", post.id);

    fail(path, "Could not assign destinations; please retry");
  }

  revalidatePath("/blog-admin/dashboard");
  revalidatePath("/blog-admin/posts");
  revalidatePath("/blog-admin/posts/new");

  // Revalidate all selected publishing destinations.
  await revalidatePublishingDestinations(supabase, pageIds);

  // Revalidate global blog and article URL.
  revalidatePath("/blog");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  redirect("/blog-admin/dashboard?success=Article%20saved");
}

export async function createPublishingPage(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const path = "/blog-admin/pages";

  const name = field(form, "name");
  const slug = slugify(field(form, "slug") || name);
  const type = field(form, "page_type");

  const countryCode = field(form, "country_code").toUpperCase();
  const parentCountryId = field(form, "country_id");

  const heading = field(form, "heading");
  const description = field(form, "description");
  const seoTitle = field(form, "seo_title");
  const seoDescription = field(form, "seo_description");

  // 1. Validate destination name and slug.
  if (
    name.length < 2 ||
    name.length > 120 ||
    !slug ||
    slug.length > 100 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  ) {
    fail(path, "Enter a valid page name and slug");
  }

  if (RESERVED_DESTINATION_SLUGS.has(slug)) {
    fail(
      path,
      `The URL slug "${slug}" is reserved. Please choose another slug.`,
    );
  }

  // 2. Validate destination type.
  if (!["COUNTRY", "CITY", "CUSTOM"].includes(type)) {
    fail(path, "Invalid page type");
  }

  if (type === "COUNTRY" && !/^[A-Z]{2}$/.test(countryCode)) {
    fail(path, "Use a 2-letter ISO country code (AE, SA, QA...)");
  }

  if (type === "CITY" && !validUUID(parentCountryId)) {
    fail(path, "Select a valid parent country");
  }

  // 3. Validate content and SEO fields.
  if (
    heading.length > 180 ||
    seoTitle.length > 180 ||
    seoDescription.length > 300 ||
    description.length > 5000
  ) {
    fail(path, "One or more page fields are too long");
  }

  // 4. Check for duplicate destination slugs.
  const { data: existingPage, error: slugError } = await supabase
    .from("blog_pages")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (slugError) {
    fail(path, "Could not verify destination URL");
  }

  if (existingPage) {
    fail(path, "A destination with this URL slug already exists");
  }

  let countryId: string | null = null;
  let createdCountryId: string | null = null;

  // 5. COUNTRY destination.
  if (type === "COUNTRY") {
    const existing = await supabase
      .from("blog_countries")
      .select("id")
      .eq("country_code", countryCode)
      .maybeSingle();

    if (existing.error) {
      fail(path, "Could not check country");
    }

    if (existing.data) {
      countryId = existing.data.id;
    } else {
      const newCountry = await supabase
        .from("blog_countries")
        .insert({
          name,
          slug,
          country_code: countryCode,
          is_active: true,
        })
        .select("id")
        .single();

      if (newCountry.error || !newCountry.data) {
        fail(
          path,
          "Could not create country; check for an existing slug or country code",
        );
      }

      countryId = createdCountryId = newCountry.data.id;
    }
  }

  // 6. CITY destination.
  if (type === "CITY") {
    const { data: parentCountry, error: countryError } = await supabase
      .from("blog_countries")
      .select("id,name,country_code,is_active")
      .eq("id", parentCountryId)
      .eq("is_active", true)
      .maybeSingle();

    if (countryError) {
      fail(path, "Could not verify the selected parent country");
    }

    if (!parentCountry) {
      fail(path, "The selected parent country does not exist or is inactive");
    }

    // Reuse the existing country record.
    countryId = parentCountry.id;
  }

  // 7. CUSTOM destinations retain a NULL country ID.

  // 8. Create the destination as a draft.
  const { error } = await supabase.from("blog_pages").insert({
    name,
    slug,
    page_type: type,
    country_id: countryId,
    heading: heading || name,
    description: description || null,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    status: "DRAFT",
  });

  if (error) {
    if (createdCountryId) {
      await supabase.from("blog_countries").delete().eq("id", createdCountryId);
    }

    fail(
      path,
      error.code === "23505"
        ? "A destination with that slug or country already exists"
        : "Could not create publishing destination",
    );
  }

  // 9. Revalidate admin pages.
  revalidatePath("/blog-admin/pages");
  revalidatePath("/blog-admin/dashboard");
  revalidatePath("/blog-admin/posts/new");

  redirect("/blog-admin/pages?success=Destination%20created%20as%20draft");
}

type BlogPostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

const BLOG_STATUS: BlogPostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

function validUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function updateBlogPost(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    redirect("/blog-admin/posts?error=Invalid%20article");
  }

  const path = `/blog-admin/posts/${id}/edit`;

  const title = field(form, "title");

  const slug = slugify(field(form, "slug") || title);

  const excerpt = field(form, "excerpt");

  const body = String(form.get("body") ?? "");

  if (body.length < 50 || body.length > 150000) {
    fail(path, "Article body must contain 50–150,000 characters");
  }

  let richContent: ReturnType<typeof parseBlogDocument>;

  try {
    richContent = parseBlogDocument(body);
  } catch (error) {
    fail(
      path,

      error instanceof Error ? error.message : "Invalid article content",
    );
  }

  const categoryId = field(form, "category_id") || null;

  const status = field(form, "status") as BlogPostStatus;

  const seoTitle = field(form, "seo_title");

  const seoDescription = field(form, "seo_description");

  const featuredImage = field(form, "featured_image");

  const featuredImageAlt = field(form, "featured_image_alt");

  const pageIds = [...new Set(form.getAll("page_ids").map(String))];

  if (title.length < 5 || title.length > 180 || !slug || slug.length > 180) {
    fail(path, "Invalid article title or slug");
  }

  if (
    excerpt.length > 500 ||
    seoTitle.length > 180 ||
    seoDescription.length > 300
  ) {
    fail(path, "SEO fields or summary are too long");
  }

  if (!BLOG_STATUS.includes(status)) {
    fail(path, "Invalid publishing status");
  }

  if (
    !pageIds.length ||
    pageIds.length > 50 ||
    pageIds.some((pageId) => !validUUID(pageId))
  ) {
    fail(path, "Select valid publishing destinations");
  }

  if (featuredImage) {
    try {
      const url = new URL(featuredImage);

      if (url.protocol !== "https:") {
        fail(path, "Featured image must use HTTPS");
      }
    } catch {
      fail(path, "Invalid featured image URL");
    }
  }

  const { data: existing, error: existingError } = await supabase

    .from("blog_posts")

    .select("id,published_at,slug")

    .eq("id", id)

    .single();

  if (existingError || !existing) {
    fail(path, "Article not found");
  }

  const { data: validPages, error: pagesError } = await supabase

    .from("blog_pages")

    .select("id")

    .in("id", pageIds);

  if (pagesError || validPages?.length !== pageIds.length) {
    fail(path, "One or more publishing destinations are invalid");
  }

  if (categoryId) {
    if (!validUUID(categoryId)) {
      fail(path, "Invalid category");
    }

    const { data: category, error: categoryError } = await supabase

      .from("blog_categories")

      .select("id")

      .eq("id", categoryId)

      .single();

    if (categoryError || !category) {
      fail(path, "Category not found");
    }
  }

  // Preserve original publication date when republishing.

  const publishedAt =
    status === "PUBLISHED"
      ? (existing.published_at ?? new Date().toISOString())
      : existing.published_at;

  const { error: updateError } = await supabase

    .from("blog_posts")

    .update({
      title,

      slug,

      excerpt: excerpt || null,

      content: richContent,

      category_id: categoryId,

      featured_image: featuredImage || null,

      featured_image_alt: featuredImageAlt || null,

      seo_title: seoTitle || null,

      seo_description: seoDescription || null,

      status,

      published_at: publishedAt,

      updated_at: new Date().toISOString(),
    })

    .eq("id", id);

  if (updateError) {
    fail(
      path,

      updateError.code === "23505"
        ? "This article slug already exists"
        : "Could not update article",
    );
  }

  // Synchronize publishing destinations.

  const { data: currentPages, error: currentError } = await supabase

    .from("blog_post_pages")

    .select("page_id")

    .eq("post_id", id);

  if (currentError) {
    fail(path, "Article updated, but destinations could not be loaded");
  }

  const currentIds = (currentPages ?? []).map((item) => item.page_id);

  const toAdd = pageIds.filter((pageId) => !currentIds.includes(pageId));

  const toRemove = currentIds.filter((pageId) => !pageIds.includes(pageId));

  if (toAdd.length) {
    const { error: addError } = await supabase.from("blog_post_pages").insert(
      toAdd.map((pageId) => ({
        post_id: id,

        page_id: pageId,
      })),
    );

    if (addError) {
      fail(path, "Article updated, but new destinations could not be saved");
    }
  }

  if (toRemove.length) {
    const { error: removeError } = await supabase

      .from("blog_post_pages")

      .delete()

      .eq("post_id", id)

      .in("page_id", toRemove);

    if (removeError) {
      fail(path, "Article updated, but old destinations could not be removed");
    }
  }

  revalidatePath("/blog-admin/dashboard");
  revalidatePath("/blog-admin/posts");
  revalidatePath("/blog-admin/posts/new");
  revalidatePath(`/blog-admin/posts/${id}/edit`);

  // Include both previous and newly selected destinations.
  const affectedPageIds = [...new Set([...currentIds, ...pageIds])];

  await revalidatePublishingDestinations(supabase, affectedPageIds);

  // Refresh global blog, category pages and article URLs.
  revalidatePath("/blog");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  redirect(
    `/blog-admin/posts?success=${encodeURIComponent(
      "Article updated successfully",
    )}`,
  );
}

export async function changeBlogPostStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");
  const status = field(form, "status") as BlogPostStatus;

  if (!validUUID(id) || !BLOG_STATUS.includes(status)) {
    fail("/blog-admin/posts", "Invalid article or status");
  }

  // Retrieve article and destination assignments concurrently.
  const [postResult, assignmentsResult] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id,published_at,slug")
      .eq("id", id)
      .single(),

    supabase.from("blog_post_pages").select("page_id").eq("post_id", id),
  ]);

  const post = postResult.data;

  if (postResult.error || !post) {
    fail("/blog-admin/posts", "Article not found");
  }

  if (assignmentsResult.error) {
    fail("/blog-admin/posts", "Could not load article publishing destinations");
  }

  const assignedPageIds = [
    ...new Set((assignmentsResult.data ?? []).map((item) => item.page_id)),
  ];

  if (status === "PUBLISHED" && !assignedPageIds.length) {
    fail(
      "/blog-admin/posts",
      "Select at least one publishing destination before publishing",
    );
  }

  // Update article status and preserve original publication date.
  const { error } = await supabase
    .from("blog_posts")
    .update({
      status,

      published_at:
        status === "PUBLISHED"
          ? (post.published_at ?? new Date().toISOString())
          : post.published_at,

      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    fail("/blog-admin/posts", "Could not change article status");
  }

  // Refresh admin pages.
  revalidatePath("/blog-admin/dashboard");
  revalidatePath("/blog-admin/posts");
  revalidatePath(`/blog-admin/posts/${id}/edit`);

  // Refresh all assigned country and city destinations.
  await revalidatePublishingDestinations(supabase, assignedPageIds);

  // Refresh global blog, categories, article and sitemap.
  revalidatePath("/blog");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/sitemap.xml");

  redirect(
    `/blog-admin/posts?success=${encodeURIComponent(
      `Article status changed to ${status.toLowerCase()}`,
    )}`,
  );
}

// ==================== Country landing-page management ====================

type GeoTextField = {
  key: keyof CountryPageContentV3;
  max: number;
};

const GEO_TEXT_FIELDS: GeoTextField[] = [
  { key: "heroEyebrow", max: 120 },
  { key: "introTitle", max: 180 },
  { key: "insightsTitle", max: 180 },
  { key: "programmesTitle", max: 180 },
  { key: "programmesDescription", max: 1000 },
  { key: "resourcesTitle", max: 180 },
  { key: "ctaTitle", max: 180 },
  { key: "ctaDescription", max: 1000 },
  { key: "ctaButtonText", max: 60 },

  { key: "heroImageUrl", max: 2000 },
  { key: "heroImageAlt", max: 180 },
  { key: "heroPrimaryCtaText", max: 60 },
  { key: "heroSecondaryCtaText", max: 60 },

  { key: "trustTitle", max: 180 },
  { key: "trustDescription", max: 1000 },
  { key: "comparisonTitle", max: 180 },
  { key: "comparisonDescription", max: 1000 },
  { key: "audienceTitle", max: 180 },
  { key: "audienceDescription", max: 1000 },
  { key: "whyNextWaveTitle", max: 180 },
  { key: "whyNextWaveDescription", max: 1000 },
  { key: "learningMethodTitle", max: 180 },
  { key: "learningMethodDescription", max: 1000 },
  { key: "mentorsTitle", max: 180 },
  { key: "mentorsDescription", max: 1000 },
  { key: "testimonialsTitle", max: 180 },
  { key: "testimonialsDescription", max: 1000 },
  { key: "enrollmentTitle", max: 180 },
  { key: "enrollmentDescription", max: 1000 },
  { key: "relatedLocationsTitle", max: 180 },
  { key: "relatedLocationsDescription", max: 1000 },
  { key: "faqTitle", max: 180 },
  { key: "faqDescription", max: 1000 },
];

function readGeoItems(form: FormData, key: string, path: string) {
  const titles = form.getAll(`${key}_title`).map(String);
  const descriptions = form.getAll(`${key}_description`).map(String);

  if (titles.length !== descriptions.length || titles.length > 30) {
    fail(path, `Invalid items in ${key}`);
  }

  const items: {
    title: string;
    description: string;
  }[] = [];

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i].trim();
    const description = descriptions[i].trim();

    if (!title && !description) continue;

    if (
      !title ||
      !description ||
      title.length > 180 ||
      description.length > 2000
    ) {
      fail(path, `Invalid or incomplete item in ${key}`);
    }

    items.push({ title, description });
  }

  return items;
}

function refreshGeographicPage(id: string, slug: string) {
  revalidatePath(`/blog-admin/pages/${id}/edit`);
  revalidatePath("/blog-admin/pages");
  revalidatePath("/blog-admin/dashboard");
  revalidatePath(`/${slug}`);
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

// ==========================================
// SAVE PRIVATE GEOGRAPHIC DRAFT
// ==========================================

export async function saveCountryLandingPage(form: FormData) {
  const { supabase, user } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail("/blog-admin/pages", "Invalid destination page");
  }

  const path = `/blog-admin/pages/${id}/edit`;

  const expectedPageVersion = field(form, "base_updated_at");

  const expectedDraftVersion = field(form, "draft_updated_at");

  const [pageResult, draftResult] = await Promise.all([
    supabase
      .from("blog_pages")
      .select("id,slug,page_type,content,updated_at")
      .eq("id", id)
      .in("page_type", ["COUNTRY", "CITY"])
      .single(),

    supabase
      .from("blog_page_drafts")
      .select("*")
      .eq("page_id", id)
      .maybeSingle(),
  ]);

  const page = pageResult.data;
  const draft = draftResult.data;

  if (pageResult.error || !page || draftResult.error) {
    fail(path, "Could not load geographic page");
  }

  if (page.updated_at !== expectedPageVersion) {
    fail(path, "The live page has changed. Reload the editor.");
  }

  if (draft && draft.base_updated_at !== page.updated_at) {
    fail(
      path,
      "The live page has changed since this draft was created. Discard the outdated draft before editing again.",
    );
  }

  if ((draft?.updated_at ?? "") !== expectedDraftVersion) {
    fail(
      path,
      "Another administrator changed this draft. Reload before saving.",
    );
  }

  const heading = field(form, "heading");
  const description = field(form, "description");
  const seoTitle = field(form, "seo_title");
  const seoDescription = field(form, "seo_description");
  const contentText = field(form, "country_content");

  if (
    heading.length > 180 ||
    description.length > 5000 ||
    seoTitle.length > 180 ||
    seoDescription.length > 300 ||
    contentText.length > 15000
  ) {
    fail(path, "One or more fields are too long");
  }

  const content = parseCountryPageContentV3(draft?.content ?? page.content);

  const textFields: Record<string, string> = {};

  for (const { key, max } of GEO_TEXT_FIELDS) {
    const value = field(form, key);

    if (value.length > max) {
      fail(path, `${key} exceeds ${max} characters`);
    }

    textFields[key] = value;
  }

  const imageUrl = textFields.heroImageUrl;

  if (imageUrl) {
    let validImage = false;

    if (
      imageUrl.startsWith("/") &&
      !imageUrl.startsWith("//") &&
      !imageUrl.includes("\\")
    ) {
      validImage = true;
    } else {
      try {
        validImage = new URL(imageUrl).protocol === "https:";
      } catch {
        validImage = false;
      }
    }

    if (!validImage) {
      fail(path, "Use a valid HTTPS or local hero image URL");
    }
  }

  const sections = { ...content.sections };

  for (const key of Object.keys(sections) as (keyof typeof sections)[]) {
    sections[key] = form.get(`section_${key}`) === "on";
  }

  const updatedContent: CountryPageContentV3 = {
    ...content,
    ...textFields,

    format: "country_page_v3",
    text: contentText,

    sections,

    trustBenefits: readGeoItems(form, "trustBenefits", path),

    audienceItems: readGeoItems(form, "audienceItems", path),

    whyNextWaveItems: readGeoItems(form, "whyNextWaveItems", path),

    enrollmentSteps: readGeoItems(form, "enrollmentSteps", path),

    faqs: readGeoItems(form, "faqs", path).map((item) => ({
      question: item.title,
      answer: item.description,
    })),
  };

  const values = {
    page_id: id,
    heading,
    description,
    seo_title: seoTitle,
    seo_description: seoDescription,
    content: updatedContent,
    base_updated_at: page.updated_at,
    updated_by: user.id,
  };

  if (draft) {
    const { data, error } = await supabase
      .from("blog_page_drafts")
      .update(values)
      .eq("page_id", id)
      .eq("updated_at", expectedDraftVersion)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      fail(path, "Draft changed or could not be saved");
    }
  } else {
    const { error } = await supabase.from("blog_page_drafts").insert(values);

    if (error) {
      fail(path, "Could not create draft. Reload and retry.");
    }
  }

  // Only refresh admin pages; live content is unchanged.

  revalidatePath(path);
  revalidatePath("/blog-admin/pages");

  redirect(
    `${path}?success=${encodeURIComponent(
      "Draft saved. Live content remains unchanged.",
    )}`,
  );
}

// ==========================================
// PUBLISH SAVED GEOGRAPHIC DRAFT
// ==========================================

export async function publishCountryLandingPageDraft(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail("/blog-admin/pages", "Invalid destination");
  }

  const path = `/blog-admin/pages/${id}/edit`;

  const expectedDraftVersion = field(form, "draft_updated_at");

  if (!expectedDraftVersion) {
    fail(path, "Save a draft before publishing");
  }

  const [pageResult, draftResult] = await Promise.all([
    supabase
      .from("blog_pages")
      .select("id,slug")
      .eq("id", id)
      .in("page_type", ["COUNTRY", "CITY"])
      .single(),

    supabase.from("blog_page_drafts").select("*").eq("page_id", id).single(),
  ]);

  const page = pageResult.data;
  const draft = draftResult.data;

  if (pageResult.error || draftResult.error || !page || !draft) {
    fail(path, "Saved draft or destination not found");
  }

  if (draft.updated_at !== expectedDraftVersion) {
    fail(path, "Draft has changed. Reload before publishing.");
  }

  const validation = validateCountryPagePublication(draft);

  if (!validation.valid) {
    fail(path, validation.errors.join(" "));
  }

  const { error } = await supabase.rpc("publish_blog_page_draft", {
    p_page_id: id,
    p_expected_draft_updated_at: expectedDraftVersion,
  });

  if (error) {
    fail(path, `Could not publish draft: ${error.message}`);
  }

  refreshGeographicPage(id, page.slug);

  redirect(
    `${path}?success=${encodeURIComponent(
      "Geographic page published successfully.",
    )}`,
  );
}

// ==========================================
// DISCARD PRIVATE WORKING DRAFT
// ==========================================

export async function discardCountryLandingPageDraft(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail("/blog-admin/pages", "Invalid destination");
  }

  const path = `/blog-admin/pages/${id}/edit`;

  const expectedDraftVersion = field(form, "draft_updated_at");

  if (!expectedDraftVersion) {
    fail(path, "No draft selected");
  }

  const { data, error } = await supabase
    .from("blog_page_drafts")
    .delete()
    .eq("page_id", id)
    .eq("updated_at", expectedDraftVersion)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    fail(path, "Draft changed or could not be discarded");
  }

  revalidatePath(path);
  revalidatePath("/blog-admin/pages");

  redirect(
    `${path}?success=${encodeURIComponent(
      "Working draft discarded. Live content was preserved.",
    )}`,
  );
}

// ==========================================
// UNPUBLISH GEOGRAPHIC PAGE
// ==========================================

export async function changeCountryLandingPageStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");
  const status = field(form, "status");

  if (!validUUID(id) || status !== "DRAFT") {
    fail(
      "/blog-admin/pages",
      "Invalid status action. Use the draft publishing action to publish.",
    );
  }

  const path = `/blog-admin/pages/${id}/edit`;

  const expectedPageVersion = field(form, "base_updated_at");

  const { data: draft, error: draftError } = await supabase
    .from("blog_page_drafts")
    .select("id")
    .eq("page_id", id)
    .maybeSingle();

  if (draftError) {
    fail(path, "Could not check working draft");
  }

  if (draft) {
    fail(path, "Publish or discard the working draft before unpublishing.");
  }

  const { data: page, error } = await supabase
    .from("blog_pages")
    .update({
      status: "DRAFT",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("updated_at", expectedPageVersion)
    .in("page_type", ["COUNTRY", "CITY"])
    .eq("status", "PUBLISHED")
    .select("id,slug")
    .maybeSingle();

  if (error || !page) {
    fail(path, "Page changed or could not be unpublished");
  }

  refreshGeographicPage(id, page.slug);

  redirect(
    `${path}?success=${encodeURIComponent("Geographic page unpublished.")}`,
  );
}
