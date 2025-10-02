// components/ActionBar.tsx
"use client";

type Props = {
  onHit: () => void;
  onStand: () => void;
  onHelp?: () => void;          
  disabled?: boolean;           
  highlight?: string | null;
  aiDisabled?: boolean
  thinking?: boolean
};

export default function ActionBar({ onHit, onStand, onHelp, disabled, highlight, thinking }: Props) {
  const base =
    "h-11 w-36 rounded-2xl text-black font-medium " +
    "transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ";
  
  const aiDisabled = highlight !== null

  return (
    <div className="flex items-center justify-center mt-10 gap-2 sm:gap-3 md:gap-4">
      <button className={base + (highlight?.toLowerCase()==="hit" ? "bg-amber-300" : "bg-white")} onClick={onHit} disabled={disabled}>
        Hit
      </button>

      {thinking ? (
          <div
            aria-label="AI thinking"
            role="status"
            className="grid place-items-center h-8 w-8 rounded-full bg-white/10 border border-white/15"
          >
            <div className="h-4 w-4 rounded-full border-2 border-white/25 border-t-white/90 animate-spin" />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Ask AI"
            title="AI Recommendation"
            onClick={onHelp}
            disabled={aiDisabled || !onHelp || disabled}
            className="grid place-items-center h-8 w-8 rounded-full bg-white/10 text-white/80
                       border border-white/15 text-sm hover:bg-white/15 disabled:opacity-40"
          >
            ?
          </button>
      )}

      <button className={base + (highlight?.toLowerCase()==="stand" ? "bg-amber-300" : "bg-white")} onClick={onStand} disabled={disabled}>
        Stand
      </button>
    </div>
  );
}
