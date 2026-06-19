"use client";

import type { KeyboardEvent, MutableRefObject, RefObject } from "react";
import type { ResumeExperience } from "@/data/resume";
import { getCategoryStyle } from "@/components/about/timelineStyles";

type TimelineListProps = {
  timelineItems: ResumeExperience[];
  activeId: string;
  hasSelectedTimelineItem: boolean;
  timelineContainerRef: RefObject<HTMLDivElement | null>;
  buttonRefs: MutableRefObject<Record<string, HTMLButtonElement | null>>;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  onSelectItem: (id: string) => void;
  onPreviewItem: (id: string) => void;
  onFocusItem: (id: string) => void;
};

export default function TimelineList({
  timelineItems,
  activeId,
  hasSelectedTimelineItem,
  timelineContainerRef,
  buttonRefs,
  onKeyDown,
  onSelectItem,
  onPreviewItem,
  onFocusItem,
}: TimelineListProps) {
  return (
    <div
      ref={timelineContainerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="max-h-[760px] overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl outline-none"
      aria-label="Resume timeline"
    >
      <div className="space-y-4">
        {timelineItems.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              ref={(element) => {
                buttonRefs.current[item.id] = element;
              }}
              type="button"
              onClick={() => onSelectItem(item.id)}
              onMouseEnter={() => {
                if (!hasSelectedTimelineItem) return;

                onPreviewItem(item.id);
              }}
              onFocus={() => onFocusItem(item.id)}
              aria-pressed={isActive}
              className={[
                "group relative grid w-full grid-cols-[76px_1fr] gap-5 rounded-2xl p-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300/70",
                isActive
                  ? "bg-white text-slate-950 shadow-2xl"
                  : "text-white hover:bg-white/10 focus:bg-white/10",
              ].join(" ")}
            >
              <div className="relative flex justify-center">
                <span
                  aria-hidden="true"
                  className={[
                    "absolute bottom-[-28px] left-1/2 top-[-28px] w-px -translate-x-1/2",
                    isActive ? "bg-slate-300" : "bg-white/15",
                  ].join(" ")}
                />

                <span
                  className={[
                    "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border text-sm font-black transition-all duration-300",
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-white/25 bg-slate-900 text-white group-hover:border-white/70",
                  ].join(" ")}
                >
                  {item.timelineYear}
                </span>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={[
                      "rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em]",
                      isActive
                        ? "border-slate-300 bg-slate-100 text-slate-600"
                        : getCategoryStyle(item.category),
                    ].join(" ")}
                  >
                    {item.category}
                  </span>

                  <span
                    className={[
                      "text-xs font-bold",
                      isActive ? "text-slate-500" : "text-white/45",
                    ].join(" ")}
                  >
                    {item.dateRange}
                  </span>
                </div>

                <h3 className="text-xl font-black leading-tight">
                  {item.title}
                </h3>

                <p
                  className={[
                    "mt-1 text-sm font-semibold",
                    isActive ? "text-slate-500" : "text-white/50",
                  ].join(" ")}
                >
                  {item.company} • {item.location}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}