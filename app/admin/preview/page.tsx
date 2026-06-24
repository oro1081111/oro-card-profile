"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { getDraftContent } from "@/lib/content/getDraftContent";
import { MobileShell } from "@/components/public/MobileShell";
import { HeroSection } from "@/components/public/HeroSection";
import { CardDeck } from "@/components/public/CardDeck";
import { ContactSection } from "@/components/public/ContactSection";
import type { SiteContent } from "@/types/content";

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      window.setTimeout(() => reject(new Error("session-timeout")), timeoutMs)
    )
  ]);
}

export default function AdminPreviewPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [message, setMessage] = useState("載入草稿預覽中...");

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setMessage("尚未設定 Supabase 環境變數，無法讀取草稿預覽。");
        return;
      }

      try {
        const { data } = await withTimeout(supabase.auth.getSession());
        if (!data.session) {
          router.replace("/admin/login");
          return;
        }

        const draft = await getDraftContent(supabase);
        setContent(draft.content);
      } catch {
        setMessage("Supabase 登入狀態確認逾時，請稍後再試。");
        router.replace("/admin/login");
      }
    }

    load();
  }, [router, supabase]);

  if (!content) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-slate-100">
        <p>{message}</p>
      </main>
    );
  }

  return (
    <MobileShell content={content} previewLabel="草稿預覽">
      <HeroSection profile={content.profile} theme={content.theme} />
      <CardDeck cards={content.cards} theme={content.theme} />
      <ContactSection profile={content.profile} theme={content.theme} />
    </MobileShell>
  );
}
