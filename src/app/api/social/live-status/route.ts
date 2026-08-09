import { NextResponse } from "next/server";
import type { LivePlatformId, LivePlatformStatus } from "@/types/social";

export const dynamic = "force-dynamic";

type OwncastStatusResponse = {
  online?: boolean;
  streamTitle?: string;
  viewerCount?: number;
};

type PlatformCheckStatus = {
  isLive: boolean;
  title?: string;
  thumbnail?: string;
  viewerCount?: number;
};

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type TwitchStreamResponse = {
  data?: Array<{
    id: string;
    title?: string;
    game_name?: string;
    viewer_count?: number;
    thumbnail_url?: string;
    started_at?: string;
    user_login?: string;
  }>;
};

let cachedTwitchToken:
  | {
      accessToken: string;
      expiresAt: number;
    }
  | undefined;

const OWNCAST_BASE_URL =
  process.env.OWNCAST_BASE_URL ?? "https://live.alexismarroquin.nyc";

const OWNCAST_WATCH_URL =
  process.env.OWNCAST_WATCH_URL ?? OWNCAST_BASE_URL;

const OWNCAST_EMBED_URL =
  process.env.OWNCAST_EMBED_URL ??
  `${OWNCAST_BASE_URL}/embed/video?initiallyMuted=true`;

const TWITCH_CHANNEL_NAME = process.env.TWITCH_CHANNEL_NAME ?? "";

const TWITCH_WATCH_URL =
  process.env.TWITCH_WATCH_URL ??
  (TWITCH_CHANNEL_NAME
    ? `https://www.twitch.tv/${TWITCH_CHANNEL_NAME}`
    : "https://www.twitch.tv/");

const YOUTUBE_CHANNEL_URL =
  process.env.YOUTUBE_CHANNEL_URL ?? "https://www.youtube.com/";

const INSTAGRAM_PROFILE_URL =
  process.env.INSTAGRAM_PROFILE_URL ?? "https://www.instagram.com/";

const FACEBOOK_PROFILE_URL =
  process.env.FACEBOOK_PROFILE_URL ?? "https://www.facebook.com/";

const platformLabels: Record<LivePlatformId, string> = {
  owncast: "Personal Stream",
  youtube: "YouTube Live",
  twitch: "Twitch",
  instagram: "Instagram Live",
  facebook: "Facebook Live",
};

const platformDescriptions: Record<LivePlatformId, string> = {
  owncast:
    "The main personal livestream powered by the self-hosted stream server.",
  twitch:
    "A Twitch mirror for game streams, project streams, and live experiments.",
  youtube:
    "Reserved for YouTube livestreams and selected recorded video updates.",
  instagram:
    "Reserved for Instagram posts, stories, and live links once the platform flow is worth wiring in.",
  facebook:
    "Reserved for Facebook Live if platform access becomes useful again.",
};

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function getForcedLivePlatformIds() {
  return (process.env.MOCK_LIVE_PLATFORM_IDS ?? "")
    .split(",")
    .map((platformId) => platformId.trim().toLowerCase())
    .filter(Boolean);
}

function isForcedLive(platformId: LivePlatformId) {
  return getForcedLivePlatformIds().includes(platformId);
}

function getTwitchParentDomains() {
  return (
    process.env.TWITCH_PARENT_DOMAINS ??
    "alexismarroquin.nyc,www.alexismarroquin.nyc,localhost"
  )
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean)
    .map((domain) =>
      domain
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .split(":")[0],
    );
}

function buildTwitchEmbedUrl() {
  if (!TWITCH_CHANNEL_NAME) return undefined;

  const params = new URLSearchParams({
    channel: TWITCH_CHANNEL_NAME,
    muted: "true",
  });

  getTwitchParentDomains().forEach((domain) => {
    params.append("parent", domain);
  });

  return `https://player.twitch.tv/?${params.toString()}`;
}

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getOwncastLiveStatus(): Promise<PlatformCheckStatus> {
  try {
    const response = await fetchWithTimeout(
      `${normalizeBaseUrl(OWNCAST_BASE_URL)}/api/status`,
    );

    if (!response.ok) {
  return {
    isLive: false,
    title: `Owncast status check failed: ${response.status}`,
  };
}

    const data = (await response.json()) as OwncastStatusResponse;

    return {
      isLive: Boolean(data.online),
      title: data.streamTitle,
      viewerCount: data.viewerCount,
    };
  } catch {
  return {
    isLive: false,
    title: "Owncast status check failed before response.",
  };
}
}

async function getTwitchAppAccessToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) return undefined;

  const now = Date.now();

  if (cachedTwitchToken && cachedTwitchToken.expiresAt > now + 60_000) {
    return cachedTwitchToken.accessToken;
  }

  try {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    const response = await fetchWithTimeout(
      "https://id.twitch.tv/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    if (!response.ok) return undefined;

    const data = (await response.json()) as TwitchTokenResponse;

    cachedTwitchToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    return cachedTwitchToken.accessToken;
  } catch {
    return undefined;
  }
}

async function getTwitchLiveStatus(): Promise<PlatformCheckStatus> {
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!clientId || !TWITCH_CHANNEL_NAME) {
    return { isLive: false };
  }

  try {
    const accessToken = await getTwitchAppAccessToken();

    if (!accessToken) {
      return { isLive: false };
    }

    const params = new URLSearchParams({
      user_login: TWITCH_CHANNEL_NAME,
    });

    const response = await fetchWithTimeout(
      `https://api.twitch.tv/helix/streams?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId,
        },
      },
    );

    if (!response.ok) {
  return {
    isLive: false,
    title: `Twitch status check failed: ${response.status}`,
  };
}

    const data = (await response.json()) as TwitchStreamResponse;
    const stream = data.data?.[0];

    return {
      isLive: Boolean(stream),
      title: stream?.title,
      thumbnail: stream?.thumbnail_url
        ?.replace("{width}", "1280")
        .replace("{height}", "720"),
      viewerCount: stream?.viewer_count,
    };
  } catch {
  return {
    isLive: false,
    title: "Twitch status check failed before response.",
  };
}

  
}

function buildOwncastPlatformStatus(
  owncastStatus: PlatformCheckStatus,
): LivePlatformStatus {
  const isLive = owncastStatus.isLive || isForcedLive("owncast");



  return {
    id: "owncast",
    label: platformLabels.owncast,
    description: platformDescriptions.owncast,
    isLive,
    playableInline: true,
    statusLabel: isLive ? "Live now" : "Offline",
    title: owncastStatus.title,
    embedUrl: OWNCAST_EMBED_URL,
    watchUrl: OWNCAST_WATCH_URL,
  };

  
}

function buildTwitchPlatformStatus(
  twitchStatus: PlatformCheckStatus,
): LivePlatformStatus {
  const isLive = twitchStatus.isLive || isForcedLive("twitch");

  return {
    id: "twitch",
    label: platformLabels.twitch,
    description: platformDescriptions.twitch,
    isLive,
    playableInline: true,
    statusLabel: isLive ? "Live on Twitch" : "Offline",
    title: twitchStatus.title,
    thumbnail: twitchStatus.thumbnail,
    embedUrl: buildTwitchEmbedUrl(),
    watchUrl: TWITCH_WATCH_URL,
  };
}

function buildReservedPlatformStatus(
  platformId: Extract<LivePlatformId, "youtube" | "instagram" | "facebook">,
): LivePlatformStatus {
  const reservedUrls: Record<
    Extract<LivePlatformId, "youtube" | "instagram" | "facebook">,
    string
  > = {
    youtube: YOUTUBE_CHANNEL_URL,
    instagram: INSTAGRAM_PROFILE_URL,
    facebook: FACEBOOK_PROFILE_URL,
  };

  return {
    id: platformId,
    label: platformLabels[platformId],
    description: platformDescriptions[platformId],
    isLive: isForcedLive(platformId),
    playableInline: false,
    statusLabel: isForcedLive(platformId) ? "Testing live" : "Reserved",
    watchUrl: reservedUrls[platformId],
  };
}

export async function GET() {
  const [owncastStatus, twitchStatus] = await Promise.all([
    getOwncastLiveStatus(),
    getTwitchLiveStatus(),
  ]);

  const platforms: LivePlatformStatus[] = [
    buildOwncastPlatformStatus(owncastStatus),
    buildTwitchPlatformStatus(twitchStatus),
    buildReservedPlatformStatus("youtube"),
    buildReservedPlatformStatus("instagram"),
    buildReservedPlatformStatus("facebook"),
  ];

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    platforms,
  });
}