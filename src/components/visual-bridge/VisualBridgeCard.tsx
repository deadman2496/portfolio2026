"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRotatingIndex } from "@/hooks/useRotatingIndex";

export type VisualBridgeMedia =
  | {
      type: "image";
      src: string;
      alt: string;
      label: string;
      objectPosition?: string;
    }
  | {
      type: "video";
      src: string;
      alt: string;
      label: string;
      poster?: string;
      objectPosition?: string;
    };

type VisualBridgeMediaLayerProps = {
  item: VisualBridgeMedia;
  isActive: boolean;
};

function VisualBridgeMediaLayer({
  item,
  isActive,
}: VisualBridgeMediaLayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (item.type !== "video") return;

    const video = videoRef.current;

    if (!video) return;

    if (isActive) {
      if (video.readyState >= 1) {
        video.currentTime = 0;
      }

      void video.play().catch(() => {
        // The browser may block playback until the page is interactive.
      });

      return;
    }

    video.pause();
  }, [isActive, item.src, item.type]);

  return (
    <div
      className={[
        "absolute inset-0 transition-opacity duration-1000",
        isActive ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      {item.type === "image" ? (
        <Image
          src={item.src}
          alt={isActive ? item.alt : ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          style={{
            objectPosition: item.objectPosition ?? "center",
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          aria-label={item.alt}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          style={{
            objectPosition: item.objectPosition ?? "center",
          }}
        />
      )}
    </div>
  );
}

type VisualBridgeCardProps = {
  title: string;
  media: VisualBridgeMedia[];
};

export default function VisualBridgeCard({
  title,
  media,
}: VisualBridgeCardProps) {
  const [isPaused, setIsPaused] = useState(false);

  const { activeIndex, setActiveIndex } = useRotatingIndex({
    itemCount: media.length,
    intervalMs: 5000,
    paused: isPaused,
    randomStart: true,
  });

  const activeMedia = media[activeIndex] ?? media[0];

  if (!activeMedia) {
    return null;
  }

  return (
    <article
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        {media.map((item, index) => (
          <VisualBridgeMediaLayer
            key={`${item.type}-${item.src}`}
            item={item}
            isActive={index === activeIndex}
          />
        ))}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
          {activeMedia.label}
        </div>

        {media.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {media.map((item, index) => (
              <button
                key={`${item.type}-${item.src}`}
                type="button"
                aria-label={`Show ${item.label}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={[
                  "h-2.5 w-2.5 rounded-full border border-white/40 transition",
                  index === activeIndex
                    ? "scale-110 bg-white"
                    : "bg-white/20 hover:bg-white/50",
                ].join(" ")}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-black">{title}</h3>
      </div>
    </article>
  );
}