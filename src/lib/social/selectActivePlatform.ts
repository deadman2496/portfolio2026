import type {
  LivePlatformId,
  LivePlatformStatus,
} from "@/types/social";

export function selectActivePlatform(
  platforms: LivePlatformStatus[],
): LivePlatformId {
  const externalLivePlatforms = platforms.filter(
    (platform) => platform.id !== "owncast" && platform.isLive,
  );

  if (externalLivePlatforms.length === 1) {
    return externalLivePlatforms[0].id;
  }

  return "owncast";
}