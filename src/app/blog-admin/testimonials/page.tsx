import Link from "next/link";
import {
  MessageSquareQuote,
  CheckCircle2,
  FileText,
  Archive,
  Plus,
  Pencil,
} from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import { changeBlogTestimonialStatus } from "@/lib/blog-admin/testimonial-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

const statusStyles: Record<string, string> = {
  PUBLISHED: "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]",
  DRAFT: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  ARCHIVED: "border-white/15 bg-white/5 text-white/50",
};

export default async function TestimonialsPage({ searchParams }: Props) {
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const [testimonialResult, programmeResult, pageResult] = await Promise.all([
    supabase
      .from("blog_testimonials")
      .select(
        "id,student_name,professional_title,testimonial,rating,programme_id,destination_scope,consent_confirmed,status,sort_order,updated_at,blog_testimonial_pages(page_id)",
      )
      .order("sort_order", { ascending: true })
      .order("student_name", { ascending: true }),

    supabase.from("blog_programmes").select("id,name,is_active"),

    supabase
      .from("blog_pages")
      .select("id,name,slug,status")
      .in("page_type", ["COUNTRY", "CITY"]),
  ]);

  if (testimonialResult.error || programmeResult.error || pageResult.error) {
    throw new Error("Unable to load testimonials.");
  }

  const testimonials = testimonialResult.data ?? [];

  const programmes = new Map(
    (programmeResult.data ?? []).map((item) => [item.id, item]),
  );

  const pages = new Map((pageResult.data ?? []).map((item) => [item.id, item]));

  const statistics = [
    {
      label: "Total Testimonials",
      value: testimonials.length,
      icon: MessageSquareQuote,
    },
    {
      label: "Published",
      value: testimonials.filter((item) => item.status === "PUBLISHED").length,
      icon: CheckCircle2,
    },
    {
      label: "Draft",
      value: testimonials.filter((item) => item.status === "DRAFT").length,
      icon: FileText,
    },
    {
      label: "Archived",
      value: testimonials.filter((item) => item.status === "ARCHIVED").length,
      icon: Archive,
    },
  ];

  return (
    <div className="space-y-8 text-white">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
            SHARED CONTENT MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Testimonial Management
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/55">
            Manage student testimonials across country and city landing pages.
          </p>
        </div>

        <Link
          href="/blog-admin/testimonials/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214]"
        >
          <Plus size={18} />
          Add Testimonial
        </Link>
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className="rounded-xl border border-white/10 bg-[#15191A] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white/55">{statistic.label}</p>

                <Icon size={22} className="text-[#D5FF66]" />
              </div>

              <p className="mt-5 text-4xl font-semibold">{statistic.value}</p>
            </article>
          );
        })}
      </section>

      <div className="rounded-xl border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-5 text-sm leading-7 text-white/65">
        Publish only genuine student testimonials with confirmed permission.
        Published status alone does not guarantee public visibility; programme
        and destination eligibility also apply.
      </div>

      {testimonials.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => {
            const programme = item.programme_id
              ? programmes.get(item.programme_id)
              : null;

            const destinations = (item.blog_testimonial_pages ?? []).map(
              (placement) => ({
                id: placement.page_id,
                name:
                  pages.get(placement.page_id)?.name ?? "Unknown destination",
                status: pages.get(placement.page_id)?.status ?? "UNKNOWN",
              }),
            );

            return (
              <article
                key={item.id}
                className="flex h-full flex-col rounded-xl border border-white/10 bg-[#15191A] p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <MessageSquareQuote size={28} className="text-[#D5FF66]" />

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      statusStyles[item.status] ?? statusStyles.DRAFT
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.rating !== null && (
                  <p
                    aria-label={`${item.rating} out of 5 stars`}
                    className="mt-5 tracking-widest text-[#D5FF66]"
                  >
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </p>
                )}

                <blockquote className="my-5 line-clamp-5 whitespace-pre-line break-words text-sm leading-7 text-white/70">
                  {item.testimonial}
                </blockquote>

                <div className="border-t border-white/10 pt-5">
                  <h2 className="text-lg font-semibold">{item.student_name}</h2>

                  {item.professional_title && (
                    <p className="mt-2 text-xs text-white/50">
                      {item.professional_title}
                    </p>
                  )}
                </div>

                <div className="my-5 space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-xs text-white/65">
                  <p>Programme: {programme?.name ?? "General"}</p>

                  <div className="space-y-3">
                    <p className="font-semibold">Geographic destinations</p>

                    {item.destination_scope === "GLOBAL" ? (
                      <span className="inline-flex rounded-full border border-[#D5FF66]/25 bg-[#D5FF66]/10 px-3 py-1.5 text-xs text-[#D5FF66]">
                        All geographic pages
                      </span>
                    ) : destinations.length > 0 ? (
                      <>
                        <p className="text-xs text-white/45">
                          {destinations.length} selected destinations
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {destinations.map((destination) => (
                            <span
                              key={destination.id}
                              className={`rounded-full border px-3 py-1.5 text-xs ${
                                destination.status === "PUBLISHED"
                                  ? "border-[#D5FF66]/25 bg-[#D5FF66]/5 text-[#D5FF66]"
                                  : "border-yellow-500/25 bg-yellow-500/5 text-yellow-300"
                              }`}
                            >
                              {destination.name}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-yellow-300">
                        No destinations configured.
                      </p>
                    )}
                  </div>

                  <p>
                    Consent:{" "}
                    <span
                      className={
                        item.consent_confirmed
                          ? "text-[#D5FF66]"
                          : "text-yellow-300"
                      }
                    >
                      {item.consent_confirmed ? "Confirmed" : "Not confirmed"}
                    </span>
                  </p>

                  <p>Display order: {item.sort_order}</p>

                  {programme && !programme.is_active && (
                    <p className="text-yellow-300">
                      Assigned programme is inactive.
                    </p>
                  )}

                  {destinations.some(
                    (destination) => destination.status !== "PUBLISHED",
                  ) && (
                    <p className="text-yellow-300">
                      One or more assigned destinations are not published.
                    </p>
                  )}
                </div>

                <div className="mt-auto flex flex-wrap gap-2 border-t border-white/10 pt-5">
                  <Link
                    href={`/blog-admin/testimonials/${item.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-4 py-2.5 text-xs font-semibold !text-[#101214]"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>

                  {item.status !== "PUBLISHED" && item.consent_confirmed && (
                    <form action={changeBlogTestimonialStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="updated_at"
                        value={item.updated_at}
                      />
                      <input type="hidden" name="status" value="PUBLISHED" />

                      <button
                        type="submit"
                        className="rounded-lg border border-[#D5FF66]/25 !bg-[#D5FF66]/10 px-4 py-2.5 text-xs font-semibold !text-[#D5FF66]"
                      >
                        Publish
                      </button>
                    </form>
                  )}

                  {item.status !== "DRAFT" && (
                    <form action={changeBlogTestimonialStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="updated_at"
                        value={item.updated_at}
                      />
                      <input type="hidden" name="status" value="DRAFT" />

                      <button
                        type="submit"
                        className="rounded-lg border border-yellow-500/25 !bg-yellow-500/10 px-4 py-2.5 text-xs font-semibold !text-yellow-300"
                      >
                        Move to Draft
                      </button>
                    </form>
                  )}

                  {item.status !== "ARCHIVED" && (
                    <form action={changeBlogTestimonialStatus}>
                      <input type="hidden" name="id" value={item.id} />
                      <input
                        type="hidden"
                        name="updated_at"
                        value={item.updated_at}
                      />
                      <input type="hidden" name="status" value="ARCHIVED" />

                      <button
                        type="submit"
                        className="rounded-lg border border-red-500/25 !bg-red-500/10 px-4 py-2.5 text-xs font-semibold !text-red-300"
                      >
                        Archive
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="flex flex-col items-center rounded-xl border border-white/10 bg-[#15191A] px-6 py-20 text-center">
          <MessageSquareQuote size={50} className="text-white/25" />

          <h2 className="mt-6 text-xl font-semibold">
            No testimonials added yet
          </h2>

          <p className="mt-3 text-sm text-white/45">
            Create your first genuine student testimonial.
          </p>

          <Link
            href="/blog-admin/testimonials/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214]"
          >
            <Plus size={17} />
            Add First Testimonial
          </Link>
        </section>
      )}
    </div>
  );
}
