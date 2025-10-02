"use client";


type Props = {
  open: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
};

const CHIP_OPTIONS = [100, 500, 1000, 5000];

export default function BuyChipsWindow({ open, onClose, onBuy }: Props) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Buy Chips</h2>
            <p className="text-sm text-white/70">
              Select the amount of chips you want to purchase.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 text-white/50 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Chip options */}
        <div className="grid grid-cols-2 gap-3">
          {CHIP_OPTIONS.map((amt) => (
            <button
              key={amt}
              onClick={() => {onBuy(amt); onClose()}}
              className="h-14 rounded-xl border text-sm font-medium transition"
            >
              {amt.toLocaleString()} Chips
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
