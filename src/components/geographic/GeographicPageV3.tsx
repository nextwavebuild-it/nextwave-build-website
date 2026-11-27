import Link from "next/link";
import {
  ArrowRight,
  ArrowDownRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  ShoppingBag,
  CheckCircle2,
  Globe2,
  GraduationCap,
  MapPin,
  UserRound,
} from "lucide-react";

import {
  splitCountryBody,
  type CountryPageContentV3,
  type CountryPageFeature,
} from "@/lib/country-page-content";

import type { getPublicGeographicResources } from "@/lib/blog-public";

type Resources = Awaited<ReturnType<typeof getPublicGeographicResources>>;

type GeographicPage = {
  id: string;
  name: string;
  slug: string;
  heading: string | null;
  description: string | null;
};

type GeographicArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  published_at: string | null;
};

type Props = {
  page: GeographicPage;
  content: CountryPageContentV3;
  resources: Resources;
  articles: GeographicArticle[];
};

const container = "mx-auto max-w-7xl px-6";

const primaryButton =
  "inline-flex items-center justify-center gap-3 bg-[#D5FF66] px-7 py-4 text-sm font-bold uppercase !text-[#101214] transition-colors hover:bg-[#C5EF53]";

const secondaryButton =
  "inline-flex items-center justify-center gap-3 border border-white/20 px-7 py-4 text-sm font-bold uppercase text-white transition-colors hover:border-[#D5FF66]";

const fallbackProgrammes = [
  {
    id: "technology-ai",
    slug: "technology-ai",
    name: "AI & Technology",
    short_description:
      "Develop practical skills in artificial intelligence, digital tools and automation.",
    programme_url: "/programmes/technology-ai",
    icon: BrainCircuit,
  },
  {
    id: "ecommerce-dropshipping",
    slug: "ecommerce-dropshipping",
    name: "E-Commerce & Dropshipping",
    short_description:
      "Explore product research, online stores, suppliers and digital commerce.",
    programme_url: "/programmes/ecommerce-dropshipping",
    icon: ShoppingBag,
  },
  {
    id: "freelancing-online-work",
    slug: "freelancing-online-work",
    name: "Freelancing & Online Work",
    short_description:
      "Develop practical skills for client projects, freelancing and online work.",
    programme_url: "/programmes/freelancing-online-work",
    icon: BriefcaseBusiness,
  },
];

function safeImageUrl(value: string | null | undefined) {
  if (!value) return null;

  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\")
  ) {
    return value;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function safeProgrammeUrl(value: string) {
  return /^\/programmes\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : null;
}

function stringItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  );
}

function featureItems(value: unknown): CountryPageFeature[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const record = item as Record<string, unknown>;

    if (
      typeof record.title !== "string" ||
      typeof record.description !== "string" ||
      !record.title.trim() ||
      !record.description.trim()
    ) {
      return [];
    }

    return [
      {
        title: record.title,
        description: record.description,
      },
    ];
  });
}

function formatPrice(amount: number | null, currency: string) {
  if (amount === null) return null;

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });

    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;

    return formatter.format(amount / 10 ** digits);
  } catch {
    return null;
  }
}

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-4xl">
      <p
        className={`text-xs font-bold uppercase tracking-[0.2em] ${
          light ? "text-[#626A5D]" : "text-[#D5FF66]"
        }`}
      >
        {eyebrow}
      </p>

      <h2 className="mt-5 text-[clamp(2.2rem,4.5vw,4.7rem)] font-black uppercase leading-[1.02] tracking-[-0.045em]">
        {title}
      </h2>

      {description && (
        <p
          className={`mt-6 max-w-3xl whitespace-pre-line text-base leading-8 ${
            light ? "text-[#414740]" : "text-white/65"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function FeatureSection({
  id,
  eyebrow,
  title,
  description,
  items,
  light = false,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  items: CountryPageFeature[];
  light?: boolean;
}) {
  const validItems = featureItems(items);

  if (!validItems.length && !description?.trim()) {
    return null;
  }

  return (
    <section
      id={id}
      className={`py-20 lg:py-28 ${
        light ? "bg-[#F2F0E9] text-[#101214]" : "bg-[#171B1C] text-white"
      }`}
    >
      <div className={container}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          light={light}
        />

        {validItems.length > 0 && (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {validItems.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className={`nw-card-interactive p-7 ${
                  light ? "nw-card-light bg-white" : "nw-card-dark bg-[#202526]"
                }`}
              >
                <CheckCircle2
                  size={26}
                  className={light ? "text-[#46513C]" : "text-[#D5FF66]"}
                />

                <h3 className="mt-7 text-xl font-bold">{item.title}</h3>

                <p
                  className={`mt-4 whitespace-pre-line text-sm leading-7 ${
                    light ? "text-[#414740]" : "text-white/65"
                  }`}
                >
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function resolveFeatures(local: CountryPageFeature[], shared: unknown) {
  const items = featureItems(local);

  if (items.length) return items;

  if (shared && typeof shared === "object" && !Array.isArray(shared)) {
    return featureItems((shared as Record<string, unknown>).items);
  }

  return [];
}

export default function GeographicPageV3({
  page,
  content,
  resources,
  articles,
}: Props) {
  const visibility = content.sections;

  const body = splitCountryBody(content.text);

  const heroImage = safeImageUrl(content.heroImageUrl);

  const trustShared = resources.sharedContent.trust_benefits;

  const whyShared = resources.sharedContent.why_nextwave;

  const enrollmentShared = resources.sharedContent.enrollment_steps;

  const methodShared = resources.sharedContent.learning_method;

  const comparisonShared = resources.sharedContent.programme_comparison;

  const faqShared = resources.sharedContent.shared_faqs;

  const trustItems = resolveFeatures(
    content.trustBenefits,
    trustShared?.content,
  );

  const whyItems = resolveFeatures(
    content.whyNextWaveItems,
    whyShared?.content,
  );

  const enrollmentItems = resolveFeatures(
    content.enrollmentSteps,
    enrollmentShared?.content,
  );

  const methodItems = resolveFeatures([], methodShared?.content);

  const activeProgrammes = resources.programmes.filter((programme) =>
    Boolean(safeProgrammeUrl(programme.programme_url)),
  );

  const localFaqs = content.faqs.filter(
    (faq) => faq.question.trim() && faq.answer.trim(),
  );

  const sharedFaqs = resolveFeatures([], faqShared?.content).map((item) => ({
    question: item.title,
    answer: item.description,
  }));

  const faqs = localFaqs.length > 0 ? localFaqs : sharedFaqs;

  function resolveHeading(
    localHeading: string,
    defaultHeading: string,
    sharedHeading?: string,
  ) {
    const local = localHeading.trim();

    if (local && local.toLowerCase() !== defaultHeading.toLowerCase()) {
      return local;
    }

    return sharedHeading?.trim() || local || defaultHeading;
  }

  const primaryHref = visibility.programmes ? "#programmes" : "/#flagships";

  return (
    <main className="overflow-hidden bg-[#101214] text-white">
      {/* HERO */}

      <section className="relative isolate border-b border-white/10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(90deg,#fff 1px,transparent 1px),linear-gradient(#fff 1px,transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div
          className={`${container} relative grid items-center gap-12 pb-20 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-32`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D5FF66]">
              {content.heroEyebrow}
            </p>

            <div className="mt-8 flex items-center gap-2 text-sm uppercase tracking-widest text-white/55">
              <MapPin size={16} />
              {page.name}
            </div>

            <h1 className="mt-5 text-[clamp(2.7rem,5.5vw,6rem)] font-black uppercase leading-[0.97] tracking-[-0.055em]">
              {page.heading}
            </h1>

            <p className="mt-8 max-w-2xl whitespace-pre-line border-l-2 border-[#D5FF66] pl-5 text-base leading-8 text-white/65">
              {page.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={primaryHref} className={primaryButton}>
                {content.heroPrimaryCtaText}
                <ArrowRight size={18} />
              </Link>

              <Link href="#country-insights" className={secondaryButton}>
                {content.heroSecondaryCtaText}
                <ArrowDownRight size={18} />
              </Link>
            </div>
          </div>

          {heroImage ? (
            <div className="nw-card-interactive nw-card-dark relative aspect-[5/4] overflow-hidden bg-[#171B1C]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={content.heroImageAlt}
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="nw-card-interactive nw-card-dark flex aspect-square flex-col justify-between bg-[#1A1E1F] p-8 sm:p-12">
              <div className="flex items-start justify-between">
                <Globe2 size={42} className="text-[#D5FF66]" />

                <span className="text-xs tracking-widest text-white/40">
                  NEXTWAVE BUILD
                </span>
              </div>

              <p className="text-[clamp(3rem,6vw,6rem)] font-black uppercase leading-[0.95] tracking-tighter">
                LEARN.
                <br />
                BUILD.
                <br />
                <span className="text-[#D5FF66]">GROW.</span>
              </p>

              <p className="border-t border-white/10 pt-5 text-xs uppercase tracking-widest text-white/45">
                Technology · Commerce · Online Work
              </p>
            </div>
          )}
        </div>
      </section>

      {/* TRUST BENEFITS */}

      {visibility.trustBenefits && (
        <FeatureSection
          eyebrow="THE LEARNING EXPERIENCE"
          title={resolveHeading(
            content.trustTitle,
            "LEARN WITH CONFIDENCE.",
            trustShared?.heading,
          )}
          description={content.trustDescription || trustShared?.description}
          items={trustItems}
        />
      )}

      {/* PROGRAMMES */}

      {visibility.programmes && (
        <section
          id="programmes"
          className="scroll-mt-24 bg-[#F2F0E9] py-20 text-[#101214] lg:py-28"
        >
          <div className={container}>
            <SectionHeading
              eyebrow="CHOOSE YOUR LEARNING PATH"
              title={content.programmesTitle}
              description={content.programmesDescription}
              light
            />

            <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeProgrammes.length > 0
                ? activeProgrammes.map((programme, index) => {
                    const image = safeImageUrl(programme.image_url);

                    const price = formatPrice(
                      programme.price_minor,
                      programme.currency,
                    );

                    const features = stringItems(programme.features).slice(
                      0,
                      4,
                    );

                    return (
                      <article
                        key={programme.id}
                        className="nw-card-interactive nw-card-dark group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-[#15191A] text-white shadow-sm"
                      >
                        {/* Programme image */}

                        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-white/10 bg-[#202526]">
                          <div className="absolute left-5 top-5 z-10 rounded-md border border-white/10 bg-[#101214]/90 px-3 py-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D5FF66]">
                              {String(index + 1).padStart(2, "0")} / Programme
                            </span>
                          </div>

                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={programme.image_alt || programme.name}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-contain p-5 pt-14 transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <GraduationCap
                              size={75}
                              className="text-[#D5FF66]"
                            />
                          )}
                        </div>

                        {/* Programme content */}

                        <div className="flex flex-1 flex-col p-6 xl:p-7">
                          {/* Course metadata */}

                          <div className="flex flex-wrap items-center gap-2">
                            {programme.duration && (
                              <span className="rounded-md border border-[#D5FF66]/20 bg-[#D5FF66]/10 px-3 py-1.5 text-xs font-semibold text-[#D5FF66]">
                                {programme.duration}
                              </span>
                            )}

                            {programme.skill_level && (
                              <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/65">
                                {programme.skill_level}
                              </span>
                            )}
                          </div>

                          {/* Programme name */}

                          <h3 className="mt-5 text-2xl font-black uppercase leading-tight tracking-[-0.025em] text-white lg:min-h-[60px]">
                            {programme.name}
                          </h3>

                          {/* Short description */}

                          <p className="mt-4 text-sm leading-7 text-white/65">
                            {programme.short_description}
                          </p>

                          {/* Learning format */}

                          {programme.learning_format && (
                            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#D5FF66]">
                              <GraduationCap size={18} className="shrink-0" />

                              <span>{programme.learning_format}</span>
                            </div>
                          )}

                          {/* Key programme features */}

                          {features.length > 0 && (
                            <div className="mb-7 mt-6 border-t border-white/10 pt-5">
                              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45">
                                Programme Highlights
                              </p>

                              <ul className="space-y-3">
                                {features.map((item, featureIndex) => (
                                  <li
                                    key={featureIndex}
                                    className="flex items-start gap-3 text-sm leading-6 text-white/75"
                                  >
                                    <CheckCircle2
                                      size={17}
                                      className="mt-1 shrink-0 text-[#D5FF66]"
                                    />

                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Pricing and CTA footer */}

                          <div className="mt-auto border-t border-white/10 pt-6">
                            {price && (
                              <div className="mb-5">
                                <p className="text-xs font-medium text-white/45">
                                  Programme fee
                                </p>

                                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                  <span className="text-4xl font-black tracking-tight text-white">
                                    {price}
                                  </span>

                                  <span className="text-xs font-medium text-white/45">
                                    {programme.currency}
                                  </span>
                                </div>
                              </div>
                            )}

                            <Link
                              href={programme.programme_url}
                              className="group/button inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-lg bg-[#D5FF66] px-5 py-4 text-xs font-bold uppercase tracking-wide !text-[#101214] transition-colors hover:bg-[#C5EF53]"
                            >
                              <span>{programme.cta_label}</span>

                              <ArrowRight
                                size={19}
                                className="shrink-0 transition-transform group-hover/button:translate-x-1"
                              />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })
                : fallbackProgrammes.map((programme, index) => {
                    const Icon = programme.icon;

                    return (
                      <article
                        key={programme.id}
                        className="nw-card-interactive nw-card-dark group flex h-full flex-col overflow-hidden rounded-2xl bg-[#15191A] text-white"
                      >
                        <div className="relative flex aspect-[16/10] items-center justify-center border-b border-white/10 bg-[#202526]">
                          <span className="absolute left-5 top-5 text-xs font-bold uppercase tracking-widest text-[#D5FF66]">
                            {String(index + 1).padStart(2, "0")} / Programme
                          </span>

                          <Icon size={75} className="text-[#D5FF66]" />
                        </div>

                        <div className="flex flex-1 flex-col p-7">
                          <h3 className="text-2xl font-black uppercase leading-tight text-white">
                            {programme.name}
                          </h3>

                          <p className="mb-8 mt-5 text-sm leading-7 text-white/65">
                            {programme.short_description}
                          </p>

                          <Link
                            href={programme.programme_url}
                            className="mt-auto inline-flex min-h-14 w-full items-center justify-between gap-3 rounded-lg bg-[#D5FF66] px-5 py-4 text-xs font-bold uppercase !text-[#101214] hover:bg-[#C5EF53]"
                          >
                            Explore Programme
                            <ArrowRight size={19} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
            </div>
          </div>
        </section>
      )}

      {/* PROGRAMME COMPARISON */}

      {visibility.programmeComparison && activeProgrammes.length >= 2 && (
        <section className="bg-[#171B1C] py-20 lg:py-28">
          <div className={container}>
            <SectionHeading
              eyebrow="COMPARE YOUR OPTIONS"
              title={resolveHeading(
                content.comparisonTitle,
                "COMPARE OUR PROGRAMMES.",
                comparisonShared?.heading,
              )}
              description={
                content.comparisonDescription || comparisonShared?.description
              }
            />

            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th scope="col" className="p-5">
                      Programme
                    </th>

                    <th scope="col" className="p-5">
                      Duration
                    </th>

                    <th scope="col" className="p-5">
                      Learning format
                    </th>

                    <th scope="col" className="p-5">
                      Level
                    </th>

                    <th scope="col" className="p-5">
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {activeProgrammes.map((programme) => (
                    <tr key={programme.id} className="border-b border-white/10">
                      <th
                        scope="row"
                        className="p-5 font-semibold text-[#D5FF66]"
                      >
                        <Link href={programme.programme_url}>
                          {programme.name}
                        </Link>
                      </th>

                      <td className="p-5">
                        {programme.duration || "Not specified"}
                      </td>

                      <td className="p-5">
                        {programme.learning_format || "Not specified"}
                      </td>

                      <td className="p-5">
                        {programme.skill_level || "Not specified"}
                      </td>

                      <td className="p-5">
                        {formatPrice(
                          programme.price_minor,
                          programme.currency,
                        ) || "View programme"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ORIGINAL GEOGRAPHIC CONTENT */}

      <section
        id="country-insights"
        className="scroll-mt-24 bg-[#F2F0E9] py-20 text-[#101214] lg:py-28"
      >
        <div className={container}>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <SectionHeading
              eyebrow={`LEARNING IN ${page.name}`}
              title={content.introTitle}
              light
            />

            <div className="self-center space-y-5">
              {(body.intro.length ? body.intro : [page.description ?? ""]).map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="whitespace-pre-line text-base leading-8 text-[#414740]"
                  >
                    {paragraph}
                  </p>
                ),
              )}
            </div>
          </div>

          {body.sections.length > 0 && (
            <div className="mt-16 border-t border-black/15 pt-14">
              <SectionHeading
                eyebrow={
                  visibility.insights
                    ? "LOCAL EDUCATIONAL INSIGHTS"
                    : "ABOUT THIS LEARNING DESTINATION"
                }
                title={content.insightsTitle}
                light
              />

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {body.sections.map((item, index) => (
                  <article
                    key={`${item.heading}-${index}`}
                    className="nw-card-interactive nw-card-light bg-white p-7 lg:p-9"
                  >
                    <span className="text-4xl font-black text-[#A3AC99]">
                      {String(index + 1).padStart(2, "0")}.
                    </span>

                    <h3 className="mt-7 text-xl font-black uppercase">
                      {item.heading}
                    </h3>

                    {item.paragraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className="mt-5 whitespace-pre-line text-sm leading-7 text-[#414740]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TARGET AUDIENCE */}

      {visibility.targetAudience && (
        <FeatureSection
          eyebrow="FIND YOUR LEARNING PATH"
          title={content.audienceTitle}
          description={content.audienceDescription}
          items={content.audienceItems}
        />
      )}

      {/* WHY NEXTWAVE BUILD */}

      {visibility.whyNextWave && (
        <FeatureSection
          eyebrow="THE NEXTWAVE APPROACH"
          title={resolveHeading(
            content.whyNextWaveTitle,
            "WHY CHOOSE NEXTWAVE BUILD?",
            whyShared?.heading,
          )}
          description={content.whyNextWaveDescription || whyShared?.description}
          items={whyItems}
          light
        />
      )}

      {/* LEARNING METHOD */}

      {visibility.learningMethod && (
        <FeatureSection
          eyebrow="YOUR LEARNING EXPERIENCE"
          title={resolveHeading(
            content.learningMethodTitle,
            "HOW YOU WILL LEARN.",
            methodShared?.heading,
          )}
          description={
            content.learningMethodDescription || methodShared?.description
          }
          items={methodItems}
        />
      )}

      {/* MENTORS */}

      {visibility.mentors && resources.mentors.length > 0 && (
        <section
          id="mentors"
          className="scroll-mt-24 bg-[#F2F0E9] py-20 text-[#101214] lg:py-28"
        >
          <div className={container}>
            <SectionHeading
              eyebrow="LEARN WITH GUIDANCE"
              title={content.mentorsTitle}
              description={content.mentorsDescription}
              light
            />

            <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resources.mentors.map((mentor) => {
                const image = safeImageUrl(mentor.image_url);

                const programme = resources.programmes.find(
                  (item) => item.id === mentor.programme_id,
                );

                const expertise = Array.isArray(mentor.expertise)
                  ? [
                      ...new Set(
                        mentor.expertise
                          .filter(
                            (item): item is string => typeof item === "string",
                          )
                          .map((item) => item.trim())
                          .filter(Boolean),
                      ),
                    ]
                  : [];

                return (
                  <article
                    key={mentor.id}
                    className="nw-card-interactive nw-card-dark group flex h-full flex-col overflow-hidden rounded-2xl bg-[#15191A] text-white"
                  >
                    {/* PROFILE IMAGE */}

                    <div
                      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[#202526] ${
                        image ? "h-[220px] sm:h-[240px]" : "h-[160px]"
                      }`}
                    >
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image}
                          alt={mentor.image_alt || mentor.name}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D5FF66]/20 bg-[#D5FF66]/5">
                          <UserRound
                            size={40}
                            strokeWidth={1.2}
                            className="text-[#D5FF66]/60"
                            aria-hidden="true"
                          />
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#15191A] to-transparent" />

                      {/* EXPERIENCE BADGE */}

                      {mentor.years_of_experience !== null && (
                        <div className="absolute left-3 top-3 rounded-full border border-[#D5FF66]/25 bg-[#101214]/90 px-3 py-1.5 text-[11px] font-semibold text-[#D5FF66]">
                          {mentor.years_of_experience}{" "}
                          {mentor.years_of_experience === 1 ? "year" : "years"}{" "}
                          of experience
                        </div>
                      )}
                    </div>

                    {/* PROFILE INFORMATION */}

                    <div className="flex flex-1 flex-col p-5">
                      {programme && (
                        <div className="mb-2.5">
                          <span className="inline-flex rounded-full border border-[#D5FF66]/20 bg-[#D5FF66]/5 px-3 py-1.5 text-[11px] font-semibold text-[#D5FF66]">
                            {programme.name}
                          </span>
                        </div>
                      )}

                      <h3 className="!m-0 break-words !text-xl font-bold !leading-tight tracking-tight !text-white">
                        {mentor.name}
                      </h3>

                      <p className="!mb-0 !mt-1.5 text-sm font-medium leading-5 !text-[#D5FF66]">
                        {mentor.professional_title}
                      </p>

                      <div className="my-3 h-px shrink-0 bg-white/10" />

                      <p className="!m-0 whitespace-pre-line break-words text-sm leading-6 !text-white/65">
                        {mentor.biography}
                      </p>

                      {/* AREAS OF EXPERTISE */}

                      {expertise.length > 0 && (
                        <div className="mt-auto pt-4">
                          <div className="border-t border-white/10 pt-3">
                            <p className="!mb-2.5 !mt-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                              Areas of Expertise
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {expertise.map((item) => (
                                <span
                                  key={item}
                                  className="max-w-full break-words rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs leading-4 text-white/75"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}

      {visibility.testimonials && resources.testimonials.length > 0 && (
        <section
          id="testimonials"
          className="scroll-mt-24 bg-[#171B1C] py-20 lg:py-28"
        >
          <div className={container}>
            <SectionHeading
              eyebrow="LEARNER EXPERIENCES"
              title={content.testimonialsTitle}
              description={content.testimonialsDescription}
            />

            <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.testimonials.map((testimonial) => {
                const image = safeImageUrl(testimonial.image_url);

                const programme = resources.programmes.find(
                  (item) => item.id === testimonial.programme_id,
                );

                const rating =
                  typeof testimonial.rating === "number" &&
                  Number.isInteger(testimonial.rating) &&
                  testimonial.rating >= 1 &&
                  testimonial.rating <= 5
                    ? testimonial.rating
                    : null;

                const initials = testimonial.student_name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => Array.from(part)[0]?.toUpperCase())
                  .join("");

                return (
                  <figure
                    key={testimonial.id}
                    className="nw-card-interactive nw-card-dark group relative m-0 flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-[#202526] p-5 text-white sm:p-6"
                  >
                    {/* DECORATIVE TOP ACCENT */}

                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D5FF66]/50 to-transparent" />

                    {/* QUOTE AND RATING */}

                    <div className="flex items-center justify-between gap-2">
                      <span
                        aria-hidden="true"
                        className="font-serif text-5xl leading-none text-[#D5FF66]/60"
                      >
                        “
                      </span>

                      {rating !== null && (
                        <div className="flex items-center gap-1 text-lg">
                          <span
                            aria-hidden="true"
                            className="tracking-wider text-[#D5FF66]"
                          >
                            {"★".repeat(rating)}
                          </span>

                          <span
                            aria-hidden="true"
                            className="tracking-wider text-white/20"
                          >
                            {"★".repeat(5 - rating)}
                          </span>

                          <span className="sr-only">
                            {rating} out of 5 stars
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TESTIMONIAL CONTENT */}

                    <blockquote className="!mx-0 !mb-4 !mt-3 !border-0 !p-0 whitespace-pre-line break-words text-sm leading-7 text-white/75">
                      {testimonial.testimonial}
                    </blockquote>

                    {/* PROGRAMME LABEL */}

                    {programme && (
                      <div className="mb-4">
                        <span className="inline-flex rounded-full border border-[#D5FF66]/20 bg-[#D5FF66]/5 px-3 py-1.5 text-[11px] font-semibold text-[#D5FF66]">
                          {programme.name}
                        </span>
                      </div>
                    )}

                    {/* STUDENT INFORMATION */}

                    <figcaption className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D5FF66]/20 bg-[#D5FF66]/5">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={
                              testimonial.image_alt || testimonial.student_name
                            }
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="text-lg font-bold text-[#D5FF66]"
                          >
                            {initials || "?"}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-base font-bold leading-6 !text-white">
                          {testimonial.student_name}
                        </p>

                        {testimonial.professional_title && (
                          <p className="mt-1 break-words text-xs leading-5 text-white/50">
                            {testimonial.professional_title}
                          </p>
                        )}
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ENROLLMENT */}

      {visibility.enrollmentSteps && (
        <FeatureSection
          eyebrow="TAKE THE FIRST STEP"
          title={resolveHeading(
            content.enrollmentTitle,
            "HOW TO GET STARTED.",
            enrollmentShared?.heading,
          )}
          description={
            content.enrollmentDescription || enrollmentShared?.description
          }
          items={enrollmentItems}
          light
        />
      )}

      {/* RELATED LOCATIONS */}

      {visibility.relatedLocations && resources.relatedLocations.length > 0 && (
        <section className="bg-[#171B1C] py-20 lg:py-28">
          <div className={container}>
            <SectionHeading
              eyebrow="EXPLORE OUR LEARNING DESTINATIONS"
              title={content.relatedLocationsTitle}
              description={content.relatedLocationsDescription}
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.relatedLocations.map((location) => (
                <Link
                  key={location.id}
                  href={`/${location.slug}`}
                  className="nw-card-interactive nw-card-dark group flex items-center justify-between gap-4 bg-[#202526] p-6"
                >
                  <div>
                    <MapPin size={22} className="text-[#D5FF66]" />

                    <p className="mt-4 text-lg font-bold">{location.name}</p>

                    <p className="mt-2 text-xs text-white/50">
                      {location.page_type === "CITY"
                        ? "City learning guide"
                        : "Country learning guide"}
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-[#D5FF66] transition-transform group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}

      {visibility.faqs && faqs.length > 0 && (
        <section className="bg-[#F2F0E9] py-20 text-[#101214] lg:py-28">
          <div className={container}>
            <SectionHeading
              eyebrow="YOUR QUESTIONS ANSWERED"
              title={resolveHeading(
                content.faqTitle,
                "FREQUENTLY ASKED QUESTIONS.",
                faqShared?.heading,
              )}
              description={content.faqDescription || faqShared?.description}
              light
            />

            <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {faqs.map((faq, index) => (
                <details key={index} className="group py-6">
                  <summary className="cursor-pointer text-lg font-bold">
                    {faq.question}
                  </summary>

                  <p className="mt-5 max-w-4xl whitespace-pre-line text-base leading-8 text-[#414740]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RELATED ARTICLES */}

      {visibility.resources && (
        <section className="bg-[#101214] py-20 lg:py-28">
          <div className={container}>
            <SectionHeading
              eyebrow="LEARNING RESOURCES"
              title={content.resourcesTitle}
            />

            {articles.length > 0 ? (
              <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => {
                  const image = safeImageUrl(article.featured_image);

                  return (
                    <article
                      key={article.id}
                      className="nw-card-interactive nw-card-dark group flex flex-col overflow-hidden bg-[#171B1C]"
                    >
                      <Link
                        href={`/blog/${article.slug}`}
                        className="flex h-full flex-col"
                      >
                        <div className="flex aspect-video items-center justify-center overflow-hidden bg-[#202526]">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={image}
                              alt={article.featured_image_alt || article.title}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="nextwave-blog-card-image"
                            />
                          ) : (
                            <BookOpen size={42} className="text-[#D5FF66]" />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-7">
                          <h3 className="text-xl font-bold text-[#D5FF66]">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/60">
                              {article.excerpt}
                            </p>
                          )}

                          <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-[#D5FF66]">
                            Read Article
                            <ArrowRight size={17} />
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-8 text-white/65">
                Explore our global educational blog for more learning resources.
              </p>
            )}

            <Link href="/blog" className={`${secondaryButton} mt-10`}>
              View All Articles
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      )}

      {/* FINAL CTA */}

      {visibility.finalCta && (
        <section className="bg-[#D5FF66] py-20 text-[#101214] lg:py-28">
          <div
            className={`${container} flex flex-col justify-between gap-10 lg:flex-row lg:items-end`}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em]">
                NEXTWAVE BUILD / TAKE THE NEXT STEP
              </p>

              <h2 className="mt-6 max-w-4xl text-[clamp(2.8rem,5.8vw,6rem)] font-black uppercase leading-[0.95] tracking-[-0.055em]">
                {content.ctaTitle}
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8">
                {content.ctaDescription}
              </p>
            </div>

            <Link
              href={primaryHref}
              className="inline-flex shrink-0 items-center justify-center gap-5 bg-[#101214] px-7 py-5 text-sm font-bold uppercase !text-white hover:bg-[#202526]"
            >
              {content.ctaButtonText}
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
