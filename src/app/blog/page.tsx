import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { blogPublic, getGlobalBlogPosts } from "@/lib/blog-public";

import BlogPostGrid from "@/components/blog/BlogPostGrid";

export const dynamic = "force-dynamic";

const BASE_URL = "https://nextwavebuild.com";

type Props = {
  searchParams: Promise<{ page?: string }>;
};

function parsePage(value?: string) {
  const requested = Number(value ?? "1");

  return Number.isSafeInteger(requested) && requested > 0
    ? Math.min(requested, 10000)
    : 1;
}

// Correct canonical URL for each pagination page.
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = parsePage(page);

  const url =
    currentPage === 1
      ? `${BASE_URL}/blog`
      : `${BASE_URL}/blog?page=${currentPage}`;

  return {
    title: "Digital Skills & Education Blog | NextWave Build",
    description:
      "Explore practical insights into AI, technology, e-commerce, dropshipping, freelancing and online careers with NextWave Build.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "NextWave Build | Education Blog",
      description:
        "Insights, guides and ideas for building practical digital skills.",
      url,
      type: "website",
    },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = parsePage(page);

  const [articles, categoryResult] = await Promise.all([
    getGlobalBlogPosts(currentPage),
    blogPublic.from("blog_categories").select("id,name,slug").order("name"),
  ]);

  if (categoryResult.error) {
    throw new Error(
      `Unable to load blog categories: ${categoryResult.error.message}`,
    );
  }

  const categories = categoryResult.data ?? [];

  return (
    <main className="min-h-screen bg-[#101214] text-white">
      {/* BLOG HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:pb-28 lg:pt-28">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#D5FF66]">
            NEXTWAVE BUILD / JOURNAL
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Learn Today.
            <span className="block text-[#D5FF66]">Build Tomorrow.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            Discover educational insights, practical guides and emerging
            opportunities in technology, artificial intelligence, e-commerce and
            freelancing.
          </p>

          {/* CLICKABLE CATEGORY LINKS */}
          <nav
            aria-label="Blog categories"
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="/blog"
              aria-current="page"
              className="rounded-full border border-[#D5FF66] bg-[#D5FF66] px-4 py-2 text-xs font-semibold !text-[#101214]"
            >
              All Articles
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70 transition-colors hover:border-[#D5FF66] hover:text-[#D5FF66]"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* ARTICLE LISTING */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
              KNOWLEDGE HUB
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Latest Insights
            </h2>
          </div>

          <p className="text-sm text-white/45">
            {articles.total} published{" "}
            {articles.total === 1 ? "article" : "articles"}
          </p>
        </div>

        <BlogPostGrid
          posts={articles.posts}
          total={articles.total}
          currentPage={currentPage}
          pageSize={articles.pageSize}
          basePath="/blog"
        />

        {/* SUPPORTING INTERNAL LINK */}
        <div className="mt-16 flex items-center gap-3 border-t border-white/10 pt-8 text-sm text-white/50">
          <BookOpen size={18} className="text-[#D5FF66]" />

          <p>
            Explore our practical guides and{" "}
            <Link
              href="/#flagships"
              className="font-medium text-[#D5FF66] hover:underline"
            >
              learning programmes
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
