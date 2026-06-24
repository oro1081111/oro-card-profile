import { Mail, Sparkles } from "lucide-react";
import type { Profile, Theme } from "@/types/content";

type HeroSectionProps = {
  profile: Profile;
  theme: Theme;
};

export function HeroSection({ profile, theme }: HeroSectionProps) {
  const email = profile.links.find((link) => link.type === "email" && link.url);

  return (
    <section className="pt-8">
      <div className="flex items-center gap-4">
        <div
          className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-slate-900 shadow-glow"
          style={{ borderColor: `${theme.accentColor}88` }}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={`${profile.displayNameZh} 頭像`}
              className="h-full w-full object-cover"
            />
          ) : (
            <Sparkles
              aria-hidden="true"
              className="h-10 w-10"
              style={{ color: theme.accentColor }}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold" style={{ color: theme.accentColor }}>
            Mobile Interactive Card
          </p>
          <h1 className="mt-1 text-[30px] font-black leading-tight text-white">
            {profile.displayNameZh}
          </h1>
          <p className="mt-1 text-sm text-slate-300">{profile.displayNameEn}</p>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <p className="text-lg font-bold leading-snug text-white">
          {profile.headline}
        </p>
        <p className="rounded-lg border border-white/10 bg-white/[.04] px-4 py-3 text-[15px] leading-relaxed text-slate-100">
          {profile.subheadline}
        </p>
        <p className="text-[15px] leading-7 text-slate-300">{profile.shortBio}</p>
      </div>

      {email?.url ? (
        <a
          href={email.url}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-slate-950 transition active:scale-[.98]"
          style={{ backgroundColor: theme.accentColor }}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          快速聯絡
        </a>
      ) : null}
    </section>
  );
}
