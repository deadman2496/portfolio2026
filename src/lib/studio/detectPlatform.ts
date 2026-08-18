import type { StudioContentType, StudioPlatform } from "@/types/studio";

export function detectPlatformFromUrl(url: string): StudioPlatform | undefined {
  if (!url.trim()) return undefined;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname === "youtu.be" || hostname.endsWith("youtube.com")) {
      return "youtube";
    }

    if (hostname.endsWith("twitch.tv")) {
      return "twitch";
    }

    if (hostname.endsWith("instagram.com")) {
      return "instagram";
    }

    if (hostname === "x.com" || hostname.endsWith("twitter.com")) {
      return "x";
    }

    if (hostname.endsWith("linkedin.com")) {
      return "linkedin";
    }

    if (hostname.includes("owncast") || hostname.includes("live.alexismarroquin.nyc")) {
      return "owncast";
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export function suggestContentTypeFromUrl(url: string): StudioContentType {
  const platform = detectPlatformFromUrl(url);

  if (platform === "youtube") {
    return "project-video";
  }

  if (platform === "twitch" || platform === "owncast") {
    return "livestream-replay";
  }

  return "selected-post";
}