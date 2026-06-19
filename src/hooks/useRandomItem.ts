"use client";

import { useEffect, useState } from "react";

export function useRandomItem<T>(items: readonly T[], fallback: T) {
  const [selectedItem, setSelectedItem] = useState<T>(fallback);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);

      setSelectedItem(items[randomIndex] ?? fallback);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fallback, items]);

  return selectedItem;
}