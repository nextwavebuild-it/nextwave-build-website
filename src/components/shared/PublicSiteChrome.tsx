"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";

export default function PublicSiteChrome({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const isBlogAdmin =
    pathname === "/blog-admin" || pathname.startsWith("/blog-admin/");

  if (isBlogAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <WhatsAppWidget />
      <Footer />
    </>
  );
}
