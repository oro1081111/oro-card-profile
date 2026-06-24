"use client";

import { Eye, FileText, Palette, Send, UserRound } from "lucide-react";

export type AdminTab = "profile" | "cards" | "theme" | "publish";

type AdminLayoutProps = {
  email: string;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
};

const tabs: Array<{
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "profile", label: "基本資料", icon: UserRound },
  { id: "cards", label: "卡牌管理", icon: FileText },
  { id: "theme", label: "主題設定", icon: Palette },
  { id: "publish", label: "預覽發布", icon: Send }
];

export function AdminLayout({
  email,
  activeTab,
  onTabChange,
  onLogout,
  children
}: AdminLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-5 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.04] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">
              Content Studio
            </p>
            <h1 className="mt-2 text-2xl font-black">個人卡牌後台</h1>
            <p className="mt-1 text-sm text-slate-300">目前登入：{email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" target="_blank" className="admin-button" rel="noreferrer">
              <Eye className="h-4 w-4" aria-hidden="true" />
              公開頁
            </a>
            <a
              href="/admin/preview"
              target="_blank"
              className="admin-button"
              rel="noreferrer"
            >
              草稿預覽
            </a>
            <button type="button" onClick={onLogout} className="admin-button">
              登出
            </button>
          </div>
        </header>

        <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                  active
                    ? "border-cyan-300 bg-cyan-300 text-slate-950"
                    : "border-white/10 bg-white/[.04] text-slate-200"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-4">
          {children}
        </section>
      </div>
    </main>
  );
}
