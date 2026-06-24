import { defaultContent } from "@/lib/content/defaultContent";
import { readSiteContentRow } from "@/lib/supabase/server";
import type { SiteContent } from "@/types/content";

export async function getPublishedContent(): Promise<SiteContent> {
  const row = await readSiteContentRow("published");

  if (!row?.content) {
    return defaultContent;
  }

  return row.content as SiteContent;
}
