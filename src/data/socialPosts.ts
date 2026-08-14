import type { SelectedSocialPost } from "@/types/social";

export const selectedSocialPosts: SelectedSocialPost[] = [
  {
  id: "instagram-mirror-01",
  platform: "instagram",
  title: "Instagram post mirror",
  description:
    "A portfolio-friendly mirror of an Instagram update with a direct link back to the original post.",
  url: "https://www.instagram.com/p/DFA6bi-PK7C/",
  thumbnail: "/images/social/post-thumbnails/instagram-mirror-01.jpg",
  publishedAt: "2026",
},
  {
  id: "youtube-recorded-demo-01",
  platform: "youtube",
  title: "Recorded livestream / project update",
  description:
    "A recorded video pulled into the Social Hub so visitors can watch it without needing to hunt through the channel.",
  url: "https://www.youtube.com/watch?v=St5HCLvrr5Y",
  thumbnail: "/images/social/post-thumbnails/youtube-demo-01.png",
  publishedAt: "2023",
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
    url: "https://x.com/Deadman2496/status/2088254908147318862",
    thumbnail: "/images/social/post-thumbnails/x-placeholder.gif",
    publishedAt: "Future",
    isHiddenFeature: true,
  },
  {
  id: "twitch-vod-01",
  platform: "twitch",
  title: "Twitch stream replay",
  description:
    "A selected Twitch stream, clip, or VOD connected to live project work, gameplay testing, or portfolio progress.",
  url: "https://www.twitch.tv/deadman2496/videos",
  thumbnail: "/images/social/post-thumbnails/twitch-vod-01.jpg",
  publishedAt: "2026",
  },
  {
  id: "linkedin-future-update",
  platform: "linkedin",
  title: "Future LinkedIn update",
  description:
    "Reserved for a future LinkedIn post once professional updates are ready to highlight.",
  url: "https://www.linkedin.com/feed/update/urn:li:activity:7489399936418205696/",
  thumbnail: "/images/social/post-thumbnails/linkedin-placeholder.png",
  publishedAt: "Future",
  isHiddenFeature: true,
},
];