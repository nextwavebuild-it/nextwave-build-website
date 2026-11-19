import { createBrowserClient } from "@supabase/ssr";

export function createBlogBrowserClient() {
  const url = process.env.NEXT_PUBLIC_BLOG_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_BLOG_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Blog CMS Supabase environment variables.");
  }

  return createBrowserClient(url, key, {
    auth: {
      storageKey: "nextwave-blog-auth",
    },
  });
}
