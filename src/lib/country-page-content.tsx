// Shared server-safe helpers for Blog Admin and public geographic pages.
// Supports legacy V1, existing V2 and the new V3 content structure.

export type CountryPageContentFormat =
  | "country_text_v1"
  | "country_page_v2"
  | "country_page_v3";

export type CountryPageContentV2 = {
  format: "country_page_v2";
  text: string;
  heroEyebrow: string;
  introTitle: string;
  insightsTitle: string;
  programmesTitle: string;
  programmesDescription: string;
  resourcesTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
};

// Reusable geographic content types.

export type CountryPageFeature = {
  title: string;
  description: string;
};

export type CountryPageFAQ = {
  question: string;
  answer: string;
};

export type CountryPageSectionVisibility = {
  trustBenefits: boolean;
  programmes: boolean;
  programmeComparison: boolean;
  insights: boolean;
  targetAudience: boolean;
  whyNextWave: boolean;
  learningMethod: boolean;
  mentors: boolean;
  testimonials: boolean;
  enrollmentSteps: boolean;
  relatedLocations: boolean;
  faqs: boolean;
  resources: boolean;
  finalCta: boolean;
};

// New geographic content structure.

export type CountryPageContentV3 = Omit<CountryPageContentV2, "format"> & {
  format: "country_page_v3";

  // Hero section.
  heroImageUrl: string;
  heroImageAlt: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;

  // Trust benefits.
  trustTitle: string;
  trustDescription: string;
  trustBenefits: CountryPageFeature[];

  // Programme comparison.
  comparisonTitle: string;
  comparisonDescription: string;

  // Target audience.
  audienceTitle: string;
  audienceDescription: string;
  audienceItems: CountryPageFeature[];

  // Why NextWave Build.
  whyNextWaveTitle: string;
  whyNextWaveDescription: string;
  whyNextWaveItems: CountryPageFeature[];

  // Learning method.
  learningMethodTitle: string;
  learningMethodDescription: string;

  // Mentor profiles.
  mentorsTitle: string;
  mentorsDescription: string;

  // Student testimonials.
  testimonialsTitle: string;
  testimonialsDescription: string;

  // Enrollment process.
  enrollmentTitle: string;
  enrollmentDescription: string;
  enrollmentSteps: CountryPageFeature[];

  // Related geographic destinations.
  relatedLocationsTitle: string;
  relatedLocationsDescription: string;

  // Frequently asked questions.
  faqTitle: string;
  faqDescription: string;
  faqs: CountryPageFAQ[];

  // Individual section visibility.
  sections: CountryPageSectionVisibility;
};

export type CountryPageContent = CountryPageContentV2 | CountryPageContentV3;

type ContentInput = Record<string, unknown>;

// Safe parsing utilities.

function asRecord(value: unknown): ContentInput {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ContentInput)
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asFeatures(value: unknown): CountryPageFeature[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const data = asRecord(item);

      return {
        title: asText(data.title),
        description: asText(data.description),
      };
    });
}

function asFAQs(value: unknown): CountryPageFAQ[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object" && !Array.isArray(item))
    .map((item) => {
      const data = asRecord(item);

      return {
        question: asText(data.question),
        answer: asText(data.answer),
      };
    });
}

// Default visibility for V3 pages.
// Optional sections remain hidden until configured.

export function getDefaultCountryPageSections(): CountryPageSectionVisibility {
  return {
    trustBenefits: true,
    programmes: true,
    programmeComparison: false,
    insights: true,
    targetAudience: false,
    whyNextWave: true,
    learningMethod: false,
    mentors: false,
    testimonials: false,
    enrollmentSteps: true,
    relatedLocations: true,
    faqs: false,
    resources: true,
    finalCta: true,
  };
}

function parseSectionVisibility(value: unknown): CountryPageSectionVisibility {
  const data = asRecord(value);
  const defaults = getDefaultCountryPageSections();

  return {
    trustBenefits: asBoolean(data.trustBenefits, defaults.trustBenefits),
    programmes: asBoolean(data.programmes, defaults.programmes),
    programmeComparison: asBoolean(
      data.programmeComparison,
      defaults.programmeComparison,
    ),
    insights: asBoolean(data.insights, defaults.insights),
    targetAudience: asBoolean(data.targetAudience, defaults.targetAudience),
    whyNextWave: asBoolean(data.whyNextWave, defaults.whyNextWave),
    learningMethod: asBoolean(data.learningMethod, defaults.learningMethod),
    mentors: asBoolean(data.mentors, defaults.mentors),
    testimonials: asBoolean(data.testimonials, defaults.testimonials),
    enrollmentSteps: asBoolean(data.enrollmentSteps, defaults.enrollmentSteps),
    relatedLocations: asBoolean(
      data.relatedLocations,
      defaults.relatedLocations,
    ),
    faqs: asBoolean(data.faqs, defaults.faqs),
    resources: asBoolean(data.resources, defaults.resources),
    finalCta: asBoolean(data.finalCta, defaults.finalCta),
  };
}

// Existing V2 parser.
// Preserves compatibility with current public pages and CMS.

export function parseCountryPageContent(value: unknown): CountryPageContentV2 {
  const data = asRecord(value);

  return {
    format: "country_page_v2",

    text: asText(data.text),

    heroEyebrow:
      asText(data.heroEyebrow) || "NEXTWAVE BUILD / DIGITAL EDUCATION",

    introTitle: asText(data.introTitle) || "LEARN THE SKILLS THAT MATTER.",

    insightsTitle: asText(data.insightsTitle) || "DIGITAL LEARNING INSIGHTS",

    programmesTitle:
      asText(data.programmesTitle) || "YOUR NEXT CHAPTER STARTS HERE.",

    programmesDescription:
      asText(data.programmesDescription) ||
      "Explore practical learning pathways in technology, e-commerce and online work.",

    resourcesTitle:
      asText(data.resourcesTitle) || "EXPLORE MORE LEARNING RESOURCES.",

    ctaTitle: asText(data.ctaTitle) || "DON'T JUST LEARN IT. BUILD IT.",

    ctaDescription:
      asText(data.ctaDescription) ||
      "Explore a programme and take the next step towards building practical skills.",

    ctaButtonText: asText(data.ctaButtonText) || "Explore programmes",
  };
}

// New V3 parser.
// Existing V1 and V2 records can be converted into V3
// working drafts without modifying the stored live page.

export function parseCountryPageContentV3(
  value: unknown,
): CountryPageContentV3 {
  const data = asRecord(value);
  const legacy = parseCountryPageContent(value);

  return {
    ...legacy,

    format: "country_page_v3",

    // Hero.
    heroImageUrl: asText(data.heroImageUrl),
    heroImageAlt: asText(data.heroImageAlt),

    heroPrimaryCtaText: asText(data.heroPrimaryCtaText) || "Explore Programmes",

    heroSecondaryCtaText: asText(data.heroSecondaryCtaText) || "Learn More",

    // Trust benefits.
    trustTitle: asText(data.trustTitle) || "LEARN WITH CONFIDENCE.",

    trustDescription: asText(data.trustDescription),

    trustBenefits: asFeatures(data.trustBenefits),

    // Programme comparison.
    comparisonTitle: asText(data.comparisonTitle) || "COMPARE OUR PROGRAMMES.",

    comparisonDescription: asText(data.comparisonDescription),

    // Target audience.
    audienceTitle: asText(data.audienceTitle) || "WHO IS THIS FOR?",

    audienceDescription: asText(data.audienceDescription),

    audienceItems: asFeatures(data.audienceItems),

    // Why NextWave Build.
    whyNextWaveTitle:
      asText(data.whyNextWaveTitle) || "WHY CHOOSE NEXTWAVE BUILD?",

    whyNextWaveDescription: asText(data.whyNextWaveDescription),

    whyNextWaveItems: asFeatures(data.whyNextWaveItems),

    // Learning method.
    learningMethodTitle:
      asText(data.learningMethodTitle) || "HOW YOU WILL LEARN.",

    learningMethodDescription: asText(data.learningMethodDescription),

    // Mentors.
    mentorsTitle: asText(data.mentorsTitle) || "MEET YOUR MENTORS.",

    mentorsDescription: asText(data.mentorsDescription),

    // Testimonials.
    testimonialsTitle:
      asText(data.testimonialsTitle) || "WHAT OUR LEARNERS SAY.",

    testimonialsDescription: asText(data.testimonialsDescription),

    // Enrollment.
    enrollmentTitle: asText(data.enrollmentTitle) || "HOW TO GET STARTED.",

    enrollmentDescription: asText(data.enrollmentDescription),

    enrollmentSteps: asFeatures(data.enrollmentSteps),

    // Related geographic destinations.
    relatedLocationsTitle:
      asText(data.relatedLocationsTitle) || "EXPLORE MORE LOCATIONS.",

    relatedLocationsDescription: asText(data.relatedLocationsDescription),

    // FAQs.
    faqTitle: asText(data.faqTitle) || "FREQUENTLY ASKED QUESTIONS.",

    faqDescription: asText(data.faqDescription),

    faqs: asFAQs(data.faqs),

    // Section visibility.
    sections: parseSectionVisibility(data.sections),
  };
}

// Supported geographic content formats.

export function isSupportedCountryPageFormat(
  value: unknown,
): value is CountryPageContentFormat {
  return (
    value === "country_text_v1" ||
    value === "country_page_v2" ||
    value === "country_page_v3"
  );
}

// Identify the stored content format.

export function getCountryPageContentFormat(
  value: unknown,
): CountryPageContentFormat | null {
  const data = asRecord(value);

  return isSupportedCountryPageFormat(data.format) ? data.format : null;
}

// Parse content without downgrading V3 records.

export function parseGeographicPageContent(value: unknown): CountryPageContent {
  const format = getCountryPageContentFormat(value);

  if (format === "country_page_v3") {
    return parseCountryPageContentV3(value);
  }

  return parseCountryPageContent(value);
}

// Extract original geographic page body content.
// Supports all three stored formats.

export function getCountryBodyText(value: unknown): string {
  const data = asRecord(value);

  if (
    isSupportedCountryPageFormat(data.format) &&
    typeof data.text === "string"
  ) {
    return data.text.trim();
  }

  return "";
}

// Shared geographic publication validation.
// Matches existing SQL publication thresholds.

export type CountryPagePublicationInput = {
  heading?: unknown;
  description?: unknown;
  seo_title?: unknown;
  seo_description?: unknown;
  content?: unknown;
};

export type CountryPageValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateCountryPagePublication(
  value: CountryPagePublicationInput,
): CountryPageValidationResult {
  const errors: string[] = [];

  if (asText(value.heading).trim().length < 10) {
    errors.push("Page heading must contain at least 10 characters.");
  }

  if (asText(value.description).trim().length < 100) {
    errors.push("Page description must contain at least 100 characters.");
  }

  if (asText(value.seo_title).trim().length < 10) {
    errors.push("SEO title must contain at least 10 characters.");
  }

  if (asText(value.seo_description).trim().length < 50) {
    errors.push("SEO description must contain at least 50 characters.");
  }

  if (!getCountryPageContentFormat(value.content)) {
    errors.push("Unsupported geographic page content format.");
  }

  if (getCountryBodyText(value.content).length < 300) {
    errors.push("Original page content must contain at least 300 characters.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Split original page body into paragraphs and sections.
// Only standalone Markdown-style headings are interpreted.
// No HTML is rendered or injected.

export function splitCountryBody(text: string) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  const intro: string[] = [];

  const sections: {
    heading: string;
    paragraphs: string[];
  }[] = [];

  for (const block of blocks) {
    const lines = block.split(/\n/);
    const first = lines[0].trim();

    const heading = first.match(/^(?:\*\*(.+?)\*\*|#{1,3}\s+(.+))$/);

    if (heading) {
      sections.push({
        heading: (heading[1] || heading[2]).trim(),
        paragraphs: [],
      });

      const remainder = lines.slice(1).join("\n").trim();

      if (remainder) {
        sections[sections.length - 1].paragraphs.push(remainder);
      }
    } else if (sections.length) {
      sections[sections.length - 1].paragraphs.push(block);
    } else {
      intro.push(block);
    }
  }

  return {
    intro,
    sections,
  };
}
