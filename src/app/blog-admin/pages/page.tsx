import Link from "next/link";
import { ArrowRight, ExternalLink, Pencil } from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import CreateDestinationForm from "@/components/blog-admin/CreateDestinationForm";

export default async function PublishingPages({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
}) {
  const { supabase } = await requireBlogAdmin();

  // Fetch destinations and countries concurrently.
  const [pagesResult, countriesResult] = await Promise.all([
    supabase
      .from("blog_pages")
      .select("id,name,slug,page_type,status,country_id")
      .order("created_at"),

    supabase
      .from("blog_countries")
      .select("id,name,country_code,is_active")
      .order("name"),
  ]);

  const pages = pagesResult.data ?? [];
  const countries = countriesResult.data ?? [];

  const activeCountries = countries.filter((country) => country.is_active);

  const countriesById = new Map(
    countries.map((country) => [country.id, country]),
  );

  const query = await searchParams;

  const loadingError = Boolean(pagesResult.error || countriesResult.error);

  return (
    <main className="max-w-5xl space-y-7">
      {/* PAGE HEADER */}
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-[#D5FF66]">
          MULTI-PAGE PUBLISHING
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
          Publishing Destinations
        </h1>

        <p className="mt-3 text-sm leading-7 text-white/60">
          Create and manage country-specific and city-specific SEO landing
          pages. Edit their content, prepare drafts, and manage publishing.
        </p>
      </div>

      {/* ERROR NOTIFICATION */}
      {query.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          {query.error}
        </div>
      )}

      {/* SUCCESS NOTIFICATION */}
      {query.success && (
        <div
          role="status"
          className="rounded-xl border border-[#D5FF66]/30 bg-[#D5FF66]/10 px-5 py-4 text-sm text-[#D5FF66]"
        >
          {query.success}
        </div>
      )}

      {/* COUNTRY LOADING ERROR */}
      {countriesResult.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200"
        >
          Could not load country records. Destination creation has been
          disabled.
        </div>
      )}

      {/* EXISTING PUBLISHING DESTINATIONS */}
      <section className="rounded-xl border border-white/10 bg-[#15191A] p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Existing Pages</h2>

          <p className="mt-2 text-sm text-white/45">
            Manage the locations where your educational articles can appear.
          </p>
        </div>

        {pagesResult.error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            Could not load publishing destinations.
          </p>
        ) : !pages.length ? (
          <div className="rounded-lg border border-dashed border-white/10 p-8 text-center">
            <p className="text-sm text-white/50">
              No publishing destinations available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {pages.map((page) => {
              const isCountry = page.page_type === "COUNTRY";

              const isCity = page.page_type === "CITY";

              const pageUrl =
                page.page_type === "GLOBAL"
                  ? "/blog"
                  : isCountry || isCity
                    ? `/${page.slug}`
                    : `/pages/${page.slug}`;

              const isPublished = page.status === "PUBLISHED";

              const country = page.country_id
                ? countriesById.get(page.country_id)
                : undefined;

              return (
                <div
                  key={page.id}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* PAGE INFORMATION */}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{page.name}</p>

                    <p className="mt-2 break-all text-xs text-white/45">
                      {pageUrl}
                    </p>

                    <p className="mt-2 text-xs uppercase tracking-wider text-white/35">
                      {page.page_type}
                    </p>

                    {/* COUNTRY INFORMATION */}
                    {isCountry && country && (
                      <p className="mt-2 text-xs text-white/45">
                        Country code:{" "}
                        <span className="font-medium text-[#D5FF66]">
                          {country.country_code}
                        </span>
                      </p>
                    )}

                    {/* CITY PARENT INFORMATION */}
                    {isCity && country && (
                      <p className="mt-2 text-xs text-white/45">
                        Parent country:{" "}
                        <span className="font-medium text-[#D5FF66]">
                          {country.name} ({country.country_code})
                        </span>
                      </p>
                    )}

                    {(isCountry || isCity) && country && !country.is_active && (
                      <p className="mt-2 text-xs text-amber-300">
                        Parent country is inactive.
                      </p>
                    )}
                  </div>

                  {/* STATUS AND ACTIONS */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        isPublished
                          ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                          : "border-white/15 bg-white/5 text-white/55"
                      }`}
                    >
                      {page.status}
                    </span>

                    {/* COUNTRY EDITOR */}
                    {(isCountry || isCity) && (
                      <Link
                        href={`/blog-admin/pages/${page.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#D5FF66]/35 bg-[#D5FF66]/10 px-4 py-2 text-sm font-semibold text-[#D5FF66] transition-colors hover:border-[#D5FF66] hover:bg-[#D5FF66]/15"
                      >
                        <Pencil size={15} />
                        Edit Page
                        <ArrowRight size={14} />
                      </Link>
                    )}

                    {/* VIEW PUBLISHED PAGE */}
                    {isPublished && (
                      <Link
                        href={pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
                      >
                        <ExternalLink size={15} />
                        View Live
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CREATE DESTINATION FORM */}
      <CreateDestinationForm
        countries={activeCountries}
        disabled={loadingError}
      />
    </main>
  );
}
