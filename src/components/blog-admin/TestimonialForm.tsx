"use client";

import Link from "next/link";
import { useState } from "react";

export type TestimonialFormData = {
  id: string;
  student_name: string;
  professional_title: string | null;
  testimonial: string;
  image_url: string | null;
  image_alt: string | null;
  rating: number | null;
  programme_id: string | null;
  destination_scope: "GLOBAL" | "SELECTED";
  page_ids: string[];
  consent_confirmed: boolean;
  status: string;
  sort_order: number;
  updated_at: string;
};

export type ProgrammeOption = {
  id: string;
  name: string;
  is_active: boolean;
};

export type DestinationOption = {
  id: string;
  name: string;
  slug: string;
  page_type: string;
  status: string;
};

type Props = {
  testimonial?: TestimonialFormData;
  programmes: ProgrammeOption[];
  destinations: DestinationOption[];
  action: (formData: FormData) => Promise<void>;
};

const input =
  "mt-2 w-full rounded-lg border border-white/15 bg-[#1c2022] px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-1 focus:ring-[#D5FF66]/30";

const section = "space-y-5 rounded-xl border border-white/10 bg-[#15191A] p-6";

export default function TestimonialForm({
  testimonial,
  programmes,
  destinations,
  action,
}: Props) {
  const [destinationScope, setDestinationScope] = useState<
    "GLOBAL" | "SELECTED"
  >(testimonial?.destination_scope ?? "SELECTED");

  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(
    testimonial?.page_ids ?? [],
  );

  const [destinationSearch, setDestinationSearch] = useState("");

  const filteredDestinations = destinations.filter((destination) =>
    `${destination.name} ${destination.slug} ${destination.page_type}`
      .toLowerCase()
      .includes(destinationSearch.toLowerCase().trim()),
  );

  function toggleDestination(id: string) {
    setSelectedPageIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <form action={action} className="space-y-6 text-white">
      {testimonial && (
        <>
          <input type="hidden" name="id" value={testimonial.id} />

          <input
            type="hidden"
            name="updated_at"
            value={testimonial.updated_at}
          />
        </>
      )}

      {/* 1. STUDENT INFORMATION */}

      <section className={section}>
        <h2 className="text-xl font-semibold">1. Student Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Student name
            <span className="ml-1 text-[#D5FF66]">*</span>
            <input
              name="student_name"
              defaultValue={testimonial?.student_name ?? ""}
              minLength={2}
              maxLength={120}
              required
              placeholder="Student full name"
              className={input}
            />
          </label>

          <label className="block text-sm font-medium">
            Professional title
            <input
              name="professional_title"
              defaultValue={testimonial?.professional_title ?? ""}
              maxLength={180}
              placeholder="Student or professional title"
              className={input}
            />
          </label>
        </div>
      </section>

      {/* 2. TESTIMONIAL CONTENT */}

      <section className={section}>
        <h2 className="text-xl font-semibold">2. Testimonial Content</h2>

        <label className="block text-sm font-medium">
          Student testimonial
          <span className="ml-1 text-[#D5FF66]">*</span>
          <textarea
            name="testimonial"
            defaultValue={testimonial?.testimonial ?? ""}
            minLength={10}
            maxLength={5000}
            required
            rows={8}
            placeholder="Enter the student's genuine feedback..."
            className={input}
          />
          <span className="mt-2 block text-xs font-normal leading-6 text-white/45">
            Minimum 10 characters to save and 30 characters to publish. Preserve
            the meaning of the student&apos;s original feedback.
          </span>
        </label>

        <label className="block text-sm font-medium">
          Star rating
          <select
            name="rating"
            defaultValue={testimonial?.rating ?? ""}
            className={input}
          >
            <option value="">No rating</option>
            <option value="5">★★★★★ — 5 out of 5</option>
            <option value="4">★★★★☆ — 4 out of 5</option>
            <option value="3">★★★☆☆ — 3 out of 5</option>
            <option value="2">★★☆☆☆ — 2 out of 5</option>
            <option value="1">★☆☆☆☆ — 1 out of 5</option>
          </select>
          <span className="mt-2 block text-xs text-white/45">
            Optional. Only select a rating actually provided by the student.
          </span>
        </label>
      </section>

      {/* 3. STUDENT IMAGE */}

      <section className={section}>
        <h2 className="text-xl font-semibold">3. Student Image</h2>

        {testimonial?.image_url && (
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#202526]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={testimonial.image_url}
              alt={testimonial.image_alt || testimonial.student_name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <label className="block text-sm font-medium">
          Student image URL
          <input
            name="image_url"
            defaultValue={testimonial?.image_url ?? ""}
            maxLength={2000}
            placeholder="https://..."
            className={input}
          />
          <span className="mt-2 block text-xs text-white/45">
            Optional. Use an approved HTTPS image URL or local website image
            path.
          </span>
        </label>

        <label className="block text-sm font-medium">
          Image alternative text
          <input
            name="image_alt"
            defaultValue={testimonial?.image_alt ?? ""}
            maxLength={180}
            placeholder="Portrait of the student"
            className={input}
          />
          <span className="mt-2 block text-xs text-white/45">
            Required when an image is provided.
          </span>
        </label>
      </section>

      {/* 4. PROGRAMME AND DESTINATION */}

      <section className={section}>
        <h2 className="text-xl font-semibold">4. Programme and Destination</h2>

        <label className="block text-sm font-medium">
          Associated programme
          <select
            name="programme_id"
            defaultValue={testimonial?.programme_id ?? ""}
            className={input}
          >
            <option value="">General / No specific programme</option>

            {programmes.map((programme) => (
              <option key={programme.id} value={programme.id}>
                {programme.name}
                {!programme.is_active ? " (Inactive)" : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold">
              Geographic publishing destinations
            </h3>

            <p className="mt-2 text-xs leading-6 text-white/45">
              Choose all geographic pages or select specific countries and
              cities.
            </p>
          </div>

          {/* DESTINATION SCOPE */}

          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                destinationScope === "GLOBAL"
                  ? "border-[#D5FF66]/50 bg-[#D5FF66]/5"
                  : "border-white/10"
              }`}
            >
              <input
                type="radio"
                name="destination_scope"
                value="GLOBAL"
                checked={destinationScope === "GLOBAL"}
                onChange={() => setDestinationScope("GLOBAL")}
                className="mt-1 h-4 w-4 accent-[#D5FF66]"
              />

              <span>
                <span className="block text-sm font-semibold">
                  All geographic pages
                </span>

                <span className="mt-2 block text-xs leading-5 text-white/45">
                  Available across all eligible countries and cities.
                </span>
              </span>
            </label>

            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                destinationScope === "SELECTED"
                  ? "border-[#D5FF66]/50 bg-[#D5FF66]/5"
                  : "border-white/10"
              }`}
            >
              <input
                type="radio"
                name="destination_scope"
                value="SELECTED"
                checked={destinationScope === "SELECTED"}
                onChange={() => setDestinationScope("SELECTED")}
                className="mt-1 h-4 w-4 accent-[#D5FF66]"
              />

              <span>
                <span className="block text-sm font-semibold">
                  Selected destinations
                </span>

                <span className="mt-2 block text-xs leading-5 text-white/45">
                  Choose one or more geographic pages.
                </span>
              </span>
            </label>
          </div>

          {/* GLOBAL DESTINATION */}

          {destinationScope === "GLOBAL" && (
            <div className="rounded-lg border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-4">
              <p className="text-sm text-[#D5FF66]">
                This testimonial will be available across all eligible
                geographic pages, including future countries and cities.
              </p>
            </div>
          )}

          {/* MULTIPLE DESTINATIONS */}

          {destinationScope === "SELECTED" && (
            <div className="space-y-4">
              <input
                type="search"
                aria-label="Search geographic destinations"
                value={destinationSearch}
                onChange={(event) => setDestinationSearch(event.target.value)}
                placeholder="Search countries or cities..."
                className={input}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold text-[#D5FF66]">
                  {selectedPageIds.length} destinations selected
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPageIds(destinations.map((item) => item.id))
                    }
                    className="rounded-md border border-white/15 !bg-transparent px-3 py-2 text-xs !text-white"
                  >
                    Select all
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPageIds([])}
                    className="rounded-md border border-white/15 !bg-transparent px-3 py-2 text-xs !text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-white/10 p-3">
                {filteredDestinations.map((destination) => (
                  <label
                    key={destination.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 ${
                      selectedPageIds.includes(destination.id)
                        ? "border-[#D5FF66]/25 bg-[#D5FF66]/5"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPageIds.includes(destination.id)}
                        onChange={() => toggleDestination(destination.id)}
                        className="h-4 w-4 shrink-0 accent-[#D5FF66]"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {destination.name}
                        </p>

                        <p className="mt-1 text-xs text-white/45">
                          /{destination.slug}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-medium text-white/50">
                        {destination.page_type}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          destination.status === "PUBLISHED"
                            ? "text-[#D5FF66]"
                            : "text-yellow-300"
                        }`}
                      >
                        {destination.status}
                      </p>
                    </div>
                  </label>
                ))}

                {filteredDestinations.length === 0 && (
                  <p className="p-5 text-center text-sm text-white/45">
                    No matching destinations found.
                  </p>
                )}
              </div>

              {/* SUBMITTED DESTINATION IDS */}

              {selectedPageIds.map((id) => (
                <input key={id} type="hidden" name="page_ids" value={id} />
              ))}

              {/* SELECTED DESTINATION TAGS */}

              {selectedPageIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPageIds.map((id) => {
                    const destination = destinations.find(
                      (item) => item.id === id,
                    );

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleDestination(id)}
                        aria-label={`Remove ${destination?.name ?? id}`}
                        className="rounded-full border border-[#D5FF66]/25 !bg-[#D5FF66]/5 px-3 py-2 text-xs !text-[#D5FF66]"
                      >
                        {destination?.name ?? id} ×
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedPageIds.length === 0 && (
                <p role="alert" className="text-xs text-yellow-300">
                  Select at least one geographic destination.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 5. CONSENT AND PUBLICATION */}

      <section className={section}>
        <h2 className="text-xl font-semibold">5. Consent and Publication</h2>

        <label className="flex items-start gap-4 rounded-lg border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-5">
          <input
            type="checkbox"
            name="consent_confirmed"
            defaultChecked={testimonial?.consent_confirmed ?? false}
            className="mt-1 h-5 w-5 shrink-0 accent-[#D5FF66]"
          />

          <span>
            <span className="block text-sm font-semibold">
              Student consent confirmed
            </span>

            <span className="mt-2 block text-xs leading-6 text-white/55">
              I confirm that this student has granted permission to publish
              their testimonial, name and image where applicable.
            </span>
          </span>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Publication status
            <select
              name="status"
              defaultValue={testimonial?.status ?? "DRAFT"}
              className={input}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <span className="mt-2 block text-xs leading-6 text-white/45">
              Publishing requires confirmed student consent.
            </span>
          </label>

          <label className="block text-sm font-medium">
            Display order
            <input
              type="number"
              name="sort_order"
              min={0}
              max={9999}
              step={1}
              required
              defaultValue={testimonial?.sort_order ?? 0}
              className={input}
            />
            <span className="mt-2 block text-xs text-white/45">
              Lower numbers appear first.
            </span>
          </label>
        </div>
      </section>

      {/* FORM ACTIONS */}

      <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#101214] p-4 shadow-xl">
        <Link
          href="/blog-admin/testimonials"
          className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            destinationScope === "SELECTED" && selectedPageIds.length === 0
          }
          className="rounded-lg !bg-[#D5FF66] px-7 py-3 text-sm font-semibold !text-[#101214] hover:!bg-[#C5EF53] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {testimonial ? "Save Testimonial" : "Create Testimonial"}
        </button>
      </div>
    </form>
  );
}
