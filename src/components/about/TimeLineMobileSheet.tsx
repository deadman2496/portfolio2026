"use client";

import { type TouchEvent, useEffect, useRef } from "react";
import type { ResumeExperience } from "@/data/resume";
import TimelineDetailsContent from "@/components/about/TimelineDetailsContent";
import { useDelayedAutoScroll } from "@/hooks/useDelayedAutoScroll";
import TimelineSheetHandle from "./TimelineSheetHandle";
import TimelineSheetTutorial from "./TimelineSheetTutorial";


const MODAL_AUTO_SCROLL_DELAY_MS = 1600;

type TimelineMobileSheetProps = {
  isOpen: boolean;
  activeItem: ResumeExperience;
  activeIndex: number;
  totalItems: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const SWIPE_THRESHOLD_PX = 60;

export default function TimelineMobileSheet({
  isOpen,
  activeItem,
  activeIndex,
  totalItems,
  onClose,
  onPrevious,
  onNext,
}: TimelineMobileSheetProps) {
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < totalItems - 1;

  const {
  startAutoScroll: startModalAutoScroll,
  cancelAutoScroll: cancelModalAutoScroll,
} = useDelayedAutoScroll(contentScrollRef, {
  delayMs: MODAL_AUTO_SCROLL_DELAY_MS,
  speedPixelsPerMs: 0.026,
});

useEffect(() => {
  if (!isOpen) return;

  const timer = window.setTimeout(() => {
    contentScrollRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });

    startModalAutoScroll();
  }, 100);

  return () => {
    window.clearTimeout(timer);
    cancelModalAutoScroll();
  };
}, [
  activeItem.id,
  cancelModalAutoScroll,
  isOpen,
  startModalAutoScroll,
]);


useEffect(() => {
  if (!isOpen) return;

  const originalBodyOverflow = document.body.style.overflow;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = originalBodyOverflow;
  };
}, [isOpen]);

useEffect(() => {
  if (!isOpen) return;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
    }

    if (event.key === "ArrowLeft" && canGoPrevious) {
      onPrevious();
    }

    if (event.key === "ArrowRight" && canGoNext) {
      onNext();
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [canGoNext, canGoPrevious, isOpen, onClose, onNext, onPrevious]);


  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const touch = event.changedTouches[0];

    if (!touch) return;
    if (touchStartXRef.current === null) return;
    if (touchStartYRef.current === null) return;

    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isStrongEnoughSwipe = Math.abs(deltaX) >= SWIPE_THRESHOLD_PX;

    if (!isHorizontalSwipe || !isStrongEnoughSwipe) return;

    if (deltaX < 0 && canGoNext) {
      onNext();
      return;
    }

    if (deltaX > 0 && canGoPrevious) {
      onPrevious();
    }
  }

  return (
    <div
      className={[
  "fixed inset-0 z-[120] bg-black/70 backdrop-blur-md transition-opacity duration-300 lg:hidden",
  isOpen ? "opacity-100" : "pointer-events-none opacity-0",
].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-label={`${activeItem.title} timeline details`}
    >
      <button
        type="button"
        aria-label="Close timeline details"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={[
          "absolute inset-x-0 bottom-0 flex h-[82dvh] flex-col overflow-hidden rounded-t-[1.5rem] border border-white/10 bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-out min-[390px]:h-[86dvh] sm:h-[88dvh] sm:rounded-t-[2rem]",
          isOpen ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <TimelineSheetHandle onClose={onClose} />

        <div className="border-b border-white/10 px-4 pb-3 pt-1 sm:px-5 sm:pb-4">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
            Timeline Details
          </p>

          <p className="mt-1 text-sm font-bold text-white/45">
            {activeIndex + 1} of {totalItems}
          </p>
        </div>

        <TimelineSheetTutorial />

        <div
          ref={contentScrollRef}
          onPointerDown={cancelModalAutoScroll}
          onWheel={cancelModalAutoScroll}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-6"
        >
          <TimelineDetailsContent activeItem={activeItem} compact />
        </div>

        <div className="grid grid-cols-2 items-center gap-2 border-t border-white/10 bg-slate-950/95 px-4 py-3 min-[390px]:grid-cols-[1fr_auto_1fr] sm:gap-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Previous
          </button>

          <p className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white/35 min-[390px]:block">
            Swipe
          </p>

          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next
          </button>

          <button
            type="button"
            onClick={onClose}
            className="col-span-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-2xl transition hover:scale-[1.01] min-[390px]:col-span-3 sm:py-4"
          >
            Close Timeline Details
          </button>
        </div>
      </div>
      </div>
  );
}