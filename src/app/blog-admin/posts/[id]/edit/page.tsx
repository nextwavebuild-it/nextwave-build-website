import Link from "next/link";
import { notFound } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/blog-admin/RichTextEditor";
import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import { updateBlogPost } from "@/lib/blog-admin/actions";
import FeaturedImageUploader from "@/components/blog-admin/FeaturedImageUploader";

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 transition-colors focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

type ArticleContent = {
  format?: string;
  text?: string;
  doc?: JSONContent;
} | null;

export default async function EditBlogPost({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const [postResult, categories, pages, assignments] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", id).single(),

    supabase.from("blog_categories").select("id,name").order("name"),

    supabase
      .from("blog_pages")
      .select("id,name,page_type,status")
      .order("name"),

    supabase.from("blog_post_pages").select("page_id").eq("post_id", id),
  ]);

  const post = postResult.data;

  if (!post) {
    notFound();
  }

  const selectedPages = new Set(
    assignments.data?.map((item) => item.page_id) ?? [],
  );

  // Support existing plain-text and new Tiptap articles.
  const content = post.content as ArticleContent;

  const supportedContent =
    content?.format === "plain_text_v1" ||
    (content?.format === "tiptap_v1" && content.doc?.type === "doc");

  const loadingError =
    Boolean(categories.error) ||
    Boolean(pages.error) ||
    Boolean(assignments.error) ||
    !supportedContent;

  return (
    <main className="max-w-6xl space-y-7">
      {/* Page heading */}
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

        <h1 className="mt-2 text-4xl font-semibold text-white">Edit Article</h1>

        <p className="mt-3 text-sm text-white/50">
          Update your article, SEO settings, and publishing destinations.
        </p>
      </div>

      {/* Error message */}
      {query.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {query.error}
        </p>
      )}

      {/* Loading or content format error */}
      {loadingError && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          Some article information could not be loaded, or the article uses an
          unsupported content format. Saving has been disabled to prevent
          accidental data loss.
        </p>
      )}

      {/* Article form */}
      <form
        action={updateBlogPost}
        className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"
      >
        <input type="hidden" name="id" value={post.id} />

        <div className="space-y-5">
          {/* Article content section */}
          <section className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6">
            <h2 className="text-xl font-semibold text-white">
              Article Content
            </h2>

            {/* Article Title */}
            <label className="block text-sm text-white/80">
              Article Title *
              <input
                name="title"
                defaultValue={post.title}
                minLength={5}
                maxLength={180}
                required
                className={input}
              />
            </label>

            {/* Slug */}
            <label className="block text-sm text-white/80">
              URL Slug *
              <input
                name="slug"
                defaultValue={post.slug}
                required
                className={input}
              />
            </label>

            {/* Summary */}
            <label className="block text-sm text-white/80">
              Summary
              <textarea
                name="excerpt"
                defaultValue={post.excerpt ?? ""}
                maxLength={500}
                rows={3}
                className={input}
              />
            </label>

            {/* New Tiptap Rich-Text Editor */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">
                Article Body *
              </label>

              <RichTextEditor initialContent={content} />

              <p className="text-xs text-white/40">
                Use headings, paragraphs, bold text, lists, blockquotes, and
                links to structure your article.
              </p>
            </div>
          </section>

          {/* SEO Metadata section */}
          <section className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6">
            <div>
              <h2 className="text-xl font-semibold text-white">SEO Metadata</h2>

              <p className="mt-2 text-xs text-white/45">
                Optimize how your article will appear in search engines.
              </p>
            </div>

            <label className="block text-sm text-white/80">
              SEO Title
              <input
                name="seo_title"
                defaultValue={post.seo_title ?? ""}
                maxLength={180}
                className={input}
              />
            </label>

            <label className="block text-sm text-white/80">
              Meta Description
              <textarea
                name="seo_description"
                defaultValue={post.seo_description ?? ""}
                maxLength={300}
                rows={3}
                className={input}
              />
            </label>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/80">
                Featured Image
              </label>

              <FeaturedImageUploader initialUrl={post.featured_image} />
            </div>

            <label className="block text-sm text-white/80">
              Featured Image Alt Text
              <input
                name="featured_image_alt"
                defaultValue={post.featured_image_alt ?? ""}
                className={input}
                placeholder="Describe the featured image"
              />
            </label>
          </section>
        </div>

        {/* Publishing settings sidebar */}
        <aside>
          <section className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6">
            <h2 className="text-lg font-semibold text-white">
              Publishing Settings
            </h2>

            {/* Category */}
            <label className="block text-sm text-white/80">
              Category
              <select
                name="category_id"
                defaultValue={post.category_id ?? ""}
                className={input}
              >
                <option value="">Uncategorized</option>

                {categories.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Status */}
            <label className="block text-sm text-white/80">
              Publishing Status
              <select
                name="status"
                defaultValue={post.status}
                className={input}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>

            {/* Publishing destinations */}
            <div>
              <p className="mb-3 text-sm font-medium text-white/80">
                Publishing Destinations *
              </p>

              <div className="space-y-3">
                {pages.data?.map((page) => (
                  <label
                    key={page.id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-[#1c2022] p-3 text-sm transition-colors hover:border-[#D5FF66]/40 has-[:checked]:border-[#D5FF66]/60 has-[:checked]:bg-[#D5FF66]/5"
                  >
                    <input
                      type="checkbox"
                      name="page_ids"
                      value={page.id}
                      defaultChecked={selectedPages.has(page.id)}
                      className="mt-0.5 h-4 w-4 accent-[#D5FF66]"
                    />

                    <span className="min-w-0">
                      <span className="block font-medium text-white">
                        {page.name}
                      </span>

                      <small className="mt-1 block text-xs text-white/45">
                        {page.page_type} · {page.status}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Link
              href="/blog-admin/pages"
              className="block text-sm font-medium text-[#D5FF66] transition-colors hover:text-[#C5EF53]"
            >
              + Manage Publishing Destinations
            </Link>

            {/* Save Changes */}
            <button
              type="submit"
              disabled={loadingError}
              className="w-full rounded-xl bg-[#D5FF66] px-5 py-3 font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Changes
            </button>
          </section>
        </aside>
      </form>
    </main>
  );
}
