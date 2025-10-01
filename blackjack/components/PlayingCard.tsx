"use client";

import { motion } from "framer-motion";
import { Card } from "@/lib/blackjack"
 
type Props = {
  card?: Card;
  hidden?: boolean;     // dealer’s hole card
  delay?: number;       // seconds
};

export default function PlayingCard({ card, hidden = false, delay = 0 }: Props) {
  const isRed = card!.suit === "♥" || card!.suit === "♦";

    return (
    <motion.div
      initial={{ y: -18, opacity: 0, rotate: -4 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 28, delay }}
      className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-36"
      style={{ perspective: 700 }}
    >
      <motion.div
        animate={{ rotateY: hidden ? 180 : 0 }}
        transition={{ duration: 0.35 }}
        className="relative w-full h-full rounded-xl"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT (face-up) */}
        <div
          className={[
            "absolute inset-0 rounded-xl bg-white shadow-md border border-black/10",
            "flex flex-col items-center justify-center",
          ].join(" ")}
          style={{ backfaceVisibility: "hidden" }}>
          <div className={`text-xl font-bold leading-none ${isRed ? "text-red-600" : "text-black"}`}>
            {card?.rank ?? ""}
          </div>
          <div className={`text-2xl ${isRed ? "text-red-600" : "text-black"}`}>
            {card?.suit ?? ""}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
