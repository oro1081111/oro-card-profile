"use client";

import { useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import type { ProfileCard } from "@/types/content";

type CardDetailSheetProps = {
  card: ProfileCard | null;
  onClose: () => void;
};

export function CardDetailSheet({ card, onClose }: CardDetailSheetProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (card) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [card, onClose]);

  if (!card) {
    return null;
  }

  const links = card.buttons.filter(
    (button) => button.type === "link" && button.target.trim()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label="關閉詳細內容"
        className="absolute inset-0 bg-black/62"
        onClick={onClose}
      />
      <div className="relative max-h-[86vh] w-full max-w-[430px] overflow-auto rounded-t-2xl border border-white/12 bg-slate-950 p-5 text-slate-100 shadow-glow">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-cyan-200">詳細介紹</p>
            <h2 className="mt-1 text-2xl font-black">{card.title}</h2>
          </div>
          <button
            type="button"
            aria-label="關閉"
            onClick={onClose}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/12 text-slate-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.imageUrl}
            alt={`${card.title} 詳細圖片`}
            className="mb-5 h-48 w-full rounded-xl object-cover"
          />
        ) : null}

        <div className="mb-5 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md px-2.5 py-1 text-xs font-bold text-slate-950"
              style={{ backgroundColor: card.accentColor }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[15px] leading-7 text-slate-200">{card.detail}</p>

        {links.length ? (
          <div className="mt-6 space-y-3">
            {links.map((button) => (
              <a
                key={`${button.label}-${button.target}`}
                href={button.target}
                target={button.target.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-slate-950"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {button.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
