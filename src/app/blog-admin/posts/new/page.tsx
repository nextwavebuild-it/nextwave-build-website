import Link from "next/link";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import { createBlogPost } from "@/lib/blog-admin/actions";

import RichTextEditor from "@/components/blog-admin/RichTextEditor";
import FeaturedImageUploader from "@/components/blog-admin/FeaturedImageUploader";
import PublishingDestinationSelector from "@/components/blog-admin/PublishingDestinationSelector";

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewBlogPost({ searchParams }: Props) {
  const { supabase } = await requireBlogAdmin();

  const [categories, pages, countries] = await Promise.all([
    supabase.from("blog_categories").select("id,name").order("name"),

    supabase
      .from("blog_pages")
      .select("id,name,slug,page_type,status,country_id")
      .order("name"),

    supabase
      .from("blog_countries")
      .select("id,name,country_code,is_active")
      .order("name"),
  ]);

  const query = await searchParams;

  const loadingError = Boolean(
    categories.error || pages.error || countries.error,
  );

  return (
    <main className="max-w-6xl space-y-7">
      {/* PAGE HEADING */}
      <div>
        <Link
          href="/blog-admin/posts"
          className="text-sm font-medium text-[#D5FF66] transition-colors hover:text-[#C5EF53]"
        >
          ← Back to All Articles
        </Link>

        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
          CONTENT EDITOR
        </p>

        <h1 className="mt-2 text-4xl font-semibold text-white">
          Create Blog Article
        </h1>

        <p className="mt-3 text-sm text-white/60">
          Create educational content with rich-text formatting, SEO metadata,
          and multiple publishing destinations.
        </p>
      </div>

      {/* ERROR MESSAGES */}
      {query.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          {query.error}
        </p>
      )}

      {loadingError && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          Could not load article categories or publishing destinations. Saving
          has been disabled.
        </p>
      )}

      {/* ARTICLE FORM */}
      <form
        action={createBlogPost}
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"
      >
        <div className="space-y-5">
          {/* ARTICLE CONTENT */}
          <section className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6">
            <h2 className="text-xl font-semibold text-white">
              Article Content
            </h2>

            {/* TITLE */}
            <label className="block text-sm text-white/85">
              Article Title *
              <input
                className={input}
                name="title"
                minLength={5}
                maxLength={180}
                required
                placeholder="How to Start a Dropshipping Business"
              />
            </label>

            {/* SLUG */}
            <label className="block text-sm text-white/85">
              URL Slug (optional; generated from title)
              <input
                className={input}
                name="slug"
                maxLength={180}
                placeholder="how-to-start-a-dropshipping-business"
              />
            </label>

            {/* SUMMARY */}
            <label className="block text-sm text-white/85">
              Summary
              <textarea
                className={input}
                name="excerpt"
                maxLength={500}
                rows={3}
                placeholder="Write a short article summary..."
              />
            </label>

            {/* TIPTAP RICH-TEXT EDITOR */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/85">
                Article Body *
              </label>

              <RichTextEditor initialContent={null} />

              <p className="text-xs leading-6 text-white/45">
                Format your article using H2 and H3 headings, bold and italic
                text, numbered lists, bullet lists, blockquotes, and internal
                links.
              </p>

              <p className="text-xs text-white/40">
                Your article title is the H1. Use H2 and H3 headings inside the
                article for a clear document structure.
              </p>
            </div>
          </section>

          {/* SEO METADATA */}
          <section className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">SEO Metadata</h2>

              <p className="mt-2 text-xs text-white/45">
                Configure how your article appears in search engine results.
              </p>
            </div>

            {/* SEO TITLE */}
            <label className="block text-sm text-white/85">
              SEO Title
              <input
                className={input}
                name="seo_title"
                maxLength={180}
                placeholder="Enter an SEO-optimized title"
              />
            </label>

            {/* META DESCRIPTION */}
            <label className="block text-sm text-white/85">
              Meta Description
              <textarea
                className={input}
                name="seo_description"
                maxLength={300}
                rows={3}
                placeholder="Write a compelling search engine description"
              />
            </label>

            {/* FEATURED IMAGE */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/85">
                Featured Image
              </label>

              <FeaturedImageUploader />
            </div>

            {/* IMAGE ALT TEXT */}
            <label className="block text-sm text-white/85">
              Featured Image Alt Text
              <input
                className={input}
                name="featured_image_alt"
                maxLength={300}
                placeholder="Describe what the image shows"
              />
            </label>
          </section>
        </div>

        {/* PUBLISHING SIDEBAR */}
        <aside className="space-y-5">
          <section className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6">
            <h2 className="text-lg font-semibold text-white">Publishing</h2>

            {/* CATEGORY */}
            <label className="block text-sm text-white/85">
              Category
              <select className={input} name="category_id" defaultValue="">
                <option value="">Uncategorized</option>

                {categories.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {/* STATUS */}
            <label className="block text-sm text-white/85">
              Status
              <select className={input} name="status" defaultValue="DRAFT">
                <option value="DRAFT">Save Draft</option>

                <option value="PUBLISHED">Publish Now</option>
              </select>
            </label>

            {/* PUBLISHING DESTINATIONS */}
            <PublishingDestinationSelector
              pages={pages.data ?? []}
              countries={countries.data ?? []}
              initialSelectedIds={(pages.data ?? [])
                .filter((page) => page.page_type === "GLOBAL")
                .map((page) => page.id)}
            />

            {/* ADD DESTINATION */}
            <Link
              href="/blog-admin/pages"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#D5FF66] transition-colors hover:text-[#C5EF53]"
            >
              + Add publishing destination
            </Link>

            {/* SAVE */}
            <button
              type="submit"
              disabled={loadingError}
              className="w-full rounded-lg bg-[#D5FF66] px-5 py-3 font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FF66] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Article
            </button>
          </section>
        </aside>
      </form>
    </main>
  );
}
