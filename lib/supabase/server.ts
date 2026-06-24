const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isServerSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function readSiteContentRow(id: "draft" | "published") {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const url = `${supabaseUrl}/rest/v1/site_content?id=eq.${id}&select=content,updated_at,published_at`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    },
    next: { revalidate: 30 }
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as Array<{
    content: unknown;
    updated_at?: string;
    published_at?: string | null;
  }>;

  return rows[0] ?? null;
}
