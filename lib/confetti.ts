"use client";

import confetti from "canvas-confetti";

export function fireConfetti(origin = { x: 0.5, y: 0.6 }) {
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 42,
    origin,
    scalar: 1.05,
    zIndex: 100,
  });
}

export function fireFallingConfetti(durationMs = 4000) {
  const animationEnd = Date.now() + durationMs;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 90 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / durationMs);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}
