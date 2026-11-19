import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import PublicSiteChrome from "@/components/shared/PublicSiteChrome";

import "./globals.css";

export const metadata: Metadata = {
  title: "NextWave Build - Don't just learn it. Build it.",
  description:
    "Practical skills, real projects and mentor support. Explore E-commerce, Freelancing, and Technology & AI with NextWave Build.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#101214",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PublicSiteChrome>{children}</PublicSiteChrome>

        <GoogleAnalytics gaId="G-2DQPE4XF70" />
      </body>
    </html>
  );
}
