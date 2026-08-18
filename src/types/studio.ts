export const studioPlatforms = [
  "instagram",
  "youtube",
  "twitch",
  "x",
  "linkedin",
  "owncast",
  "local",
] as const;

export type StudioPlatform = (typeof studioPlatforms)[number];

export const studioContentTypes = [
  "selected-post",
  "project-video",
  "photoshop",
  "repair",
  "livestream-replay",
  "portfolio-update",
  "development-project"
] as const;

export type StudioContentType = (typeof studioContentTypes)[number];

export const studioVisibilities = ["public", "lab", "draft"] as const;

export type StudioVisibility = (typeof studioVisibilities)[number];

export const studioPlacements = [
  "selected-posts",
  "selected-projects",
  "visual-bridge",
  "repair-work",
  "project-videos",
  "livestream-replays",
  "portfolio-updates",
] as const;

export type StudioPlacement = (typeof studioPlacements)[number];

export const studioMediaTypes = ["link", "image", "video", "before-after"] as const;

export type StudioMediaType = (typeof studioMediaTypes)[number];

export type StudioContentItem = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  platform?: StudioPlatform;
  contentType: StudioContentType;
  visibility: StudioVisibility;
  placement: StudioPlacement;
  mediaType: StudioMediaType;
  thumbnail?: string;
  beforeImage?: string;
  afterImage?: string;
  videoSrc?: string;
  videoAutoplay: boolean;
  publishedAt?: string;
  tags: string[];
  isFeatured: boolean;

  /**
   * Legacy compatibility for the current lab/Konami UI.
   * New Studio logic should prefer `visibility`.
   */
  isHiddenFeature: boolean;

  createdAt: string;
  updatedAt: string;
};

export type StudioContentInput = {
  id?: string;
  title?: string;
  description?: string;
  url?: string;
  platform?: StudioPlatform | "";
  contentType?: StudioContentType;
  visibility?: StudioVisibility;
  placement?: StudioPlacement;
  mediaType?: StudioMediaType;
  thumbnail?: string;
  beforeImage?: string;
  afterImage?: string;
  videoSrc?: string;
  videoAutoplay?: boolean;
  publishedAt?: string;
  tags?: string[] | string;
  isFeatured?: boolean;
  isHiddenFeature?: boolean;
};