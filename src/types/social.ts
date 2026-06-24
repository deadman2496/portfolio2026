export type LivePlatformId =
  | "owncast"
  | "youtube"
  | "twitch"
  | "facebook"
  | "instagram";

export type LivePlatformStatus = {
  id: LivePlatformId;
  label: string;
  isLive: boolean;
  playableInline: boolean;
  title?: string;
  thumbnail?: string;
  embedId?: string;
  watchUrl?: string;
};

export type LiveStatusResponse = {
  checkedAt: string;
  platforms: LivePlatformStatus[];
};

export type SelectedSocialPost = {
  id: string;
  platform: "instagram" | "linkedin" | "x" | "youtube";
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  publishedAt?: string;
};