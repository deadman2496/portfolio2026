"use client";

import { useEffect, useState } from "react";

type UseRotatingIndexOptions = {
  itemCount: number;
  intervalMs?: number;
  paused?: boolean;
  randomStart?: boolean;
};

export function useRotatingIndex({
  itemCount,
  intervalMs = 3500,
  paused = false,
  randomStart = true,
}: UseRotatingIndexOptions) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!randomStart || itemCount <= 1) return;

    const timer = window.setTimeout(() => {
      setActiveIndex(Math.floor(Math.random() * itemCount));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [itemCount, randomStart]);

  useEffect(() => {
    if (paused || itemCount <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, itemCount, paused]);

  return {
    activeIndex,
    setActiveIndex,
  };
}