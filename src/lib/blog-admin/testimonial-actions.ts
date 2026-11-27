"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

const BASE_PATH = "/blog-admin/testimonials";

const ALLOWED_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

type TestimonialStatus = (typeof ALLOWED_STATUSES)[number];

function field(form: FormData, name: string) {
  return String(form.get(name) ?? "").trim();
}

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function validUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function validStatus(value: string): value is TestimonialStatus {
  return ALLOWED_STATUSES.some((status) => status === value);
}

// ==========================================
// VALIDATE IMAGE URL
// ==========================================

function validateImageUrl(value: string, path: string) {
  if (!value) return null;

  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\s\\\u0000-\u001f\u007f]/.test(value)
  ) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.protocol === "https:" && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    // Invalid URL handled below.
  }

  fail(path, "Image must use a valid HTTPS URL or local image path.");
}

// ==========================================
// MULTIPLE DESTINATION VALIDATION
// ==========================================

function readDestinations(form: FormData, path: string) {
  const scope = field(form, "destination_scope");

  if (scope !== "GLOBAL" && scope !== "SELECTED") {
    fail(path, "Select a valid destination scope.");
  }

  const pageIds = [
    ...new Set(
      form
        .getAll("page_ids")
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];

  if (pageIds.length > 500 || pageIds.some((id) => !validUUID(id))) {
    fail(path, "Invalid geographic destinations.");
  }

  if (scope === "GLOBAL" && pageIds.length > 0) {
    fail(path, "Global testimonials cannot have selected destinations.");
  }

  if (scope === "SELECTED" && !pageIds.length) {
    fail(path, "Select at least one geographic destination.");
  }

  return {
    scope,
    pageIds,
  };
}

// ==========================================
// VALIDATE TESTIMONIAL CONTENT
// ==========================================

function parseTestimonialForm(form: FormData, path: string) {
  const studentName = field(form, "student_name");

  const professionalTitle = field(form, "professional_title");

  const testimonial = field(form, "testimonial");

  const imageUrl = field(form, "image_url");
  const imageAlt = field(form, "image_alt");

  const programmeId = field(form, "programme_id");

  const ratingRaw = field(form, "rating");

  const sortOrderRaw = field(form, "sort_order") || "0";

  const status = field(form, "status") || "DRAFT";

  const consentConfirmed = form.get("consent_confirmed") === "on";

  if (studentName.length < 2 || studentName.length > 120) {
    fail(path, "Student name must contain between 2 and 120 characters.");
  }

  if (testimonial.length < 10 || testimonial.length > 5000) {
    fail(path, "Testimonial must contain between 10 and 5000 characters.");
  }

  if (
    professionalTitle.length > 180 ||
    imageUrl.length > 2000 ||
    imageAlt.length > 180
  ) {
    fail(path, "One or more fields exceed the allowed length.");
  }

  if (programmeId && !validUUID(programmeId)) {
    fail(path, "Invalid programme selection.");
  }

  if (!validStatus(status)) {
    fail(path, "Invalid testimonial status.");
  }

  if (imageUrl && !imageAlt) {
    fail(path, "Provide alternative text for the student image.");
  }

  let rating: number | null = null;

  if (ratingRaw) {
    if (!/^[1-5]$/.test(ratingRaw)) {
      fail(path, "Rating must be between 1 and 5.");
    }

    rating = Number(ratingRaw);
  }

  if (!/^\d+$/.test(sortOrderRaw)) {
    fail(path, "Display order must be a non-negative integer.");
  }

  const sortOrder = Number(sortOrderRaw);

  if (!Number.isSafeInteger(sortOrder) || sortOrder > 9999) {
    fail(path, "Display order must be between 0 and 9999.");
  }

  if (status === "PUBLISHED") {
    if (!consentConfirmed) {
      fail(path, "Student consent must be confirmed before publishing.");
    }

    if (testimonial.length < 30) {
      fail(path, "Published testimonials require at least 30 characters.");
    }
  }

  return {
    student_name: studentName,
    professional_title: professionalTitle || null,
    testimonial,
    image_url: validateImageUrl(imageUrl, path),
    image_alt: imageAlt || null,
    programme_id: programmeId || null,
    rating,
    sort_order: sortOrder,
    consent_confirmed: consentConfirmed,
    status,
  };
}

// ==========================================
// REFRESH RELATED PAGES
// ==========================================

function refreshTestimonialPages(id?: string) {
  revalidatePath(BASE_PATH);
  revalidatePath(`${BASE_PATH}/new`);
  revalidatePath("/blog-admin/dashboard");

  if (id) {
    revalidatePath(`${BASE_PATH}/${id}/edit`);
  }

  revalidatePath("/[country]", "page");

  revalidatePath("/blog-admin/pages/[id]/preview", "page");
}

// ==========================================
// CREATE TESTIMONIAL
// ==========================================

export async function createBlogTestimonial(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const path = `${BASE_PATH}/new`;

  const values = parseTestimonialForm(form, path);
  const destinations = readDestinations(form, path);

  const { data, error } = await supabase.rpc("save_blog_testimonial", {
    p_testimonial_id: null,
    p_expected_updated_at: null,
    p_values: values,
    p_destination_scope: destinations.scope,
    p_page_ids: destinations.pageIds,
  });

  if (error || !data) {
    fail(
      path,
      error?.code === "P0001" ? error.message : "Could not create testimonial.",
    );
  }

  refreshTestimonialPages(data);

  redirect(
    `${BASE_PATH}/${data}/edit?success=${encodeURIComponent(
      "Testimonial created successfully.",
    )}`,
  );
}

// ==========================================
// UPDATE TESTIMONIAL
// ==========================================

export async function updateBlogTestimonial(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail(BASE_PATH, "Invalid testimonial.");
  }

  const path = `${BASE_PATH}/${id}/edit`;

  const expectedVersion = field(form, "updated_at");

  if (!expectedVersion) {
    fail(path, "Testimonial version is missing. Reload the editor.");
  }

  const values = parseTestimonialForm(form, path);
  const destinations = readDestinations(form, path);

  const { data, error } = await supabase.rpc("save_blog_testimonial", {
    p_testimonial_id: id,
    p_expected_updated_at: expectedVersion,
    p_values: values,
    p_destination_scope: destinations.scope,
    p_page_ids: destinations.pageIds,
  });

  if (error || !data) {
    fail(
      path,
      error?.code === "P0001" ? error.message : "Could not update testimonial.",
    );
  }

  refreshTestimonialPages(id);

  redirect(
    `${path}?success=${encodeURIComponent(
      "Testimonial updated successfully.",
    )}`,
  );
}

// ==========================================
// CHANGE TESTIMONIAL STATUS
// ==========================================

export async function changeBlogTestimonialStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");
  const status = field(form, "status");

  const expectedVersion = field(form, "updated_at");

  if (!validUUID(id) || !validStatus(status) || !expectedVersion) {
    fail(BASE_PATH, "Invalid testimonial status request.");
  }

  const [testimonialResult, placementResult] = await Promise.all([
    supabase
      .from("blog_testimonials")
      .select(
        "id,student_name,professional_title,testimonial,image_url,image_alt,rating,programme_id,destination_scope,consent_confirmed,sort_order,updated_at",
      )
      .eq("id", id)
      .eq("updated_at", expectedVersion)
      .maybeSingle(),

    supabase
      .from("blog_testimonial_pages")
      .select("page_id")
      .eq("testimonial_id", id),
  ]);

  if (
    testimonialResult.error ||
    !testimonialResult.data ||
    placementResult.error
  ) {
    fail(BASE_PATH, "Testimonial has changed or could not be loaded.");
  }

  const testimonial = testimonialResult.data;

  const scope = testimonial.destination_scope;

  if (scope !== "GLOBAL" && scope !== "SELECTED") {
    fail(BASE_PATH, "Invalid destination scope. Review the testimonial.");
  }

  const pageIds = (placementResult.data ?? []).map((item) => item.page_id);

  const values = {
    student_name: testimonial.student_name,
    professional_title: testimonial.professional_title,
    testimonial: testimonial.testimonial,
    image_url: testimonial.image_url,
    image_alt: testimonial.image_alt,
    programme_id: testimonial.programme_id,
    rating: testimonial.rating,
    sort_order: testimonial.sort_order,
    consent_confirmed: testimonial.consent_confirmed,
    status,
  };

  const { data, error } = await supabase.rpc("save_blog_testimonial", {
    p_testimonial_id: id,
    p_expected_updated_at: expectedVersion,
    p_values: values,
    p_destination_scope: scope,
    p_page_ids: pageIds,
  });

  if (error || !data) {
    fail(
      BASE_PATH,
      error?.code === "P0001"
        ? error.message
        : "Could not update testimonial status.",
    );
  }

  refreshTestimonialPages(id);

  redirect(
    `${BASE_PATH}?success=${encodeURIComponent(
      status === "PUBLISHED"
        ? "Testimonial published successfully."
        : status === "ARCHIVED"
          ? "Testimonial archived successfully."
          : "Testimonial moved to draft.",
    )}`,
  );
}
