"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { AdminLayout, type AdminTab } from "@/components/admin/AdminLayout";
import { CardListEditor } from "@/components/admin/CardListEditor";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { PublishPanel } from "@/components/admin/PublishPanel";
import { ThemeEditor } from "@/components/admin/ThemeEditor";
import { defaultContent } from "@/lib/content/defaultContent";
import { getDraftContent } from "@/lib/content/getDraftContent";
import { publishDraftContent } from "@/lib/content/publishDraftContent";
import { saveDraftContent } from "@/lib/content/saveDraftContent";
import { createBrowserSupabase } from "@/lib/supabase/client";
import type { SiteContent } from "@/types/content";

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 2500) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      window.setTimeout(() => reject(new Error("session-timeout")), timeoutMs)
    )
  ]);
}

export function AdminApp() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [activeTab, setActiveTab] = useState<AdminTab>("profile");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [email, setEmail] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setMessage("尚未設定 Supabase 環境變數，無法使用後台。");
        setLoading(false);
        return;
      }

      try {
        const { data } = await withTimeout(supabase.auth.getSession());
        if (!data.session) {
          router.replace("/admin/login");
          window.setTimeout(() => {
            if (window.location.pathname === "/admin") {
              window.location.href = "/admin/login";
            }
          }, 500);
          return;
        }

        setEmail(data.session.user.email ?? "");
        const draft = await getDraftContent(supabase);
        setContent(draft.content);
        setUpdatedAt(draft.updatedAt);
        setPublishedAt(draft.publishedAt);
        setLoading(false);
      } catch {
        setMessage("Supabase 登入狀態確認逾時，請稍後再試。");
        setLoading(false);
        router.replace("/admin/login");
        window.setTimeout(() => {
          if (window.location.pathname === "/admin") {
            window.location.href = "/admin/login";
          }
        }, 500);
      }
    }

    load();
  }, [router, supabase]);

  async function handleSave() {
    if (!supabase) {
      setMessage("尚未設定 Supabase，無法儲存草稿。");
      return false;
    }

    setSaving(true);
    setMessage("");
    const { error } = await saveDraftContent(supabase, content);
    setSaving(false);

    if (error) {
      setMessage(`儲存失敗：${error.message}`);
      return false;
    }

    const now = new Date().toISOString();
    setUpdatedAt(now);
    setMessage("草稿已儲存。公開頁面仍維持已發布版本。");
    return true;
  }

  async function handlePublish() {
    if (!supabase) {
      setMessage("尚未設定 Supabase，無法發布。");
      return;
    }

    setPublishing(true);
    setMessage("");
    const saved = await handleSave();
    if (!saved) {
      setPublishing(false);
      return;
    }
    const { error } = await publishDraftContent(supabase);
    setPublishing(false);

    if (error) {
      setMessage(`發布失敗：${error.message}`);
      return;
    }

    const now = new Date().toISOString();
    setPublishedAt(now);
    setMessage("發布成功，公開頁面已更新。");
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <div className="inline-flex items-center gap-3 text-sm font-bold">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          載入後台中...
        </div>
      </main>
    );
  }

  return (
    <AdminLayout
      email={email || "未連線"}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-950/50 p-3">
        <p className="text-sm text-slate-300">
          所有修改都保存在目前瀏覽器狀態；請按「儲存草稿」寫入 Supabase。
        </p>
        <button
          type="button"
          className="admin-button-primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? "儲存中..." : "儲存草稿"}
        </button>
      </div>

      {activeTab === "profile" ? (
        <ProfileEditor
          profile={content.profile}
          onChange={(profile) => setContent({ ...content, profile })}
        />
      ) : null}

      {activeTab === "cards" ? (
        <CardListEditor
          cards={content.cards}
          onChange={(cards) => setContent({ ...content, cards })}
        />
      ) : null}

      {activeTab === "theme" ? (
        <ThemeEditor
          theme={content.theme}
          onChange={(theme) => setContent({ ...content, theme })}
        />
      ) : null}

      {activeTab === "publish" ? (
        <PublishPanel
          updatedAt={updatedAt}
          publishedAt={publishedAt}
          saving={saving}
          publishing={publishing}
          message={message}
          onSave={handleSave}
          onPublish={handlePublish}
        />
      ) : null}

      {message && activeTab !== "publish" ? (
        <p className="mt-5 rounded-lg border border-cyan-300/30 bg-cyan-950/40 p-3 text-sm text-cyan-50">
          {message}
        </p>
      ) : null}
    </AdminLayout>
  );
}
