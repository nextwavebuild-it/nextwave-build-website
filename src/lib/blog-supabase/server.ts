import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createBlogServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_BLOG_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Blog CMS Supabase environment variables.");
  }

  return createServerClient(url, key, {
    auth: {
      storageKey: "nextwave-blog-auth",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies.
          // Session refresh will be handled by Next.js Proxy.
        }
      },
    },
  });
}
