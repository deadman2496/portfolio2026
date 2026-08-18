"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useDelayedAutoScroll } from "@/hooks/useDelayedAutoScroll";
import {
  getAboutTimelineItems,
  type ResumeExperience,
  type ResumeTag,
} from "@/data/resume";
import Reveal from "@/components/Reveal";
import TimelineList from "@/components/about/TimelineList";
import TimelineDesktopDetails from "@/components/about/TimelineDesktopDetails";
import TimelineMobileSheet from "@/components/about/TimeLineMobileSheet";

type PublicStudioExperienceItem = {
  id: string;
  type: "work" | "project" | "education" | "certification" | "volunteer";
  organization: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  summary?: string;
  bullets: string[];
  skills: string[];
  focusTags?: ResumeTag[];
  visibility: "public" | "lab" | "draft";
  sortOrder: number;

};

type AboutTimelineProps = {
  showHiddenExperience?: boolean;
};

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

function getStudioCategory(
  type: PublicStudioExperienceItem["type"],
): ResumeExperience["category"] {
  if (type === "education" || type === "certification") {
    return "Education";
  }

  if (type === "project" || type === "volunteer") {
    return "Business";
  }

  return "Work";
}

function getStudioTimelineYear(item: PublicStudioExperienceItem) {
  if (item.isCurrent) {
    return "Now";
  }

  if (item.endDate) {
    return item.endDate.slice(0, 4);
  }

  return item.startDate.slice(0, 4);
}

function getStudioDateRange(item: PublicStudioExperienceItem) {
  const endLabel = item.isCurrent ? "Present" : item.endDate ?? item.startDate;

  return `${item.startDate} – ${endLabel}`;
}

function getTimelineEndDate(item: ResumeExperience) {
  if (item.end === null) {
    return "9999-12";
  }

  if (item.end) {
    return item.end;
  }

  return item.start || "0000-00";
}

function sortTimelineItems(items: ResumeExperience[]) {
  return [...items].sort((a, b) => {
    const endCompare = getTimelineEndDate(a).localeCompare(
      getTimelineEndDate(b),
    );

    if (endCompare !== 0) {
      return endCompare;
    }

    return (a.start || "0000-00").localeCompare(b.start || "0000-00");
  });
}

function mapStudioExperienceToTimelineItem(
  item: PublicStudioExperienceItem,
): ResumeExperience {
  const generalTag: ResumeTag = "general";
  const focusTags =
  Array.isArray(item.focusTags) && item.focusTags.length > 0
    ? item.focusTags
    : [generalTag];

  return {
    id: `studio-${item.id}`,
    title: item.role,
    company: item.organization,
    location: item.location ?? "",
    start: item.startDate,
    end: item.isCurrent ? null : item.endDate ?? item.startDate,
    dateRange: getStudioDateRange(item),
    category: getStudioCategory(item.type),
    timelineYear: getStudioTimelineYear(item),
    summary: item.summary ?? `${item.role} at ${item.organization}.`,
    tags: focusTags,
    bullets: Array.isArray(item.bullets)
  ? item.bullets.map((bullet) => ({
      text: bullet,
      tags: focusTags,
    }))
  : [],
  };
}

export default function AboutTimeline({
  showHiddenExperience = false,
}: AboutTimelineProps) {
  const hardcodedTimelineItems = useMemo(() => getAboutTimelineItems(), []);
  const [studioTimelineItems, setStudioTimelineItems] = useState<
    ResumeExperience[]
  >([]);

  const timelineItems = useMemo(
    () => sortTimelineItems([...hardcodedTimelineItems, ...studioTimelineItems]),
    [hardcodedTimelineItems, studioTimelineItems],
  );
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

  const effectiveActiveId = activeItem?.id ?? "";

  const activeIndex = timelineItems.findIndex(
    (item) => item.id === effectiveActiveId,
  );

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
    effectiveActiveId,
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


    useEffect(() => {
    let isMounted = true;

    async function loadStudioExperience() {
      try {
        const experienceUrl = `/api/studio/public-experience${
          showHiddenExperience ? "?lab=true" : ""
        }`;

        const response = await fetch(experienceUrl, {
          cache: "no-store",
        });

        if (!response.ok) {
        if (isMounted) {
          setStudioTimelineItems([]);
        }

        return;
      }

        const data = await response.json();

        const mappedItems = Array.isArray(data.items)
          ? (data.items as PublicStudioExperienceItem[]).map(
              mapStudioExperienceToTimelineItem,
            )
          : [];

        if (isMounted) {
          setStudioTimelineItems(mappedItems);
        }
      } catch (error) {
      if (isMounted) {
        setStudioTimelineItems([]);
      }

      if (process.env.NODE_ENV === "development") {
        console.warn("Unable to load Studio experience timeline items.", error);
      }
    }
    }

    loadStudioExperience();

    return () => {
      isMounted = false;
    };
  }, [showHiddenExperience]);

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
                activeId={effectiveActiveId}
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