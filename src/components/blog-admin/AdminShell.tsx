"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  Globe2,
  LogOut,
  BookOpen,
} from "lucide-react";

import { blogLogout } from "@/lib/blog-admin/actions";

const navigation = [
  {
    label: "Dashboard",
    href: "/blog-admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "All Articles",
    href: "/blog-admin/posts",
    icon: FileText,
  },
  {
    label: "New Article",
    href: "/blog-admin/posts/new",
    icon: FilePlus2,
  },
  {
    label: "Publishing Pages",
    href: "/blog-admin/pages",
    icon: Globe2,
  },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/blog-admin/login" ||
    pathname === "/blog-admin/reset-password" ||
    pathname.startsWith("/blog-admin/auth/");

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#101214] text-white">{children}</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101214] text-white lg:flex">
      {/* ======================================
          SIDEBAR
      ====================================== */}
      <aside className="border-b border-white/10 bg-[#15191A] lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        {/* NEXTWAVE OFFICIAL LOGO */}
        <div className="flex min-h-[116px] items-center border-b border-white/10 px-5 py-6">
          <Link
            href="/blog-admin/dashboard"
            aria-label="NextWave Build Blog CMS Dashboard"
            className="flex w-full items-center"
          >
            <Image
              src="/logo.png"
              alt="NextWave Build"
              width={220}
              height={46}
              priority
              className="h-auto w-full max-w-[215px] object-contain"
            />
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
            Content Management
          </p>

          <nav
            aria-label="Blog administration"
            className="flex gap-2 overflow-x-auto lg:flex-col"
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href === "/blog-admin/posts" &&
                  pathname.startsWith("/blog-admin/posts/") &&
                  pathname !== "/blog-admin/posts/new") ||
                (item.href === "/blog-admin/pages" &&
                  pathname.startsWith("/blog-admin/pages/"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? "!bg-[#D5FF66] !text-[#101214] [&_svg]:!text-[#101214]"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="hidden border-t border-white/10 px-6 py-5 lg:block">
          <p className="text-xs text-white/40">NextWave Content Platform</p>

          <p className="mt-1 text-xs text-white/25">
            Global &amp; Regional Publishing
          </p>
        </div>
      </aside>

      {/* ======================================
          MAIN DASHBOARD AREA
      ====================================== */}
      <div className="min-w-0 flex-1">
        {/* DASHBOARD HEADER */}
        <header className="flex min-h-20 items-center justify-between gap-4 border-b border-white/10 bg-[#101415] px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <BookOpen className="text-[#D5FF66]" size={22} />

            <div>
              <h1 className="text-base font-semibold text-white">
                Content Management
              </h1>

              <p className="text-xs text-white/45">
                Global and country-specific blogs
              </p>
            </div>
          </div>

          {/* SIGN OUT */}
          <form action={blogLogout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg border border-[#D5FF66] !bg-[#D5FF66] px-5 py-2.5 text-sm font-semibold !text-[#101214] transition-colors hover:!bg-[#C5EF53] hover:!text-[#101214] [&_svg]:!text-[#101214]"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">Sign out</span>
            </button>
          </form>
        </header>

        {/* MAIN PAGE CONTENT */}
        <main className="min-w-0 px-5 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
