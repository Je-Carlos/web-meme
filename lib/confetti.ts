"use client";

import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 42,
    origin: { y: 0.6 },
    scalar: 1.05,
  });
}
