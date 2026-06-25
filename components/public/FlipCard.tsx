import { ExternalLink } from "lucide-react";
import type { ProfileCard, Theme } from "@/types/content";

type FlipCardProps = {
  card: ProfileCard;
  theme: Theme;
  flipped: boolean;
  onToggle: () => void;
};

export function FlipCard({
  card,
  theme,
  flipped,
  onToggle
}: FlipCardProps) {
  const activeButtons = card.buttons.filter(
    (button) => button.type === "link" && button.target.trim()
  );

  return (
    <article className="card-perspective mx-auto w-[82%] max-w-[300px]">
      <div
        className="flip-card-inner relative aspect-[63/88] w-full"
        data-flipped={flipped}
      >
        <button
          type="button"
          aria-label={`${card.title} 卡牌正面`}
          onClick={onToggle}
          className="card-face absolute inset-0 flex w-full flex-col overflow-hidden rounded-[24px] border p-4 text-left shadow-card outline-none focus:ring-2 focus:ring-cyan-300"
          style={{
            backgroundColor: card.frontColor,
            borderColor: `${card.accentColor}88`,
            color: card.textColor,
            borderRadius: theme.cardRadius,
            boxShadow: theme.cardShadow ? undefined : "none"
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-black text-slate-950"
              style={{ backgroundColor: card.accentColor }}
            >
              #{String(card.order).padStart(2, "0")}
            </span>
            <span className="text-xs font-bold text-white/70">點擊翻面</span>
          </div>

          <div className="mx-auto mt-3 aspect-[4/3] w-[92%] overflow-hidden rounded-2xl border border-white/12 bg-white/[.08] shadow-inner">
            {card.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.imageUrl}
                alt={`${card.title} 圖片`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center px-3 text-center text-sm font-bold text-white/65">
                {card.title}
              </div>
            )}
          </div>

          <div className="mt-auto">
            <h3 className="text-[21px] font-black leading-tight">{card.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/82">
              {card.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/16 bg-white/12 px-2.5 py-1 text-[11px] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label={`${card.title} 卡牌背面，點擊翻回正面`}
          className="card-face card-back absolute inset-0 flex w-full flex-col overflow-hidden rounded-[24px] border p-4 text-left shadow-card outline-none focus:ring-2 focus:ring-cyan-300"
          style={{
            backgroundColor: card.frontColor,
            borderColor: `${card.accentColor}88`,
            color: card.textColor,
            borderRadius: theme.cardRadius,
            boxShadow: theme.cardShadow ? undefined : "none"
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-black text-slate-950"
              style={{ backgroundColor: card.accentColor }}
            >
              Back
            </span>
            <span className="text-xs font-bold text-white/70">點擊翻回</span>
          </div>
          <h3 className="mt-5 text-[21px] font-black leading-tight">
            {card.title}
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-[14px] leading-6 text-white/86">
            {card.shortDescription}
          </p>

          <div className="mt-auto space-y-2.5 pt-5" onClick={(e) => e.stopPropagation()}>
            {activeButtons.length ? (
              activeButtons.slice(0, 3).map((button) => (
                <a
                  key={`${button.label}-${button.target}`}
                  href={button.target}
                  target={button.target.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/18 px-4 py-3 text-sm font-bold text-white transition active:scale-[.98]"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {button.label}
                </a>
              ))
            ) : (
              <p className="rounded-lg border border-white/14 bg-white/8 px-4 py-3 text-center text-sm font-bold text-white/72">
                點擊卡牌可翻回正面
              </p>
            )}
          </div>
        </button>
      </div>
    </article>
  );
}
