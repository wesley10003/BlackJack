"use client";

type Props = {
  amount: number | string;
  onPlus?: () => void;         // open Buy Chips modal
  className?: string;
};

export default function ChipTab({ amount, onPlus, className="" }: Props) {

  return (
    <div
      className={[
        "inline-flex items-center rounded-full bg-white/8 border border-white/12",
        "shadow-[inset_0_-1px_0_rgba(255,255,255,.06)]",
        "h-9 px-3 gap-2 whitespace-nowrap flex-shrink min-w-0",
        className,
      ].join(" ")}
    >
      <span className="text-sm font-semibold">💰 {amount}</span>

      {/* Plus button */}
      <button
        type="button"
        aria-label="Buy chips"
        onClick={onPlus}
        className={[
          "grid place-items-center rounded-full",
          "w-6", "h-7",
          "text-white/90 hover:text-white",
          "hover:bg-white/10 active:bg-white/15",
          "transition"
        ].join(" ")}
      >
        +
      </button>
    </div>
  );
}
