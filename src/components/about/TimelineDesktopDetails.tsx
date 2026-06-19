"use client";

import type { RefObject } from "react";
import type { ResumeExperience } from "@/data/resume";
import TimelineDetailsContent from "@/components/about/TimelineDetailsContent";

type TimelineDesktopDetailsProps = {
  activeItem: ResumeExperience;
  hasSelectedTimelineItem: boolean;
  detailsScrollRef: RefObject<HTMLDivElement | null>;
  onCancelAutoScroll: () => void;
};

export default function TimelineDesktopDetails({
  activeItem,
  hasSelectedTimelineItem,
  detailsScrollRef,
  onCancelAutoScroll,
}: TimelineDesktopDetailsProps) {
  return (
    <aside className="hidden h-fit self-start lg:sticky lg:top-24 lg:block">
      {!hasSelectedTimelineItem ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
            Timeline Details
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight">
            Select a year to view the story.
          </h3>

          <p className="mt-5 leading-8 text-white/65">
            Click, tap, or use the arrow keys on the timeline to reveal the
            role, responsibilities, and related skills for each point in my
            resume.
          </p>
        </div>
      ) : (
        <div
          ref={detailsScrollRef}
          onWheel={onCancelAutoScroll}
          onTouchStart={onCancelAutoScroll}
          className="max-h-[calc(100vh-13rem)] overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          <TimelineDetailsContent activeItem={activeItem} />
        </div>
      )}
    </aside>
  );
}