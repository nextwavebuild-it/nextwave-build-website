import Link from "next/link";
import { notFound } from "next/navigation";
import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import {
  parseCountryPageContent,
  splitCountryBody,
} from "@/lib/country-page-content";
import {
  saveCountryLandingPage,
  changeCountryLandingPageStatus,
} from "@/lib/blog-admin/actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";
const section = "space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6";

export default async function EditCountryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await requireBlogAdmin();
  const { data: page, error } = await supabase
    .from("blog_pages")
    .select(
      "id,name,slug,page_type,status,heading,description,seo_title,seo_description,content",
    )
    .eq("id", id)
    .eq("page_type", "COUNTRY")
    .maybeSingle();
  if (error) throw new Error(`Could not load country page: ${error.message}`);
  if (!page) notFound();

  const content = parseCountryPageContent(page.content);
  const body = splitCountryBody(content.text);
  const published = page.status === "PUBLISHED";

  return (
    <main className="max-w-5xl space-y-7 text-white">
      <header>
        <Link
          href="/blog-admin/pages"
          className="text-sm text-[#D5FF66] hover:underline"
        >
          ← Publishing Destinations
        </Link>
        <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
          COUNTRY SEO CONTENT MANAGEMENT
        </p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          Edit {page.name}
        </h1>
        <p className="mt-3 text-sm text-white/55">
          Public URL: /{page.slug} · Status: {page.status}
        </p>
        <p className="mt-2 text-xs leading-6 text-white/45">
          Changes to this page appear on its public URL after saving. Design
          stays in Next.js; country-specific content is managed here.
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

      <form action={saveCountryLandingPage} className="space-y-6">
        <input type="hidden" name="id" value={page.id} />

        <section className={section}>
          <h2 className="text-xl font-semibold">1. Hero &amp; introduction</h2>
          <label className="block text-sm font-medium">
            Hero eyebrow
            <input
              name="heroEyebrow"
              required
              maxLength={120}
              defaultValue={content.heroEyebrow}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Hero title (H1)
            <input
              name="heading"
              required
              maxLength={180}
              defaultValue={page.heading ?? ""}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Hero introduction
            <textarea
              name="description"
              required
              rows={5}
              maxLength={5000}
              defaultValue={page.description ?? ""}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Introduction section heading (H2)
            <input
              name="introTitle"
              required
              maxLength={180}
              defaultValue={content.introTitle}
              className={input}
            />
          </label>
        </section>

        <section className={section}>
          <h2 className="text-xl font-semibold">
            2. Country-specific educational content
          </h2>
          <label className="block text-sm font-medium">
            Insights section heading (H2)
            <input
              name="insightsTitle"
              required
              maxLength={180}
              defaultValue={content.insightsTitle}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Original country body content
            <textarea
              name="country_content"
              rows={18}
              maxLength={15000}
              defaultValue={content.text}
              className={input}
              placeholder={
                "Intro paragraph...\n\n## Technology & AI in the UAE\n\nCountry-specific explanation..."
              }
            />
            <span className="mt-2 block text-xs font-normal leading-6 text-white/45">
              Minimum 300 characters to publish. Separate blocks with blank
              lines. For individual H3 insights, put a heading on its own line,
              e.g. **AI learning in the UAE** or ## AI learning in the UAE,
              followed by a blank line and content. Existing text is preserved.
            </span>
          </label>
        </section>

        <section className={section}>
          <h2 className="text-xl font-semibold">
            3. Programme &amp; article sections
          </h2>
          <label className="block text-sm font-medium">
            Programmes section heading (H2)
            <input
              name="programmesTitle"
              required
              maxLength={180}
              defaultValue={content.programmesTitle}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Programmes section description
            <textarea
              name="programmesDescription"
              required
              maxLength={1000}
              rows={3}
              defaultValue={content.programmesDescription}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Recommended articles heading (H2)
            <input
              name="resourcesTitle"
              required
              maxLength={180}
              defaultValue={content.resourcesTitle}
              className={input}
            />
          </label>
          <p className="text-xs leading-6 text-white/45">
            The three programme links and published article cards are generated
            automatically. Their card templates remain shared across country
            pages.
          </p>
        </section>

        <section className={section}>
          <h2 className="text-xl font-semibold">4. Final call to action</h2>
          <label className="block text-sm font-medium">
            CTA title (H2)
            <input
              name="ctaTitle"
              required
              maxLength={180}
              defaultValue={content.ctaTitle}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            CTA description
            <textarea
              name="ctaDescription"
              required
              rows={3}
              maxLength={1000}
              defaultValue={content.ctaDescription}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            CTA button text
            <input
              name="ctaButtonText"
              required
              maxLength={60}
              defaultValue={content.ctaButtonText}
              className={input}
            />
          </label>
        </section>

        <section className={section}>
          <h2 className="text-xl font-semibold">
            5. Search engine optimization
          </h2>
          <label className="block text-sm font-medium">
            SEO title
            <input
              name="seo_title"
              required
              maxLength={180}
              defaultValue={page.seo_title ?? ""}
              className={input}
            />
          </label>
          <label className="block text-sm font-medium">
            Meta description
            <textarea
              name="seo_description"
              required
              rows={3}
              maxLength={300}
              defaultValue={page.seo_description ?? ""}
              className={input}
            />
          </label>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
            Canonical URL:{" "}
            <strong className="text-white">
              https://nextwavebuild.com/{page.slug}
            </strong>
            <p className="mt-1 text-xs">
              Country URLs remain excluded from sitemap.xml as requested.
              Sitemap exclusion does not prevent Google indexing.
            </p>
          </div>
        </section>

        <button
          type="submit"
          className="rounded-lg bg-[#D5FF66] px-7 py-3 text-sm font-semibold text-[#101214] hover:bg-[#C5EF53]"
        >
          Save Country SEO Content
        </button>
      </form>

      <section className={section}>
        <h2 className="text-xl font-semibold">Publishing</h2>
        <p className="text-sm leading-7 text-white/55">
          Save first, then publish. All publicly accessible country pages
          require complete fields and at least 300 characters of original
          content.
        </p>
        {published ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 px-5 py-3 text-sm hover:border-[#D5FF66]"
            >
              View Published Page
            </Link>
            <form action={changeCountryLandingPageStatus}>
              <input type="hidden" name="id" value={page.id} />
              <input type="hidden" name="status" value="DRAFT" />
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-red-500/50 !bg-[#7F1D1D] px-6 py-3 text-sm font-semibold !text-white transition-colors hover:!bg-[#991B1B] hover:!text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                Unpublish Page
              </button>
            </form>
          </div>
        ) : (
          <form action={changeCountryLandingPageStatus}>
            <input type="hidden" name="id" value={page.id} />
            <input type="hidden" name="status" value="PUBLISHED" />
            <button
              type="submit"
              className="rounded-lg bg-[#D5FF66] px-6 py-3 text-sm font-semibold text-[#101214] hover:bg-[#C5EF53]"
            >
              Publish Country Page
            </button>
          </form>
        )}
      </section>

      <section className={section}>
        <h2 className="text-xl font-semibold">Saved content review</h2>
        <p className="text-xs text-white/50">
          Protected text review of saved values. This is not a full visual draft
          preview.
        </p>
        <h3 className="text-2xl font-semibold">{page.heading}</h3>
        <p className="text-sm leading-7 text-white/70">{page.description}</p>
        <h4 className="text-lg font-semibold text-[#D5FF66]">
          {content.insightsTitle}
        </h4>
        {body.intro.map((paragraph, index) => (
          <p
            key={`intro-${index}`}
            className="whitespace-pre-line text-sm leading-7 text-white/65"
          >
            {paragraph}
          </p>
        ))}
        {body.sections.map((item, index) => (
          <div key={index} className="space-y-2">
            <h5 className="font-semibold">{item.heading}</h5>
            {item.paragraphs.map((p, i) => (
              <p
                key={i}
                className="whitespace-pre-line text-sm leading-7 text-white/65"
              >
                {p}
              </p>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
