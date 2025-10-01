"use client";

type Props = {
  amount: number | string;
  onPlus?: () => void;         // open Buy Chips modal
  className?: string;
  size?: "sm" | "md";
};

export default function ChipTab({ amount, onPlus, className="", size="sm" }: Props) {
  const h = size === "sm" ? "h-8" : "h-9";
  const px = size === "sm" ? "px-3" : "px-4";
  const gap = size === "sm" ? "gap-2" : "gap-2.5";
  const plusW = size === "sm" ? "w-6" : "w-7";
  const text = size === "sm" ? "text-sm" : "text-base";

  return (
    <div
      className={[
        // pill
        "inline-flex items-center rounded-full bg-white/8 border border-white/12",
        "shadow-[inset_0_-1px_0_rgba(255,255,255,.06)]",
        // sizing + shrink behavior
        "h-9 px-3 gap-2 whitespace-nowrap flex-shrink min-w-0",
        className,
      ].join(" ")}
    >
      <span className={`${text} font-semibold`}>💰 {amount}</span>

      {/* Plus button */}
      <button
        type="button"
        aria-label="Buy chips"
        onClick={onPlus}
        className={[
          "grid place-items-center rounded-full",
          plusW, "h-7",
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
