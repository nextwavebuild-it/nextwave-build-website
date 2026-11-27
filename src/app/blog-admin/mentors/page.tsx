import Link from "next/link";
import { Users, UserCheck, UserRound, Plus, Pencil } from "lucide-react";

import { requireBlogAdmin } from "@/lib/blog-admin/guard";
import { changeBlogMentorStatus } from "@/lib/blog-admin/mentor-actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function MentorsPage({ searchParams }: Props) {
  const query = await searchParams;
  const { supabase } = await requireBlogAdmin();

  const [mentorResult, programmeResult] = await Promise.all([
    supabase
      .from("blog_mentors")
      .select(
        "id,name,slug,professional_title,biography,image_url,image_alt,programme_id,years_of_experience,sort_order,is_active,updated_at",
      )
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),

    supabase.from("blog_programmes").select("id,name,is_active"),
  ]);

  if (mentorResult.error || programmeResult.error) {
    throw new Error("Unable to load mentor profiles.");
  }

  const mentors = mentorResult.data ?? [];

  const programmes = new Map(
    (programmeResult.data ?? []).map((programme) => [programme.id, programme]),
  );

  const activeCount = mentors.filter((mentor) => mentor.is_active).length;

  return (
    <div className="space-y-8 text-white">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D5FF66]">
            SHARED CONTENT MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Mentor Management
          </h1>

          <p className="mt-3 text-sm leading-7 text-white/55">
            Manage public mentor profiles for country and city landing pages.
          </p>
        </div>

        <Link
          href="/blog-admin/mentors/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214] hover:bg-[#C5EF53]"
        >
          <Plus size={18} />
          Add Mentor
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

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Mentors",
            value: mentors.length,
            icon: Users,
          },
          {
            label: "Active Mentors",
            value: activeCount,
            icon: UserCheck,
          },
          {
            label: "Inactive Mentors",
            value: mentors.length - activeCount,
            icon: UserRound,
          },
        ].map((statistic) => {
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
        Add only genuine mentor profiles approved for public display. These
        profiles are separate from mentor accounts in the internal registration
        platform.
      </div>

      {mentors.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((mentor) => {
            const programme = mentor.programme_id
              ? programmes.get(mentor.programme_id)
              : null;

            return (
              <article
                key={mentor.id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#15191A]"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#202526]">
                  {mentor.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mentor.image_url}
                      alt={mentor.image_alt || mentor.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <UserRound size={64} className="text-white/25" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold">{mentor.name}</h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${
                        mentor.is_active
                          ? "border-[#D5FF66]/25 bg-[#D5FF66]/10 text-[#D5FF66]"
                          : "border-white/15 bg-white/5 text-white/50"
                      }`}
                    >
                      {mentor.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#D5FF66]">
                    {mentor.professional_title || "Title not configured"}
                  </p>

                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/55">
                    {mentor.biography || "Biography not configured"}
                  </p>

                  <div className="my-5 space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-xs text-white/65">
                    <p>Programme: {programme?.name || "General Mentor"}</p>

                    {programme && !programme.is_active && (
                      <p className="text-yellow-300">
                        Assigned programme is inactive.
                      </p>
                    )}

                    <p>
                      Experience:{" "}
                      {mentor.years_of_experience === null
                        ? "Not specified"
                        : `${mentor.years_of_experience} years`}
                    </p>

                    <p>Display order: {mentor.sort_order}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 pt-5">
                    <Link
                      href={`/blog-admin/mentors/${mentor.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-4 py-2.5 text-xs font-semibold !text-[#101214]"
                    >
                      <Pencil size={14} />
                      Edit Mentor
                    </Link>

                    <form action={changeBlogMentorStatus}>
                      <input type="hidden" name="id" value={mentor.id} />

                      <input
                        type="hidden"
                        name="updated_at"
                        value={mentor.updated_at}
                      />

                      <input
                        type="hidden"
                        name="status"
                        value={mentor.is_active ? "INACTIVE" : "ACTIVE"}
                      />

                      <button
                        type="submit"
                        className={`rounded-lg border px-4 py-2.5 text-xs font-semibold ${
                          mentor.is_active
                            ? "border-red-500/30 !bg-red-500/10 !text-red-300"
                            : "border-[#D5FF66]/25 !bg-[#D5FF66]/10 !text-[#D5FF66]"
                        }`}
                      >
                        {mentor.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="flex flex-col items-center rounded-xl border border-white/10 bg-[#15191A] px-6 py-20 text-center">
          <Users size={50} className="text-white/25" />

          <h2 className="mt-6 text-xl font-semibold">No mentors added yet</h2>

          <p className="mt-3 text-sm text-white/45">
            Create your first public mentor profile.
          </p>

          <Link
            href="/blog-admin/mentors/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#D5FF66] px-5 py-3 text-sm font-semibold !text-[#101214]"
          >
            <Plus size={17} />
            Add First Mentor
          </Link>
        </section>
      )}
    </div>
  );
}
