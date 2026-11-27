import Link from "next/link";
import { notFound } from "next/navigation";

import ProgrammeForm, {
  type ProgrammeFormData,
} from "@/components/blog-admin/ProgrammeForm";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { updateBlogProgramme } from "@/lib/blog-admin/programme-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;

  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditProgrammePage({
  params,
  searchParams,
}: Props) {
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

  const { data, error } = await supabase
    .from("blog_programmes")
    .select(
      `id,
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
       sort_order,
       is_active,
       updated_at`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load programme.");
  }

  if (!data) {
    notFound();
  }

  const programme = data as ProgrammeFormData;

  return (
    <div className="max-w-5xl space-y-7 text-white">
      <header>
        <Link
          href="/blog-admin/programmes"
          className="text-sm text-[#D5FF66] hover:underline"
        >
          ← Programme Catalog
        </Link>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
          SHARED CONTENT MANAGEMENT
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Edit {programme.name}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              programme.is_active
                ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                : "border-white/15 bg-white/5 text-white/50"
            }`}
          >
            {programme.is_active ? "Active" : "Inactive"}
          </span>

          <span className="text-xs text-white/45">{programme.slug}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/55">
          Update shared programme information used across geographic landing
          pages.
        </p>
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

      {programme.is_active && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm leading-7 text-yellow-100">
          This programme is active. Saving changes may immediately update
          published V3 geographic pages.
        </div>
      )}

      <ProgrammeForm programme={programme} action={updateBlogProgramme} />
    </div>
  );
}
