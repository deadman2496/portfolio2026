"use client";

import { RefObject, useCallback, useEffect, useRef } from "react";

type UseDelayedAutoScrollOptions = {
  delayMs?: number;
  speedPixelsPerMs?: number;
  pauseAtBottomMs?: number;
  returnSpeedPixelsPerMs?: number;
};

export function useDelayedAutoScroll(
  scrollRef: RefObject<HTMLElement | null>,
  options?: UseDelayedAutoScrollOptions,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const frameRef = useRef<number | null>(null);

  const delayMs = options?.delayMs ?? 3000;
  const speedPixelsPerMs = options?.speedPixelsPerMs ?? 0.035;
  const pauseAtBottomMs = options?.pauseAtBottomMs ?? 2500;
  const returnSpeedPixelsPerMs =
    options?.returnSpeedPixelsPerMs ?? speedPixelsPerMs * 1.2;

  const cancelAutoScroll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (bottomPauseTimeoutRef.current) {
      clearTimeout(bottomPauseTimeoutRef.current);
      bottomPauseTimeoutRef.current = null;
    }

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const startAutoScroll = useCallback(() => {
    cancelAutoScroll();

    timeoutRef.current = setTimeout(() => {
      const scrollElement = scrollRef.current;

      if (!scrollElement) return;

      const maxScrollTop =
        scrollElement.scrollHeight - scrollElement.clientHeight;

      if (maxScrollTop <= 0) return;

      let previousTimestamp: number | null = null;

      function scrollDown(timestamp: number) {
        const element = scrollRef.current;

        if (!element) return;

        if (previousTimestamp === null) {
          previousTimestamp = timestamp;
        }

        const delta = timestamp - previousTimestamp;
        previousTimestamp = timestamp;

        element.scrollTop += delta * speedPixelsPerMs;

        const reachedBottom =
          element.scrollTop >= element.scrollHeight - element.clientHeight - 2;

        if (!reachedBottom) {
          frameRef.current = requestAnimationFrame(scrollDown);
          return;
        }

        previousTimestamp = null;

        bottomPauseTimeoutRef.current = setTimeout(() => {
          frameRef.current = requestAnimationFrame(scrollUp);
        }, pauseAtBottomMs);
      }

      function scrollUp(timestamp: number) {
        const element = scrollRef.current;

        if (!element) return;

        if (previousTimestamp === null) {
          previousTimestamp = timestamp;
        }

        const delta = timestamp - previousTimestamp;
        previousTimestamp = timestamp;

        element.scrollTop -= delta * returnSpeedPixelsPerMs;

        const reachedTop = element.scrollTop <= 2;

        if (!reachedTop) {
          frameRef.current = requestAnimationFrame(scrollUp);
          return;
        }

        element.scrollTop = 0;
        frameRef.current = null;
      }

      frameRef.current = requestAnimationFrame(scrollDown);
    }, delayMs);
  }, [
    cancelAutoScroll,
    delayMs,
    pauseAtBottomMs,
    returnSpeedPixelsPerMs,
    scrollRef,
    speedPixelsPerMs,
  ]);

  useEffect(() => {
    return () => {
      cancelAutoScroll();
    };
  }, [cancelAutoScroll]);

  return {
    startAutoScroll,
    cancelAutoScroll,
  };
}