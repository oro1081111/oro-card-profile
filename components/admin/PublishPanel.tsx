"use client";

import { ExternalLink, Save, Send } from "lucide-react";

type PublishPanelProps = {
  updatedAt: string | null;
  publishedAt: string | null;
  saving: boolean;
  publishing: boolean;
  message: string;
  onSave: () => Promise<boolean>;
  onPublish: () => Promise<void>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "尚無資料";
  }

  return new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function PublishPanel({
  updatedAt,
  publishedAt,
  saving,
  publishing,
  message,
  onSave,
  onPublish
}: PublishPanelProps) {
  async function confirmPublish() {
    const yes = confirm(
      "確定要發布目前草稿嗎？公開頁面會更新成目前草稿內容。"
    );

    if (yes) {
      await onPublish();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black">預覽與發布</h2>
        <p className="mt-1 text-sm text-slate-300">
          草稿儲存後可預覽；按下發布才會更新公開頁面。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs font-bold text-slate-400">草稿最後修改</p>
          <p className="mt-2 font-bold">{formatDate(updatedAt)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs font-bold text-slate-400">已發布時間</p>
          <p className="mt-2 font-bold">{formatDate(publishedAt)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="admin-button"
          onClick={onSave}
          disabled={saving}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? "儲存中..." : "儲存草稿"}
        </button>
        <a href="/admin/preview" target="_blank" rel="noreferrer" className="admin-button">
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          預覽草稿
        </a>
        <button
          type="button"
          className="admin-button-primary"
          onClick={confirmPublish}
          disabled={publishing}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {publishing ? "發布中..." : "發布到公開頁面"}
        </button>
      </div>

      {message ? (
        <p className="rounded-lg border border-cyan-300/30 bg-cyan-950/40 p-3 text-sm text-cyan-50">
          {message}
        </p>
      ) : null}
    </div>
  );
}
