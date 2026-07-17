"use client";

import type { SocialHubTab, SocialHubTabId } from "@/types/social";

type SocialHubTabsProps = {
  tabs: SocialHubTab[];
  activeTabId: SocialHubTabId;
  onSelectTab: (tabId: SocialHubTabId) => void;
};

export default function SocialHubTabs({
  tabs,
  activeTabId,
  onSelectTab,
}: SocialHubTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Social hub sections"
      className="flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`social-panel-${tab.id}`}
            id={`social-tab-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={[
              "rounded-full px-4 py-3 text-sm font-black uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 focus:ring-blue-300/70",
              isActive
                ? "bg-white text-slate-950 shadow-2xl"
                : "text-white/55 hover:bg-white/10 hover:text-white",
              tab.isHiddenFeature ? "border border-dashed border-blue-300/30" : "",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}