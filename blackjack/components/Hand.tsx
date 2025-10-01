"use client";

import PlayingCard from "@/components/PlayingCard";
import { Card } from "@/lib/blackjack"

export default function Hand({cards, slots = 2}: {cards: Card[], slots?: number}) {

  // Build a fixed-length array: real cards first, then nulls as placeholders
  const shown: (Card | null)[] = Array.from({ length: Math.max(slots, cards.length) })
    .map((_, i) => (i < cards.length ? cards[i] : null));

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
      {shown.map((c, i) =>
        c ? (
          <PlayingCard
            key={`${c.rank}${c.suit}-${i}`}
            card={c}
          />
        ) : (
          // Placeholder
          <div
            key={`ph-${i}`}
            className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36 rounded-xl border border-white/15 bg-white/5"
          />
        )
      )}
    </div>
  );
}
