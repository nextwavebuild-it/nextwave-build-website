// Shared server-safe helpers for both the Blog Admin and public country pages.
// The original country_text_v1 records remain readable without a migration.
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

type ContentInput = Record<string, unknown>;
const asText = (value: unknown): string =>
  typeof value === "string" ? value : "";

export function parseCountryPageContent(value: unknown): CountryPageContentV2 {
  const data: ContentInput =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as ContentInput)
      : {};
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

export function getCountryBodyText(value: unknown): string {
  const data =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as ContentInput)
      : {};
  if (
    (data.format === "country_page_v2" || data.format === "country_text_v1") &&
    typeof data.text === "string"
  ) {
    return data.text.trim();
  }
  return "";
}

// The legacy country body uses separated paragraphs with Markdown-style standalone headings.
// Only these headings are interpreted, all other content remains plain text (no HTML injection).
export function splitCountryBody(text: string) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .filter(Boolean);
  const intro: string[] = [];
  const sections: { heading: string; paragraphs: string[] }[] = [];
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
      if (remainder) sections[sections.length - 1].paragraphs.push(remainder);
    } else if (sections.length) {
      sections[sections.length - 1].paragraphs.push(block);
    } else {
      intro.push(block);
    }
  }
  return { intro, sections };
}
