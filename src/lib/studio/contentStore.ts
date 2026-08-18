import { randomUUID } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  studioContentTypes,
  studioMediaTypes,
  studioPlacements,
  studioPlatforms,
  studioVisibilities,
  type StudioContentInput,
  type StudioContentItem,
  type StudioContentType,
  type StudioMediaType,
  type StudioPlacement,
  type StudioPlatform,
  type StudioVisibility,
} from "@/types/studio";
import { detectPlatformFromUrl, suggestContentTypeFromUrl } from "@/lib/studio/detectPlatform";

const fallbackContentPath = path.join(process.cwd(), "studio-data", "content.json");

function isStudioVisibility(value: unknown): value is StudioVisibility {
  return (
    typeof value === "string" &&
    studioVisibilities.includes(value as StudioVisibility)
  );
}

function isStudioPlacement(value: unknown): value is StudioPlacement {
  return (
    typeof value === "string" &&
    studioPlacements.includes(value as StudioPlacement)
  );
}

function isStudioMediaType(value: unknown): value is StudioMediaType {
  return (
    typeof value === "string" &&
    studioMediaTypes.includes(value as StudioMediaType)
  );
}

function getDefaultPlacement(): StudioPlacement {
  return "selected-posts";
}

function getDefaultMediaType(input: StudioContentInput): StudioMediaType {
  if (cleanText(input.beforeImage) || cleanText(input.afterImage)) {
    return "before-after";
  }

  if (cleanText(input.videoSrc)) {
    return "video";
  }

  if (cleanText(input.thumbnail)) {
    return "image";
  }

  return "link";
}

function getVisibility(input: StudioContentInput): StudioVisibility {
  if (isStudioVisibility(input.visibility)) {
    return input.visibility;
  }

  if (input.isHiddenFeature) {
    return "lab";
  }

  return "public";
}

function getContentPath() {
  return process.env.STUDIO_CONTENT_PATH ?? fallbackContentPath;
}

function isStudioPlatform(value: unknown): value is StudioPlatform {
  return typeof value === "string" && studioPlatforms.includes(value as StudioPlatform);
}

function isStudioContentType(value: unknown): value is StudioContentType {
  return (
    typeof value === "string" &&
    studioContentTypes.includes(value as StudioContentType)
  );
}

function cleanText(value: unknown) {
  if (typeof value !== "string") return undefined;

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function cleanTags(value: StudioContentInput["tags"]) {
  if (Array.isArray(value)) {
    return value
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

async function ensureContentFile() {
  const contentPath = getContentPath();

  await mkdir(path.dirname(contentPath), {
    recursive: true,
  });

  try {
    await access(contentPath);
  } catch {
    await writeFile(contentPath, "[]\n", "utf-8");
  }
}

export async function readStudioContent(): Promise<StudioContentItem[]> {
  await ensureContentFile();

  const rawContent = await readFile(getContentPath(), "utf-8");

  try {
    const parsedContent = JSON.parse(rawContent);

    if (!Array.isArray(parsedContent)) {
      return [];
    }

    return parsedContent as StudioContentItem[];
  } catch {
    return [];
  }
}

export async function writeStudioContent(items: StudioContentItem[]) {
  await ensureContentFile();

  await writeFile(getContentPath(), `${JSON.stringify(items, null, 2)}\n`, "utf-8");
}

export async function upsertStudioContent(input: StudioContentInput) {
  const items = await readStudioContent();
  const existingIndex = input.id
    ? items.findIndex((item) => item.id === input.id)
    : -1;
  const existingItem = existingIndex >= 0 ? items[existingIndex] : undefined;
  const now = new Date().toISOString();

  const url = cleanText(input.url);
  const detectedPlatform = url ? detectPlatformFromUrl(url) : undefined;

  const contentType = isStudioContentType(input.contentType)
    ? input.contentType
    : url
      ? suggestContentTypeFromUrl(url)
      : "selected-post";

    const visibility = getVisibility(input);

    const placement = isStudioPlacement(input.placement)
    ? input.placement
    : getDefaultPlacement();

    const mediaType = isStudioMediaType(input.mediaType)
    ? input.mediaType
    : getDefaultMediaType(input);

  const platform = isStudioPlatform(input.platform)
    ? input.platform
    : detectedPlatform;

  const title = cleanText(input.title);

  if (!title) {
    throw new Error("A title is required.");
  }

  const nextItem: StudioContentItem = {
  id: existingItem?.id ?? randomUUID(),
  title,
  description: cleanText(input.description),
  url,
  platform,
  contentType,
  visibility,
  placement,
  mediaType,
  thumbnail: cleanText(input.thumbnail),
  beforeImage: cleanText(input.beforeImage),
  afterImage: cleanText(input.afterImage),
  videoSrc: cleanText(input.videoSrc),
  videoAutoplay: Boolean(input.videoAutoplay),
  publishedAt: cleanText(input.publishedAt),
  tags: cleanTags(input.tags),
  isFeatured: Boolean(input.isFeatured),
  isHiddenFeature: visibility === "lab",
  createdAt: existingItem?.createdAt ?? now,
  updatedAt: now,
};

  if (existingIndex >= 0) {
    items[existingIndex] = nextItem;
  } else {
    items.unshift(nextItem);
  }

  await writeStudioContent(items);

  return nextItem;
}

export async function deleteStudioContent(id: string) {
  const items = await readStudioContent();
  const nextItems = items.filter((item) => item.id !== id);

  await writeStudioContent(nextItems);

  return {
    deleted: nextItems.length !== items.length,
  };
}