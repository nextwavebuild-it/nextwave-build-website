import Link from "next/link";
import GeographicEditorWizard from "@/components/blog-admin/GeographicEditorWizard";
import { notFound } from "next/navigation";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import {
  parseCountryPageContentV3,
  splitCountryBody,
  validateCountryPagePublication,
  type CountryPageFeature,
} from "@/lib/country-page-content";

import {
  saveCountryLandingPage,
  publishCountryLandingPageDraft,
  discardCountryLandingPageDraft,
  changeCountryLandingPageStatus,
} from "@/lib/blog-admin/actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

const section = "space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6";

const primaryButton =
  "rounded-lg bg-[#D5FF66] px-6 py-3 text-sm font-semibold text-[#101214] hover:bg-[#C5EF53] disabled:cursor-not-allowed disabled:opacity-40";

const secondaryButton =
  "rounded-lg border border-white/20 px-5 py-3 text-sm hover:border-[#D5FF66]";

const dangerButton =
  "rounded-lg border border-red-500/40 bg-red-950 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900";

function TextField({
  name,
  label,
  value,
  max = 180,
  rows,
}: {
  name: string;
  label: string;
  value: string;
  max?: number;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}

      {rows ? (
        <textarea
          name={name}
          defaultValue={value}
          maxLength={max}
          rows={rows}
          className={input}
        />
      ) : (
        <input
          name={name}
          defaultValue={value}
          maxLength={max}
          className={input}
        />
      )}
    </label>
  );
}

function ItemFields({
  name,
  items,
  titleLabel = "Title",
  descriptionLabel = "Description",
}: {
  name: string;
  items: CountryPageFeature[];
  titleLabel?: string;
  descriptionLabel?: string;
}) {
  const slots = Math.min(Math.max(items.length + 3, 4), 30);

  return (
    <div className="space-y-4">
      <p className="text-xs leading-6 text-white/45">
        Leave unused items empty. Clear both fields to remove an item. Save the
        draft to get more empty slots.
      </p>

      {Array.from({ length: slots }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-lg border border-white/10 p-4"
        >
          <p className="text-xs font-semibold text-[#D5FF66]">
            Item {index + 1}
          </p>

          <TextField
            name={`${name}_title`}
            label={titleLabel}
            value={items[index]?.title ?? ""}
          />

          <TextField
            name={`${name}_description`}
            label={descriptionLabel}
            value={items[index]?.description ?? ""}
            max={2000}
            rows={3}
          />
        </div>
      ))}
    </div>
  );
}

export default async function EditCountryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const [pageResult, draftResult, sharedResult] = await Promise.all([
    supabase
      .from("blog_pages")
      .select(
        "id,name,slug,page_type,status,heading,description,seo_title,seo_description,content,updated_at",
      )
      .eq("id", id)
      .in("page_type", ["COUNTRY", "CITY"])
      .maybeSingle(),

    supabase
      .from("blog_page_drafts")
      .select("*")
      .eq("page_id", id)
      .maybeSingle(),

    supabase
      .from("blog_shared_content")
      .select("section_key,heading,description,content")
      .eq("is_active", true),
  ]);

  if (pageResult.error || draftResult.error || sharedResult.error) {
    throw new Error("Could not load geographic editor.");
  }

  const shared: Record<
    string,
    { heading: string; description: string; hasItems: boolean }
  > = {};
  for (const row of sharedResult.data ?? []) {
    const raw = row.content as { items?: unknown } | null;
    const items = raw?.items;
    shared[row.section_key] = {
      heading: row.heading,
      description: row.description,
      hasItems:
        Array.isArray(items) &&
        items.some((item: unknown) => {
          if (!item || typeof item !== "object") return false;
          const pair = item as Record<string, unknown>;
          return (
            typeof pair.title === "string" &&
            Boolean(pair.title.trim()) &&
            typeof pair.description === "string" &&
            Boolean(pair.description.trim())
          );
        }),
    };
  }

  const page = pageResult.data;

  if (!page) notFound();

  const draft = draftResult.data;
  const source = draft ?? page;

  const content = parseCountryPageContentV3(source.content);

  const body = splitCountryBody(content.text);
  const published = page.status === "PUBLISHED";

  const staleDraft =
    Boolean(draft) && draft?.base_updated_at !== page.updated_at;

  const validation = validateCountryPagePublication({
    heading: source.heading,
    description: source.description,
    seo_title: source.seo_title,
    seo_description: source.seo_description,
    content,
  });

  const destinationLabel = page.page_type === "CITY" ? "City" : "Country";

  const visibilityLabels: Record<keyof typeof content.sections, string> = {
    trustBenefits: "Trust benefits",
    programmes: "Programmes",
    programmeComparison: "Programme comparison",
    insights: "Local learning insights",
    targetAudience: "Target audience",
    whyNextWave: "Why NextWave Build",
    learningMethod: "Learning method",
    mentors: "Mentors",
    testimonials: "Testimonials",
    enrollmentSteps: "Enrollment steps",
    relatedLocations: "Related locations",
    faqs: "Frequently asked questions",
    resources: "Related blog articles",
    finalCta: "Final call to action",
  };

  return (
    <main className="max-w-6xl space-y-7 text-white">
      <header>
        <Link
          href="/blog-admin/pages"
          className="text-sm text-[#D5FF66] hover:underline"
        >
          ← Publishing Destinations
        </Link>

        <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
          {destinationLabel.toUpperCase()} CONTENT MANAGEMENT
        </p>

        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
          Edit {page.name}
        </h1>

        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="rounded-full border border-white/15 px-3 py-2">
            Live status: {page.status}
          </span>

          <span className="rounded-full border border-[#D5FF66]/30 px-3 py-2 text-[#D5FF66]">
            {draft ? "Saved working draft" : "No working draft"}
          </span>
        </div>

        <p className="mt-4 text-sm text-white/55">
          Public URL: /{page.slug}. Saving a draft does not change the published
          website.
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

      {staleDraft && (
        <p className="rounded-lg border border-red-500/40 p-4 text-sm text-red-200">
          Live content has changed since this draft was created. Review and
          discard the outdated draft before starting a new one.
        </p>
      )}

      <form action={saveCountryLandingPage} className="space-y-6">
        <input type="hidden" name="id" value={page.id} />

        <input type="hidden" name="base_updated_at" value={page.updated_at} />

        <input
          type="hidden"
          name="draft_updated_at"
          value={draft?.updated_at ?? ""}
        />

        <GeographicEditorWizard
          key={draft?.updated_at ?? page.updated_at}
          shared={shared}
          disabled={staleDraft}
        >
          <section className={section}>
            <h2 className="text-xl font-semibold">1. Hero and introduction</h2>

            <TextField
              name="heroEyebrow"
              label="Hero eyebrow"
              value={content.heroEyebrow}
              max={120}
            />

            <TextField
              name="heading"
              label="Hero title (H1)"
              value={source.heading ?? ""}
            />

            <TextField
              name="description"
              label="Hero introduction"
              value={source.description ?? ""}
              max={5000}
              rows={5}
            />

            <TextField
              name="heroImageUrl"
              label="Hero image URL"
              value={content.heroImageUrl}
              max={2000}
            />

            <TextField
              name="heroImageAlt"
              label="Hero image alternative text"
              value={content.heroImageAlt}
            />

            <TextField
              name="heroPrimaryCtaText"
              label="Primary CTA button"
              value={content.heroPrimaryCtaText}
              max={60}
            />

            <TextField
              name="heroSecondaryCtaText"
              label="Secondary CTA button"
              value={content.heroSecondaryCtaText}
              max={60}
            />

            <TextField
              name="introTitle"
              label="Introduction heading"
              value={content.introTitle}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">2. Section visibility</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {(
                Object.keys(
                  content.sections,
                ) as (keyof typeof content.sections)[]
              ).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-3 rounded-lg border border-white/10 p-4 text-sm"
                >
                  <input
                    type="checkbox"
                    name={`section_${key}`}
                    defaultChecked={content.sections[key]}
                    className="h-4 w-4 accent-[#D5FF66]"
                  />

                  {visibilityLabels[key]}
                </label>
              ))}
            </div>
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">3. Trust benefits</h2>

            <TextField
              name="trustTitle"
              label="Heading"
              value={content.trustTitle}
            />

            <TextField
              name="trustDescription"
              label="Description"
              value={content.trustDescription}
              max={1000}
              rows={3}
            />

            <ItemFields name="trustBenefits" items={content.trustBenefits} />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">
              4. Programmes and comparison
            </h2>

            <TextField
              name="programmesTitle"
              label="Programmes heading"
              value={content.programmesTitle}
            />

            <TextField
              name="programmesDescription"
              label="Programmes description"
              value={content.programmesDescription}
              max={1000}
              rows={3}
            />

            <TextField
              name="comparisonTitle"
              label="Comparison heading"
              value={content.comparisonTitle}
            />

            <TextField
              name="comparisonDescription"
              label="Comparison description"
              value={content.comparisonDescription}
              max={1000}
              rows={3}
            />

            <p className="text-xs text-white/45">
              Programme records will be managed through the shared programme
              catalog.
            </p>
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">
              5. Local educational insights
            </h2>

            <TextField
              name="insightsTitle"
              label="Insights heading"
              value={content.insightsTitle}
            />

            <TextField
              name="country_content"
              label={`Original ${destinationLabel.toLowerCase()} content`}
              value={content.text}
              max={15000}
              rows={16}
            />

            <p className="text-xs text-white/45">
              Minimum 300 characters to publish. Use standalone Markdown-style
              headings and separate paragraphs with blank lines.
            </p>
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">6. Target audience</h2>

            <TextField
              name="audienceTitle"
              label="Heading"
              value={content.audienceTitle}
            />

            <TextField
              name="audienceDescription"
              label="Description"
              value={content.audienceDescription}
              max={1000}
              rows={3}
            />

            <ItemFields name="audienceItems" items={content.audienceItems} />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">7. Why NextWave Build</h2>

            <TextField
              name="whyNextWaveTitle"
              label="Heading"
              value={content.whyNextWaveTitle}
            />

            <TextField
              name="whyNextWaveDescription"
              label="Description"
              value={content.whyNextWaveDescription}
              max={1000}
              rows={3}
            />

            <ItemFields
              name="whyNextWaveItems"
              items={content.whyNextWaveItems}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">8. Learning method</h2>

            <TextField
              name="learningMethodTitle"
              label="Heading"
              value={content.learningMethodTitle}
            />

            <TextField
              name="learningMethodDescription"
              label="Description"
              value={content.learningMethodDescription}
              max={1000}
              rows={4}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">
              9. Mentors and testimonials
            </h2>

            <TextField
              name="mentorsTitle"
              label="Mentors heading"
              value={content.mentorsTitle}
            />

            <TextField
              name="mentorsDescription"
              label="Mentors description"
              value={content.mentorsDescription}
              max={1000}
              rows={3}
            />

            <TextField
              name="testimonialsTitle"
              label="Testimonials heading"
              value={content.testimonialsTitle}
            />

            <TextField
              name="testimonialsDescription"
              label="Testimonials description"
              value={content.testimonialsDescription}
              max={1000}
              rows={3}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">10. Enrollment process</h2>

            <TextField
              name="enrollmentTitle"
              label="Heading"
              value={content.enrollmentTitle}
            />

            <TextField
              name="enrollmentDescription"
              label="Description"
              value={content.enrollmentDescription}
              max={1000}
              rows={3}
            />

            <ItemFields
              name="enrollmentSteps"
              items={content.enrollmentSteps}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">11. Related locations</h2>

            <TextField
              name="relatedLocationsTitle"
              label="Heading"
              value={content.relatedLocationsTitle}
            />

            <TextField
              name="relatedLocationsDescription"
              label="Description"
              value={content.relatedLocationsDescription}
              max={1000}
              rows={3}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">
              12. Frequently asked questions
            </h2>

            <TextField
              name="faqTitle"
              label="FAQ heading"
              value={content.faqTitle}
            />

            <TextField
              name="faqDescription"
              label="FAQ introduction"
              value={content.faqDescription}
              max={1000}
              rows={3}
            />

            <ItemFields
              name="faqs"
              titleLabel="Question"
              descriptionLabel="Answer"
              items={content.faqs.map((faq) => ({
                title: faq.question,
                description: faq.answer,
              }))}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">13. Related articles</h2>

            <TextField
              name="resourcesTitle"
              label="Related articles heading"
              value={content.resourcesTitle}
            />

            <p className="text-xs text-white/45">
              Published articles are retrieved automatically from existing
              destination assignments.
            </p>
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">14. Final call to action</h2>

            <TextField
              name="ctaTitle"
              label="CTA heading"
              value={content.ctaTitle}
            />

            <TextField
              name="ctaDescription"
              label="CTA description"
              value={content.ctaDescription}
              max={1000}
              rows={3}
            />

            <TextField
              name="ctaButtonText"
              label="CTA button"
              value={content.ctaButtonText}
              max={60}
            />
          </section>

          <section className={section}>
            <h2 className="text-xl font-semibold">
              15. Search engine optimization
            </h2>

            <TextField
              name="seo_title"
              label="SEO title"
              value={source.seo_title ?? ""}
            />

            <TextField
              name="seo_description"
              label="Meta description"
              value={source.seo_description ?? ""}
              max={300}
              rows={3}
            />

            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
              Canonical URL:
              <p className="mt-2 break-all text-[#D5FF66]">
                https://nextwavebuild.com/{page.slug}
              </p>
            </div>
          </section>
        </GeographicEditorWizard>
      </form>

      <section className={section}>
        <h2 className="text-xl font-semibold">Publishing controls</h2>

        {!validation.valid && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
            <p className="text-sm font-semibold text-yellow-200">
              Publication requirements
            </p>

            {validation.errors.map((error) => (
              <p key={error} className="mt-2 text-xs text-yellow-100">
                {error}
              </p>
            ))}
          </div>
        )}

        <p className="text-sm text-white/55">
          Publishing applies the last saved draft, not unsaved changes in the
          editor.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/blog-admin/pages/${page.id}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryButton}
          >
            Preview New Design
          </Link>

          {draft && (
            <>
              <form action={publishCountryLandingPageDraft}>
                <input type="hidden" name="id" value={page.id} />

                <input
                  type="hidden"
                  name="draft_updated_at"
                  value={draft.updated_at}
                />

                <button
                  type="submit"
                  disabled={!validation.valid || staleDraft}
                  className={primaryButton}
                >
                  {published ? "Publish Changes" : "Publish Page"}
                </button>
              </form>

              <form action={discardCountryLandingPageDraft}>
                <input type="hidden" name="id" value={page.id} />

                <input
                  type="hidden"
                  name="draft_updated_at"
                  value={draft.updated_at}
                />

                <button type="submit" className={dangerButton}>
                  Discard Draft
                </button>
              </form>
            </>
          )}

          {published && (
            <>
              <Link
                href={`/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryButton}
              >
                View Live Page
              </Link>

              {!draft && (
                <form action={changeCountryLandingPageStatus}>
                  <input type="hidden" name="id" value={page.id} />

                  <input type="hidden" name="status" value="DRAFT" />

                  <input
                    type="hidden"
                    name="base_updated_at"
                    value={page.updated_at}
                  />

                  <button type="submit" className={dangerButton}>
                    Unpublish Page
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </section>

      <details className={section}>
        <summary className="cursor-pointer text-xl font-semibold">
          Saved content review
        </summary>

        <p className="text-xs text-white/45">
          Protected text review of{" "}
          {draft ? "saved draft content" : "existing page content"}. This is not
          the full visual preview.
        </p>

        <h3 className="text-2xl font-semibold">{source.heading}</h3>

        <p className="whitespace-pre-line text-sm leading-7 text-white/70">
          {source.description}
        </p>

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

            {item.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="whitespace-pre-line text-sm leading-7 text-white/65"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </details>
    </main>
  );
}
