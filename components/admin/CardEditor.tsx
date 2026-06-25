"use client";

import { Plus, Trash2 } from "lucide-react";
import { ImageField } from "@/components/admin/ImageField";
import type { CardButton, ProfileCard } from "@/types/content";

type CardEditorProps = {
  card: ProfileCard;
  onChange: (card: ProfileCard) => void;
};

export function CardEditor({ card, onChange }: CardEditorProps) {
  function updateField<K extends keyof ProfileCard>(key: K, value: ProfileCard[K]) {
    onChange({ ...card, [key]: value });
  }

  function updateButton(index: number, button: CardButton) {
    updateField(
      "buttons",
      card.buttons.map((item, itemIndex) =>
        itemIndex === index ? button : item
      )
    );
  }

  return (
    <div className="space-y-5 rounded-lg border border-white/10 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black">編輯卡牌</h3>
          <p className="text-xs text-slate-400">{card.id}</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={card.visible}
            onChange={(event) => updateField("visible", event.target.checked)}
          />
          顯示
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="admin-label">title</span>
          <input
            className="admin-field"
            value={card.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className="admin-label">subtitle</span>
          <input
            className="admin-field"
            value={card.subtitle}
            onChange={(event) => updateField("subtitle", event.target.value)}
          />
        </label>
      </div>

      <ImageField
        label="卡牌圖片 URL"
        value={card.imageUrl ?? ""}
        folder="cards"
        cropAspect={3 / 4}
        onChange={(value) => updateField("imageUrl", value)}
      />

      <label className="block space-y-2">
        <span className="admin-label">tags，使用逗號分隔</span>
        <input
          className="admin-field"
          value={card.tags.join(",")}
          onChange={(event) =>
            updateField(
              "tags",
              event.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            )
          }
        />
      </label>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["frontColor", "正面色"],
          ["backColor", "背面色"],
          ["accentColor", "強調色"],
          ["textColor", "文字色"]
        ].map(([key, label]) => (
          <label key={key} className="block space-y-2">
            <span className="admin-label">{label}</span>
            <input
              type="color"
              className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 p-1"
              value={card[key as keyof ProfileCard] as string}
              onChange={(event) =>
                updateField(key as keyof ProfileCard, event.target.value as never)
              }
            />
          </label>
        ))}
      </div>

      <label className="block space-y-2">
        <span className="admin-label">shortDescription</span>
        <textarea
          className="admin-field min-h-24"
          value={card.shortDescription}
          onChange={(event) =>
            updateField("shortDescription", event.target.value)
          }
        />
      </label>

      <label className="block space-y-2">
        <span className="admin-label">detail</span>
        <textarea
          className="admin-field min-h-36"
          value={card.detail}
          onChange={(event) => updateField("detail", event.target.value)}
        />
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-black">按鈕</h4>
          <button
            type="button"
            className="admin-button"
            disabled={card.buttons.length >= 3}
            onClick={() =>
              updateField("buttons", [
                ...card.buttons,
                { label: "新按鈕", type: "modal", target: "detail" }
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            新增按鈕
          </button>
        </div>

        {card.buttons.map((button, index) => (
          <div
            key={`${button.label}-${index}`}
            className="grid gap-3 rounded-lg border border-white/10 bg-slate-900/70 p-3 md:grid-cols-[1fr_130px_1.6fr_auto]"
          >
            <input
              className="admin-field"
              value={button.label}
              onChange={(event) =>
                updateButton(index, { ...button, label: event.target.value })
              }
              placeholder="label"
            />
            <select
              className="admin-field"
              value={button.type}
              onChange={(event) =>
                updateButton(index, {
                  ...button,
                  type: event.target.value as CardButton["type"]
                })
              }
            >
              <option value="modal">modal</option>
              <option value="link">link</option>
            </select>
            <input
              className="admin-field"
              value={button.target}
              onChange={(event) =>
                updateButton(index, { ...button, target: event.target.value })
              }
              placeholder="detail、mailto: 或 https://"
            />
            <button
              type="button"
              aria-label="刪除按鈕"
              className="admin-button px-3 text-rose-100"
              onClick={() =>
                updateField(
                  "buttons",
                  card.buttons.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
