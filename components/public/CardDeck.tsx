"use client";

import { useState } from "react";
import { sortedVisibleCards } from "@/lib/content/utils";
import type { ProfileCard, Theme } from "@/types/content";
import { FlipCard } from "@/components/public/FlipCard";
import { CardDetailSheet } from "@/components/public/CardDetailSheet";

type CardDeckProps = {
  cards: ProfileCard[];
  theme: Theme;
};

export function CardDeck({ cards, theme }: CardDeckProps) {
  const visibleCards = sortedVisibleCards(cards);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [detailCard, setDetailCard] = useState<ProfileCard | null>(null);

  return (
    <section aria-label="個人卡牌" className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-200">
            Card Deck
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">我的角色卡</h2>
        </div>
        <p className="text-right text-xs text-slate-400">{visibleCards.length} 張</p>
      </div>

      <div className="space-y-6">
        {visibleCards.map((card) => (
          <FlipCard
            key={card.id}
            card={card}
            theme={theme}
            flipped={flippedId === card.id}
            onToggle={() =>
              setFlippedId((current) => (current === card.id ? null : card.id))
            }
            onOpenDetail={() => setDetailCard(card)}
          />
        ))}
      </div>

      <CardDetailSheet card={detailCard} onClose={() => setDetailCard(null)} />
    </section>
  );
}
