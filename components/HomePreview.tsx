"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GiftBox } from "./GiftBox";
import { TextOverlay } from "./TextOverlay";
import { fireConfetti, fireFallingConfetti } from "@/lib/confetti";

export function HomePreview() {
  const [boxState, setBoxState] = useState<"closed" | "opening" | "open">("closed");

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    setBoxState("opening");
    window.setTimeout(() => {
      fireConfetti({ x, y });
      fireFallingConfetti(4000);
    }, 420);
    window.setTimeout(() => {
      setBoxState("open");
      // Optional: auto reset after some time
      window.setTimeout(() => setBoxState("closed"), 5000);
    }, 780);
  };

  return (
    <div className="flex h-full w-full min-h-[260px] flex-col items-center justify-center">
      {boxState !== "open" ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <GiftBox state={boxState} onOpen={handleOpen} />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/60">
            Clique para abrir
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-[280px] overflow-hidden rounded-2xl border-2 border-black/20 bg-white shadow-2xl"
        >
          <div className="relative h-[280px] w-full bg-gradient-to-br from-amber-400 to-orange-500">
            {/* Placeholder image representation or just gradient for the home preview */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>
          <TextOverlay topText="feliz" bottomText="aniversário" />
        </motion.div>
      )}
    </div>
  );
}
