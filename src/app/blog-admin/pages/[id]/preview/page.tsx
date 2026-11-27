import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { parseCountryPageContentV3 } from "@/lib/country-page-content";

import { getPublicGeographicResources } from "@/lib/blog-public";

import GeographicPageV3 from "@/components/geographic/GeographicPageV3";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Geographic Draft Preview | NextWave Build",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GeographicDraftPreview({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireBlogAdmin();

  const [pageResult, draftResult] = await Promise.all([
    supabase
      .from("blog_pages")
      .select(
        "id,name,slug,page_type,country_id,heading,description,content,updated_at",
      )
      .eq("id", id)
      .in("page_type", ["COUNTRY", "CITY"])
      .maybeSingle(),

    supabase
      .from("blog_page_drafts")
      .select("*")
      .eq("page_id", id)
      .maybeSingle(),
  ]);

  if (pageResult.error || draftResult.error) {
    throw new Error("Unable to load geographic preview.");
  }

  const page = pageResult.data;

  if (!page || !page.country_id) {
    notFound();
  }

  const draft = draftResult.data;
  const source = draft ?? page;

  const content = parseCountryPageContentV3(source.content);

  const [resources, articlesResult] = await Promise.all([
    getPublicGeographicResources(page.id, page.country_id),

    supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,featured_image,featured_image_alt,published_at,blog_post_pages!inner(page_id)",
      )
      .eq("status", "PUBLISHED")
      .lte("published_at", new Date().toISOString())
      .eq("blog_post_pages.page_id", page.id)
      .order("published_at", { ascending: false })
      .limit(12),
  ]);

  if (articlesResult.error) {
    throw new Error("Unable to load preview articles.");
  }

  return (
    <div className="bg-[#101214]">
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-[#D5FF66] px-6 py-4 text-[#101214]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider">
            Private Geographic Preview
          </p>

          <p className="mt-1 text-xs">
            {page.name} —{" "}
            {draft ? "Saved working draft" : "Existing content in V3 layout"}.
            Live website remains unchanged.
          </p>
        </div>

        <Link
          href={`/blog-admin/pages/${page.id}/edit`}
          className="rounded-lg bg-[#101214] px-5 py-3 text-sm font-semibold !text-white"
        >
          Back to Editor
        </Link>
      </div>

      <GeographicPageV3
        page={{
          id: page.id,
          name: page.name,
          slug: page.slug,
          heading: source.heading,
          description: source.description,
        }}
        content={content}
        resources={resources}
        articles={articlesResult.data ?? []}
      />
    </div>
  );
}
