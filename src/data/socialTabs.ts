import type { SocialHubTab } from "@/types/social";

export const socialHubTabs: SocialHubTab[] = [
  {
    id: "live",
    label: "Live Now",
    eyebrow: "Live",
    title: "Live streams and current broadcasts.",
    description:
      "This will choose the active platform when you are live, while keeping playback paused until the visitor presses play.",
    isEnabled: true,
  },
  {
    id: "instagram-stories",
    label: "IG Stories",
    eyebrow: "Instagram",
    title: "Current Instagram stories.",
    description:
      "This will eventually show your active Instagram stories when Meta API access is ready.",
    isEnabled: true,
  },
  {
    id: "selected-posts",
    label: "Selected Posts",
    eyebrow: "Social",
    title: "Curated posts and updates.",
    description:
      "This will show posts you manually add from Instagram, X, YouTube, and eventually other platforms.",
    isEnabled: true,
  },
];