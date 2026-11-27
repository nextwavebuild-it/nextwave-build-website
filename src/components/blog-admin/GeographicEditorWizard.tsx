"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

const steps = [
  "Hero and introduction",
  "Section visibility",
  "Trust benefits",
  "Programmes and comparison",
  "Local educational insights",
  "Target audience",
  "Why NextWave Build",
  "Learning method",
  "Mentors and testimonials",
  "Enrollment process",
  "Related locations",
  "Frequently asked questions",
  "Related articles",
  "Final call to action",
  "Search engine optimization",
];

type Shared = Record<
  string,
  { heading: string; description: string; hasItems: boolean }
>;
type Status = { label: string; issues: string[] };
type Props = { children: ReactNode; shared: Shared; disabled?: boolean };

function assess(form: HTMLFormElement, shared: Shared): Status[] {
  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const enabled = (name: string) => data.has(`section_${name}`);
  const ready = (): Status => ({ label: "Ready", issues: [] });
  const off = (): Status => ({ label: "Disabled", issues: [] });
  const managed = (): Status => ({ label: "Automatic / catalog", issues: [] });
  const result = (issues: string[], label = "Ready"): Status => ({
    label: issues.length ? "Needs attention" : label,
    issues,
  });
  const minimum = (name: string, label: string, min: number) =>
    value(name).length < min ? [`${label}: minimum ${min} characters.`] : [];
  function pairs(name: string, title = "Title", desc = "Description") {
    const titles = data.getAll(`${name}_title`).map((v) => String(v).trim());
    const descriptions = data
      .getAll(`${name}_description`)
      .map((v) => String(v).trim());
    const issues: string[] = [];
    let complete = 0;
    for (let i = 0; i < Math.max(titles.length, descriptions.length); i++) {
      const a = titles[i] || "",
        b = descriptions[i] || "";
      if (a && b) complete++;
      else if (a || b)
        issues.push(`Item ${i + 1}: ${a ? desc : title} is missing.`);
    }
    return { issues, complete };
  }
  function features(
    flag: string,
    name: string,
    key?: string,
    faq = false,
  ): Status {
    if (!enabled(flag)) return off();
    const p = pairs(
      name,
      faq ? "Question" : "Title",
      faq ? "Answer" : "Description",
    );
    const fallback = key && shared[key]?.hasItems;
    if (!p.complete && !fallback)
      p.issues.push(
        faq
          ? "Add at least one complete question and answer or activate shared FAQs."
          : "Add at least one complete content item or configure shared content where supported.",
      );
    return result(
      p.issues,
      !p.complete && fallback ? "Shared content" : "Ready",
    );
  }
  const hero = [
    ...minimum("heading", "Hero title", 10),
    ...minimum("description", "Hero introduction", 100),
  ];
  if (value("heroImageUrl") && !value("heroImageAlt"))
    hero.push("Hero image alternative text is missing.");
  const comparison = enabled("programmeComparison");
  const programmes = enabled("programmes");
  const comparisonIssues =
    comparison &&
    !value("comparisonDescription") &&
    !shared.programme_comparison?.description
      ? [
          "Comparison description is not configured locally or in shared content.",
        ]
      : [];
  const method = !enabled("learningMethod")
    ? off()
    : result(
        shared.learning_method?.hasItems
          ? []
          : ["Configure learning method items in Shared Content."],
        "Shared content",
      );
  const cta = enabled("finalCta")
    ? result([
        ...minimum("ctaTitle", "CTA heading", 1),
        ...minimum("ctaDescription", "CTA description", 1),
        ...minimum("ctaButtonText", "CTA button", 1),
      ])
    : off();
  return [
    result(hero),
    ready(),
    features("trustBenefits", "trustBenefits", "trust_benefits"),
    !comparison && !programmes
      ? off()
      : result(comparisonIssues, "Automatic / catalog"),
    result(minimum("country_content", "Original geographic content", 300)),
    features("targetAudience", "audienceItems"),
    features("whyNextWave", "whyNextWaveItems", "why_nextwave"),
    method,
    enabled("mentors") || enabled("testimonials") ? managed() : off(),
    features("enrollmentSteps", "enrollmentSteps", "enrollment_steps"),
    enabled("relatedLocations") ? managed() : off(),
    features("faqs", "faqs", "shared_faqs", true),
    enabled("resources") ? managed() : off(),
    cta,
    result([
      ...minimum("seo_title", "SEO title", 10),
      ...minimum("seo_description", "Meta description", 50),
    ]),
  ];
}

export default function GeographicEditorWizard({
  children,
  shared,
  disabled,
}: Props) {
  const panels = Children.toArray(children);
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(0);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = root.current?.closest("form");
    if (!form) return;
    const snapshot = () =>
      JSON.stringify(Array.from(new FormData(form).entries()));
    const initial = snapshot();
    let submitting = false;
    const update = () => {
      setStatuses(assess(form, shared));
      setDirty(snapshot() !== initial);
    };
    const onSubmit = () => {
      submitting = true;
    };
    const onLeave = (event: BeforeUnloadEvent) => {
      if (!submitting && snapshot() !== initial) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const otherSubmit = (event: Event) => {
      if (
        event.target !== form &&
        snapshot() !== initial &&
        !window.confirm(
          "You have unsaved editor changes. This action uses saved content only. Continue?",
        )
      )
        event.preventDefault();
    };
    const initialFrame = window.requestAnimationFrame(update);
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    form.addEventListener("submit", onSubmit);
    document.addEventListener("submit", otherSubmit, true);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      form.removeEventListener("input", update);
      form.removeEventListener("change", update);
      form.removeEventListener("submit", onSubmit);
      document.removeEventListener("submit", otherSubmit, true);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [shared]);

  function navigate(index: number) {
    setActive(index);
    heading.current?.focus({ preventScroll: true });
    root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const relevant = statuses.filter((s) => s.label !== "Disabled");
  const attention = relevant.filter((s) => s.issues.length > 0).length;
  const checked = relevant.length - attention;
  const current = statuses[active];
  const color = (s?: Status) =>
    !s
      ? "text-white/45"
      : s.issues.length
        ? "text-amber-300"
        : s.label === "Disabled"
          ? "text-white/40"
          : s.label === "Shared content" || s.label === "Automatic / catalog"
            ? "text-sky-300"
            : "text-[#D5FF66]";
  return (
    <div ref={root} className="scroll-mt-6 space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#15191A] p-4">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span>
            Section {active + 1} of {steps.length}
          </span>
          <span aria-live="polite" className="text-[#D5FF66]">
            {checked} of {relevant.length} enabled/configuration steps without
            warnings
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-[#D5FF66] transition-all"
            style={{
              width: `${relevant.length ? (checked / relevant.length) * 100 : 0}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-white/50">
          {attention} steps need attention. Catalog availability and final
          publication rules are checked separately.
        </p>
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav
          aria-label="Editor sections"
          className="grid gap-1 rounded-xl border border-white/10 bg-[#15191A] p-2 lg:sticky lg:top-4"
        >
          {steps.map((step, index) => (
            <button
              key={step}
              type="button"
              aria-current={active === index ? "step" : undefined}
              onClick={() => navigate(index)}
              className={`w-full rounded-lg px-3 py-2 text-left !text-white ${active === index ? "!bg-[#303C25] ring-1 ring-[#D5FF66]/40" : "!bg-transparent hover:!bg-white/5"}`}
            >
              <span className="block text-sm">
                {index + 1}. {step}
              </span>
              <span className={`block text-xs ${color(statuses[index])}`}>
                {statuses[index]?.label ?? "Checking…"}
              </span>
            </button>
          ))}
        </nav>
        <div className="min-w-0 space-y-4">
          <h2 ref={heading} tabIndex={-1} className="sr-only">
            {steps[active]}
          </h2>
          {current?.issues.length ? (
            <div
              role="status"
              className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200"
            >
              <p className="font-semibold">Fields needing attention</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {current.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {panels.map((panel, index) => (
            <div
              key={index}
              hidden={index !== active}
              className={index !== active ? "hidden" : ""}
            >
              {panel}
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => navigate(active - 1)}
              className="rounded-lg border border-white/20 !bg-transparent px-4 py-3 text-sm !text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={active === steps.length - 1}
              onClick={() => navigate(active + 1)}
              className="rounded-lg !bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-[#101214] p-4 shadow-xl">
        <p className="text-xs text-white/60" role="status">
          {dirty
            ? "Unsaved changes — save all sections before previewing or publishing."
            : "No unsaved changes. Save privately before publishing."}
        </p>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg !bg-[#D5FF66] px-6 py-3 text-sm font-semibold !text-[#101214] disabled:opacity-40"
        >
          Save Working Draft
        </button>
      </div>
    </div>
  );
}
