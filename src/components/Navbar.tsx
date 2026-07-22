"use client";

import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getVisibleNavLinks } from "@/data/navLinks";
import type { NavLink } from "@/types/navigation";
import { useKonamiUnlock } from "@/hooks/useKonamiUnlock";
import MobileNavbar from "@/components/nav/MobileNavbar";

const NAVBAR_INTRO_DELAY_MS = 2200;

const trackedSectionIds = [
  "home",
  "about",
  "about-stats",
  "visual-bridge",
  "projects",
  "social",
  "work",
  "apps-sites",
  "mobile-apps",
  "websites",
  "local-ai-assistant",
  "trading-bot",
  "contact",
];

const workRelatedSections = new Set([
  "work",
  "projects",
  "visual-bridge",
  "social",
]);

const appsSitesRelatedSections = new Set([
  "apps-sites",
  "mobile-apps",
  "websites",
  "local-ai-assistant",
  "trading-bot",
]);

const bottomDockSections = new Set(["about"]);

const aboutRelatedSections = new Set([
  "about",
  "about-stats",
  "visual-bridge",
]);

function getActiveLabel(navLinks: NavLink[], activeNavId: string) {
  return navLinks.find((link) => link.id === activeNavId)?.label ?? "Home";
}

function getActiveViewingLabel(activeSection: string, navLinks: NavLink[]) {
  const subsectionLabels: Record<string, string> = {
    home: "Home",
    about: "About",
    "about-stats": "About Stats",
    "visual-bridge": "Repairs / Visual Work",
    projects: "Project Work",
    social: "Social Hub",
    work: "Work",
    "apps-sites": "Apps & Sites",
    "mobile-apps": "Mobile Apps",
    websites: "Websites",
    "local-ai-assistant": "Local AI Assistant",
    "trading-bot": "Trading Bot",
    contact: "Contact",
  };

  return (
    subsectionLabels[activeSection] ??
    navLinks.find((link) => link.id === activeSection)?.label ??
    "Home"
  );
}

export default function Navbar() {
  const [navReady, setNavReady] = useState(false);
  const { isUnlocked: labModeUnlocked } = useKonamiUnlock();
  const visibleNavLinks = getVisibleNavLinks(labModeUnlocked);
  const [livePlatformCount, setLivePlatformCount] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNavReady(true);
    }, NAVBAR_INTRO_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const activeSection = useActiveSection(trackedSectionIds, {
    anchorRatio: 0.42,
  });

  const dockToBottom = bottomDockSections.has(activeSection);

  useEffect(() => {
  let isMounted = true;

  async function loadLiveStatus() {
    try {
      const response = await fetch("/api/social/live-status", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      const liveCount = Array.isArray(data.platforms)
        ? data.platforms.filter(
            (platform: { isLive?: boolean }) => platform.isLive,
          ).length
        : 0;

      if (isMounted) {
        setLivePlatformCount(liveCount);
      }
    } catch {
      if (isMounted) {
        setLivePlatformCount(0);
      }
    }
  }

  void loadLiveStatus();

  const interval = window.setInterval(() => {
    void loadLiveStatus();
  }, 60000);

  return () => {
    isMounted = false;
    window.clearInterval(interval);
  };
}, []);

  const activeNavId = aboutRelatedSections.has(activeSection)
  ? "about"
  : workRelatedSections.has(activeSection)
    ? "work"
    : appsSitesRelatedSections.has(activeSection)
      ? "apps-sites"
      : activeSection;

  const activeLabel = getActiveViewingLabel(activeSection, visibleNavLinks);

  const isViewingSocialHub = activeSection === "social";
const hasLiveStream = livePlatformCount > 0;
const showLiveIndicator = isViewingSocialHub && hasLiveStream;

const viewingStatusLabel = showLiveIndicator
  ? livePlatformCount > 1
    ? `${activeLabel} · Multi-live`
    : `${activeLabel} · Live`
  : activeLabel;

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          top: dockToBottom ? "calc(100dvh - 5.35rem)" : "1.25rem",
          willChange: "top, opacity, transform",
        }}
        className={[
          "fixed left-1/2 z-50 hidden w-[min(1180px,calc(100%-40px))] -translate-x-1/2 items-center justify-between rounded-2xl border px-6 py-4 text-white shadow-2xl backdrop-blur-xl md:flex",
          "transition-[top,opacity,transform,background-color,border-color,box-shadow] duration-1000 ease-out",
          navReady
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
          dockToBottom
            ? "scale-[0.985] border-white/20 bg-slate-950/75 shadow-blue-950/40"
            : "scale-100 border-white/15 bg-slate-950/55 shadow-black/40",
        ].join(" ")}
      >
        <a href="#home" className="text-xl font-extrabold tracking-tight">
          AlexisMarroquin<span className="text-white/45">.nyc</span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/60 shadow-xl backdrop-blur-xl lg:flex">
          <span className="h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_14px_rgba(147,197,253,0.95)]" />
          Viewing {viewingStatusLabel}
        </div>

        {visibleNavLinks.map((link) => {
        const hasChildren = Boolean(link.children?.length);
        const isActive = activeNavId === link.id;

        return (
          <div key={link.id} className="group relative">
            <a
              href={link.href}
              target={link.isExternal ? "_blank" : undefined}
              rel={link.isExternal ? "noreferrer" : undefined}
              className={[
            "rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.16em] transition hover:bg-white/10 hover:text-white",
            isActive
              ? "bg-white/10 text-white shadow-[0_0_24px_rgba(147,197,253,0.12)]"
              : "text-white/70",
          ].join(" ")}
            >
              {link.label}
            </a>

            {hasChildren && (
              <div
                className={[
                  "invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition-all duration-150 ease-out",
                  "group-hover:visible group-hover:opacity-100",
                  "group-focus-within:visible group-focus-within:opacity-100",
                ].join(" ")}
              >
                <div className="min-w-56 rounded-3xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-xl">
                  {link.children?.map((child) => (
                    <a
                      key={child.id}
                      href={child.href}
                      target={child.isExternal ? "_blank" : undefined}
                      rel={child.isExternal ? "noreferrer" : undefined}
                      className={[
                        "block rounded-2xl px-4 py-3 text-sm font-bold text-white/65 transition hover:bg-white/10 hover:text-white",
                        child.isHiddenFeature
                          ? "border border-dashed border-blue-300/20 text-blue-100/70"
                          : "",
                      ].join(" ")}
                    >
                      {child.label}

                      {child.isHiddenFeature && (
                        <span className="ml-2 text-[0.65rem] uppercase tracking-[0.16em] text-blue-300/70">
                          Lab
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      </nav>

      <MobileNavbar
        navLinks={visibleNavLinks}
        activeNavId={activeNavId}
        navReady={navReady}
      />
    </>
  );
}
