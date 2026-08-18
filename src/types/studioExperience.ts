export const studioExperienceTypes = [
  "work",
  "project",
  "education",
  "certification",
  "volunteer",
] as const;

export type StudioExperienceType = (typeof studioExperienceTypes)[number];

export const studioExperienceVisibilities = ["public", "lab", "draft"] as const;

export type StudioExperienceVisibility =
  (typeof studioExperienceVisibilities)[number];

export type StudioExperienceItem = {
  id: string;
  type: StudioExperienceType;
  organization: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  summary?: string;
  bullets: string[];
  skills: string[];
  visibility: StudioExperienceVisibility;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  focusTags: StudioExperienceFocusTag[];
};

export type StudioExperienceInput = {
  id?: string;
  type?: StudioExperienceType;
  organization?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  summary?: string;
  bullets?: string[] | string;
  skills?: string[] | string;
  visibility?: StudioExperienceVisibility;
  sortOrder?: number;
  focusTags?: StudioExperienceFocusTag[] | string;
};

export const studioExperienceFocusTags = [
  "general",
  "it-technician",
  "developer",
  "supervisor",
  "operations",
  "customer-support",
  "field-operations",
  "repair",
  "networking",
  "leadership",
] as const;

export type StudioExperienceFocusTag =
  (typeof studioExperienceFocusTags)[number];