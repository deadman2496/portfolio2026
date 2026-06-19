"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  description?: string;
  mediaClassName?: string;
};

const IDLE_AUTOPLAY_DELAY_MS = 2000;
const AUTOPLAY_STEP_MS = 2400;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  title,
  description,
  mediaClassName = "aspect-[4/5] sm:aspect-[16/10]",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  function updatePosition(clientX: number) {
    const container = containerRef.current;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const nextPosition = ((clientX - rect.left) / rect.width) * 100;

    setSliderPosition(clamp(nextPosition, 0, 100));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    setIsDragging(true);
    setIsAutoPlaying(false);
    updatePosition(event.clientX);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;

    updatePosition(event.clientX);
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  useEffect(() => {
    if (isDragging) return;

    const timer = window.setTimeout(() => {
      setIsAutoPlaying(true);
    }, IDLE_AUTOPLAY_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [isDragging, sliderPosition]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = window.setInterval(() => {
      setSliderPosition((current) => (current < 50 ? 96 : 4));
    }, AUTOPLAY_STEP_MS);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
      <div
        ref={containerRef}
        role="slider"
        aria-label={`${title} before and after comparison`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPosition)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={[
        "group relative cursor-ew-resize touch-none select-none overflow-hidden bg-slate-950",
        mediaClassName,
        ].join(" ")}
      >
        <Image
          src={beforeSrc}
          alt={beforeAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
        />

        <div
          className={[
            "absolute inset-y-0 left-0 overflow-hidden",
            isDragging ? "" : "transition-[width] duration-1000 ease-in-out",
          ].join(" ")}
          style={{
            width: `${sliderPosition}%`,
          }}
        >
          <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>

        <div
          className={[
            "absolute inset-y-0 w-px bg-white shadow-[0_0_24px_rgba(255,255,255,0.75)]",
            isDragging ? "" : "transition-[left] duration-1000 ease-in-out",
          ].join(" ")}
          style={{
            left: `${sliderPosition}%`,
          }}
        />

        <div
          className={[
            "absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/80 text-xs font-black text-white shadow-2xl backdrop-blur-xl",
            isDragging ? "" : "transition-[left] duration-1000 ease-in-out",
          ].join(" ")}
          style={{
            left: `${sliderPosition}%`,
          }}
        >
          ↔
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/75 backdrop-blur-xl">
          After
        </div>

        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/75 backdrop-blur-xl">
          Before
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-black tracking-tight">{title}</h3>

        {description && (
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
        )}

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-blue-200/70">
          Drag to compare • Auto slides when idle
        </p>
      </div>
    </article>
  );
}