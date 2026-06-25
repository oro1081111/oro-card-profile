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

function extensionFromFile(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  return file.type.split("/").pop() || "jpg";
}

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
    const ext = extensionFromFile(file);
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("profile-assets")
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false
      });

    if (error) {
      setUploading(false);
      setMessage(`上傳失敗：${error.message}`);
      return;
    }

    const { data } = supabase.storage
      .from("profile-assets")
      .getPublicUrl(path);

    onChange(data.publicUrl);
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
          也可直接貼圖片 URL。上傳需登入管理員，並已建立 `profile-assets` bucket。
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
