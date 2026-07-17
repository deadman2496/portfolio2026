export type LivePlatformId =
  | "owncast"
  | "youtube"
  | "twitch"
  | "facebook"
  | "instagram";

export type SelectedSocialPlatform =
  | "instagram"
  | "youtube"
  | "x"
  | "Linkedin";

export type LivePlatformStatus = {
  id: LivePlatformId;
  label: string;
  description: string;
  isLive: boolean;
  playableInline: boolean;
  statusLabel?: string;
  title?: string;
  thumbnail?: string;
  embedId?: string;
  embedUrl?: string;
  watchUrl?: string;
};

export type LiveStatusResponse = {
  checkedAt: string;
  platforms: LivePlatformStatus[];
};

export type SelectedSocialPost = {
  id: string;
  platform: SelectedSocialPlatform;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  publishedAt?: string;
  isHiddenFeature?: boolean;
};

export type SocialHubTabId =
  | "live"
  | "instagram-stories"
  | "selected-posts";

export type SocialHubTab = {
  id: SocialHubTabId;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  isEnabled: boolean;
  isHiddenFeature?: boolean;
};