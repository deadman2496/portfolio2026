import { NextResponse } from "next/server";
import type { LivePlatformId, LivePlatformStatus } from "@/types/social";

export const dynamic = "force-dynamic";

const OWNCAST_WATCH_URL =
  process.env.OWNCAST_WATCH_URL ?? "https://live.alexismarroquin.nyc";

const OWNCAST_EMBED_URL =
  process.env.OWNCAST_EMBED_URL ??
  "https://live.alexismarroquin.nyc/embed/video?initiallyMuted=true";

const platformLabels: Record<LivePlatformId, string> = {
  owncast: "Personal Stream",
  youtube: "YouTube",
  twitch: "Twitch",
  instagram: "Instagram Live",
  facebook: "Facebook Live"
};

const platformDescriptions: Record<LivePlatformId, string> = {
  owncast:
    "The Main Live Feed directly from the computer self-hosted.",
  youtube:
    "Reserved for YouTube livestreams and selected video broadcasts.",
  twitch:
    "Reserved for Twitch streams when the account and stream setup are ready.",
  instagram:
    "Reserved for Instagram Live status and a direct profile/live link.",
    facebook:
    "Reserved for Facebook Live status and a direct profile/live link"
};

function getMockLivePlatformIds() {
  return (process.env.MOCK_LIVE_PLATFORM_IDS ?? "")
    .split(",")
    .map((platformId) => platformId.trim().toLowerCase())
    .filter(Boolean);
}

function isMockLive(platformId: LivePlatformId) {
  return getMockLivePlatformIds().includes(platformId);
}

function buildPlatformStatus(platformId: LivePlatformId): LivePlatformStatus {
  const isLive = isMockLive(platformId);

   if (platformId === "owncast") {
    return {
      id: "owncast",
      label: platformLabels.owncast,
      description: platformDescriptions.owncast,
      isLive,
      playableInline: true,
      statusLabel: isLive ? "Live now" : "Offline",
      embedUrl: OWNCAST_EMBED_URL,
      watchUrl: OWNCAST_WATCH_URL,
    };
  }

  if (platformId === "youtube") {
  return {
    id: "youtube",
    label: "YouTube Live",
    description:
      "YouTube livestreams open directly on YouTube when available.",
    isLive,
    playableInline: false,
    statusLabel: isLive ? "Live on YouTube" : "External only",
    watchUrl:
      process.env.YOUTUBE_LIVE_URL ??
      process.env.YOUTUBE_CHANNEL_URL ??
      "https://www.youtube.com/",
  };
}


  return {
    id: platformId,
    label: platformLabels[platformId],
    description: platformDescriptions[platformId],
    isLive,
    playableInline: platformId !== "instagram",
    statusLabel: isLive ? "Live now" : "Offline",
    watchUrl: undefined,
    embedUrl: undefined,
  };
}

export async function GET() {
  const platforms: LivePlatformStatus[] = [
    buildPlatformStatus("owncast"),
    buildPlatformStatus("youtube"),
    buildPlatformStatus("twitch"),
    buildPlatformStatus("instagram"),
    buildPlatformStatus("facebook"),
  ];

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    platforms,
  });
}