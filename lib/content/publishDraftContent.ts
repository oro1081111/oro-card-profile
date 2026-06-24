import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteContent } from "@/types/content";

export async function publishDraftContent(supabase: SupabaseClient) {
  const draft = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "draft")
    .maybeSingle();

  if (draft.error) {
    return { error: draft.error };
  }

  if (!draft.data?.content) {
    return { error: new Error("找不到草稿內容。") };
  }

  const publish = await supabase.from("site_content").upsert({
    id: "published",
    content: draft.data.content as SiteContent,
    published_at: new Date().toISOString()
  });

  return { error: publish.error };
}
