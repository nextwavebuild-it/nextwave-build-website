import Link from "next/link";
import { notFound } from "next/navigation";

import TestimonialForm, {
  type TestimonialFormData,
} from "@/components/blog-admin/TestimonialForm";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { updateBlogTestimonial } from "@/lib/blog-admin/testimonial-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;

  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

const statusStyles: Record<string, string> = {
  PUBLISHED: "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]",
  DRAFT: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  ARCHIVED: "border-white/15 bg-white/5 text-white/50",
};

export default async function EditTestimonialPage({
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

  const [testimonialResult, programmeResult, destinationResult] =
    await Promise.all([
      supabase
        .from("blog_testimonials")
        .select(
          "id,student_name,professional_title,testimonial,image_url,image_alt,rating,programme_id,destination_scope,consent_confirmed,status,sort_order,updated_at",
        )
        .eq("id", id)
        .maybeSingle(),

      supabase
        .from("blog_programmes")
        .select("id,name,is_active")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),

      supabase
        .from("blog_pages")
        .select("id,name,slug,page_type,status")
        .in("page_type", ["COUNTRY", "CITY"])
        .order("name", { ascending: true }),
    ]);

  if (
    testimonialResult.error ||
    programmeResult.error ||
    destinationResult.error
  ) {
    throw new Error("Unable to load testimonial.");
  }

  if (!testimonialResult.data) {
    notFound();
  }

  const { data: placements, error: placementError } = await supabase
    .from("blog_testimonial_pages")
    .select("page_id")
    .eq("testimonial_id", id);

  if (placementError) {
    throw new Error("Unable to load testimonial destinations.");
  }

  const scope = testimonialResult.data.destination_scope;

  if (scope !== "GLOBAL" && scope !== "SELECTED") {
    throw new Error("Invalid testimonial destination scope.");
  }

  const testimonial: TestimonialFormData = {
    ...testimonialResult.data,
    destination_scope: scope,
    page_ids: (placements ?? []).map((item) => item.page_id),
  };

  return (
    <div className="max-w-5xl space-y-7 text-white">
      <header>
        <Link
          href="/blog-admin/testimonials"
          className="text-sm text-[#D5FF66] hover:underline"
        >
          ← Testimonial Management
        </Link>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
          SHARED CONTENT MANAGEMENT
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Edit Testimonial
        </h1>

        <p className="mt-3 text-lg text-white/70">{testimonial.student_name}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              statusStyles[testimonial.status] ?? statusStyles.DRAFT
            }`}
          >
            {testimonial.status}
          </span>

          <span
            className={`text-xs ${
              testimonial.consent_confirmed
                ? "text-[#D5FF66]"
                : "text-yellow-300"
            }`}
          >
            {testimonial.consent_confirmed
              ? "Consent confirmed"
              : "Consent not confirmed"}
          </span>
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

      {testimonial.status === "PUBLISHED" && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm leading-7 text-yellow-100">
          This testimonial is published. Saving changes may immediately affect
          eligible public geographic pages. Confirm permission for any revised
          content or image before saving.
        </div>
      )}

      <TestimonialForm
        testimonial={testimonial}
        programmes={programmeResult.data ?? []}
        destinations={destinationResult.data ?? []}
        action={updateBlogTestimonial}
      />
    </div>
  );
}
