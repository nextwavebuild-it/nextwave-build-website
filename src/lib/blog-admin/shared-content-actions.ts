"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

const BASE_PATH = "/blog-admin/shared-content";

const ALLOWED_SECTIONS = new Set([
  "trust_benefits",
  "why_nextwave",
  "enrollment_steps",
  "learning_method",
  "programme_comparison",
  "shared_faqs",
]);

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

// ==========================================
// READ REPEATABLE CONTENT ITEMS
// ==========================================

function readItems(form: FormData, path: string) {
  const titles = form.getAll("item_title").map(String);

  const descriptions = form.getAll("item_description").map(String);

  if (titles.length !== descriptions.length || titles.length > 30) {
    fail(path, "Invalid content items.");
  }

  const items: {
    title: string;
    description: string;
  }[] = [];

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i].trim();
    const description = descriptions[i].trim();

    if (!title && !description) {
      continue;
    }

    if (
      !title ||
      !description ||
      title.length > 180 ||
      description.length > 2000
    ) {
      fail(path, `Item ${i + 1} is incomplete or exceeds the allowed length.`);
    }

    items.push({
      title,
      description,
    });
  }

  return items;
}

// ==========================================
// READ EXISTING SHARED CONTENT ITEMS
// ==========================================

function hasValidItems(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const content = value as Record<string, unknown>;

  if (!Array.isArray(content.items)) {
    return false;
  }

  return content.items.some((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return false;
    }

    const record = item as Record<string, unknown>;

    return (
      typeof record.title === "string" &&
      record.title.trim().length > 0 &&
      typeof record.description === "string" &&
      record.description.trim().length > 0
    );
  });
}

// ==========================================
// REFRESH SHARED CONTENT DESTINATIONS
// ==========================================

function refreshSharedContent(id?: string) {
  revalidatePath(BASE_PATH);
  revalidatePath("/blog-admin/dashboard");

  if (id) {
    revalidatePath(`${BASE_PATH}/${id}/edit`);
  }

  // Refresh public country and city pages.
  revalidatePath("/[country]", "page");

  // Refresh private geographic previews.
  revalidatePath("/blog-admin/pages/[id]/preview", "page");
}

// ==========================================
// UPDATE SHARED CONTENT
// ==========================================

export async function updateBlogSharedContent(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail(BASE_PATH, "Invalid shared content record.");
  }

  const path = `${BASE_PATH}/${id}/edit`;

  const expectedVersion = field(form, "updated_at");

  if (!expectedVersion) {
    fail(path, "Content version is missing. Reload the page.");
  }

  const heading = field(form, "heading");
  const description = field(form, "description");

  const isActive = form.get("is_active") === "on";

  if (heading.length > 180 || description.length > 2000) {
    fail(path, "One or more fields exceed the allowed length.");
  }

  // Retrieve the existing record and verify its version.

  const { data: existing, error: readError } = await supabase
    .from("blog_shared_content")
    .select("id,section_key,content,updated_at")
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .maybeSingle();

  if (readError || !existing) {
    fail(
      path,
      "Shared content has changed or no longer exists. Reload the editor.",
    );
  }

  if (!ALLOWED_SECTIONS.has(existing.section_key)) {
    fail(path, "Unsupported shared content section.");
  }

  const items = readItems(form, path);

  if (isActive) {
    if (heading.length < 3) {
      fail(path, "Active sections require a valid heading.");
    }

    if (existing.section_key === "shared_faqs") {
      if (!items.length) {
        fail(path, "Add at least one FAQ before activation.");
      }
    } else if (existing.section_key === "programme_comparison") {
      if (!description) {
        fail(path, "Provide a programme comparison description.");
      }
    } else if (!description && !items.length) {
      fail(path, "Add a description or content items before activation.");
    }
  }

  // Preserve unrelated JSON properties.

  const previousContent =
    existing.content &&
    typeof existing.content === "object" &&
    !Array.isArray(existing.content)
      ? existing.content
      : {};

  const updatedContent = {
    ...previousContent,
    items,
  };

  const { data, error } = await supabase
    .from("blog_shared_content")
    .update({
      heading,
      description,
      content: updatedContent,
      is_active: isActive,
    })
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .select("id")
    .maybeSingle();

  if (error) {
    fail(path, "Could not update shared content.");
  }

  if (!data) {
    fail(
      path,
      "Another administrator changed this record. Reload before saving.",
    );
  }

  refreshSharedContent(id);

  redirect(
    `${path}?success=${encodeURIComponent(
      "Shared content saved successfully.",
    )}`,
  );
}

// ==========================================
// ACTIVATE OR DEACTIVATE SHARED CONTENT
// ==========================================

export async function changeBlogSharedContentStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");
  const status = field(form, "status");
  const expectedVersion = field(form, "updated_at");

  if (
    !validUUID(id) ||
    !["ACTIVE", "INACTIVE"].includes(status) ||
    !expectedVersion
  ) {
    fail(BASE_PATH, "Invalid shared content status request.");
  }

  const isActive = status === "ACTIVE";

  const { data: existing, error: readError } = await supabase
    .from("blog_shared_content")
    .select("id,section_key,heading,description,content,updated_at")
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .maybeSingle();

  if (readError || !existing) {
    fail(BASE_PATH, "Shared content changed or no longer exists.");
  }

  if (!ALLOWED_SECTIONS.has(existing.section_key)) {
    fail(BASE_PATH, "Unsupported shared content section.");
  }

  if (isActive) {
    if (existing.heading.trim().length < 3) {
      fail(BASE_PATH, "Complete the section heading first.");
    }

    const validItems = hasValidItems(existing.content);

    if (existing.section_key === "shared_faqs") {
      if (!validItems) {
        fail(BASE_PATH, "Add FAQ content before activation.");
      }
    } else if (existing.section_key === "programme_comparison") {
      if (!existing.description.trim()) {
        fail(
          BASE_PATH,
          "Complete the comparison description before activation.",
        );
      }
    } else if (!existing.description.trim() && !validItems) {
      fail(BASE_PATH, "Complete the shared content before activation.");
    }
  }

  const { data, error } = await supabase
    .from("blog_shared_content")
    .update({
      is_active: isActive,
    })
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    fail(
      BASE_PATH,
      "Shared content changed or its status could not be updated.",
    );
  }

  refreshSharedContent(id);

  redirect(
    `${BASE_PATH}?success=${encodeURIComponent(
      isActive
        ? "Shared content activated successfully."
        : "Shared content deactivated successfully.",
    )}`,
  );
}
