import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const url = process.env.BLOG_SUPABASE_URL;
const secret = process.env.BLOG_SUPABASE_SECRET_KEY;

if (!url || !secret) {
  throw new Error("Missing Supabase URL or secret key.");
}

const rl = createInterface({ input, output });

try {
  const password = await rl.question("Enter new Blog Admin password: ");

  if (password.length < 12) {
    throw new Error("Use at least 12 characters.");
  }

  const supabase = createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.admin.updateUserById(
    "fce75b8b-f098-49d8-927f-218804aab5cc",
    { password },
  );

  if (error) throw error;

  if (data.user?.email !== "umair@nextwavebuild.com") {
    throw new Error("Updated user email did not match expectations.");
  }

  console.log("Blog Admin password updated successfully.");
} finally {
  rl.close();
}
