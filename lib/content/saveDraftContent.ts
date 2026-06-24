import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteContent } from "@/types/content";

export async function saveDraftContent(
  supabase: SupabaseClient,
  content: SiteContent
) {
  return supabase.from("site_content").upsert({
    id: "draft",
    content
  });
}
