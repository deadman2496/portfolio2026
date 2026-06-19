"use client";

import { ReactNode, useRef } from "react";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

type RevealDirection = "up" | "left" | "right" | "down" | "scale";

type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delayMs?: number;
  className?: string;
  once?: boolean;
};

function getHiddenTransform(direction: RevealDirection) {
  switch (direction) {
    case "left":
      return "-translate-x-10 translate-y-0 scale-100";
    case "right":
      return "translate-x-10 translate-y-0 scale-100";
    case "down":
      return "translate-y-10 translate-x-0 scale-100";
    case "scale":
      return "translate-y-4 translate-x-0 scale-95";
    case "up":
    default:
      return "translate-y-10 translate-x-0 scale-100";
  }
}

export default function Reveal({
  children,
  direction = "up",
  delayMs = 0,
  className = "",
  once = true,
}: RevealProps) {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useRevealOnScroll(revealRef, {
    once,
    threshold: 0.18,
  });

  return (
    <div
      ref={revealRef}
      className={[
        "transition-all duration-1000 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100",
        isVisible
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : `${getHiddenTransform(direction)} opacity-0`,
        className,
      ].join(" ")}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}