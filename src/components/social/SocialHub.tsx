"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { socialHubTabs } from "@/data/socialTabs";
import type { SocialHubTab, SocialHubTabId } from "@/types/social";
import SocialHubTabs from "@/components/social/SocialHubTabs";
import { useKonamiUnlock } from "@/hooks/useKonamiUnlock";
import SelectedPosts from "./posts/SelectedPosts";
import LiveNow from "./live/LiveNow";

type SocialHubProps = {
  showHiddenTabs?: boolean;
};

function getVisibleTabs(showHiddenTabs: boolean) {
  return socialHubTabs.filter((tab) => {
    if (tab.isEnabled) return true;

    return showHiddenTabs && tab.isHiddenFeature;
  });
}

function SocialHubPanel({
  tab,
  showHiddenFeatures,
}: {
  tab: SocialHubTab;
  showHiddenFeatures: boolean;
}) {
  if (tab.id === "live") {
    return (
      <div
        role="tabpanel"
        id={`social-panel-${tab.id}`}
        aria-labelledby={`social-tab-${tab.id}`}
        className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
      >
        <LiveNow showHiddenPlatforms={showHiddenFeatures} />
      </div>
    );
  }

  if (tab.id === "selected-posts") {
    return (
      <div
        role="tabpanel"
        id={`social-panel-${tab.id}`}
        aria-labelledby={`social-tab-${tab.id}`}
        className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
      >
        <SelectedPosts showHiddenPlatforms={showHiddenFeatures} />
      </div>
    );
  }

  return (
    <div
      role="tabpanel"
      id={`social-panel-${tab.id}`}
      aria-labelledby={`social-tab-${tab.id}`}
      className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
    >
      <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-blue-300">
        {tab.eyebrow}
      </p>

      <h3 className="text-3xl font-black tracking-tight md:text-4xl">
        {tab.title}
      </h3>

      <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
        {tab.description}
      </p>

      {tab.isHiddenFeature && (
        <div className="mt-5 rounded-2xl border border-dashed border-blue-300/25 bg-blue-300/10 p-4 text-sm font-bold text-blue-100/80">
          Hidden feature preview. This tab is reserved for later and can stay
          disabled in production.
        </div>
      )}
    </div>
  );
}

export default function SocialHub({ showHiddenTabs = false }: SocialHubProps) {
  const {
    isUnlocked: konamiTabsUnlocked,
    unlock,
    unlockCount,
    resetUnlock,
  } = useKonamiUnlock();

  const liveTapCountRef = useRef(0);
  const liveTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldShowHiddenTabs = showHiddenTabs || konamiTabsUnlocked;

  const visibleTabs = useMemo(
    () => getVisibleTabs(shouldShowHiddenTabs),
    [shouldShowHiddenTabs],
  );

  const firstVisibleTab = visibleTabs[0];

  const [activeTabId, setActiveTabId] = useState<SocialHubTabId>(
    firstVisibleTab?.id ?? "live",
  );

  const activeTab =
    visibleTabs.find((tab) => tab.id === activeTabId) ?? firstVisibleTab;

  useEffect(() => {
    return () => {
      if (liveTapTimerRef.current) {
        clearTimeout(liveTapTimerRef.current);
      }
    };
  }, []);

  if (!activeTab) {
    return null;
  }

  function handleSelectTab(tabId: SocialHubTabId) {
    setActiveTabId(tabId);

    if (tabId !== "live" || shouldShowHiddenTabs) {
      liveTapCountRef.current = 0;
      return;
    }

    liveTapCountRef.current += 1;

    if (liveTapTimerRef.current) {
      clearTimeout(liveTapTimerRef.current);
    }

    liveTapTimerRef.current = setTimeout(() => {
      liveTapCountRef.current = 0;
    }, 2200);

    if (liveTapCountRef.current >= 5) {
      liveTapCountRef.current = 0;

      if (liveTapTimerRef.current) {
        clearTimeout(liveTapTimerRef.current);
        liveTapTimerRef.current = null;
      }

      unlock();
    }
  }

  function handleHideHiddenTabs() {
    setActiveTabId("live");
    liveTapCountRef.current = 0;

    if (liveTapTimerRef.current) {
      clearTimeout(liveTapTimerRef.current);
      liveTapTimerRef.current = null;
    }

    resetUnlock();
  }

  return (
    <section id="social" className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              Live & Social
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Streams, stories, and selected updates.
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/65">
              A hub for live streams, Instagram stories, and hand-picked posts
              from the platforms I use.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delayMs={150}>
          <SocialHubTabs
            tabs={visibleTabs}
            activeTabId={activeTab.id}
            onSelectTab={handleSelectTab}
          />

          {konamiTabsUnlocked && (
            <div
              key={unlockCount}
              className="mt-4 rounded-2xl border border-blue-300/25 bg-blue-300/10 px-4 py-3 text-sm font-bold text-blue-100 shadow-xl"
            >
              Lab mode unlocked. Hidden social tabs are now visible.

              <button
                type="button"
                onClick={handleHideHiddenTabs}
                className="ml-3 rounded-full border border-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Hide
              </button>
            </div>
          )}

          <SocialHubPanel tab={activeTab} showHiddenFeatures={shouldShowHiddenTabs} />
        </Reveal>
      </div>
    </section>
  );
}