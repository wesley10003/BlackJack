// components/AISuggestion.tsx
"use client";

import { motion } from "framer-motion";

type Props = {
  action?: string | null;  
  reason?: string | null;  
};

export default function AISuggestion({ action, reason }: Props) {
  if (!action) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 text-center"
    >
      <div className="text-sm text-white/70">
        AI suggests: <span className="font-semibold text-white lowercase">{action}</span>
      </div>
      {reason && (
        <div className="text-xs text-white/60 mt-0.5">{reason}</div>
      )}
    </motion.div>
  );
}
