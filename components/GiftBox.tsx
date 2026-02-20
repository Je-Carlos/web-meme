"use client";

import { motion } from "framer-motion";

type GiftBoxState = "closed" | "opening" | "open";

type GiftBoxProps = {
  state: GiftBoxState;
  onOpen: () => void;
};

export function GiftBox({ state, onOpen }: GiftBoxProps) {
  if (state === "open") {
    return null;
  }

  const isClosed = state === "closed";
  const isOpening = state === "opening";

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={!isClosed}
      aria-label="Abrir caixa de presente"
      className="focusable relative cursor-pointer rounded-2xl disabled:cursor-default"
    >
      <motion.div
        animate={
          isClosed
            ? { rotate: [0, -1.8, 1.8, -1.1, 1.1, 0] }
            : { rotate: [0, -4, 4, 0] }
        }
        transition={{
          duration: isClosed ? 1.2 : 0.45,
          repeat: isClosed ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: 1.8,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <motion.div
          initial={false}
          animate={isOpening ? { y: -84, rotate: -12, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute left-1/2 top-0 z-20 h-16 w-64 -translate-x-1/2 rounded-xl border-2 border-black/20 bg-red-400 shadow-md"
        >
          <span className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-yellow-300/90" />
        </motion.div>
        <div className="relative z-10 mt-12 h-40 w-72 rounded-2xl border-2 border-black/20 bg-red-500 shadow-2xl">
          <span className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 bg-yellow-300/90" />
          <span className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 bg-yellow-300/90" />
        </div>
      </motion.div>
    </button>
  );
}
