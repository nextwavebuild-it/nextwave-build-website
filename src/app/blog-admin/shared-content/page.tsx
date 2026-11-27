import Link from "next/link";

import { Layers, Pencil, CheckCircle2, CircleOff } from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { changeBlogSharedContentStatus } from "@/lib/blog-admin/shared-content-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

const SECTION_DETAILS: Record<string, { name: string; description: string }> = {
  trust_benefits: {
    name: "Trust Benefits",
    description: "Common learning benefits and student support.",
  },
  why_nextwave: {
    name: "Why NextWave Build",
    description: "Brand advantages and educational differentiators.",
  },
  enrollment_steps: {
    name: "Enrollment Steps",
    description: "Registration and programme enrollment process.",
  },
  learning_method: {
    name: "Learning Method",
    description: "How students learn, practise and build projects.",
  },
  programme_comparison: {
    name: "Programme Comparison",
    description: "Shared introduction for programme comparisons.",
  },
  shared_faqs: {
    name: "Shared FAQs",
    description: "Common questions about programmes and enrollment.",
  },
};

function countItems(value: unknown): number {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return 0;
  }

  const content = value as Record<string, unknown>;

  return Array.isArray(content.items) ? content.items.length : 0;
}

export default async function SharedContentPage({ searchParams }: Props) {
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const { data, error } = await supabase
    .from("blog_shared_content")
    .select("id,section_key,heading,description,content,is_active,updated_at");

  if (error) {
    throw new Error("Unable to load shared content.");
  }

  const sections = (data ?? [])
    .filter((item) => Object.hasOwn(SECTION_DETAILS, item.section_key))
    .sort(
      (a, b) =>
        Object.keys(SECTION_DETAILS).indexOf(a.section_key) -
        Object.keys(SECTION_DETAILS).indexOf(b.section_key),
    );

  const activeCount = sections.filter((section) => section.is_active).length;

  return (
    <div className="space-y-8 text-white">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
          SHARED CONTENT MANAGEMENT
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Shared Content
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/55">
          Manage reusable content across country and city landing pages from one
          central location.
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

      {/* STATISTICS */}

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Sections",
            value: sections.length,
            icon: Layers,
          },
          {
            label: "Active Sections",
            value: activeCount,
            icon: CheckCircle2,
          },
          {
            label: "Inactive Sections",
            value: sections.length - activeCount,
            icon: CircleOff,
          },
        ].map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className="rounded-xl border border-white/10 bg-[#15191A] p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/55">{statistic.label}</p>

                <Icon size={22} className="text-[#D5FF66]" />
              </div>

              <p className="mt-5 text-4xl font-semibold">{statistic.value}</p>
            </article>
          );
        })}
      </section>

      <div className="rounded-xl border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-5">
        <p className="text-sm font-semibold text-[#D5FF66]">
          Centralized Content
        </p>

        <p className="mt-2 text-sm leading-7 text-white/55">
          Active sections provide reusable content to V3 geographic pages.
          Location-specific content can override shared content. Changes to
          active sections may appear immediately on published V3 pages.
        </p>
      </div>

      {/* SHARED CONTENT CARDS */}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const details = SECTION_DETAILS[section.section_key];

          return (
            <article
              key={section.id}
              className="flex flex-col rounded-xl border border-white/10 bg-[#15191A] p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#D5FF66]/20 bg-[#D5FF66]/10">
                  <Layers size={24} className="text-[#D5FF66]" />
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    section.is_active
                      ? "border-[#D5FF66]/25 bg-[#D5FF66]/10 text-[#D5FF66]"
                      : "border-white/15 bg-white/5 text-white/50"
                  }`}
                >
                  {section.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <h2 className="mt-6 text-xl font-semibold">{details.name}</h2>

              <p className="mt-3 text-sm leading-7 text-white/55">
                {details.description}
              </p>

              <div className="my-6 space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-white/45">Current heading</p>

                <p className="text-sm font-medium">
                  {section.heading || "Not configured"}
                </p>

                <p className="text-xs text-white/45">
                  Content items: {countItems(section.content)}
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 pt-5">
                <Link
                  href={`/blog-admin/shared-content/${section.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-4 py-2.5 text-xs font-semibold !text-[#101214] hover:bg-[#C5EF53]"
                >
                  <Pencil size={14} />
                  Edit Content
                </Link>

                <form action={changeBlogSharedContentStatus}>
                  <input type="hidden" name="id" value={section.id} />

                  <input
                    type="hidden"
                    name="updated_at"
                    value={section.updated_at}
                  />

                  <input
                    type="hidden"
                    name="status"
                    value={section.is_active ? "INACTIVE" : "ACTIVE"}
                  />

                  <button
                    type="submit"
                    className={`rounded-lg border px-4 py-2.5 text-xs font-semibold ${
                      section.is_active
                        ? "border-red-500/30 !bg-red-500/10 !text-red-300 hover:!bg-red-500/20"
                        : "border-[#D5FF66]/25 !bg-[#D5FF66]/10 !text-[#D5FF66] hover:!bg-[#D5FF66]/20"
                    }`}
                  >
                    {section.is_active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </section>

      {!sections.length && (
        <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-white/50">
          No shared content records found.
        </p>
      )}
    </div>
  );
}
