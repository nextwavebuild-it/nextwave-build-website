import "server-only";
import { redirect } from "next/navigation";
import { createBlogServerClient } from "@/lib/blog-supabase/server";

export async function requireBlogAdmin() {
  const supabase = await createBlogServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/blog-admin/login");
  const { data: staff, error } = await supabase
    .from("blog_staff")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();
  if (error || !staff || staff.role !== "ADMIN" || !staff.is_active) {
    redirect("/blog-admin/login?error=Access%20denied");
  }
  return { supabase, user };
}
