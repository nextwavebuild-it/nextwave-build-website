import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";

import BlogArticleBody from "@/components/blog/BlogArticleBody";
import RelatedArticles from "@/components/blog/RelatedArticles";
import { getPublicBlogPost } from "@/lib/blog-public";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://nextwavebuild.com";

function formatDate(date: string | null) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

/* ==========================================
   SEO METADATA
========================================== */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | NextWave Build",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = post.seo_title || post.title;

  const description =
    post.seo_description ||
    post.excerpt ||
    "Explore educational insights from NextWave Build.";

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.featured_image
        ? [
            {
              url: post.featured_image,
              alt: post.featured_image_alt || post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: post.featured_image ? "summary_large_image" : "summary",
      title,
      description,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

/* ==========================================
   PUBLIC BLOG ARTICLE PAGE
========================================== */

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;

  const post = await getPublicBlogPost(slug);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  /* ==========================================
     BLOG POST STRUCTURED DATA
  ========================================== */

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description || post.excerpt || post.title,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: "NextWave Build",
    },
    publisher: {
      "@type": "Organization",
      name: "NextWave Build",
      url: SITE_URL,
    },
    ...(post.featured_image ? { image: [post.featured_image] } : {}),
  };

  return (
    <main className="min-h-screen bg-[#101214] text-white">
      {/* ======================================
          SCHEMA MARKUP
      ====================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      {/* ======================================
          ARTICLE
      ====================================== */}

      <article>
        {/* ARTICLE HEADER */}
        <header className="border-b border-white/10">
          <div className="mx-auto max-w-4xl px-6 pb-12 pt-16 lg:pb-16 lg:pt-24">
            {/* BREADCRUMB */}
            <nav aria-label="Breadcrumb">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#D5FF66] hover:text-[#C5EF53]"
              >
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </nav>

            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-[#D5FF66]">
              NEXTWAVE BUILD / INSIGHTS
            </p>

            {/* ARTICLE TITLE */}
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            {/* ARTICLE SUMMARY */}
            {post.excerpt && (
              <p className="mt-7 text-lg leading-8 text-white/60">
                {post.excerpt}
              </p>
            )}

            {/* PUBLISHING DATES */}
            <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-white/45">
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {formatDate(post.published_at)}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={16} />
                Updated {formatDate(post.updated_at)}
              </span>
            </div>
          </div>
        </header>

        {/* ======================================
            FEATURED IMAGE
        ====================================== */}

        {post.featured_image && (
          <div className="mx-auto max-w-5xl px-6 pt-12">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c2022]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featured_image}
                alt={post.featured_image_alt || ""}
                className="nextwave-blog-featured-image"
              />
            </div>
          </div>
        )}

        {/* ======================================
            ARTICLE CONTENT
        ====================================== */}

        <div className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
          <BlogArticleBody content={post.content} />

          {/* ==================================
              NEXTWAVE PROGRAMME CTA
          ================================== */}

          <div className="mt-16 rounded-2xl border border-[#D5FF66]/20 bg-[#181C1E] p-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
              KEEP BUILDING
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Turn learning into practical skills.
            </h2>

            <p className="mt-4 leading-7 text-white/55">
              Explore NextWave Build programmes in Technology &amp; AI,
              E-Commerce and Freelancing.
            </p>

            <Link
              href="/#flagships"
              className="mt-6 inline-flex rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53]"
            >
              Explore Programmes
            </Link>
          </div>

          {/* BACK TO ALL ARTICLES */}
          <Link
            href="/blog"
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-[#D5FF66] hover:text-[#C5EF53]"
          >
            <ArrowLeft size={16} />
            Back to All Articles
          </Link>
        </div>
      </article>

      {/* ======================================
          RELATED ARTICLES — NEW FEATURE
          Outside article for wider card layout
      ====================================== */}

      <div className="mx-auto max-w-7xl px-6 pb-20">
        <RelatedArticles
          currentPostId={post.id}
          categoryId={post.category_id}
        />
      </div>
    </main>
  );
}
