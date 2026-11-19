import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { blogPublic, getGlobalBlogPosts } from "@/lib/blog-public";

import BlogPostGrid from "@/components/blog/BlogPostGrid";

export const dynamic = "force-dynamic";

const BASE_URL = "https://nextwavebuild.com";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function parsePage(value?: string) {
  const requested = Number(value ?? "1");

  return Number.isSafeInteger(requested) && requested > 0
    ? Math.min(requested, 10000)
    : 1;
}

async function getCategory(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  const { data, error } = await blogPublic
    .from("blog_categories")
    .select("id,name,slug,description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load blog category: ${error.message}`);
  }

  return data;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await searchParams;

  const category = await getCategory(slug);

  if (!category) {
    return {
      title: "Category Not Found | NextWave Build",
      robots: { index: false, follow: false },
    };
  }

  const currentPage = parsePage(page);
  const articles = await getGlobalBlogPosts(currentPage, 9, category.id);

  const basePath = `/blog/category/${category.slug}`;

  const canonical =
    currentPage === 1
      ? `${BASE_URL}${basePath}`
      : `${BASE_URL}${basePath}?page=${currentPage}`;

  const title = `${category.name} Articles & Guides | NextWave Build`;

  const description =
    category.description ||
    `Explore practical ${category.name} guides, insights and educational articles from NextWave Build.`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    // Avoid indexing empty category pages or invalid pages.
    robots: {
      index: articles.posts.length > 0,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const currentPage = parsePage(page);
  const category = await getCategory(slug);

  if (!category) notFound();

  const [articles, categoryResult] = await Promise.all([
    getGlobalBlogPosts(currentPage, 9, category.id),

    blogPublic.from("blog_categories").select("id,name,slug").order("name"),
  ]);

  if (categoryResult.error) {
    throw new Error(
      `Unable to load categories: ${categoryResult.error.message}`,
    );
  }

  const categories = categoryResult.data ?? [];
  const basePath = `/blog/category/${category.slug}`;

  return (
    <main className="min-h-screen bg-[#101214] text-white">
      {/* CATEGORY HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:pb-20 lg:pt-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D5FF66] hover:text-[#C5EF53]"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-[#D5FF66]">
            NEXTWAVE BUILD / KNOWLEDGE HUB
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60">
            {category.description ||
              `Discover educational guides, insights and practical learning resources about ${category.name}.`}
          </p>

          {/* CATEGORY NAVIGATION */}
          <nav
            aria-label="Blog categories"
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link
              href="/blog"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70 hover:border-[#D5FF66] hover:text-[#D5FF66]"
            >
              All Articles
            </Link>

            {categories.map((item) => {
              const active = item.slug === category.slug;

              return (
                <Link
                  key={item.id}
                  href={`/blog/category/${item.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-full border border-[#D5FF66] bg-[#D5FF66] px-4 py-2 text-xs font-semibold !text-[#101214]"
                      : "rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/70 transition-colors hover:border-[#D5FF66] hover:text-[#D5FF66]"
                  }
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* FILTERED ARTICLE LIST */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
              CATEGORY INSIGHTS
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Latest Articles
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
          basePath={basePath}
        />
      </section>
    </main>
  );
}
