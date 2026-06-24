import type { ProfileCard } from "@/types/content";

export function sortedVisibleCards(cards: ProfileCard[]) {
  return [...cards]
    .filter((card) => card.visible)
    .sort((a, b) => a.order - b.order);
}

export function normalizeCardOrders(cards: ProfileCard[]) {
  return cards.map((card, index) => ({
    ...card,
    order: index + 1
  }));
}
