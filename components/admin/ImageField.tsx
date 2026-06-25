"use client";

import { useMemo, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder?: "avatars" | "cards" | "misc";
};

export function ImageField({
  label,
  value,
  onChange,
  folder = "misc"
}: ImageFieldProps) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadImage(file: File) {
    setMessage("");

    if (!supabase) {
      setMessage("尚未設定 Supabase，請先使用圖片 URL。");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("請選擇圖片檔。");
      return;
    }

    setUploading(true);
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session?.access_token) {
      setUploading(false);
      setMessage("登入狀態已過期，請重新登入後再上傳。");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/admin/upload-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      },
      body: formData
    });

    const result = (await response.json()) as {
      publicUrl?: string;
      error?: string;
    };

    if (!response.ok || !result.publicUrl) {
      setUploading(false);
      setMessage(result.error || "上傳失敗，請稍後再試。");
      return;
    }

    onChange(result.publicUrl);
    setUploading(false);
    setMessage("圖片已上傳，記得儲存草稿。");
  }

  return (
    <div className="space-y-2">
      <label className="block space-y-2">
        <span className="admin-label">{label}</span>
        <input
          className="admin-field"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://..."
        />
      </label>

      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-3 sm:flex-row sm:items-center">
        <label className="admin-button cursor-pointer">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImageUp className="h-4 w-4" aria-hidden="true" />
          )}
          {uploading ? "上傳中..." : "從手機選擇圖片"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) {
                uploadImage(file);
              }
            }}
          />
        </label>
        <span className="text-xs leading-5 text-slate-400">
          也可直接貼圖片 URL。上傳需登入管理員。
        </span>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={`${label} 預覽`} className="max-h-48 w-full object-contain" />
        </div>
      ) : null}

      {message ? <p className="text-xs text-cyan-100">{message}</p> : null}
    </div>
  );
}
