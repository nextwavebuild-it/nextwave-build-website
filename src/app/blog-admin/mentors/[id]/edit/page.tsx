import Link from "next/link";
import { notFound } from "next/navigation";

import MentorForm, {
  type MentorFormData,
} from "@/components/blog-admin/MentorForm";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { updateBlogMentor } from "@/lib/blog-admin/mentor-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;

  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditMentorPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    notFound();
  }

  const [mentorResult, programmeResult] = await Promise.all([
    supabase
      .from("blog_mentors")
      .select(
        "id,name,slug,professional_title,biography,image_url,image_alt,programme_id,expertise,years_of_experience,sort_order,is_active,updated_at",
      )
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("blog_programmes")
      .select("id,name,is_active")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  if (mentorResult.error || programmeResult.error) {
    throw new Error("Unable to load mentor profile.");
  }

  if (!mentorResult.data) {
    notFound();
  }

  const mentor = mentorResult.data as MentorFormData;

  return (
    <div className="max-w-5xl space-y-7 text-white">
      <header>
        <Link
          href="/blog-admin/mentors"
          className="text-sm text-[#D5FF66] hover:underline"
        >
          ← Mentor Management
        </Link>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
          SHARED CONTENT MANAGEMENT
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Edit {mentor.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              mentor.is_active
                ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                : "border-white/15 bg-white/5 text-white/50"
            }`}
          >
            {mentor.is_active ? "Active" : "Inactive"}
          </span>

          <span className="text-xs text-white/45">{mentor.slug}</span>
        </div>
      </header>

      {query.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {query.error}
        </p>
      )}

      {query.success && (
        <p
          role="status"
          className="rounded-xl border border-[#D5FF66]/30 bg-[#D5FF66]/10 p-4 text-sm text-[#D5FF66]"
        >
          {query.success}
        </p>
      )}

      {mentor.is_active && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm leading-7 text-yellow-100">
          This mentor profile is active. Saving changes may immediately update
          published geographic pages.
        </div>
      )}

      <MentorForm
        mentor={mentor}
        programmes={programmeResult.data ?? []}
        action={updateBlogMentor}
      />
    </div>
  );
}
