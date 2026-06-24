import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultContent } from "@/lib/content/defaultContent";
import type { SiteContent } from "@/types/content";

export async function getDraftContent(supabase: SupabaseClient) {
  const draft = await supabase
    .from("site_content")
    .select("content, updated_at, published_at")
    .eq("id", "draft")
    .maybeSingle();

  if (draft.data?.content) {
    return {
      content: draft.data.content as SiteContent,
      updatedAt: draft.data.updated_at as string | null,
      publishedAt: draft.data.published_at as string | null
    };
  }

  const published = await supabase
    .from("site_content")
    .select("content, updated_at, published_at")
    .eq("id", "published")
    .maybeSingle();

  return {
    content: (published.data?.content as SiteContent | undefined) ?? defaultContent,
    updatedAt: (published.data?.updated_at as string | null) ?? null,
    publishedAt: (published.data?.published_at as string | null) ?? null
  };
}
