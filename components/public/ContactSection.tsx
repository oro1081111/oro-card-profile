import { ExternalLink } from "lucide-react";
import type { Profile, Theme } from "@/types/content";

type ContactSectionProps = {
  profile: Profile;
  theme: Theme;
};

export function ContactSection({ profile, theme }: ContactSectionProps) {
  const links = profile.links.filter((link) => link.url.trim());

  return (
    <footer className="pb-10">
      <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">
          Contact
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">保持聯絡</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          歡迎交流 AI Agent、產品管理、生成式 AI、桌遊設計與跨界合作。
        </p>
        <div className="mt-5 grid gap-3">
          {links.map((link) => (
            <a
              key={`${link.label}-${link.url}`}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-white/12 px-4 py-3 text-sm font-bold text-white"
            >
              {link.label}
              <ExternalLink
                className="h-4 w-4"
                aria-hidden="true"
                style={{ color: theme.accentColor }}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
