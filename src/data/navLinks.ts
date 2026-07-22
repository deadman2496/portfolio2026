import type { NavLink } from "@/types/navigation";

export const navLinks: NavLink[] = [
  {
    id: "home",
    label: "Home",
    href: "#home",
  },
  {
    id: "about",
    label: "About",
    href: "#about",
  },
  {
    id: "work",
    label: "Work",
    href: "#work",
    children: [
      {
        id: "project-work",
        label: "Project Work",
        href: "#projects",
      },
      {
        id: "repairs-visual-work",
        label: "Repairs / Visual Work",
        href: "#visual-bridge",
      },
      {
        id: "social-hub",
        label: "Social Hub",
        href: "#social",
      },
    ],
  },
  {
    id: "apps-sites",
    label: "Apps & Sites",
    href: "#apps-sites",
    children: [
      {
        id: "mobile-apps",
        label: "Mobile Apps",
        href: "#mobile-apps",
      },
      {
        id: "website-links",
        label: "Websites",
        href: "#websites",
      },
      {
        id: "local-ai-assistant",
        label: "Local AI Assistant",
        href: "#local-ai-assistant",
        isHiddenFeature: true,
      },
      {
        id: "trading-bot",
        label: "Trading Bot",
        href: "#trading-bot",
        isHiddenFeature: true,
      },
      {
        id: "ai-lab",
        label: "AI Lab",
        href: "https://lab.alexismarroquin.nyc/ai",
        isExternal: true,
        isHiddenFeature: true,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
  },
];

export function getVisibleNavLinks(showHiddenFeatures: boolean) {
  return navLinks
    .filter((link) => !link.isHiddenFeature || showHiddenFeatures)
    .map((link) => ({
      ...link,
      children: link.children?.filter(
        (child) => !child.isHiddenFeature || showHiddenFeatures,
      ),
    }));
}