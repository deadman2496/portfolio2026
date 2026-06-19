"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAboutTimelineItems } from "@/data/resume";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useDelayedAutoScroll } from "@/hooks/useDelayedAutoScroll";
import Reveal from "@/components/Reveal";
import TimelineList from "@/components/about/TimelineList";
import TimelineDesktopDetails from "@/components/about/TimelineDesktopDetails";
import TimelineMobileSheet from "@/components/about/TimeLineMobileSheet";

const DETAILS_AUTO_SCROLL_DELAY_MS = 2500;

const arrowKeys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];

const pageSectionIds = [
  "home",
  "about",
  "about-stats",
  "visual-bridge",
  "projects",
  "contact",
];

function isMobileViewport() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(max-width: 1023px)").matches;
}

export default function AboutTimeline() {
  const timelineItems = useMemo(() => getAboutTimelineItems(), []);
  const [activeId, setActiveId] = useState(timelineItems[0]?.id ?? "");
  const [hasSelectedTimelineItem, setHasSelectedTimelineItem] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [autoScrollRequestId, setAutoScrollRequestId] = useState(0);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const detailsScrollRef = useRef<HTMLDivElement | null>(null);

  const activePageSection = useActiveSection(pageSectionIds, {
    anchorRatio: 0.42,
  });

  const isAboutSectionActive = activePageSection === "about";

  const {
    startAutoScroll: startDetailsAutoScroll,
    cancelAutoScroll: cancelDetailsAutoScroll,
  } = useDelayedAutoScroll(detailsScrollRef, {
    delayMs: DETAILS_AUTO_SCROLL_DELAY_MS,
    speedPixelsPerMs: 0.038,
  });

  const activeItem =
    timelineItems.find((item) => item.id === activeId) ?? timelineItems[0];

  const activeIndex = timelineItems.findIndex((item) => item.id === activeId);
  const safeActiveIndex = Math.max(activeIndex, 0);

  function getNextTimelineIndexFromKey(key: string) {
    if (!hasSelectedTimelineItem) {
      return safeActiveIndex;
    }

    if (key === "ArrowDown" || key === "ArrowRight") {
      return Math.min(safeActiveIndex + 1, timelineItems.length - 1);
    }

    if (key === "ArrowUp" || key === "ArrowLeft") {
      return Math.max(safeActiveIndex - 1, 0);
    }

    return safeActiveIndex;
  }

  function selectTimelineItem(
    id: string,
    options?: {
      focusButton?: boolean;
      resetDetailsScroll?: boolean;
      showDetails?: boolean;
      autoScrollDetails?: boolean;
      openMobileSheet?: boolean;
    },
  ) {
    const shouldAutoScroll = Boolean(options?.autoScrollDetails);

    if (!shouldAutoScroll) {
      cancelDetailsAutoScroll();
    }

    setActiveId(id);

    if (options?.showDetails) {
      setHasSelectedTimelineItem(true);
    }

    if (options?.openMobileSheet) {
      setIsMobileSheetOpen(true);
    }

    if (shouldAutoScroll) {
      setAutoScrollRequestId((current) => current + 1);
    }

    window.requestAnimationFrame(() => {
      const button = buttonRefs.current[id];

      if (options?.focusButton) {
        button?.focus();
      }

      button?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });

      if (options?.resetDetailsScroll) {
        detailsScrollRef.current?.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }
    });
  }

  function selectTimelineIndex(index: number) {
    const nextItem = timelineItems[index];

    if (!nextItem) return;

    selectTimelineItem(nextItem.id, {
      resetDetailsScroll: true,
      showDetails: true,
      autoScrollDetails: false,
      openMobileSheet: true,
    });
  }

  function handleTimelineSelect(id: string) {
    const shouldOpenMobileSheet = isMobileViewport();

    selectTimelineItem(id, {
      resetDetailsScroll: true,
      showDetails: true,
      autoScrollDetails: !shouldOpenMobileSheet,
      openMobileSheet: shouldOpenMobileSheet,
    });
  }

  function handleTimelinePreview(id: string) {
    selectTimelineItem(id, {
      resetDetailsScroll: false,
      showDetails: true,
      autoScrollDetails: false,
    });
  }

  function handleTimelineKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!timelineItems.length) return;
    if (!arrowKeys.includes(event.key)) return;

    event.preventDefault();

    const nextIndex = getNextTimelineIndexFromKey(event.key);
    const nextItem = timelineItems[nextIndex];

    if (!nextItem) return;

    selectTimelineItem(nextItem.id, {
      focusButton: true,
      resetDetailsScroll: true,
      showDetails: true,
      autoScrollDetails: true,
    });
  }

  useEffect(() => {
    if (!hasSelectedTimelineItem) return;
    if (autoScrollRequestId === 0) return;

    const renderDelay = window.setTimeout(() => {
      detailsScrollRef.current?.scrollTo({
        top: 0,
        behavior: "auto",
      });

      startDetailsAutoScroll();
    }, 75);

    return () => window.clearTimeout(renderDelay);
  }, [
    activeId,
    autoScrollRequestId,
    hasSelectedTimelineItem,
    startDetailsAutoScroll,
  ]);

  useEffect(() => {
    if (!isAboutSectionActive) return;

    function handleWindowKeyDown(event: KeyboardEvent) {
      if (!arrowKeys.includes(event.key)) return;

      const target = event.target;

      if (target instanceof HTMLElement) {
        const isTypingField =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable;

        if (isTypingField) return;

        if (timelineContainerRef.current?.contains(target)) {
          return;
        }
      }

      event.preventDefault();

      timelineContainerRef.current?.focus({ preventScroll: true });

      const nextIndex = getNextTimelineIndexFromKey(event.key);
      const nextItem = timelineItems[nextIndex];

      if (!nextItem) return;

      selectTimelineItem(nextItem.id, {
        focusButton: true,
        resetDetailsScroll: true,
        showDetails: true,
        autoScrollDetails: true,
      });
    }

    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isAboutSectionActive, safeActiveIndex, hasSelectedTimelineItem, timelineItems]);

  if (!activeItem) {
    return null;
  }

  return (
    <>
    <Reveal direction="up">
      <section
        id="about"
        className="relative bg-slate-950 px-6 py-24 text-white"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              About Me
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Built through technology, operations, repair, and real-world
              problem solving.
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/65">
              My background spans software development, computer repair,
              technical support, aviation operations, climate field work,
              logistics, dispatching, and leadership. Select a year to explore
              the experience behind it.
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_430px]">
            <Reveal direction="left" delayMs={150}>
              <TimelineList
                timelineItems={timelineItems}
                activeId={activeId}
                hasSelectedTimelineItem={hasSelectedTimelineItem}
                timelineContainerRef={timelineContainerRef}
                buttonRefs={buttonRefs}
                onKeyDown={handleTimelineKeyDown}
                onSelectItem={handleTimelineSelect}
                onPreviewItem={handleTimelinePreview}
                onFocusItem={(id) => setActiveId(id)}
              />
            </Reveal>

            <Reveal direction="right" delayMs={300}>
              <TimelineDesktopDetails
                activeItem={activeItem}
                hasSelectedTimelineItem={hasSelectedTimelineItem}
                detailsScrollRef={detailsScrollRef}
                onCancelAutoScroll={cancelDetailsAutoScroll}
              />
            </Reveal>
          </div>
        </div>

      </section>
    </Reveal>

    <TimelineMobileSheet
          isOpen={isMobileSheetOpen}
          activeItem={activeItem}
          activeIndex={safeActiveIndex}
          totalItems={timelineItems.length}
          onClose={() => setIsMobileSheetOpen(false)}
          onPrevious={() => selectTimelineIndex(safeActiveIndex - 1)}
          onNext={() => selectTimelineIndex(safeActiveIndex + 1)}
        />
        </>
  );
}