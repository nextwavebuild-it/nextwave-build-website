import type { Metadata } from "next";

import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import Flagships from "@/components/home/Flagships";
import Method from "@/components/home/Method";
import WhyNextWave from "@/components/home/WhyNextWave";
import Contact from "@/components/home/Contact";

const BASE_URL = "https://nextwavebuild.com";

const PAGE_TITLE =
  "NextWave Build | Online Courses in AI, Freelancing & E-Commerce";

const PAGE_DESCRIPTION =
  "Learn practical skills in AI, freelancing and e-commerce with mentor-led online courses. Build real projects and develop skills for the digital economy.";

export const metadata: Metadata = {
  title: PAGE_TITLE,

  description: PAGE_DESCRIPTION,

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: BASE_URL,
    siteName: "NextWave Build",
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Ticker />
      <Flagships />
      <Method />
      <WhyNextWave />
      <Contact />
    </main>
  );
}
