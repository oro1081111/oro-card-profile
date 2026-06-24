"use client";

import { Plus, Trash2 } from "lucide-react";
import { ImageField } from "@/components/admin/ImageField";
import type { Profile, ProfileLink } from "@/types/content";

type ProfileEditorProps = {
  profile: Profile;
  onChange: (profile: Profile) => void;
};

export function ProfileEditor({ profile, onChange }: ProfileEditorProps) {
  function updateField<K extends keyof Profile>(key: K, value: Profile[K]) {
    onChange({ ...profile, [key]: value });
  }

  function updateLink(index: number, link: ProfileLink) {
    onChange({
      ...profile,
      links: profile.links.map((item, itemIndex) =>
        itemIndex === index ? link : item
      )
    });
  }

  function moveLink(index: number, direction: -1 | 1) {
    const next = [...profile.links];
    const target = index + direction;
    if (target < 0 || target >= next.length) {
      return;
    }
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...profile, links: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black">基本資料</h2>
        <p className="mt-1 text-sm text-slate-300">
          這裡的修改會先存在草稿，發布後才會更新公開頁。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="admin-label">中文姓名</span>
          <input
            className="admin-field"
            value={profile.displayNameZh}
            onChange={(event) => updateField("displayNameZh", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="admin-label">英文名稱</span>
          <input
            className="admin-field"
            value={profile.displayNameEn}
            onChange={(event) => updateField("displayNameEn", event.target.value)}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="admin-label">主標語</span>
        <input
          className="admin-field"
          value={profile.headline}
          onChange={(event) => updateField("headline", event.target.value)}
        />
      </label>

      <label className="block space-y-2">
        <span className="admin-label">副標語</span>
        <input
          className="admin-field"
          value={profile.subheadline}
          onChange={(event) => updateField("subheadline", event.target.value)}
        />
      </label>

      <label className="block space-y-2">
        <span className="admin-label">簡短介紹</span>
        <textarea
          className="admin-field min-h-28"
          value={profile.shortBio}
          onChange={(event) => updateField("shortBio", event.target.value)}
        />
      </label>

      <ImageField
        label="頭像圖片 URL"
        value={profile.avatarUrl ?? ""}
        onChange={(value) => updateField("avatarUrl", value)}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-black">聯絡連結</h3>
          <button
            type="button"
            className="admin-button"
            onClick={() =>
              updateField("links", [
                ...profile.links,
                { label: "自訂連結", type: "link", url: "" }
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            新增
          </button>
        </div>

        <div className="space-y-3">
          {profile.links.map((link, index) => (
            <div
              key={`${link.label}-${index}`}
              className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/50 p-3 md:grid-cols-[1fr_130px_1.5fr_auto]"
            >
              <input
                className="admin-field"
                value={link.label}
                onChange={(event) =>
                  updateLink(index, { ...link, label: event.target.value })
                }
                placeholder="Label"
              />
              <select
                className="admin-field"
                value={link.type}
                onChange={(event) =>
                  updateLink(index, {
                    ...link,
                    type: event.target.value as ProfileLink["type"]
                  })
                }
              >
                <option value="email">email</option>
                <option value="link">link</option>
                <option value="social">social</option>
              </select>
              <input
                className="admin-field"
                value={link.url}
                onChange={(event) =>
                  updateLink(index, { ...link, url: event.target.value })
                }
                placeholder="mailto: 或 https://"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  className="admin-button px-3"
                  onClick={() => moveLink(index, -1)}
                >
                  上移
                </button>
                <button
                  type="button"
                  className="admin-button px-3"
                  onClick={() => moveLink(index, 1)}
                >
                  下移
                </button>
                <button
                  type="button"
                  aria-label="刪除連結"
                  className="admin-button px-3 text-rose-100"
                  onClick={() =>
                    updateField(
                      "links",
                      profile.links.filter((_, itemIndex) => itemIndex !== index)
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
