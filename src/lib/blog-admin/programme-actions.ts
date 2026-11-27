"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

const BASE_PATH = "/blog-admin/programmes";

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readList(form: FormData, name: string, path: string) {
  const values = field(form, name)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (values.length > 30 || values.some((item) => item.length > 500)) {
    fail(path, `${name} supports up to 30 items of 500 characters each.`);
  }

  return values;
}

function readPrice(
  value: string,
  currency: string,
  path: string,
): number | null {
  if (!value) return null;

  if (!/^\d+(?:\.\d+)?$/.test(value)) {
    fail(path, "Enter a valid non-negative price.");
  }

  let digits: number;

  try {
    digits =
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    fail(path, "Invalid currency.");
  }

  const [whole, fraction = ""] = value.split(".");

  if (fraction.length > digits) {
    fail(path, `Price supports up to ${digits} decimal places.`);
  }

  const minor = Number(whole + fraction.padEnd(digits, "0"));

  if (!Number.isSafeInteger(minor) || minor < 0 || minor > 2147483647) {
    fail(path, "Price is outside the supported range.");
  }

  return minor;
}

function validateImageUrl(value: string, path: string) {
  if (!value) return null;

  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\s\\]/.test(value)
  ) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.protocol === "https:" && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    // Invalid URL is handled below.
  }

  fail(path, "Image URL must be a local path or valid HTTPS URL.");
}

function parseProgrammeForm(form: FormData, path: string) {
  const name = field(form, "name");
  const slug = slugify(field(form, "slug") || name);

  const shortDescription = field(form, "short_description");

  const description = field(form, "description");
  const imageUrl = field(form, "image_url");
  const imageAlt = field(form, "image_alt");
  const programmeUrl = field(form, "programme_url");

  const currency = field(form, "currency").toUpperCase() || "USD";

  const duration = field(form, "duration");
  const learningFormat = field(form, "learning_format");
  const skillLevel = field(form, "skill_level");

  const ctaLabel = field(form, "cta_label") || "Explore Programme";

  const sortOrderRaw = field(form, "sort_order") || "0";

  const isActive = form.get("is_active") === "on";

  if (name.length < 3 || name.length > 180 || !slug || slug.length > 100) {
    fail(path, "Enter a valid programme name and slug.");
  }

  if (
    shortDescription.length > 1000 ||
    description.length > 15000 ||
    imageUrl.length > 2000 ||
    imageAlt.length > 180 ||
    duration.length > 120 ||
    learningFormat.length > 180 ||
    skillLevel.length > 120 ||
    ctaLabel.length > 60
  ) {
    fail(path, "One or more programme fields are too long.");
  }

  if (!/^\/programmes\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(programmeUrl)) {
    fail(path, "Programme URL must use /programmes/your-programme-slug.");
  }

  // Restrict pricing to supported catalogue currencies.
  if (!["USD", "AED", "SAR", "EUR", "GBP"].includes(currency)) {
    fail(path, "Select a supported currency.");
  }

  const priceMinor = readPrice(field(form, "price"), currency, path);

  const originalPriceMinor = readPrice(
    field(form, "original_price"),
    currency,
    path,
  );

  if (
    originalPriceMinor !== null &&
    (priceMinor === null || originalPriceMinor < priceMinor)
  ) {
    fail(
      path,
      "Original price must be greater than or equal to the current price.",
    );
  }

  if (!/^\d+$/.test(sortOrderRaw)) {
    fail(path, "Display order must be a non-negative integer.");
  }

  const sortOrder = Number(sortOrderRaw);

  if (!Number.isSafeInteger(sortOrder) || sortOrder > 9999) {
    fail(path, "Display order must be between 0 and 9999.");
  }

  if (imageUrl && !imageAlt) {
    fail(path, "Provide alternative text for the programme image.");
  }

  if (isActive && shortDescription.length < 30) {
    fail(
      path,
      "Active programmes require a short description of at least 30 characters.",
    );
  }

  return {
    name,
    slug,
    short_description: shortDescription,
    description,
    image_url: validateImageUrl(imageUrl, path),
    image_alt: imageAlt || null,
    programme_url: programmeUrl,
    price_minor: priceMinor,
    original_price_minor: originalPriceMinor,
    currency,
    duration: duration || null,
    learning_format: learningFormat || null,
    skill_level: skillLevel || null,
    features: readList(form, "features", path),
    learning_outcomes: readList(form, "learning_outcomes", path),
    cta_label: ctaLabel,
    sort_order: sortOrder,
    is_active: isActive,
  };
}

function refreshProgrammePages(id?: string) {
  revalidatePath(BASE_PATH);
  revalidatePath(`${BASE_PATH}/new`);
  revalidatePath("/blog-admin/dashboard");

  if (id) {
    revalidatePath(`${BASE_PATH}/${id}/edit`);
  }

  // Programme content is shared across geographic pages.
  revalidatePath("/[country]", "page");

  // Refresh administrator previews.
  revalidatePath("/blog-admin/pages/[id]/preview", "page");
}

// ==========================================
// CREATE PROGRAMME
// ==========================================

export async function createBlogProgramme(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const path = `${BASE_PATH}/new`;

  const values = parseProgrammeForm(form, path);

  const { data, error } = await supabase
    .from("blog_programmes")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    fail(
      path,
      error?.code === "23505"
        ? "This programme slug already exists."
        : "Could not create programme.",
    );
  }

  refreshProgrammePages(data.id);

  redirect(
    `${BASE_PATH}/${data.id}/edit?success=${encodeURIComponent(
      "Programme created successfully.",
    )}`,
  );
}

// ==========================================
// UPDATE PROGRAMME
// ==========================================

export async function updateBlogProgramme(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail(BASE_PATH, "Invalid programme.");
  }

  const path = `${BASE_PATH}/${id}/edit`;

  const expectedVersion = field(form, "updated_at");

  if (!expectedVersion) {
    fail(path, "Programme version is missing. Reload the page.");
  }

  const values = parseProgrammeForm(form, path);

  const { data, error } = await supabase
    .from("blog_programmes")
    .update(values)
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .select("id")
    .maybeSingle();

  if (error) {
    fail(
      path,
      error.code === "23505"
        ? "This programme slug already exists."
        : "Could not update programme.",
    );
  }

  if (!data) {
    fail(path, "Programme has changed. Reload before saving.");
  }

  refreshProgrammePages(id);

  redirect(
    `${path}?success=${encodeURIComponent("Programme updated successfully.")}`,
  );
}

// ==========================================
// ACTIVATE OR DEACTIVATE PROGRAMME
// ==========================================

export async function changeBlogProgrammeStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");
  const status = field(form, "status");
  const expectedVersion = field(form, "updated_at");

  if (
    !validUUID(id) ||
    !["ACTIVE", "INACTIVE"].includes(status) ||
    !expectedVersion
  ) {
    fail(BASE_PATH, "Invalid programme status request.");
  }

  const isActive = status === "ACTIVE";

  if (isActive) {
    const { data: programme, error } = await supabase
      .from("blog_programmes")
      .select("name,short_description,programme_url")
      .eq("id", id)
      .eq("updated_at", expectedVersion)
      .maybeSingle();

    if (error || !programme) {
      fail(BASE_PATH, "Programme changed or no longer exists.");
    }

    if (
      programme.name.trim().length < 3 ||
      programme.short_description.trim().length < 30 ||
      !/^\/programmes\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(programme.programme_url)
    ) {
      fail(BASE_PATH, "Complete the programme information before activation.");
    }
  }

  const { data, error } = await supabase
    .from("blog_programmes")
    .update({
      is_active: isActive,
    })
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    fail(BASE_PATH, "Programme changed or its status could not be updated.");
  }

  refreshProgrammePages(id);

  redirect(
    `${BASE_PATH}?success=${encodeURIComponent(
      isActive
        ? "Programme activated successfully."
        : "Programme deactivated successfully.",
    )}`,
  );
}
