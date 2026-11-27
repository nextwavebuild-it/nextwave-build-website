import Link from "next/link";

import TestimonialForm from "@/components/blog-admin/TestimonialForm";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { createBlogTestimonial } from "@/lib/blog-admin/testimonial-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewTestimonialPage({ searchParams }: Props) {
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const [programmeResult, destinationResult] = await Promise.all([
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

  if (programmeResult.error || destinationResult.error) {
    throw new Error("Unable to load programmes or destinations.");
  }

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
          Add Testimonial
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/55">
          Create a student testimonial for geographic landing pages.
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

      <TestimonialForm
        programmes={programmeResult.data ?? []}
        destinations={destinationResult.data ?? []}
        action={createBlogTestimonial}
      />
    </div>
  );
}
