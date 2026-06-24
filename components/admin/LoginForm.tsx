"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("尚未設定 Supabase 環境變數，無法登入後台。");
      return;
    }

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[.04] p-6 shadow-glow"
      >
        <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">
          Admin
        </p>
        <h1 className="mt-2 text-2xl font-black">後台登入</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          使用 Supabase Auth 帳號登入後，可編輯草稿並發布公開頁面。
        </p>

        <div className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="admin-label">Email</span>
            <input
              className="admin-field"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="admin-label">密碼</span>
            <input
              className="admin-field"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="admin-button-primary mt-6 w-full"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          {loading ? "登入中..." : "登入"}
        </button>

        {message ? (
          <p className="mt-4 rounded-lg border border-rose-300/30 bg-rose-950/40 p-3 text-sm text-rose-100">
            {message}
          </p>
        ) : null}
      </form>
    </main>
  );
}
