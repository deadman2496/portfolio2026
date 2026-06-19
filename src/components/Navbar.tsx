"use client";

import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import MobileNavbar from "@/components/nav/MobileNavbar";

const NAVBAR_INTRO_DELAY_MS = 2200;

const navLinks = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const trackedSectionIds = [
  "home",
  "about",
  "about-stats",
  "visual-bridge",
  "projects",
  "contact",
];

const bottomDockSections = new Set(["about"]);

const aboutRelatedSections = new Set([
  "about",
  "about-stats",
  "visual-bridge",
]);

function getActiveLabel(activeNavId: string) {
  return navLinks.find((link) => link.id === activeNavId)?.label ?? "Home";
}

export default function Navbar() {
  const [navReady, setNavReady] = useState(false);

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

  const activeNavId = aboutRelatedSections.has(activeSection)
    ? "about"
    : activeSection;

  const activeLabel = getActiveLabel(activeNavId);

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
          Viewing {activeLabel}
        </div>

        <div className="hidden gap-8 text-sm font-semibold text-white/75 md:flex">
          {navLinks.map((link) => {
            const isActive = activeNavId === link.id;

            return (
              <a
                key={link.id}
                href={link.href}
                className={[
                  "relative flex items-center gap-2 rounded-full px-3 py-2 transition hover:text-white",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_0_24px_rgba(147,197,253,0.12)]"
                    : "text-white/70",
                ].join(" ")}
              >
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_14px_rgba(147,197,253,0.95)]" />
                )}

                {link.label}
              </a>
            );
          })}
        </div>
      </nav>

      <MobileNavbar
        navLinks={navLinks}
        activeNavId={activeNavId}
        navReady={navReady}
      />
    </>
  );
}
