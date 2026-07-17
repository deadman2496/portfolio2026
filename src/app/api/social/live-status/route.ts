import { NextResponse } from "next/server";
import type { LivePlatformId, LivePlatformStatus } from "@/types/social";

export const dynamic = "force-dynamic";

const platformLabels: Record<LivePlatformId, string> = {
  owncast: "Personal Stream",
  youtube: "YouTube",
  twitch: "Twitch",
  instagram: "Instagram Live",
  facebook: "Facebook Live"
};

const platformDescriptions: Record<LivePlatformId, string> = {
  owncast:
    "The default stream home base. This will eventually connect to your Owncast server.",
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