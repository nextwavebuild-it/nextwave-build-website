"use server";

import { parseBlogDocument } from "@/lib/blog-admin/content";
import {
  getCountryBodyText,
  parseCountryPageContent,
  type CountryPageContentV2,
} from "@/lib/country-page-content";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

import { createBlogServerClient } from "@/lib/blog-supabase/server";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

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
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);

  redirect("/blog-admin/dashboard?success=Article%20saved");
}

export async function createPublishingPage(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const path = "/blog-admin/pages";

  const name = field(form, "name");

  const slug = slugify(field(form, "slug") || name);

  const type = field(form, "page_type");

  const countryCode = field(form, "country_code").toUpperCase();

  const heading = field(form, "heading");

  const description = field(form, "description");

  const seoTitle = field(form, "seo_title");

  const seoDescription = field(form, "seo_description");

  if (
    name.length < 2 ||
    name.length > 120 ||
    !slug ||
    slug === "global" ||
    slug.length > 100
  )
    fail(path, "Enter a valid page name and slug");

  if (!["COUNTRY", "CUSTOM"].includes(type)) fail(path, "Invalid page type");

  if (type === "COUNTRY" && !/^[A-Z]{2}$/.test(countryCode))
    fail(path, "Use a 2-letter ISO country code (AE, SA, QA...) ");

  if (
    heading.length > 180 ||
    seoTitle.length > 180 ||
    seoDescription.length > 300 ||
    description.length > 5000
  )
    fail(path, "One or more page fields are too long");

  let countryId: string | null = null;

  let createdCountryId: string | null = null;

  if (type === "COUNTRY") {
    const existing = await supabase

      .from("blog_countries")

      .select("id")

      .eq("country_code", countryCode)

      .maybeSingle();

    if (existing.error) fail(path, "Could not check country");

    if (existing.data) countryId = existing.data.id;
    else {
      const newCountry = await supabase

        .from("blog_countries")

        .insert({ name, slug, country_code: countryCode, is_active: true })

        .select("id")

        .single();

      if (newCountry.error || !newCountry.data)
        fail(path, "Could not create country; check for an existing slug");

      countryId = createdCountryId = newCountry.data.id;
    }
  }

  const { error } = await supabase.from("blog_pages").insert({
    name,

    slug,

    page_type: type,

    country_id: countryId,

    heading: heading || name,

    description: description || null,

    seo_title: seoTitle || null,

    seo_description: seoDescription || null,

    status: "DRAFT", // New destination is not public until implemented/reviewed.
  });

  if (error) {
    if (createdCountryId)
      await supabase.from("blog_countries").delete().eq("id", createdCountryId);

    fail(
      path,

      error.code === "23505"
        ? "A destination with that slug or country already exists"
        : "Could not create page",
    );
  }

  revalidatePath("/blog-admin/pages");

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

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${slug}`);

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

  const { data: post, error: readError } = await supabase

    .from("blog_posts")

    .select("id,published_at,slug")

    .eq("id", id)

    .single();

  if (readError || !post) {
    fail("/blog-admin/posts", "Article not found");
  }

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

  revalidatePath("/blog-admin/dashboard");

  revalidatePath("/blog-admin/posts");

  revalidatePath("/blog");

  revalidatePath(`/blog/${post.slug}`);

  redirect(
    `/blog-admin/posts?success=${encodeURIComponent(
      `Article status changed to ${status.toLowerCase()}`,
    )}`,
  );
}

// ==================== Country landing-page management ====================

function validCountryContent(page: {
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

type CountryEditableField = Exclude<
  keyof CountryPageContentV2,
  "format" | "text"
>;

const COUNTRY_FIELDS: { key: CountryEditableField; max: number }[] = [
  { key: "heroEyebrow", max: 120 },
  { key: "introTitle", max: 180 },
  { key: "insightsTitle", max: 180 },
  { key: "programmesTitle", max: 180 },
  { key: "programmesDescription", max: 1000 },
  { key: "resourcesTitle", max: 180 },
  { key: "ctaTitle", max: 180 },
  { key: "ctaDescription", max: 1000 },
  { key: "ctaButtonText", max: 60 },
];

export async function saveCountryLandingPage(form: FormData) {
  const { supabase } = await requireBlogAdmin();
  const id = field(form, "id");
  if (!validUUID(id)) fail("/blog-admin/pages", "Invalid country page");
  const path = `/blog-admin/pages/${id}/edit`;

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
  )
    fail(path, "One or more fields exceed their maximum length");

  const { data: page, error: readError } = await supabase
    .from("blog_pages")
    .select("id,slug,status,content")
    .eq("id", id)
    .eq("page_type", "COUNTRY")
    .single();
  if (readError || !page) fail(path, "Country page not found");

  // Merge with the previously saved document rather than dropping legacy text.
  const content = parseCountryPageContent(page.content);
  content.text = contentText;
  for (const { key, max } of COUNTRY_FIELDS) {
    const value = field(form, key);
    if (!value || value.length > max) {
      fail(
        path,
        `${key} is required and must be no longer than ${max} characters`,
      );
    }
    content[key] = value;
  }

  const updatedPage = {
    heading: heading || null,
    description: description || null,
    seo_title: seoTitle || null,
    seo_description: seoDescription || null,
    content,
  };
  if (page.status === "PUBLISHED" && !validCountryContent(updatedPage)) {
    fail(
      path,
      "A published page requires an H1, introduction, SEO fields and 300+ characters of country body content. Unpublish to save an incomplete draft.",
    );
  }

  const { error } = await supabase
    .from("blog_pages")
    .update({ ...updatedPage, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("page_type", "COUNTRY");
  if (error) fail(path, `Could not save country page: ${error.message}`);
  revalidatePath(`/blog-admin/pages/${id}/edit`);
  revalidatePath("/blog-admin/pages");
  revalidatePath(`/${page.slug}`);
  // Country pages remain excluded from sitemap intentionally.
  redirect(
    `${path}?success=${encodeURIComponent("Country SEO content saved")}`,
  );
}

export async function changeCountryLandingPageStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();
  const id = field(form, "id");
  const status = field(form, "status");
  if (!validUUID(id) || !["DRAFT", "PUBLISHED"].includes(status)) {
    fail("/blog-admin/pages", "Invalid country page or status");
  }
  const path = `/blog-admin/pages/${id}/edit`;
  const { data: page, error: readError } = await supabase
    .from("blog_pages")
    .select(
      "id,slug,country_id,heading,description,seo_title,seo_description,content",
    )
    .eq("id", id)
    .eq("page_type", "COUNTRY")
    .single();
  if (readError || !page?.country_id) fail(path, "Country page not found");

  if (status === "PUBLISHED") {
    const { data: country, error: countryError } = await supabase
      .from("blog_countries")
      .select("id")
      .eq("id", page.country_id)
      .eq("is_active", true)
      .maybeSingle();
    if (countryError || !country)
      fail(path, "Country must be active before publishing");
    if (!validCountryContent(page)) {
      fail(
        path,
        "Publishing requires an H1 (10+ characters), an introduction (100+), SEO title, meta description (50+), and original body content (300+). Save first.",
      );
    }
  }
  const { error } = await supabase
    .from("blog_pages")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("page_type", "COUNTRY");
  if (error)
    fail(path, `Could not change country publishing status: ${error.message}`);
  revalidatePath("/blog-admin/pages");
  revalidatePath(path);
  revalidatePath(`/${page.slug}`);
  redirect(
    `${path}?success=${encodeURIComponent(status === "PUBLISHED" ? "Country page published" : "Country page unpublished")}`,
  );
}
