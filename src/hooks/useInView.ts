"use client";

import { RefObject, useEffect, useState } from "react";

export function useInView(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
        ...options,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}