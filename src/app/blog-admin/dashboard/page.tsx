import Link from "next/link";
import { requireBlogAdmin } from "@/lib/blog-admin/guard";

export default async function BlogDashboard({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { supabase, user } = await requireBlogAdmin();

  const [all, published, drafts, destinations, recent] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),

    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "PUBLISHED"),

    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "DRAFT"),

    supabase.from("blog_pages").select("id", { count: "exact", head: true }),

    supabase
      .from("blog_posts")
      .select("id,title,slug,status,created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const query = await searchParams;

  const stats = [
    { label: "All Articles", count: all.count },
    { label: "Published", count: published.count },
    { label: "Drafts", count: drafts.count },
    { label: "Publishing Pages", count: destinations.count },
  ];

  return (
    <main className="space-y-8">
      {/* Dashboard heading */}
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-[#D5FF66]">
            Signed in as {user.email}
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Content Dashboard
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Manage your global and country-specific educational content.
          </p>
        </div>

        <Link
          href="/blog-admin/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D5FF66] px-6 py-3 text-sm font-semibold !text-[#101214] transition-colors hover:bg-[#C5EF53] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FF66]"
        >
          + Create Article
        </Link>
      </div>

      {/* Success notification */}
      {query.success && (
        <div
          role="status"
          className="rounded-xl border border-[#D5FF66]/30 bg-[#D5FF66]/10 px-5 py-4 text-sm text-[#D5FF66]"
        >
          {query.success}
        </div>
      )}

      {/* Dashboard statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-[#191D1F] p-6 transition-colors hover:border-[#D5FF66]/30"
          >
            <p className="text-sm font-medium text-white/60">{stat.label}</p>

            <p className="mt-4 text-4xl font-bold tracking-tight text-white">
              {stat.count ?? "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Recent articles */}
      <section className="rounded-xl border border-white/10 bg-[#15191A] p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Recent Articles
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Your latest blog content and publishing activity.
            </p>
          </div>

          <Link
            href="/blog-admin/pages"
            className="text-sm font-semibold text-[#D5FF66] transition-colors hover:text-[#C5EF53]"
          >
            Manage publishing pages
          </Link>
        </div>

        {recent.error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
          >
            Could not load articles: {recent.error.message}
          </p>
        ) : !recent.data?.length ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-base font-medium text-white/80">
              No articles yet
            </p>

            <p className="mt-2 text-sm text-white/45">
              Create your first educational article to get started.
            </p>

            <Link
              href="/blog-admin/posts/new"
              className="mt-5 inline-flex items-center justify-center rounded-lg border border-[#D5FF66]/40 px-5 py-2.5 text-sm font-semibold text-[#D5FF66] transition-colors hover:bg-[#D5FF66]/10"
            >
              Create First Article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {recent.data.map((post) => (
              <div
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-white">{post.title}</p>

                  <p className="mt-1 text-xs text-white/40">
                    /blog/{post.slug}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    post.status === "PUBLISHED"
                      ? "border-[#D5FF66]/30 bg-[#D5FF66]/10 text-[#D5FF66]"
                      : "border-white/15 bg-white/5 text-white/60"
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
