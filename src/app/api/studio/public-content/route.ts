import { NextResponse } from "next/server";
import { readStudioContent } from "@/lib/studio/contentStore";
import { studioPlacements, type StudioPlacement } from "@/types/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isStudioPlacement(value: unknown): value is StudioPlacement {
  return (
    typeof value === "string" &&
    studioPlacements.includes(value as StudioPlacement)
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedPlacement = url.searchParams.get("placement");
  const includeLab = url.searchParams.get("lab") === "true";

  const placement = isStudioPlacement(requestedPlacement)
    ? requestedPlacement
    : "selected-posts";

  const items = await readStudioContent();

  const publicItems = items
    .filter((item) => item.placement === placement)
    .filter((item) => item.visibility !== "draft")
    .filter(
      (item) =>
        item.visibility === "public" ||
        (includeLab && item.visibility === "lab"),
    )
    .map((item) => ({
      id: item.id,
      platform: item.platform,
      title: item.title,
      description: item.description,
      url: item.url,
      contentType: item.contentType,
      placement: item.placement,
      mediaType: item.mediaType,
      thumbnail: item.thumbnail,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
      videoSrc: item.videoSrc,
      videoAutoplay: item.videoAutoplay,
      publishedAt: item.publishedAt,
      isHiddenFeature: item.visibility === "lab",
      tags: item.tags,
      visibility: item.visibility,
    }))
    .filter((item) => item.title);

  return NextResponse.json({
    items: publicItems,
  });
}