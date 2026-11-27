import Link from "next/link";

import ProgrammeForm from "@/components/blog-admin/ProgrammeForm";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { createBlogProgramme } from "@/lib/blog-admin/programme-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewProgrammePage({ searchParams }: Props) {
  await requireBlogAdmin();

  const query = await searchParams;

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
          Create Programme
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/55">
          Create a shared programme record for country and city landing pages.
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

      <ProgrammeForm action={createBlogProgramme} />
    </div>
  );
}
