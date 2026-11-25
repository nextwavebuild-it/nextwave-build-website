"use client";

import { useState } from "react";
import { createPublishingPage } from "@/lib/blog-admin/actions";

type Country = {
  id: string;
  name: string;
  country_code: string;
};

type DestinationType = "COUNTRY" | "CITY" | "CUSTOM";

type Props = {
  countries: Country[];
  disabled?: boolean;
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateDestinationForm({
  countries,
  disabled = false,
}: Props) {
  const [pageType, setPageType] = useState<DestinationType>("COUNTRY");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [countryId, setCountryId] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const selectedCountry = countries.find((country) => country.id === countryId);

  const generatedSlug = slugify(slug.trim() || name.trim());

  const publicPath =
    pageType === "CUSTOM" ? `/pages/${generatedSlug}` : `/${generatedSlug}`;

  const cannotSubmit = disabled || (pageType === "CITY" && !selectedCountry);

  return (
    <form
      action={createPublishingPage}
      className="space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6"
    >
      {/* FORM HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          Add New Destination
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Create country-specific, city-specific or custom publishing
          destinations.
        </p>
      </div>

      {/* PAGE NAME */}
      <label className="block text-sm font-medium text-white/85">
        Page name *
        <input
          name="name"
          required
          minLength={2}
          maxLength={120}
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={input}
          placeholder={
            pageType === "CITY"
              ? "Dubai"
              : pageType === "COUNTRY"
                ? "United Arab Emirates"
                : "Destination name"
          }
        />
      </label>

      {/* URL SLUG */}
      <label className="block text-sm font-medium text-white/85">
        URL slug (optional)
        <input
          name="slug"
          maxLength={100}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className={input}
          placeholder={slugify(name) || "destination-slug"}
        />
        <span className="mt-2 block text-xs text-white/40">
          Leave empty to generate the URL from the page name.
        </span>
      </label>

      {/* PAGE TYPE */}
      <label className="block text-sm font-medium text-white/85">
        Page type *
        <select
          name="page_type"
          value={pageType}
          onChange={(event) => {
            setPageType(event.target.value as DestinationType);
            setCountryId("");
            setCountryCode("");
          }}
          className={input}
          required
        >
          <option value="COUNTRY">Country</option>
          <option value="CITY">City</option>
          <option value="CUSTOM">Custom</option>
        </select>
      </label>

      {/* COUNTRY CODE — COUNTRY ONLY */}
      {pageType === "COUNTRY" && (
        <label className="block text-sm font-medium text-white/85">
          2-letter country code *
          <input
            name="country_code"
            value={countryCode}
            onChange={(event) =>
              setCountryCode(
                event.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, "")
                  .slice(0, 2),
              )
            }
            className={input}
            placeholder="AE"
            maxLength={2}
            minLength={2}
            pattern="[A-Z]{2}"
            autoCapitalize="characters"
            required
          />
          <span className="mt-2 block text-xs text-white/40">
            Use the two-letter ISO country code, such as AE, SA, PK or GB.
          </span>
        </label>
      )}

      {/* PARENT COUNTRY — CITY ONLY */}
      {pageType === "CITY" && (
        <div className="space-y-5 rounded-xl border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-5">
          <label className="block text-sm font-medium text-white/85">
            Parent country *
            <select
              name="country_id"
              value={countryId}
              onChange={(event) => setCountryId(event.target.value)}
              className={input}
              required
            >
              <option value="">Select a country</option>

              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({country.country_code})
                </option>
              ))}
            </select>
          </label>

          {!countries.length && (
            <p className="text-xs leading-6 text-amber-300">
              No active countries are available. Create a country destination
              first.
            </p>
          )}

          <label className="block text-sm font-medium text-white/85">
            Inherited country code
            <input
              value={selectedCountry?.country_code ?? ""}
              readOnly
              disabled
              className={`${input} cursor-not-allowed opacity-60`}
              placeholder="Select a parent country"
            />
            <span className="mt-2 block text-xs text-white/45">
              The country code is automatically inherited from the selected
              parent country.
            </span>
          </label>
        </div>
      )}

      {/* LIVE URL PREVIEW */}
      <div className="rounded-xl border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
          Generated public URL
        </p>

        <p className="mt-2 break-all text-sm font-semibold text-[#D5FF66]">
          {generatedSlug
            ? `https://nextwavebuild.com${publicPath}`
            : "Enter a page name or URL slug"}
        </p>

        {pageType === "CITY" && (
          <p className="mt-2 text-xs leading-6 text-white/45">
            City destinations use independent URLs, regardless of their parent
            country.
          </p>
        )}

        {pageType === "CUSTOM" && (
          <p className="mt-2 text-xs leading-6 text-white/45">
            Custom destinations require a corresponding public route before they
            can be published.
          </p>
        )}
      </div>

      {/* PAGE HEADING */}
      <label className="block text-sm font-medium text-white/85">
        Page heading
        <input
          name="heading"
          maxLength={180}
          className={input}
          placeholder="Explore Digital Skills and Education"
        />
      </label>

      {/* PAGE INTRODUCTION */}
      <label className="block text-sm font-medium text-white/85">
        Page introduction
        <textarea
          name="description"
          className={input}
          rows={4}
          maxLength={5000}
          placeholder="Introduce educational opportunities and digital skills relevant to this destination."
        />
      </label>

      {/* SEO TITLE */}
      <label className="block text-sm font-medium text-white/85">
        SEO title
        <input
          name="seo_title"
          className={input}
          maxLength={180}
          placeholder="Digital Skills & Online Learning | NextWave Build"
        />
      </label>

      {/* SEO DESCRIPTION */}
      <label className="block text-sm font-medium text-white/85">
        SEO description
        <textarea
          name="seo_description"
          className={input}
          maxLength={300}
          rows={3}
          placeholder="Write a compelling description for search engines."
        />
      </label>

      {/* DRAFT INFORMATION */}
      <p className="text-xs leading-6 text-white/45">
        All new destinations are created as drafts. Complete the page content
        before publishing.
      </p>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={cannotSubmit}
        className="inline-flex items-center justify-center rounded-xl bg-[#D5FF66] px-6 py-3 text-sm font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FF66] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Create Draft Destination
      </button>
    </form>
  );
}
