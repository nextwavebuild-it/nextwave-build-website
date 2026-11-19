import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";

import type { getGlobalBlogPosts } from "@/lib/blog-public";

type BlogPosts = Awaited<ReturnType<typeof getGlobalBlogPosts>>["posts"];

type Props = {
  posts: BlogPosts;
  total: number;
  currentPage: number;
  pageSize: number;
  basePath: string;
};

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function pageUrl(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

export default function BlogPostGrid({
  posts,
  total,
  currentPage,
  pageSize,
  basePath,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      {!posts.length ? (
        <div className="rounded-2xl border border-white/10 bg-[#181C1E] px-6 py-20 text-center">
          <BookOpen className="mx-auto text-[#D5FF66]" size={36} />

          <h2 className="mt-5 text-2xl font-semibold">
            {total === 0
              ? "Insights are coming soon"
              : "No articles on this page"}
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-white/50">
            {total === 0
              ? "We are preparing practical guides and educational resources."
              : "Choose an earlier page to continue exploring."}
          </p>

          {total > 0 && (
            <Link
              href={basePath}
              className="mt-6 inline-flex text-sm font-semibold text-[#D5FF66]"
            >
              Back to first page
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#181C1E] transition-colors hover:border-[#D5FF66]/40"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="aspect-[16/10] overflow-hidden bg-[#24292B]">
                  {post.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featured_image}
                      alt={post.featured_image_alt || ""}
                      loading="lazy"
                      className="nextwave-blog-card-image"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={42} className="text-[#D5FF66]/50" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="flex items-center gap-2 text-xs text-white/45">
                    <CalendarDays size={14} />
                    {formatDate(post.published_at)}
                  </p>

                  <h3 className="mt-4 text-xl font-semibold leading-snug text-white transition-colors group-hover:text-[#D5FF66]">
                    {post.title}
                  </h3>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/55">
                    {post.excerpt ||
                      "Explore practical educational insights from NextWave Build."}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#D5FF66]">
                    Read Article
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Blog pagination"
          className="mt-12 flex items-center justify-center gap-4"
        >
          {currentPage > 1 && (
            <Link
              href={pageUrl(basePath, currentPage - 1)}
              className="rounded-lg border border-white/15 px-5 py-3 text-sm hover:border-[#D5FF66]"
            >
              Previous
            </Link>
          )}

          <span className="text-sm text-white/55">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages && (
            <Link
              href={pageUrl(basePath, currentPage + 1)}
              className="rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53]"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
