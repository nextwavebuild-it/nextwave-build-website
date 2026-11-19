import Link from "next/link";
import {
  FilePlus2,
  Pencil,
  Search,
  Archive,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import { changeBlogPostStatus } from "@/lib/blog-admin/actions";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  page?: string;
  success?: string;
  error?: string;
}>;

const PAGE_SIZE = 15;

export default async function AllBlogPosts({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireBlogAdmin();
  const params = await searchParams;

  const search = (params.q ?? "").trim().slice(0, 120);

  const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(
    params.status ?? "",
  )
    ? params.status!
    : "ALL";

  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  let query = supabase
    .from("blog_posts")
    .select("id,title,slug,status,created_at,updated_at,published_at", {
      count: "exact",
    });

  if (status !== "ALL") {
    query = query.eq("status", status);
  }

  if (search) {
    // Treat user search as literal text rather than LIKE patterns.
    const safeSearch = search.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("title", `%${safeSearch}%`);
  }

  const {
    data: posts,
    count,
    error,
  } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  function pageHref(targetPage: number) {
    const url = new URLSearchParams();

    if (search) url.set("q", search);
    if (status !== "ALL") url.set("status", status);

    url.set("page", String(targetPage));

    return `/blog-admin/posts?${url.toString()}`;
  }

  return (
    <main className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
            CONTENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-white">
            All Articles
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Search, edit, publish and archive your blog content.
          </p>
        </div>

        <Link
          href="/blog-admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53]"
        >
          <FilePlus2 size={17} />
          New Article
        </Link>
      </div>

      {params.success && (
        <p
          role="status"
          className="rounded-xl border border-[#D5FF66]/30 bg-[#D5FF66]/10 p-4 text-sm text-[#D5FF66]"
        >
          {params.success}
        </p>
      )}

      {params.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {params.error}
        </p>
      )}

      <section className="rounded-xl border border-white/10 bg-[#15191A] p-5">
        <form
          action="/blog-admin/posts"
          method="get"
          className="flex flex-wrap items-end gap-3"
        >
          <label className="min-w-[220px] flex-1 text-sm text-white/70">
            Search articles
            <div className="relative mt-2">
              <Search
                size={17}
                className="absolute left-3 top-3.5 text-white/40"
              />

              <input
                name="q"
                defaultValue={search}
                placeholder="Search by title..."
                maxLength={120}
                className="w-full rounded-lg border border-white/15 bg-[#1c2022] py-3 pl-10 pr-4 text-white outline-none focus:border-[#D5FF66]"
              />
            </div>
          </label>

          <label className="text-sm text-white/70">
            Status
            <select
              name="status"
              defaultValue={status}
              className="mt-2 block rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none focus:border-[#D5FF66]"
            >
              <option value="ALL">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>

          <button
            type="submit"
            className="rounded-lg bg-[#D5FF66] px-5 py-3 font-semibold !text-[#101214] hover:bg-[#C5EF53]"
          >
            Filter
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-[#15191A]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Articles</h2>

          <span className="text-sm text-white/50">{count ?? 0} results</span>
        </div>

        {error ? (
          <p role="alert" className="p-6 text-red-300">
            Could not load articles: {error.message}
          </p>
        ) : !posts?.length ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-white">No articles found</p>

            <p className="mt-2 text-sm text-white/50">
              Create an article or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="px-5 py-4">Article</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.025]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{post.title}</p>

                      <p className="mt-1 text-xs text-white/40">
                        /blog/{post.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                          post.status === "PUBLISHED"
                            ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                            : post.status === "ARCHIVED"
                              ? "border-red-400/25 bg-red-400/10 text-red-300"
                              : "border-white/15 bg-white/5 text-white/60"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-white/60">
                      {new Date(post.created_at).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog-admin/posts/${post.id}/edit`}
                          aria-label={`Edit ${post.title}`}
                          title="Edit article"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 !bg-[#252B2C] !text-white transition-colors hover:border-[#D5FF66] hover:!bg-[#303839] hover:!text-[#D5FF66]"
                        >
                          <Pencil size={16} />
                        </Link>

                        {post.status !== "PUBLISHED" ? (
                          <form action={changeBlogPostStatus}>
                            <input type="hidden" name="id" value={post.id} />
                            <input
                              type="hidden"
                              name="status"
                              value="PUBLISHED"
                            />
                            <button
                              type="submit"
                              aria-label={`Publish ${post.title}`}
                              title="Publish article"
                              className="rounded-lg border border-white/15 p-2 text-[#D5FF66] hover:bg-[#D5FF66]/10"
                            >
                              <Eye size={16} />
                            </button>
                          </form>
                        ) : (
                          <form action={changeBlogPostStatus}>
                            <input type="hidden" name="id" value={post.id} />
                            <input type="hidden" name="status" value="DRAFT" />
                            <button
                              type="submit"
                              aria-label={`Unpublish ${post.title}`}
                              title="Unpublish article"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 !bg-[#252B2C] !text-white transition-colors hover:border-[#D5FF66] hover:!bg-[#303839] hover:!text-[#D5FF66]"
                            >
                              <EyeOff size={17} className="!text-white" />
                            </button>
                          </form>
                        )}

                        {post.status !== "ARCHIVED" ? (
                          <form action={changeBlogPostStatus}>
                            <input type="hidden" name="id" value={post.id} />
                            <input
                              type="hidden"
                              name="status"
                              value="ARCHIVED"
                            />
                            <button
                              type="submit"
                              aria-label={`Archive ${post.title}`}
                              title="Archive article"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/40 !bg-[#391A20] !text-red-200 transition-colors hover:border-red-400 hover:!bg-[#54252D] hover:!text-white"
                            >
                              <Archive size={17} className="!text-red-200" />
                            </button>
                          </form>
                        ) : (
                          <form action={changeBlogPostStatus}>
                            <input type="hidden" name="id" value={post.id} />
                            <input type="hidden" name="status" value="DRAFT" />
                            <button
                              type="submit"
                              aria-label={`Restore ${post.title} as draft`}
                              title="Restore as draft"
                              className="rounded-lg border border-white/15 p-2 text-[#D5FF66]"
                            >
                              <RotateCcw size={16} />
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!error && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
            <span className="text-sm text-white/50">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:border-[#D5FF66]"
                >
                  Previous
                </Link>
              )}

              {page < totalPages && (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:border-[#D5FF66]"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
