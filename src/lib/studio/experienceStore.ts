import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  studioExperienceTypes,
  studioExperienceVisibilities,
  studioExperienceFocusTags,
  type StudioExperienceFocusTag,
  type StudioExperienceInput,
  type StudioExperienceItem,
  type StudioExperienceType,
  type StudioExperienceVisibility,
} from "@/types/studioExperience";

const fallbackExperiencePath = path.join(
  process.cwd(),
  "studio-data",
  "experience.json",
);

function cleanFocusTags(value: unknown): StudioExperienceFocusTag[] {
  const rawItems = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n|,/)
      : [];

  return rawItems
    .map((item) => String(item).trim())
    .filter((item): item is StudioExperienceFocusTag =>
      studioExperienceFocusTags.includes(item as StudioExperienceFocusTag),
    );
}

function getExperiencePath() {
  return process.env.STUDIO_EXPERIENCE_PATH ?? fallbackExperiencePath;
}

async function ensureExperienceDirectory() {
  await mkdir(path.dirname(getExperiencePath()), {
    recursive: true,
  });
}

function cleanText(value: unknown) {
  if (typeof value !== "string") return undefined;

  const cleaned = value.trim();

  return cleaned.length > 0 ? cleaned : undefined;
}

function cleanList(value: StudioExperienceInput["bullets"]) {
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function isStudioExperienceType(value: unknown): value is StudioExperienceType {
  return (
    typeof value === "string" &&
    studioExperienceTypes.includes(value as StudioExperienceType)
  );
}

function isStudioExperienceVisibility(
  value: unknown,
): value is StudioExperienceVisibility {
  return (
    typeof value === "string" &&
    studioExperienceVisibilities.includes(
      value as StudioExperienceVisibility,
    )
  );
}

function getSortOrder(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function normalizeExperienceItem(
  item: Partial<StudioExperienceItem>,
): StudioExperienceItem | null {
  const organization = cleanText(item.organization);
  const role = cleanText(item.role);
  const startDate = cleanText(item.startDate);

  if (!item.id || !organization || !role || !startDate) {
    return null;
  }

  const type = isStudioExperienceType(item.type) ? item.type : "work";

  const visibility = isStudioExperienceVisibility(item.visibility)
    ? item.visibility
    : "draft";

  const isCurrent = Boolean(item.isCurrent);

  return {
    id: item.id,
    type,
    organization,
    role,
    location: cleanText(item.location),
    startDate,
    endDate: isCurrent ? undefined : cleanText(item.endDate),
    isCurrent,
    summary: cleanText(item.summary),
    bullets: Array.isArray(item.bullets) ? item.bullets : [],
    skills: Array.isArray(item.skills) ? item.skills : [],
    visibility,
    sortOrder: getSortOrder(item.sortOrder),
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
    focusTags: cleanFocusTags(item.focusTags),
  };
}

export async function readStudioExperience(): Promise<StudioExperienceItem[]> {
  try {
    const content = await readFile(getExperiencePath(), "utf-8");
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => normalizeExperienceItem(item))
      .filter((item): item is StudioExperienceItem => Boolean(item))
      .sort((a, b) => b.sortOrder - a.sortOrder);
  } catch {
    return [];
  }
}

async function writeStudioExperience(items: StudioExperienceItem[]) {
  await ensureExperienceDirectory();

  await writeFile(getExperiencePath(), `${JSON.stringify(items, null, 2)}\n`);
}

export async function upsertStudioExperience(input: StudioExperienceInput) {
  const items = await readStudioExperience();

  const existingItem = input.id
    ? items.find((item) => item.id === input.id)
    : undefined;

  const organization = cleanText(input.organization);

  if (!organization) {
    throw new Error("Organization is required.");
  }

  const role = cleanText(input.role);

  if (!role) {
    throw new Error("Role is required.");
  }

  const startDate = cleanText(input.startDate);

  if (!startDate) {
    throw new Error("Start date is required.");
  }

  const type = isStudioExperienceType(input.type)
    ? input.type
    : existingItem?.type ?? "work";

  const visibility = isStudioExperienceVisibility(input.visibility)
    ? input.visibility
    : existingItem?.visibility ?? "draft";

  const isCurrent = Boolean(input.isCurrent);
  const now = new Date().toISOString();

  const nextItem: StudioExperienceItem = {
    id: existingItem?.id ?? randomUUID(),
    type,
    organization,
    role,
    location: cleanText(input.location),
    startDate,
    endDate: isCurrent ? undefined : cleanText(input.endDate),
    isCurrent,
    summary: cleanText(input.summary),
    bullets: cleanList(input.bullets),
    skills: cleanList(input.skills),
    visibility,
    sortOrder:
      typeof input.sortOrder === "number"
        ? input.sortOrder
        : existingItem?.sortOrder ?? 0,
    createdAt: existingItem?.createdAt ?? now,
    updatedAt: now,
    focusTags: cleanFocusTags(input.focusTags)
  };

  const nextItems = existingItem
    ? items.map((item) => (item.id === existingItem.id ? nextItem : item))
    : [nextItem, ...items];

  await writeStudioExperience(nextItems);

  return nextItem;
}

export async function deleteStudioExperience(id: string) {
  const items = await readStudioExperience();
  const nextItems = items.filter((item) => item.id !== id);

  await writeStudioExperience(nextItems);

  return {
    deleted: nextItems.length !== items.length,
  };
}