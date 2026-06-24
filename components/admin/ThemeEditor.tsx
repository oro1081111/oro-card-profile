"use client";

import type { Theme } from "@/types/content";

type ThemeEditorProps = {
  theme: Theme;
  onChange: (theme: Theme) => void;
};

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  function updateField<K extends keyof Theme>(key: K, value: Theme[K]) {
    onChange({ ...theme, [key]: value });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black">主題設定</h2>
        <p className="mt-1 text-sm text-slate-300">
          先用基本色彩與字體風格控制整體視覺，後續可擴充更多樣式。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["backgroundColor", "背景色"],
          ["textColor", "文字色"],
          ["primaryColor", "主色"],
          ["accentColor", "強調色"]
        ].map(([key, label]) => (
          <label key={key} className="block space-y-2">
            <span className="admin-label">{label}</span>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-11 w-14 rounded-lg border border-slate-700 bg-slate-900 p-1"
                value={theme[key as keyof Theme] as string}
                onChange={(event) =>
                  updateField(key as keyof Theme, event.target.value as never)
                }
              />
              <input
                className="admin-field"
                value={theme[key as keyof Theme] as string}
                onChange={(event) =>
                  updateField(key as keyof Theme, event.target.value as never)
                }
              />
            </div>
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="admin-label">卡牌圓角</span>
          <input
            className="admin-field"
            value={theme.cardRadius}
            onChange={(event) => updateField("cardRadius", event.target.value)}
            placeholder="24px"
          />
        </label>
        <label className="block space-y-2">
          <span className="admin-label">字體風格</span>
          <select
            className="admin-field"
            value={theme.fontStyle}
            onChange={(event) =>
              updateField("fontStyle", event.target.value as Theme["fontStyle"])
            }
          >
            <option value="modern">modern</option>
            <option value="classic">classic</option>
            <option value="playful">playful</option>
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-950/50 p-3">
          <input
            type="checkbox"
            checked={theme.cardShadow}
            onChange={(event) => updateField("cardShadow", event.target.checked)}
          />
          <span className="text-sm font-bold">啟用卡牌陰影</span>
        </label>
      </div>
    </div>
  );
}
