"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

const BASE_PATH = "/blog-admin/mentors";

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

// ==========================================
// VALIDATE PROFILE IMAGE
// ==========================================

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

  fail(path, "Profile image must use a valid HTTPS URL or local image path.");
}

// ==========================================
// READ MENTOR EXPERTISE
// ==========================================

function readExpertise(form: FormData, path: string) {
  const expertise = field(form, "expertise")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (expertise.length > 20 || expertise.some((item) => item.length > 120)) {
    fail(
      path,
      "Add a maximum of 20 expertise items with up to 120 characters each.",
    );
  }

  return [...new Set(expertise)];
}

// ==========================================
// VALIDATE MENTOR FORM
// ==========================================

function parseMentorForm(form: FormData, path: string) {
  const name = field(form, "name");

  const slug = slugify(field(form, "slug") || name);

  const professionalTitle = field(form, "professional_title");

  const biography = field(form, "biography");
  const imageUrl = field(form, "image_url");
  const imageAlt = field(form, "image_alt");
  const programmeId = field(form, "programme_id");

  const experienceRaw = field(form, "years_of_experience");

  const sortOrderRaw = field(form, "sort_order") || "0";

  const isActive = form.get("is_active") === "on";

  if (name.length < 2 || name.length > 120 || !slug || slug.length > 100) {
    fail(path, "Enter a valid mentor name and slug.");
  }

  if (
    professionalTitle.length > 180 ||
    biography.length > 5000 ||
    imageUrl.length > 2000 ||
    imageAlt.length > 180
  ) {
    fail(path, "One or more mentor fields exceed the allowed length.");
  }

  if (programmeId && !validUUID(programmeId)) {
    fail(path, "Invalid programme selection.");
  }

  if (imageUrl && !imageAlt) {
    fail(path, "Provide alternative text for the mentor image.");
  }

  // Years of experience is optional.

  let yearsOfExperience: number | null = null;

  if (experienceRaw) {
    if (!/^\d+$/.test(experienceRaw)) {
      fail(path, "Years of experience must be a non-negative integer.");
    }

    yearsOfExperience = Number(experienceRaw);

    if (!Number.isSafeInteger(yearsOfExperience) || yearsOfExperience > 80) {
      fail(path, "Years of experience must be between 0 and 80.");
    }
  }

  // Validate display order.

  if (!/^\d+$/.test(sortOrderRaw)) {
    fail(path, "Display order must be a non-negative integer.");
  }

  const sortOrder = Number(sortOrderRaw);

  if (!Number.isSafeInteger(sortOrder) || sortOrder > 9999) {
    fail(path, "Display order must be between 0 and 9999.");
  }

  // Active mentors require complete public profiles.

  if (isActive) {
    if (professionalTitle.length < 3) {
      fail(path, "Active mentors require a professional title.");
    }

    if (biography.length < 50) {
      fail(
        path,
        "Active mentors require a biography of at least 50 characters.",
      );
    }
  }

  return {
    name,
    slug,
    professional_title: professionalTitle,
    biography,
    image_url: validateImageUrl(imageUrl, path),
    image_alt: imageAlt || null,
    programme_id: programmeId || null,
    expertise: readExpertise(form, path),
    years_of_experience: yearsOfExperience,
    sort_order: sortOrder,
    is_active: isActive,
  };
}

// ==========================================
// REFRESH MENTOR DESTINATIONS
// ==========================================

function refreshMentorPages(id?: string) {
  revalidatePath(BASE_PATH);
  revalidatePath(`${BASE_PATH}/new`);
  revalidatePath("/blog-admin/dashboard");

  if (id) {
    revalidatePath(`${BASE_PATH}/${id}/edit`);
  }

  // Public geographic pages.

  revalidatePath("/[country]", "page");

  // Private geographic previews.

  revalidatePath("/blog-admin/pages/[id]/preview", "page");
}

// ==========================================
// CREATE MENTOR
// ==========================================

export async function createBlogMentor(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const path = `${BASE_PATH}/new`;

  const values = parseMentorForm(form, path);

  if (values.programme_id) {
    const { data: programme, error } = await supabase
      .from("blog_programmes")
      .select("id,is_active")
      .eq("id", values.programme_id)
      .maybeSingle();

    if (error || !programme) {
      fail(path, "Selected programme does not exist.");
    }

    if (values.is_active && !programme.is_active) {
      fail(
        path,
        "An active mentor cannot be assigned to an inactive programme.",
      );
    }
  }

  const { data, error } = await supabase
    .from("blog_mentors")
    .insert(values)
    .select("id")
    .single();

  if (error || !data) {
    fail(
      path,
      error?.code === "23505"
        ? "A mentor with this slug already exists."
        : "Could not create mentor profile.",
    );
  }

  refreshMentorPages(data.id);

  redirect(
    `${BASE_PATH}/${data.id}/edit?success=${encodeURIComponent(
      "Mentor profile created successfully.",
    )}`,
  );
}

// ==========================================
// UPDATE MENTOR
// ==========================================

export async function updateBlogMentor(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");

  if (!validUUID(id)) {
    fail(BASE_PATH, "Invalid mentor profile.");
  }

  const path = `${BASE_PATH}/${id}/edit`;

  const expectedVersion = field(form, "updated_at");

  if (!expectedVersion) {
    fail(path, "Mentor version is missing. Reload the editor.");
  }

  const values = parseMentorForm(form, path);

  if (values.programme_id) {
    const { data: programme, error } = await supabase
      .from("blog_programmes")
      .select("id,is_active")
      .eq("id", values.programme_id)
      .maybeSingle();

    if (error || !programme) {
      fail(path, "Selected programme does not exist.");
    }

    if (values.is_active && !programme.is_active) {
      fail(
        path,
        "An active mentor cannot be assigned to an inactive programme.",
      );
    }
  }

  const { data, error } = await supabase
    .from("blog_mentors")
    .update(values)
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .select("id")
    .maybeSingle();

  if (error) {
    fail(
      path,
      error.code === "23505"
        ? "A mentor with this slug already exists."
        : "Could not update mentor profile.",
    );
  }

  if (!data) {
    fail(
      path,
      "Another administrator changed this profile. Reload before saving.",
    );
  }

  refreshMentorPages(id);

  redirect(
    `${path}?success=${encodeURIComponent(
      "Mentor profile updated successfully.",
    )}`,
  );
}

// ==========================================
// ACTIVATE OR DEACTIVATE MENTOR
// ==========================================

export async function changeBlogMentorStatus(form: FormData) {
  const { supabase } = await requireBlogAdmin();

  const id = field(form, "id");
  const status = field(form, "status");

  const expectedVersion = field(form, "updated_at");

  if (
    !validUUID(id) ||
    !["ACTIVE", "INACTIVE"].includes(status) ||
    !expectedVersion
  ) {
    fail(BASE_PATH, "Invalid mentor status request.");
  }

  const isActive = status === "ACTIVE";

  const { data: mentor, error: mentorError } = await supabase
    .from("blog_mentors")
    .select(
      "id,name,professional_title,biography,image_url,image_alt,programme_id",
    )
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .maybeSingle();

  if (mentorError || !mentor) {
    fail(BASE_PATH, "Mentor profile has changed or no longer exists.");
  }

  if (isActive) {
    if (
      mentor.name.trim().length < 2 ||
      mentor.professional_title.trim().length < 3 ||
      mentor.biography.trim().length < 50
    ) {
      fail(BASE_PATH, "Complete the mentor profile before activation.");
    }

    if (mentor.image_url && !mentor.image_alt?.trim()) {
      fail(BASE_PATH, "Add mentor image alternative text before activation.");
    }

    validateImageUrl(mentor.image_url ?? "", BASE_PATH);

    if (mentor.programme_id) {
      const { data: programme, error } = await supabase
        .from("blog_programmes")
        .select("id,is_active")
        .eq("id", mentor.programme_id)
        .maybeSingle();

      if (error || !programme || !programme.is_active) {
        fail(BASE_PATH, "The assigned programme must be active.");
      }
    }
  }

  const { data, error } = await supabase
    .from("blog_mentors")
    .update({
      is_active: isActive,
    })
    .eq("id", id)
    .eq("updated_at", expectedVersion)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    fail(BASE_PATH, "Mentor status could not be updated. Reload and retry.");
  }

  refreshMentorPages(id);

  redirect(
    `${BASE_PATH}?success=${encodeURIComponent(
      isActive
        ? "Mentor activated successfully."
        : "Mentor deactivated successfully.",
    )}`,
  );
}
