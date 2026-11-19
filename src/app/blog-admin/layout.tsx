import type { Metadata } from "next";
import type { ReactNode } from "react";

import AdminShell from "@/components/blog-admin/AdminShell";

export const metadata: Metadata = {
  title: "Blog Admin | NextWave Build",
  description: "NextWave Build content management dashboard.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function BlogAdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
