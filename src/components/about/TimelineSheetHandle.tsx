"use client";

import { type KeyboardEvent, type PointerEvent, useRef } from "react";

type TimelineSheetHandleProps = {
  onClose: () => void;
};

const DRAG_CLOSE_THRESHOLD_PX = 72;
const DOUBLE_TAP_WINDOW_MS = 320;

export default function TimelineSheetHandle({
  onClose,
}: TimelineSheetHandleProps) {
  const startYRef = useRef<number | null>(null);
  const lastTapAtRef = useRef(0);
  const hasMovedRef = useRef(false);
  const hasClosedRef = useRef(false);

  function closeOnce() {
    if (hasClosedRef.current) return;

    hasClosedRef.current = true;
    onClose();
  }

  function resetGesture() {
    startYRef.current = null;
    hasMovedRef.current = false;
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    startYRef.current = event.clientY;
    hasMovedRef.current = false;
    hasClosedRef.current = false;

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (startYRef.current === null) return;

    const deltaY = event.clientY - startYRef.current;

    if (Math.abs(deltaY) > 8) {
      hasMovedRef.current = true;
    }

    if (deltaY >= DRAG_CLOSE_THRESHOLD_PX) {
      closeOnce();
      resetGesture();
    }
  }

  function handlePointerUp() {
    const now = Date.now();

    if (!hasMovedRef.current && now - lastTapAtRef.current <= DOUBLE_TAP_WINDOW_MS) {
      closeOnce();
    }

    lastTapAtRef.current = now;
    resetGesture();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    closeOnce();
  }

  return (
    <button
      type="button"
      aria-label="Close timeline details. Drag down or double tap."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={resetGesture}
      onKeyDown={handleKeyDown}
      className="mx-auto mt-3 flex h-8 w-24 touch-none items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300/70"
    >
      <span className="h-1.5 w-14 rounded-full bg-white/25 transition group-hover:bg-white/40" />
    </button>
  );
}