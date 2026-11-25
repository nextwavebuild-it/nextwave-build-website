import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  Globe2,
  ShoppingBag,
} from "lucide-react";
import { blogPublic } from "@/lib/blog-public";
import {
  getCountryBodyText,
  parseCountryPageContent,
  splitCountryBody,
} from "@/lib/country-page-content";

export const dynamic = "force-dynamic";
const SITE_URL = "https://nextwavebuild.com";
type Props = { params: Promise<{ country: string }> };

async function getCountryPage(slug: string) {
  // Validate public URL input.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return null;
  }

  // Retrieve published COUNTRY or CITY destinations.
  const { data: page, error } = await blogPublic
    .from("blog_pages")
    .select(
      "id,name,slug,page_type,heading,description,seo_title,seo_description,country_id,content",
    )
    .in("page_type", ["COUNTRY", "CITY"])
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();

  if (error) {
    throw new Error(`Cannot load destination page: ${error.message}`);
  }

  if (!page?.country_id) {
    return null;
  }

  // Verify that the associated country is active.
  const { data: activeCountry, error: countryError } = await blogPublic
    .from("blog_countries")
    .select("id")
    .eq("id", page.country_id)
    .eq("is_active", true)
    .maybeSingle();

  if (countryError) {
    throw new Error(`Cannot verify parent country: ${countryError.message}`);
  }
  // Never expose destinations with inactive countries
  // or incomplete landing page content.
  // Keep validation aligned with publishing, sitemap and RLS rules.
  if (
    !activeCountry ||
    (page.heading?.trim().length ?? 0) < 10 ||
    (page.description?.trim().length ?? 0) < 100 ||
    (page.seo_title?.trim().length ?? 0) < 10 ||
    (page.seo_description?.trim().length ?? 0) < 50 ||
    getCountryBodyText(page.content).length < 300
  ) {
    return null;
  }

  return page;
}

async function getCountryArticles(pageId: string) {
  const { data, error } = await blogPublic
    .from("blog_posts")
    .select(
      "id,title,slug,excerpt,featured_image,featured_image_alt,published_at,blog_post_pages!inner(page_id)",
    )
    .eq("status", "PUBLISHED")
    .lte("published_at", new Date().toISOString())
    .eq("blog_post_pages.page_id", pageId)
    .order("published_at", { ascending: false })
    .limit(12);
  if (error) throw new Error(`Cannot load country articles: ${error.message}`);
  return data ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const page = await getCountryPage(country);
  if (!page)
    return {
      title: "Page Not Found | NextWave Build",
      robots: { index: false, follow: false },
    };
  const title =
    page.seo_title || page.heading || `${page.name} | NextWave Build`;
  const description = page.seo_description || page.description || "";
  const url = `${SITE_URL}/${page.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "NextWave Build",
    },
    twitter: { card: "summary", title, description },
  };
}

const programmes = [
  {
    number: "01",
    title: "TECHNOLOGY & AI",
    href: "/programmes/technology-ai",
    icon: BrainCircuit,
    description:
      "Understand AI fundamentals, digital tools and the technology shaping modern work.",
  },
  {
    number: "02",
    title: "E-COMMERCE & DROPSHIPPING",
    href: "/programmes/ecommerce-dropshipping",
    icon: ShoppingBag,
    description:
      "Explore online stores, suppliers, research, and practical digital commerce skills.",
  },
  {
    number: "03",
    title: "FREELANCING & ONLINE WORK",
    href: "/programmes/freelancing-online-work",
    icon: BriefcaseBusiness,
    description:
      "Discover client projects, online work practices and transferable professional skills.",
  },
];

export default async function CountryLandingPage({ params }: Props) {
  const { country } = await params;
  const page = await getCountryPage(country);
  if (!page) notFound();

  const isCity = page.page_type === "CITY";
  const destinationLabel = isCity ? "City" : "Country";

  const content = parseCountryPageContent(page.content);
  const parsed = splitCountryBody(content.text);
  const articles = await getCountryArticles(page.id);

  return (
    <main className="overflow-hidden bg-[#101214] text-white">
      {/* HERO — dark, large editorial typography */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(90deg,#fff 1px,transparent 1px),linear-gradient(#fff 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-24 lg:grid-cols-[1.4fr_0.6fr] lg:items-center lg:pb-28 lg:pt-32">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D5FF66]">
              {content.heroEyebrow}
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.15em] text-white/55">
              {page.name}
            </p>
            <h1 className="mt-5 max-w-5xl text-[clamp(2.9rem,6.4vw,6.8rem)] font-black uppercase leading-[0.97] tracking-[-0.055em]">
              {page.heading}
            </h1>
            <p className="mt-8 max-w-2xl border-l-2 border-[#D5FF66] pl-5 text-base leading-8 text-white/65">
              {page.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/#flagships"
                className="inline-flex items-center justify-center gap-3 bg-[#D5FF66] px-6 py-4 text-sm font-bold uppercase !text-[#101214] transition-colors hover:bg-[#C5EF53] hover:!text-[#101214] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FF66]"
              >
                Explore programmes{" "}
                <ArrowRight size={18} className="text-[#101214]" />
              </Link>
              <Link
                href="#country-insights"
                className="inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-sm font-bold uppercase hover:border-[#D5FF66]"
              >
                Read insights <ArrowDownRight size={18} />
              </Link>
            </div>
          </div>
          <div className="hidden aspect-square max-w-[370px] flex-col justify-between border border-white/15 bg-[#1A1E1F] p-8 lg:flex">
            <div className="flex justify-between">
              <Globe2 size={40} className="text-[#D5FF66]" />
              <span className="text-xs text-white/35">NEXTWAVE / LEARN</span>
            </div>
            <p className="text-5xl font-black uppercase leading-[0.98] tracking-tighter">
              LEARN.
              <br />
              BUILD.
              <br />
              <span className="text-[#D5FF66]">GROW.</span>
            </p>
            <p className="border-t border-white/10 pt-5 text-xs uppercase tracking-[0.14em] text-white/45">
              Technology · Commerce · Online Work
            </p>
          </div>
        </div>
      </section>

      {/* INTRO — warm off-white */}
      <section
        id="country-insights"
        className="bg-[#F2F0E9] py-20 text-[#101214] lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#626A5D]">
              01 / THE OPPORTUNITY
            </p>
            <h2 className="mt-6 text-[clamp(2.7rem,5vw,5rem)] font-black uppercase leading-[0.98] tracking-[-0.05em]">
              {content.introTitle}
            </h2>
          </div>
          <div className="self-center space-y-5">
            {(parsed.intro.length
              ? parsed.intro
              : [page.description ?? ""]
            ).map((paragraph, index) => (
              <p
                className="whitespace-pre-line text-base leading-8 text-[#414740]"
                key={index}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTRY INSIGHTS — numbered cards, dynamic headings and content */}
      {parsed.sections.length > 0 && (
        <section className="bg-[#F2F0E9] pb-24 text-[#101214] lg:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="border-t border-black/15 pt-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#626A5D]">
                02 / {destinationLabel.toUpperCase()} INSIGHTS
              </p>
              <h2 className="mt-5 max-w-4xl text-[clamp(2.5rem,5vw,4.8rem)] font-black uppercase leading-[0.98] tracking-[-0.05em]">
                {content.insightsTitle}
              </h2>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2">
              {parsed.sections.map((section, index) => (
                <article
                  key={`${section.heading}-${index}`}
                  className="flex flex-col bg-[#E7E8E0] p-7 lg:min-h-72 lg:p-9"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-5xl font-black text-[#A3AC99]">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <ArrowDownRight className="text-[#717D6C]" />
                  </div>
                  <h3 className="mt-8 text-xl font-black uppercase leading-snug tracking-tight">
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((paragraph, i) => (
                    <p
                      key={i}
                      className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4A5048]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROGRAMMES — shared actual programme destinations, country-editable heading */}
      <section className="bg-[#171B1C] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D5FF66]">
            03 / EXPLORE YOUR OPTIONS
          </p>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="max-w-3xl text-[clamp(2.7rem,5vw,5.5rem)] font-black uppercase leading-[0.98] tracking-[-0.05em]">
                {content.programmesTitle}
              </h2>
              <div className="mt-8 h-1 w-20 bg-[#D5FF66]" aria-hidden="true" />
            </div>

            {/* Useful navigation fills the right column, with no empty decorative block. */}
            <div className="border border-white/10 bg-[#202526] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D5FF66]">
                CHOOSE YOUR LEARNING PATH
              </p>
              <p className="mt-4 text-base leading-8 text-white/70">
                {content.programmesDescription}
              </p>
              <div className="mt-7 divide-y divide-white/10 border-t border-white/10">
                {programmes.map((programme) => (
                  <Link
                    key={programme.href}
                    href={programme.href}
                    className="group flex items-center justify-between gap-3 py-4 text-sm font-semibold text-white transition-colors hover:text-[#D5FF66]"
                  >
                    <span>
                      <span className="mr-3 text-[#D5FF66]">
                        {programme.number}.
                      </span>
                      {programme.title}
                    </span>
                    <ArrowRight
                      size={17}
                      className="shrink-0 text-[#D5FF66] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {programmes.map((programme) => {
              const Icon = programme.icon;
              return (
                <Link
                  key={programme.href}
                  href={programme.href}
                  className="group flex min-h-80 flex-col justify-between border border-white/10 bg-[#202526] p-7 hover:border-[#D5FF66]/60"
                >
                  <div className="flex justify-between">
                    <span className="text-5xl font-black text-[#D5FF66]">
                      {programme.number}.
                    </span>
                    <Icon size={30} className="text-[#D5FF66]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase">
                      {programme.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/55">
                      {programme.description}
                    </p>
                    <span className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-wide text-[#D5FF66]">
                      Explore programme <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED ARTICLES — from Supabase publishing assignments */}
      <section className="bg-[#F2F0E9] py-24 text-[#101214] lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#626A5D]">
            04 / LEARNING RESOURCES
          </p>
          <h2 className="mt-6 max-w-4xl text-[clamp(2.7rem,5vw,5rem)] font-black uppercase leading-[0.98] tracking-[-0.05em]">
            {content.resourcesTitle}
          </h2>
          {articles.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => (
                <article
                  key={post.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#D5FF66]/35 bg-[#171B1C] transition-all duration-300 hover:-translate-y-1 hover:border-[#D5FF66]"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex h-full flex-col"
                  >
                    {/* Featured image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#202526]">
                      {post.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.featured_image}
                          alt={post.featured_image_alt || post.title}
                          loading="lazy"
                          className="absolute inset-0 block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen size={42} className="text-[#D5FF66]/60" />
                        </div>
                      )}
                    </div>

                    {/* Card content */}
                    <div className="flex flex-1 flex-col p-7">
                      {post.published_at && (
                        <div className="mb-5 flex items-center gap-2 text-sm text-[#A3AAA7]">
                          <CalendarDays size={15} />
                          <time dateTime={post.published_at}>
                            {new Intl.DateTimeFormat("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            }).format(new Date(post.published_at))}
                          </time>
                        </div>
                      )}

                      <h3 className="text-xl font-bold leading-snug tracking-tight text-[#D5FF66]">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="mt-5 line-clamp-3 text-sm leading-7 text-white/60">
                          {post.excerpt}
                        </p>
                      )}

                      <span className="mt-auto inline-flex items-center gap-2 pt-10 text-sm font-semibold text-[#D5FF66]">
                        Read Article
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-base text-[#4F584B]">
              More articles will be added to this page. Explore our global
              educational blog in the meantime.
            </p>
          )}
          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-2 border-b border-black pb-2 text-sm font-bold uppercase"
          >
            View all articles <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FINAL CTA — CMS driven */}
      <section className="bg-[#D5FF66] py-20 text-[#101214] lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em]">
              NEXTWAVE BUILD / TAKE THE NEXT STEP
            </p>
            <h2 className="mt-6 max-w-4xl text-[clamp(2.8rem,5.8vw,6.5rem)] font-black uppercase leading-[0.95] tracking-[-0.055em]">
              {content.ctaTitle}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#353B2D]">
              {content.ctaDescription}
            </p>
          </div>
          <Link
            href="/#flagships"
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-8 bg-white px-7 py-5 text-sm font-bold uppercase !text-[#101214] transition-colors hover:bg-[#F2F0E9] hover:!text-[#101214] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101214]"
          >
            {content.ctaButtonText}
            <ArrowRight size={18} className="text-[#101214]" />
          </Link>
        </div>
      </section>
    </main>
  );
}
