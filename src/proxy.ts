import type { NextRequest } from "next/server";
import { updateBlogSession } from "@/lib/blog-supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateBlogSession(request);
}

export const config = {
  matcher: ["/blog-admin/:path*"],
};
