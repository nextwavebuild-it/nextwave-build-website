import Link from "next/link";
import { notFound } from "next/navigation";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { updateBlogSharedContent } from "@/lib/blog-admin/shared-content-actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

type ContentItem = {
  title: string;
  description: string;
};

const SECTION_NAMES: Record<string, string> = {
  trust_benefits: "Trust Benefits",
  why_nextwave: "Why NextWave Build",
  enrollment_steps: "Enrollment Steps",
  learning_method: "Learning Method",
  programme_comparison: "Programme Comparison",
  shared_faqs: "Shared FAQs",
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

const sectionClass =
  "space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6";

function parseItems(value: unknown): ContentItem[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  const content = value as Record<string, unknown>;

  if (!Array.isArray(content.items)) {
    return [];
  }

  return content.items.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const record = item as Record<string, unknown>;

    return [
      {
        title: typeof record.title === "string" ? record.title : "",

        description:
          typeof record.description === "string" ? record.description : "",
      },
    ];
  });
}

export default async function EditSharedContentPage({
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

  const { data: section, error } = await supabase
    .from("blog_shared_content")
    .select("id,section_key,heading,description,content,is_active,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load shared content.");
  }

  if (!section || !Object.hasOwn(SECTION_NAMES, section.section_key)) {
    notFound();
  }

  const sectionName = SECTION_NAMES[section.section_key];

  const items = parseItems(section.content);

  const isFAQ = section.section_key === "shared_faqs";

  const isComparison = section.section_key === "programme_comparison";

  const itemCount = Math.min(Math.max(items.length + 3, 5), 30);

  return (
    <div className="max-w-5xl space-y-7 text-white">
      <header>
        <Link
          href="/blog-admin/shared-content"
          className="text-sm text-[#D5FF66] hover:underline"
        >
          ← Shared Content
        </Link>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
          SHARED CONTENT MANAGEMENT
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Edit {sectionName}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              section.is_active
                ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                : "border-white/15 bg-white/5 text-white/50"
            }`}
          >
            {section.is_active ? "Active" : "Inactive"}
          </span>

          <span className="text-xs text-white/45">{section.section_key}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-white/55">
          Configure reusable content for country and city landing pages.
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

      {section.is_active && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4 text-sm leading-7 text-yellow-100">
          This section is active. Saving changes may immediately affect
          published V3 geographic pages.
        </div>
      )}

      <form action={updateBlogSharedContent} className="space-y-6">
        <input type="hidden" name="id" value={section.id} />

        <input type="hidden" name="updated_at" value={section.updated_at} />

        {/* SECTION INFORMATION */}

        <section className={sectionClass}>
          <h2 className="text-xl font-semibold">1. Section Information</h2>

          <label className="block text-sm font-medium">
            Section heading
            <input
              name="heading"
              defaultValue={section.heading}
              maxLength={180}
              required
              className={input}
            />
          </label>

          <label className="block text-sm font-medium">
            Section description
            <textarea
              name="description"
              defaultValue={section.description}
              maxLength={2000}
              rows={5}
              className={input}
            />
          </label>

          <p className="text-xs leading-6 text-white/45">
            Keep shared descriptions relevant to learners across different
            countries. Add location-specific information through the geographic
            page editor.
          </p>
        </section>

        {/* REPEATABLE CONTENT ITEMS */}

        {(!isComparison || items.length > 0) && (
          <section className={sectionClass}>
            <h2 className="text-xl font-semibold">
              2. {isFAQ ? "Questions and Answers" : "Content Items"}
            </h2>

            <p className="text-xs leading-6 text-white/45">
              Leave unused fields empty. Clear both fields to remove an existing
              item. Save to receive additional empty slots, up to 30 items.
            </p>

            {Array.from({
              length: itemCount,
            }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#D5FF66]">
                  {isFAQ ? "Question" : "Item"} {index + 1}
                </p>

                <label className="block text-sm font-medium">
                  {isFAQ ? "Question" : "Title"}

                  <input
                    name="item_title"
                    defaultValue={items[index]?.title ?? ""}
                    maxLength={180}
                    placeholder={
                      isFAQ
                        ? "Enter a frequently asked question"
                        : "Enter item title"
                    }
                    className={input}
                  />
                </label>

                <label className="block text-sm font-medium">
                  {isFAQ ? "Answer" : "Description"}

                  <textarea
                    name="item_description"
                    defaultValue={items[index]?.description ?? ""}
                    maxLength={2000}
                    rows={4}
                    placeholder={
                      isFAQ ? "Enter the answer" : "Enter item description"
                    }
                    className={input}
                  />
                </label>
              </div>
            ))}
          </section>
        )}

        {/* DISPLAY SETTINGS */}

        <section className={sectionClass}>
          <h2 className="text-xl font-semibold">
            {isComparison && !items.length ? "2" : "3"}. Display Settings
          </h2>

          <label className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={section.is_active}
              className="mt-1 h-5 w-5 shrink-0 accent-[#D5FF66]"
            />

            <div>
              <p className="text-sm font-semibold">Active shared section</p>

              <p className="mt-2 text-xs leading-6 text-white/50">
                Make this content available to V3 geographic pages. Individual
                page visibility settings still determine whether the section
                appears.
              </p>
            </div>
          </label>
        </section>

        {/* ACTIONS */}

        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#101214] p-4 shadow-xl">
          <Link
            href="/blog-admin/shared-content"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-[#D5FF66] px-7 py-3 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53]"
          >
            Save Shared Content
          </button>
        </div>
      </form>
    </div>
  );
}
