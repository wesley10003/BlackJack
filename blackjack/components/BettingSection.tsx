// components/BettingSection.tsx
"use client";

type Props = {
  bet: number;
  setBet: (n: number) => void;
  onPlace: () => void;
  disabled?: boolean;
  max?: number; // current chips
};

export default function BettingSection({ bet, setBet, onPlace, disabled, max }: Props) {
  const add = (n: number) => bet ? setBet(bet + n) : setBet(n);

  return (
    <div className="w-auto max-w-xs mx-auto mt-10 space-y-3 text-center">
      {/* Amount input */}
      <input
        type="number"
        value={bet ? bet : ""}
        onChange={(e)=>setBet(parseInt(e.target.value||"0"))}
        className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4
                   text-white outline-none ring-0 focus:border-white/30"
      />

      {/* Quick add chips */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => add(5)}
          className="h-10 min-w-[84px] rounded-xl bg-white/5 border border-white/15
                     text-white transition hover:bg-white/10"
        >
          +5
        </button>
        <button
          type="button"
          onClick={() => add(25)}
          className="h-10 min-w-[84px] rounded-xl bg-white/5 border border-white/15
                     text-white transition hover:bg-white/10"
        >
          +25
        </button>
        <button
          type="button"
          onClick={() => add(100)}
          className="h-10 min-w-[84px] rounded-xl bg-white/5 border border-white/15
                     text-white transition hover:bg-white/10"
        >
          +100
        </button>
      </div>

      {/* Place Bet */}
      <button
        type="button"
        onClick={onPlace}
        disabled={disabled || bet < 1 || (max !== undefined && bet > max)}
        className="h-12 w-full rounded-xl bg-white text-black font-medium
                   shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]
                   transition hover:opacity-90 disabled:opacity-60"
      >
        Place Bet
      </button>
    </div>
  );
}
