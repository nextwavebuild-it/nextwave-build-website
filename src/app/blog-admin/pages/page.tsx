import Link from "next/link";
import { ArrowRight, ExternalLink, Pencil } from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import { createPublishingPage } from "@/lib/blog-admin/actions";

// NextWave Build brand colors
// Primary: #D5FF66
// Hover: #C5EF53
// Background: #101214

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

export default async function PublishingPages({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}) {
  const { supabase } = await requireBlogAdmin();

  const { data: pages, error } = await supabase
    .from("blog_pages")
    .select("id,name,slug,page_type,status")
    .order("created_at");

  const query = await searchParams;

  return (
    <main className="max-w-5xl space-y-7">
      {/* PAGE HEADER */}
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
          MULTI-PAGE PUBLISHING
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Publishing Destinations
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/60">
          Create and manage country-specific SEO landing pages. Edit their
          content, prepare drafts, and manage publishing.
        </p>
      </div>

      {/* NOTIFICATIONS */}
      {query.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          {query.error}
        </div>
      )}

      {query.success && (
        <div
          role="status"
          className="rounded-xl border border-[#D5FF66]/30 bg-[#D5FF66]/10 px-5 py-4 text-sm text-[#D5FF66]"
        >
          {query.success}
        </div>
      )}

      {/* EXISTING PUBLISHING DESTINATIONS */}
      <section className="rounded-xl border border-white/10 bg-[#15191A] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Existing Pages</h2>

          <p className="mt-2 text-sm text-white/45">
            Manage the locations where your educational articles can appear.
          </p>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            Could not load publishing destinations: {error.message}
          </p>
        ) : !pages?.length ? (
          <div className="rounded-lg border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-white/50">
              No publishing destinations available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {pages.map((page) => {
              const pageUrl =
                page.page_type === "GLOBAL"
                  ? "/blog"
                  : page.page_type === "COUNTRY"
                    ? `/${page.slug}`
                    : `/pages/${page.slug}`;

              const isPublished = page.status === "PUBLISHED";

              const isCountry = page.page_type === "COUNTRY";

              return (
                <div
                  key={page.id}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* PAGE INFORMATION */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{page.name}</p>

                    <p className="mt-2 break-all text-xs text-white/45">
                      {pageUrl}
                    </p>

                    <p className="mt-2 text-xs uppercase tracking-wider text-white/35">
                      {page.page_type}
                    </p>
                  </div>

                  {/* STATUS AND ACTIONS */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        isPublished
                          ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                          : "border-white/15 bg-white/5 text-white/55"
                      }`}
                    >
                      {page.status}
                    </span>

                    {isCountry && (
                      <Link
                        href={`/blog-admin/pages/${page.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#D5FF66]/35 bg-[#D5FF66]/10 px-4 py-2 text-sm font-semibold text-[#D5FF66] transition-colors hover:border-[#D5FF66] hover:bg-[#D5FF66]/15"
                      >
                        <Pencil size={15} />
                        Edit Page
                        <ArrowRight size={14} />
                      </Link>
                    )}

                    {isPublished && (
                      <Link
                        href={pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
                      >
                        <ExternalLink size={15} />
                        View Live
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ADD NEW DESTINATION */}
      <form
        action={createPublishingPage}
        className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-white">
            Add New Destination
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Create a new country-specific or custom publishing destination.
          </p>
        </div>

        {/* PAGE NAME */}
        <label className="block text-sm font-medium text-white/85">
          Page name *
          <input
            name="name"
            required
            maxLength={120}
            className={input}
            placeholder="United Arab Emirates"
          />
        </label>

        {/* URL SLUG */}
        <label className="block text-sm font-medium text-white/85">
          URL slug (optional)
          <input name="slug" className={input} placeholder="uae" />
        </label>

        {/* PAGE TYPE */}
        <label className="block text-sm font-medium text-white/85">
          Page type *
          <select name="page_type" className={input} required>
            <option value="COUNTRY">Country</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </label>

        {/* COUNTRY CODE */}
        <label className="block text-sm font-medium text-white/85">
          2-letter country code (required for country pages)
          <input
            name="country_code"
            className={input}
            placeholder="AE"
            maxLength={2}
            autoCapitalize="characters"
          />
        </label>

        {/* PAGE HEADING */}
        <label className="block text-sm font-medium text-white/85">
          Page heading
          <input
            name="heading"
            className={input}
            placeholder="Explore Digital Skills in the UAE"
          />
        </label>

        {/* PAGE INTRODUCTION */}
        <label className="block text-sm font-medium text-white/85">
          Page introduction
          <textarea
            name="description"
            className={input}
            rows={4}
            placeholder="Introduce educational opportunities, skills, and insights relevant to this destination."
          />
        </label>

        {/* SEO TITLE */}
        <label className="block text-sm font-medium text-white/85">
          SEO title
          <input
            name="seo_title"
            className={input}
            maxLength={180}
            placeholder="Digital Skills & Education in UAE | NextWave Build"
          />
        </label>

        {/* SEO DESCRIPTION */}
        <label className="block text-sm font-medium text-white/85">
          SEO description
          <textarea
            name="seo_description"
            className={input}
            maxLength={300}
            rows={3}
            placeholder="Write a compelling description for search engines."
          />
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={Boolean(error)}
          className="inline-flex items-center justify-center rounded-xl bg-[#D5FF66] px-6 py-3 text-sm font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FF66] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create Draft Destination
        </button>
      </form>
    </main>
  );
}
