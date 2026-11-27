import Link from "next/link";

import MentorForm from "@/components/blog-admin/MentorForm";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { createBlogMentor } from "@/lib/blog-admin/mentor-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewMentorPage({ searchParams }: Props) {
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const { data: programmes, error } = await supabase
    .from("blog_programmes")
    .select("id,name,is_active")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load programmes.");
  }

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

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Add Mentor</h1>

        <p className="mt-3 text-sm leading-7 text-white/55">
          Create a public mentor profile for geographic landing pages.
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

      <MentorForm programmes={programmes ?? []} action={createBlogMentor} />
    </div>
  );
}
