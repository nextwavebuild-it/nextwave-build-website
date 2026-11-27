import Link from "next/link";

import {
  GraduationCap,
  Plus,
  Pencil,
  ExternalLink,
  CheckCircle2,
  CircleOff,
  BookOpen,
} from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";

import { changeBlogProgrammeStatus } from "@/lib/blog-admin/programme-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

function formatPrice(amount: number | null, currency: string) {
  if (amount === null) return "Not configured";

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });

    const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;

    return formatter.format(amount / 10 ** digits);
  } catch {
    return "Invalid currency";
  }
}

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53]";

export default async function BlogProgrammesPage({ searchParams }: Props) {
  const query = await searchParams;

  const { supabase } = await requireBlogAdmin();

  const { data, error } = await supabase
    .from("blog_programmes")
    .select(
      "id,name,slug,short_description,programme_url,price_minor,original_price_minor,currency,duration,learning_format,skill_level,is_active,sort_order,updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load programme catalog.");
  }

  const programmes = data ?? [];

  const totalProgrammes = programmes.length;

  const activeProgrammes = programmes.filter(
    (programme) => programme.is_active,
  ).length;

  const inactiveProgrammes = totalProgrammes - activeProgrammes;

  const statistics = [
    {
      label: "Total Programmes",
      value: totalProgrammes,
      icon: GraduationCap,
      color: "text-[#D5FF66]",
    },
    {
      label: "Active Programmes",
      value: activeProgrammes,
      icon: CheckCircle2,
      color: "text-[#D5FF66]",
    },
    {
      label: "Inactive Programmes",
      value: inactiveProgrammes,
      icon: CircleOff,
      color: "text-white/50",
    },
  ];

  return (
    <div className="space-y-8 text-white">
      {/* PAGE HEADER */}

      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
            SHARED CONTENT MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Programme Catalog
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
            Manage programme information, pricing, course details and
            availability across country and city landing pages.
          </p>
        </div>

        <Link href="/blog-admin/programmes/new" className={primaryButton}>
          <Plus size={18} />
          New Programme
        </Link>
      </header>

      {/* FEEDBACK MESSAGES */}

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

      {/* STATISTICS */}

      <section className="grid gap-4 sm:grid-cols-3">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className="rounded-xl border border-white/10 bg-[#15191A] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-white/55">{statistic.label}</p>

                <Icon size={22} className={statistic.color} />
              </div>

              <p className="mt-5 text-4xl font-semibold">{statistic.value}</p>
            </article>
          );
        })}
      </section>

      {/* CATALOGUE NOTICE */}

      <div className="rounded-xl border border-[#D5FF66]/20 bg-[#D5FF66]/5 p-5">
        <p className="text-sm font-semibold text-[#D5FF66]">
          Shared Programme Catalog
        </p>

        <p className="mt-2 text-sm leading-7 text-white/55">
          Active programmes are available to V3 geographic pages. Catalogue
          pricing is for display purposes only and does not modify payment or
          Stripe pricing. Verify all pricing before activation.
        </p>
      </div>

      {/* PROGRAMME LIST */}

      <section className="overflow-hidden rounded-xl border border-white/10 bg-[#15191A]">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold">All Programmes</h2>

          <p className="mt-1 text-xs text-white/45">
            {totalProgrammes} programme records
          </p>
        </div>

        {programmes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-white/50"
                  >
                    Programme
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-white/50"
                  >
                    Price
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-white/50"
                  >
                    Duration
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-white/50"
                  >
                    Display Order
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-white/50"
                  >
                    Status
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-white/50"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {programmes.map((programme) => (
                  <tr
                    key={programme.id}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#D5FF66]/20 bg-[#D5FF66]/10">
                          <GraduationCap size={21} className="text-[#D5FF66]" />
                        </div>

                        <div>
                          <p className="font-semibold">{programme.name}</p>

                          <p className="mt-1 text-xs text-white/40">
                            {programme.slug}
                          </p>

                          <p className="mt-2 max-w-xs line-clamp-2 text-xs leading-5 text-white/50">
                            {programme.short_description ||
                              "Description not configured"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-6">
                      <p className="font-semibold">
                        {formatPrice(programme.price_minor, programme.currency)}
                      </p>

                      {programme.original_price_minor !== null &&
                        programme.price_minor !== null &&
                        programme.original_price_minor >
                          programme.price_minor && (
                          <p className="mt-1 text-xs text-white/40 line-through">
                            {formatPrice(
                              programme.original_price_minor,
                              programme.currency,
                            )}
                          </p>
                        )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-6 text-white/60">
                      {programme.duration || "Not set"}
                    </td>

                    <td className="px-6 py-6 text-white/60">
                      {programme.sort_order}
                    </td>

                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                          programme.is_active
                            ? "border-[#D5FF66]/25 bg-[#D5FF66]/10 text-[#D5FF66]"
                            : "border-white/15 bg-white/5 text-white/50"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            programme.is_active ? "bg-[#D5FF66]" : "bg-white/35"
                          }`}
                        />

                        {programme.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/blog-admin/programmes/${programme.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#D5FF66]/25 px-3 py-2 text-xs font-semibold text-[#D5FF66] hover:bg-[#D5FF66]/10"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>

                        {/^\/programmes\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
                          programme.programme_url,
                        ) && (
                          <Link
                            href={programme.programme_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${programme.name}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/65 hover:border-white/40"
                          >
                            <ExternalLink size={14} />
                            View
                          </Link>
                        )}

                        <form action={changeBlogProgrammeStatus}>
                          <input type="hidden" name="id" value={programme.id} />

                          <input
                            type="hidden"
                            name="updated_at"
                            value={programme.updated_at}
                          />

                          <input
                            type="hidden"
                            name="status"
                            value={programme.is_active ? "INACTIVE" : "ACTIVE"}
                          />

                          <button
                            type="submit"
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                              programme.is_active
                                ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                : "border-[#D5FF66]/25 bg-[#D5FF66]/10 text-[#D5FF66] hover:bg-[#D5FF66]/20"
                            }`}
                          >
                            {programme.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <BookOpen size={42} className="text-white/25" />

            <h3 className="mt-5 text-lg font-semibold">No programmes found</h3>

            <p className="mt-2 text-sm text-white/45">
              Create your first programme to get started.
            </p>

            <Link
              href="/blog-admin/programmes/new"
              className={`${primaryButton} mt-6`}
            >
              <Plus size={17} />
              Create Programme
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
