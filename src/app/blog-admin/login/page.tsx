import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { blogLogin } from "@/lib/blog-admin/actions";
import { createBlogServerClient } from "@/lib/blog-supabase/server";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function BlogLogin({ searchParams }: LoginPageProps) {
  const query = await searchParams;

  // Preserve existing Supabase authentication check.
  const supabase = await createBlogServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: staff } = await supabase
      .from("blog_staff")
      .select("role,is_active")
      .eq("user_id", user.id)
      .maybeSingle();

    // Authorized admins go directly to their dashboard.
    if (staff?.role === "ADMIN" && staff.is_active) {
      redirect("/blog-admin/dashboard");
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#101214] px-5 py-12 text-white sm:py-16">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Subtle brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#D5FF66]/[0.04] blur-3xl"
      />

      <div className="relative z-10 w-full max-w-[500px]">
        {/* Brand logo */}
        <div className="mb-9 flex flex-col items-center">
          <Link
            href="/"
            aria-label="NextWave Build homepage"
            className="inline-flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="NextWave Build"
              width={310}
              height={70}
              priority
              className="h-auto w-[240px] object-contain sm:w-[290px]"
            />
          </Link>
        </div>

        {/* Login card */}
        <section className="rounded-2xl border border-white/10 bg-[#181C1E] p-6 shadow-2xl shadow-black/30 sm:p-9">
          {/* Login heading */}
          <div className="mb-8">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Blog Admin Login
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/55">
              Sign in to manage articles, publishing destinations and SEO
              content.
            </p>
          </div>

          {/* Authentication error */}
          {query.error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200"
            >
              {query.error}
            </div>
          )}

          {/* Keep the existing login server action */}
          <form action={blogLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="blog-admin-email"
                className="mb-2 block text-sm font-semibold text-white/85"
              >
                Email Address
              </label>

              <input
                id="blog-admin-email"
                name="email"
                type="email"
                autoComplete="username"
                autoCapitalize="none"
                required
                maxLength={254}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-white/15 bg-[#202526] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-2 focus:ring-[#D5FF66]/15"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="blog-admin-password"
                className="mb-2 block text-sm font-semibold text-white/85"
              >
                Password
              </label>

              <input
                id="blog-admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-white/15 bg-[#202526] px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#D5FF66] focus:ring-2 focus:ring-[#D5FF66]/15"
              />
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              className="group flex min-h-13 w-full items-center justify-center gap-3 rounded-xl border border-[#D5FF66] !bg-[#D5FF66] px-6 py-4 text-sm font-bold uppercase tracking-wide !text-[#101214] transition-colors hover:!bg-[#C5EF53] hover:!text-[#101214] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FF66]"
            >
              Sign In
              <ArrowRight
                size={19}
                className="text-[#101214] transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Security information */}
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#D5FF66]/25 bg-[#D5FF66]/[0.06] px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D5FF66]/15">
              <ShieldCheck size={22} className="text-[#D5FF66]" />
            </div>

            <p className="text-sm font-medium leading-6 text-white/85">
              Authorized{" "}
              <span className="font-semibold text-[#D5FF66]">
                NextWave Build
              </span>{" "}
              content administrators only.
            </p>
          </div>
        </section>

        {/* Page footer */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 px-1">
          <p className="text-xs text-white/35">
            © {new Date().getUTCFullYear()} NextWave Build
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/55 transition-colors hover:text-[#D5FF66]"
          >
            Back to Website
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
