"use client";

import { RefObject, useEffect, useState } from "react";

type UseRevealOnScrollOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

export function useRevealOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options?: UseRevealOnScrollOptions,
) {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;

        setIsInView(visible);

        if (visible) {
          setHasRevealed(true);

          if (options?.once !== false) {
            observer.disconnect();
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.2,
        rootMargin: options?.rootMargin ?? "0px 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options?.threshold, options?.rootMargin, options?.once]);

  return options?.once === false ? isInView : hasRevealed;
}