"use client";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MobileNavAnimations } from "./mobileNavAnimations";
import {
  BUTTON_CENTER,
  ICON_CENTER,
  MENU_HEIGHT,
  MENU_WIDTH,
  mobileNavOrder,
  orbitLayoutById,
  stackedLayoutById,
} from "@/components/nav/mobileNavConfig";

type NavLink = {
  id: string;
  label: string;
  href: string;
};

type MobileNavbarProps = {
  navLinks: NavLink[];
  activeNavId: string;
  navReady: boolean;
};

type IconProps = {
  className?: string;
};

type IconComponent = (props: IconProps) => ReactNode;




function getActiveLabel(navLinks: NavLink[], activeNavId: string) {
  return navLinks.find((link) => link.id === activeNavId)?.label ?? "Menu";
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M3.5 10.5 12 3.5l8.5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 9.75V20h12.5V9.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 20v-6h5v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AboutIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectsIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="m8 9-4 3 4 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m16 9 4 3-4 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m13.5 6-3 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ContactIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M4 6.5h16v11H4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m5 7.5 7 5.25 7-5.25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DefaultIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const iconById: Record<string, IconComponent> = {
  home: HomeIcon,
  about: AboutIcon,
  projects: ProjectsIcon,
  contact: ContactIcon,
};

export default function MobileNavbar({
  navLinks,
  activeNavId,
  navReady,
}: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [useStackedLayout, setUseStackedLayout] = useState(false);


  const orbitLinks = useMemo(() => {
    const navLinkById = new Map(navLinks.map((link) => [link.id, link]));

    const orderedLinks = mobileNavOrder
      .map((id) => navLinkById.get(id))
      .filter((link): link is NavLink => Boolean(link));

    return orderedLinks.map((link, index) => {
      const fallbackOffset = -(index + 1) * 58;
      const activeLayout = useStackedLayout ? stackedLayoutById : orbitLayoutById;

        const layout = activeLayout[link.id] ?? {
          x: useStackedLayout ? 0 : -110,
          y: fallbackOffset,
        };

      return {
        ...link,
        ...layout,
      };
    });
  }, [navLinks, useStackedLayout]);

const trailPoints = useMemo(() => {
  const orbitPoints = orbitLinks.map((link) => {
    return `${ICON_CENTER.x + link.x},${ICON_CENTER.y + link.y}`;
  });

  return [...orbitPoints, `${BUTTON_CENTER.x},${BUTTON_CENTER.y}`].join(" ");
}, [orbitLinks]);

const activeLabel = getActiveLabel(navLinks, activeNavId);



  useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 389px)");

  function updateLayout() {
    setUseStackedLayout(mediaQuery.matches);
  }

  updateLayout();

  mediaQuery.addEventListener("change", updateLayout);

  return () => {
    mediaQuery.removeEventListener("change", updateLayout);
  };
}, []);  

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!menuRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
    <MobileNavAnimations />
    <button
      type="button"
      aria-label="Close navigation menu"
      onClick={() => setIsOpen(false)}
      className={[
        "fixed inset-0 z-[80] bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      />
    <div
      ref={menuRef}
      className={[
        "fixed bottom-5 right-5 z-[90] md:hidden transition-all duration-700 ease-out",
        navReady
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0",
      ].join(" ")}
    >
      <div className="relative h-[360px] w-[340px] overflow-visible">
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -bottom-8 -right-8 h-[290px] w-[290px] rounded-full bg-blue-300/10 blur-3xl transition-opacity duration-500",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -bottom-4 -right-4 h-[210px] w-[210px] rounded-full bg-black/35 blur-2xl transition-opacity duration-500",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${MENU_WIDTH} ${MENU_HEIGHT}`}
          className={[
            "pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-all duration-500",
            isOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <polyline
            points={trailPoints}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points={trailPoints}
            fill="none"
            stroke="rgba(147,197,253,0.42)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 9"
          />
        </svg>

        {orbitLinks.map((link, index) => {
          const isActive = activeNavId === link.id;
          const Icon = iconById[link.id] ?? DefaultIcon;

          return (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              aria-label={`Go to ${link.label}`}
              className={[
                "absolute bottom-0 right-0 flex items-center gap-3 transition-all duration-500 ease-out",
                isOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              ].join(" ")}
              style={{
                transform: isOpen
                  ? `translate(${link.x}px, ${link.y}px) scale(1)`
                  : "translate(0px, 0px) scale(0.65)",
                transitionDelay: isOpen ? `${index * 55}ms` : "0ms",
              }}
            >
              <span
                className={[
                  "relative min-w-[104px] whitespace-nowrap rounded-full border px-3 py-2 text-right text-[11px] font-black uppercase tracking-[0.18em] shadow-xl backdrop-blur-xl transition-all duration-300",
                  isActive
                    ? "border-blue-200/55 bg-blue-300/25 pr-7 text-blue-100 shadow-blue-950/40"
                    : "border-white/10 bg-slate-950/88 text-white/78",
                ].join(" ")}
              >
                {link.label}

                {isActive && (
                  <span className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-200 shadow-[0_0_14px_rgba(147,197,253,0.95)]" />
                )}
              </span>

              <span
  className={[
    "relative flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl transition-all duration-300",
    isActive
      ? "scale-110 border-blue-200/70 bg-blue-300/25 text-blue-50 shadow-[0_0_30px_rgba(147,197,253,0.35)]"
      : "border-white/15 bg-slate-950/90 text-white",
  ].join(" ")}
>
  {isOpen && (
  <>
    <span
      aria-hidden="true"
      className="absolute inset-[-7px] rounded-full border border-blue-200/25 motion-reduce:hidden"
      style={{
        animation: "mobileNavRipple 2.8s ease-out infinite",
      }}
    />

    <span
      aria-hidden="true"
      className="absolute inset-[-7px] rounded-full border border-blue-200/15 motion-reduce:hidden"
      style={{
        animation: "mobileNavRipple 2.8s ease-out 0.9s infinite",
      }}
    />
  </>
)}

  {isActive && (
    <span className="absolute inset-[-10px] rounded-full border border-blue-200/25 shadow-[0_0_24px_rgba(147,197,253,0.25)]" />
  )}

  <span className="absolute inset-1 rounded-full border border-white/10" />
  <Icon className="relative z-10 h-6 w-6" />
</span>
            </a>
          );
        })}

        <div
          className={[
            "pointer-events-none absolute bottom-[5.25rem] right-0 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 shadow-2xl backdrop-blur-xl transition-all duration-300",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          ].join(" ")}
        >
          Viewing {activeLabel}
        </div>

        {!isOpen && navReady && (
          <div
            key={`menu-hint-${activeNavId}`}
            className="pointer-events-none absolute bottom-3 right-[4.75rem] rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 shadow-2xl backdrop-blur-xl"
            style={{
              animation: "mobileMenuHintFade 4s ease-out forwards",
            }}
          >
            Menu
          </div>
        )}
        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className={[
            "absolute bottom-0 right-0 flex h-16 items-center rounded-full border border-white/15 bg-slate-950/88 text-white shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300",
            isOpen
              ? "w-56 justify-start gap-3 px-4"
              : "w-16 justify-center px-0",
          ].join(" ")}
        >
          <span className="absolute inset-0 rounded-full bg-blue-300/10 blur-xl" />

          <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-2xl font-black">
            <span
              aria-hidden="true"
              className="absolute inset-[-8px] rounded-full border border-blue-200/30 motion-reduce:hidden"
              style={{
                animation: "mobileNavRipple 2.8s ease-out infinite",
              }}
            />

  <span
    aria-hidden="true"
    className="absolute inset-[-8px] rounded-full border border-blue-200/20 motion-reduce:hidden"
    style={{
      animation: "mobileNavRipple 2.8s ease-out 0.9s infinite",
    }}
  />

  <span className="relative z-10">A</span>
</span>

          <span
            className={[
              "relative z-10 overflow-hidden whitespace-nowrap text-sm font-black tracking-tight transition-all duration-300",
              isOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0",
            ].join(" ")}
          >
            Alexis Marroquin
          </span>
        </button>
      </div>
    </div>
    </>
  );
}