"use client";

import { useState } from "react";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { normalizeCardOrders } from "@/lib/content/utils";
import { CardEditor } from "@/components/admin/CardEditor";
import type { ProfileCard } from "@/types/content";

type CardListEditorProps = {
  cards: ProfileCard[];
  onChange: (cards: ProfileCard[]) => void;
};

export function CardListEditor({ cards, onChange }: CardListEditorProps) {
  const orderedCards = [...cards].sort((a, b) => a.order - b.order);
  const [editingId, setEditingId] = useState(orderedCards[0]?.id ?? "");
  const editingCard =
    orderedCards.find((card) => card.id === editingId) ?? orderedCards[0];

  function updateCards(nextCards: ProfileCard[]) {
    onChange(normalizeCardOrders(nextCards));
  }

  function updateCard(nextCard: ProfileCard) {
    updateCards(
      orderedCards.map((card) => (card.id === nextCard.id ? nextCard : card))
    );
  }

  function moveCard(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= orderedCards.length) {
      return;
    }
    const next = [...orderedCards];
    [next[index], next[target]] = [next[target], next[index]];
    updateCards(next);
  }

  function addCard() {
    const id = `card-${Date.now()}`;
    const nextCard: ProfileCard = {
      id,
      order: orderedCards.length + 1,
      visible: true,
      title: "新卡牌",
      subtitle: "請輸入副標題",
      imageUrl: "",
      tags: ["Tag"],
      frontColor: "#111827",
      backColor: "#111827",
      accentColor: "#22D3EE",
      textColor: "#FFFFFF",
      shortDescription: "請輸入簡短介紹。",
      detail: "請輸入詳細介紹。",
      buttons: [
        {
          label: "前往連結",
          type: "link",
          target: ""
        }
      ]
    };
    updateCards([...orderedCards, nextCard]);
    setEditingId(id);
  }

  function duplicateCard(card: ProfileCard) {
    const id = `${card.id}-copy-${Date.now()}`;
    updateCards([
      ...orderedCards,
      {
        ...card,
        id,
        order: orderedCards.length + 1,
        title: `${card.title} 複製`
      }
    ]);
    setEditingId(id);
  }

  function deleteCard(card: ProfileCard) {
    if (!confirm(`確定要刪除「${card.title}」嗎？`)) {
      return;
    }

    const next = orderedCards.filter((item) => item.id !== card.id);
    updateCards(next);
    setEditingId(next[0]?.id ?? "");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">卡牌管理</h2>
          <p className="mt-1 text-sm text-slate-300">
            可新增、複製、刪除、排序與編輯每張卡牌。
          </p>
        </div>
        <button type="button" className="admin-button-primary" onClick={addCard}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          新增卡牌
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-slate-900 text-left text-xs text-slate-300">
            <tr>
              <th className="px-3 py-3">排序</th>
              <th className="px-3 py-3">名稱</th>
              <th className="px-3 py-3">顯示</th>
              <th className="px-3 py-3">主色</th>
              <th className="px-3 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {orderedCards.map((card, index) => (
              <tr key={card.id} className="border-t border-white/10">
                <td className="px-3 py-3">{card.order}</td>
                <td className="px-3 py-3 font-bold">{card.title}</td>
                <td className="px-3 py-3">{card.visible ? "顯示" : "隱藏"}</td>
                <td className="px-3 py-3">
                  <span
                    className="block h-7 w-12 rounded-md border border-white/20"
                    style={{ backgroundColor: card.frontColor }}
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="admin-button px-3"
                      onClick={() => setEditingId(card.id)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      編輯
                    </button>
                    <button
                      type="button"
                      className="admin-button px-3"
                      onClick={() => duplicateCard(card)}
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      複製
                    </button>
                    <button
                      type="button"
                      className="admin-button px-3"
                      onClick={() => moveCard(index, -1)}
                    >
                      上移
                    </button>
                    <button
                      type="button"
                      className="admin-button px-3"
                      onClick={() => moveCard(index, 1)}
                    >
                      下移
                    </button>
                    <button
                      type="button"
                      className="admin-button px-3 text-rose-100"
                      onClick={() => deleteCard(card)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingCard ? (
        <CardEditor card={editingCard} onChange={updateCard} />
      ) : (
        <p className="rounded-lg border border-white/10 p-4 text-sm text-slate-300">
          目前沒有卡牌，請先新增一張。
        </p>
      )}
    </div>
  );
}
