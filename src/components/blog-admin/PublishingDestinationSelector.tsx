"use client";

import { useState } from "react";
import { Globe2, MapPin, Building2, Layers } from "lucide-react";

type Destination = {
  id: string;
  name: string;
  slug: string;
  page_type: string;
  status: string;
  country_id: string | null;
};

type Country = {
  id: string;
  name: string;
  country_code: string;
  is_active: boolean;
};

type Props = {
  pages: Destination[];
  countries: Country[];
  initialSelectedIds: string[];
};

export default function PublishingDestinationSelector({
  pages,
  countries,
  initialSelectedIds,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  function toggleDestination(id: string, checked: boolean) {
    setSelectedIds((current) =>
      checked
        ? [...new Set([...current, id])]
        : current.filter((item) => item !== id),
    );
  }

  const globalPages = pages.filter((page) => page.page_type === "GLOBAL");

  const customPages = pages.filter((page) => page.page_type === "CUSTOM");

  const countryGroups = countries
    .map((country) => ({
      country,
      countryPages: pages.filter(
        (page) =>
          page.page_type === "COUNTRY" && page.country_id === country.id,
      ),
      cityPages: pages.filter(
        (page) => page.page_type === "CITY" && page.country_id === country.id,
      ),
    }))
    .filter(
      (group) => group.countryPages.length > 0 || group.cityPages.length > 0,
    );

  const knownCountryIds = new Set(countries.map((country) => country.id));

  const unmatchedPages = pages.filter(
    (page) =>
      page.page_type !== "GLOBAL" &&
      page.page_type !== "CUSTOM" &&
      (!["COUNTRY", "CITY"].includes(page.page_type) ||
        !page.country_id ||
        !knownCountryIds.has(page.country_id)),
  );

  function renderDestination(page: Destination, nested = false) {
    const checked = selectedIds.includes(page.id);

    const pageUrl =
      page.page_type === "GLOBAL"
        ? "/blog"
        : page.page_type === "CUSTOM"
          ? `/pages/${page.slug}`
          : `/${page.slug}`;

    const isPublished = page.status === "PUBLISHED";

    const parentCountry = countries.find(
      (country) => country.id === page.country_id,
    );

    const inactiveCountry = parentCountry?.is_active === false;

    const Icon =
      page.page_type === "GLOBAL"
        ? Globe2
        : page.page_type === "CITY"
          ? Building2
          : page.page_type === "COUNTRY"
            ? MapPin
            : Layers;

    return (
      <label
        key={page.id}
        className={`
          flex cursor-pointer items-start gap-3 rounded-lg
          border p-3 text-sm transition-colors
          ${
            checked
              ? "border-[#D5FF66]/60 bg-[#D5FF66]/5"
              : "border-white/10 bg-[#1c2022] hover:border-[#D5FF66]/40"
          }
          ${nested ? "ml-3 sm:ml-5" : ""}
        `}
      >
        <input
          type="checkbox"
          name="page_ids"
          value={page.id}
          checked={checked}
          onChange={(event) => toggleDestination(page.id, event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-[#D5FF66]"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon size={15} className="shrink-0 text-[#D5FF66]" />

            <span className="break-words font-medium text-white">
              {page.name}
            </span>
          </div>

          <p className="mt-1 break-all text-xs text-white/45">{pageUrl}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium tracking-wide text-white/40">
              {page.page_type}
            </span>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                isPublished
                  ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                  : "border-white/15 bg-white/5 text-white/50"
              }`}
            >
              {page.status}
            </span>

            {inactiveCountry && (
              <span className="text-[10px] text-amber-300">
                Inactive country
              </span>
            )}
          </div>

          {page.page_type === "CUSTOM" && (
            <p className="mt-2 text-xs text-white/40">
              Requires a corresponding public route.
            </p>
          )}
        </div>
      </label>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold text-white/85">
          Publishing Destinations *
        </p>

        <p className="mt-2 text-xs leading-6 text-white/45">
          Select one or more destinations where this article should appear.
        </p>
      </div>

      {/* SELECTION SUMMARY */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#D5FF66]/20 bg-[#D5FF66]/5 px-3 py-3">
        <span
          aria-live="polite"
          className="text-xs font-semibold text-[#D5FF66]"
        >
          {selectedIds.length}{" "}
          {selectedIds.length === 1 ? "destination" : "destinations"} selected
        </span>

        <button
          type="button"
          onClick={() => setSelectedIds([])}
          disabled={!selectedIds.length}
          className="rounded-md border border-[#D5FF66]/30 !bg-transparent px-3 py-1.5 text-xs font-medium !text-[#D5FF66] transition-colors hover:!bg-[#D5FF66] hover:!text-[#101214] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear selection
        </button>
      </div>

      {/* GLOBAL DESTINATIONS */}
      {globalPages.length > 0 && (
        <section className="space-y-3 rounded-xl border border-white/10 p-3">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D5FF66]">
            <Globe2 size={15} />
            Global
          </h3>

          {globalPages.map((page) => renderDestination(page))}
        </section>
      )}

      {/* COUNTRY AND CITY GROUPS */}
      {countryGroups.map((group) => (
        <section
          key={group.country.id}
          className="space-y-3 rounded-xl border border-white/10 p-3"
        >
          <div className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0 text-[#D5FF66]" />

            <h3 className="text-xs font-semibold text-[#D5FF66]">
              {group.country.name} ({group.country.country_code})
            </h3>
          </div>

          {!group.country.is_active && (
            <p className="text-xs text-amber-300">
              This country is currently inactive.
            </p>
          )}

          {/* COUNTRY LANDING PAGE */}
          {group.countryPages.map((page) => renderDestination(page))}

          {/* CITY LANDING PAGES */}
          {group.cityPages.length > 0 && (
            <div className="space-y-2">
              <p className="ml-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Cities
              </p>

              {group.cityPages.map((page) => renderDestination(page, true))}
            </div>
          )}
        </section>
      ))}

      {/* CUSTOM DESTINATIONS */}
      {customPages.length > 0 && (
        <section className="space-y-3 rounded-xl border border-white/10 p-3">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D5FF66]">
            <Layers size={15} />
            Custom Destinations
          </h3>

          {customPages.map((page) => renderDestination(page))}
        </section>
      )}

      {/* PRESERVE ANY UNMATCHED DESTINATIONS */}
      {unmatchedPages.length > 0 && (
        <section className="space-y-3 rounded-xl border border-amber-500/20 p-3">
          <h3 className="text-xs font-semibold text-amber-300">
            Other Destinations
          </h3>

          {unmatchedPages.map((page) => renderDestination(page))}
        </section>
      )}

      {!pages.length && (
        <p className="text-xs text-white/50">
          No publishing destinations available.
        </p>
      )}

      {!selectedIds.length && pages.length > 0 && (
        <p className="text-xs text-amber-300">
          Select at least one publishing destination before saving.
        </p>
      )}

      {selectedIds.length > 50 && (
        <p className="text-xs text-amber-300">
          A maximum of 50 publishing destinations is allowed per article.
        </p>
      )}

      <p className="text-xs leading-6 text-white/40">
        Selecting a country does not automatically select its cities. Articles
        assigned to draft destinations will not appear on those landing pages
        until the destinations are published.
      </p>
    </div>
  );
}
