"use client";

type ImageFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ImageField({ label, value, onChange }: ImageFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="admin-label">{label}</span>
      <input
        className="admin-field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://..."
      />
      <span className="block text-xs leading-5 text-slate-400">
        第一版支援圖片 URL；Supabase Storage 可依 README 的 bucket 規劃接上。
      </span>
    </label>
  );
}
