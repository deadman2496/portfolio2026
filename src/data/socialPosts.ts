import type { SelectedSocialPost } from "@/types/social";

export const selectedSocialPosts: SelectedSocialPost[] = [
  {
    id: "instagram-z-fold-repair",
    platform: "instagram",
    title: "Galaxy Z Fold 3 repair",
    description:
      "A selected repair post showing the damaged device, restoration process, or final result.",
    url: "https://www.instagram.com/",
    thumbnail: "/images/social/post-thumbnails/z-fold-repair.jpg",
    publishedAt: "2026",
  },
  {
    id: "youtube-portfolio-demo",
    platform: "youtube",
    title: "Portfolio project demo",
    description:
      "A selected video walkthrough or project update hosted on YouTube.",
    url: "https://www.youtube.com/",
    thumbnail: "/images/social/post-thumbnails/portfolio-demo.jpg",
    publishedAt: "2026",
  },

  // Hidden future feature.
  // Keep this commented out until you have an X post ready,
  // or leave it active with isHiddenFeature: true for lab-mode testing.
  {
    id: "x-future-post",
    platform: "x",
    title: "Future X update",
    description:
      "Reserved for a future X post when there is something worth highlighting.",
    url: "https://x.com/",
    thumbnail: "/images/social/post-thumbnails/x-placeholder.jpg",
    publishedAt: "Future",
    isHiddenFeature: true,
  },
  {
  id: "linkedin-future-update",
  platform: "Linkedin",
  title: "Future LinkedIn update",
  description:
    "Reserved for a future LinkedIn post once professional updates are ready to highlight.",
  url: "https://www.linkedin.com/",
  thumbnail: "/images/social/post-thumbnails/linkedin-placeholder.jpg",
  publishedAt: "Future",
  isHiddenFeature: true,
},
];