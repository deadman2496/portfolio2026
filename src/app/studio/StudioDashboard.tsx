"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import StudioExperiencePanel from "./StudioExperiencePanel";
import type {
  StudioContentInput,
  StudioContentItem,
  StudioContentType,
  StudioMediaType,
  StudioPlacement,
  StudioPlatform,
  StudioVisibility,
} from "@/types/studio";
import {
  detectPlatformFromUrl,
  suggestContentTypeFromUrl,
} from "@/lib/studio/detectPlatform";

type LiveStackService = {
  id: string;
  label: string;
  isReachable: boolean;
  status: string;
  error?: string;
};

type LiveStackResponse = {
  checkedAt: string;
  services: LiveStackService[];
};

type UploadTargetField = "thumbnail" | "beforeImage" | "afterImage" | "videoSrc";

type MediaUploadButtonProps = {
  label: string;
  targetField: UploadTargetField;
  accept: string;
  disabled?: boolean;
  onUpload: (file: File, targetField: UploadTargetField) => void;
};

function MediaUploadButton({
  label,
  targetField,
  accept,
  disabled = false,
  onUpload,
}: MediaUploadButtonProps) {
  return (
    <label
      className={[
        "inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white/70 transition hover:bg-white hover:text-slate-950",
        disabled ? "pointer-events-none opacity-50" : "",
      ].join(" ")}
    >
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (!file) return;

          onUpload(file, targetField);
          event.currentTarget.value = "";
        }}
      />
    </label>
  );
}

type StudioFormState = {
  id: string;
  title: string;
  description: string;
  url: string;
  platform: StudioPlatform | "";
  contentType: StudioContentType;
  thumbnail: string;
  publishedAt: string;
  tags: string;
  isFeatured: boolean;
  isHiddenFeature: boolean;
  visibility: StudioVisibility;
    placement: StudioPlacement;
    mediaType: StudioMediaType;
    beforeImage: string;
    afterImage: string;
    videoSrc: string;
    videoAutoplay: boolean;
};

const emptyForm: StudioFormState = {
  id: "",
  title: "",
  description: "",
  url: "",
  platform: "",
  contentType: "selected-post",
  thumbnail: "",
  publishedAt: "",
  tags: "",
  isFeatured: false,
  isHiddenFeature: false,
  visibility: "public",
placement: "selected-posts",
mediaType: "link",
beforeImage: "",
afterImage: "",
videoSrc: "",
videoAutoplay: false,
};

const platformOptions: Array<{
  value: StudioPlatform | "";
  label: string;
}> = [
  { value: "", label: "Auto / none" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitch", label: "Twitch" },
  { value: "x", label: "X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "owncast", label: "Owncast" },
  { value: "local", label: "Local" },
];

const contentTypeOptions: Array<{
  value: StudioContentType;
  label: string;
}> = [
  { value: "selected-post", label: "Selected Post" },
  { value: "project-video", label: "Project Video" },
  { value: "photoshop", label: "Photoshop / Visual" },
  { value: "repair", label: "Repair Content" },
  { value: "livestream-replay", label: "Livestream Replay" },
  { value: "portfolio-update", label: "Portfolio Update" },
  { value: "development-project", label: "Programming/development project"},
];

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function itemToForm(item: StudioContentItem): StudioFormState {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    url: item.url ?? "",
    platform: item.platform ?? "",
    contentType: item.contentType,
    thumbnail: item.thumbnail ?? "",
    publishedAt: item.publishedAt ?? "",
    tags: item.tags.join(", "),
    isFeatured: item.isFeatured,
    isHiddenFeature: item.isHiddenFeature,
    visibility: item.visibility ?? (item.isHiddenFeature ? "lab" : "public"),
    placement: item.placement ?? "selected-posts",
    mediaType: item.mediaType ?? "link",
    beforeImage: item.beforeImage ?? "",
    afterImage: item.afterImage ?? "",
    videoSrc: item.videoSrc ?? "",
    videoAutoplay: item.videoAutoplay ?? false,
  };
}

function formToInput(form: StudioFormState): StudioContentInput {
  return {
    id: form.id || undefined,
    title: form.title,
    description: form.description,
    url: form.url,
    platform: form.platform,
    contentType: form.contentType,
    thumbnail: form.thumbnail,
    publishedAt: form.publishedAt,
    tags: form.tags,
    isFeatured: form.isFeatured,
    isHiddenFeature: form.isHiddenFeature,
    visibility: form.visibility,
    placement: form.placement,
    mediaType: form.mediaType,
    beforeImage: form.beforeImage,
    afterImage: form.afterImage,
    videoSrc: form.videoSrc,
    videoAutoplay: form.videoAutoplay,
  };
}

export default function StudioDashboard() {
  const [token, setToken] = useState(() => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem("portfolio-studio-token") ?? "";
    });
  const [items, setItems] = useState<StudioContentItem[]>([]);
  const [form, setForm] = useState<StudioFormState>(emptyForm);
  const [liveStack, setLiveStack] = useState<LiveStackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const hasToken = token.trim().length > 0;

  const publicItems = useMemo(
  () => items.filter((item) => item.visibility === "public"),
  [items],
);

const hiddenItems = useMemo(
  () => items.filter((item) => item.visibility === "lab"),
  [items],
);
const draftItems = useMemo(
  () => items.filter((item) => item.visibility === "draft"),
  [items],
);

const [activeTab, setActiveTab] = useState<"content" | "experience">(
  "content",
);



  useEffect(() => {
    if (!token) return;

    window.localStorage.setItem("portfolio-studio-token", token);
  }, [token]);

  async function loadContent() {
    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/studio/content", {
        headers: getAuthHeaders(token),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Content request failed: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.items ?? []);
      setMessage("Studio content loaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load content.");
    } finally {
      setIsLoading(false);
    }
  }

  
  
  async function loadLiveStack() {
    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    try {
      const response = await fetch("/api/studio/live-stack", {
        headers: getAuthHeaders(token),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Live stack request failed: ${response.status}`);
      }

      const data = await response.json();
      setLiveStack(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load live stack.",
      );
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/studio/content", {
        method: "POST",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formToInput(form)),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? `Save failed: ${response.status}`);
      }

      const data = await response.json();

      setItems((currentItems) => {
        const nextItem = data.item as StudioContentItem;
        const existingIndex = currentItems.findIndex(
          (item) => item.id === nextItem.id,
        );

        if (existingIndex < 0) {
          return [nextItem, ...currentItems];
        }

        return currentItems.map((item) =>
          item.id === nextItem.id ? nextItem : item,
        );
      });

      setForm(emptyForm);
      setMessage("Content saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!hasToken) {
      setMessage("Add your Studio token first.");
      return;
    }

    const confirmed = window.confirm("Delete this Studio item?");

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/studio/content?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      setMessage("Content deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete.");
    }
  }

  async function handleTargetedUpload(
  file: File | null,
  targetField: UploadTargetField,
) {
  if (!file) return;

  if (!hasToken) {
    setMessage("Add your Studio token first.");
    return;
  }

  setIsUploading(true);
  setMessage("");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/studio/uploads", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message ?? `Upload failed: ${response.status}`);
    }

    const data = await response.json();

    setForm((currentForm) => ({
      ...currentForm,
      [targetField]: data.url,
    }));

    const labelByTarget: Record<UploadTargetField, string> = {
      thumbnail: "Thumbnail",
      beforeImage: "Before image",
      afterImage: "After image",
      videoSrc: "Video / GIF",
    };

    setMessage(`${labelByTarget[targetField]} uploaded.`);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "Unable to upload.");
  } finally {
    setIsUploading(false);
  }
  }

  function handleUrlChange(url: string) {
    const detectedPlatform = detectPlatformFromUrl(url);
    const suggestedType = suggestContentTypeFromUrl(url);

    setForm((currentForm) => ({
      ...currentForm,
      url,
      platform: currentForm.platform || detectedPlatform || "",
      contentType:
        currentForm.contentType === "selected-post"
          ? suggestedType
          : currentForm.contentType,
    }));
  }

  

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl md:p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-blue-300">
            Portfolio Studio
          </p>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">
                Content control room.
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
                Add selected posts, project videos, repair work, Photoshop
                content, thumbnails, and portfolio updates without manually
                pushing every image into Git.
              </p>
            </div>

            <Link
            href="/"
            className="inline-flex w-fit rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white/70 transition hover:bg-white hover:text-slate-950"
            >
            Back to site
            </Link>
          </div>
        </header>

        <section className="mb-8 rounded-[2rem] border border-white/10 bg-black/30 p-5">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-white/40">
            Studio Access Token
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste your Studio token"
              className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-blue-300/60"
            />

            <button
              type="button"
              onClick={() => {
                loadContent();
                loadLiveStack();
              }}
              disabled={isLoading}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-slate-950 transition hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Unlock Studio"}
            </button>
          </div>

          {message && (
            <p className="mt-3 text-sm font-bold text-blue-100/80">{message}</p>
          )}
        </section>
        

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={[
              "rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.16em] transition",
              activeTab === "content"
                ? "border-white bg-white text-slate-950"
                : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            Content
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={[
              "rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.16em] transition",
              activeTab === "experience"
                ? "border-white bg-white text-slate-950"
                : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            Experience
          </button>
        </div>
        
        {activeTab === "content" && (
        <>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                  Add / Edit Content
                </p>

                <h2 className="text-2xl font-black">Studio item</h2>
              </div>

              {form.id && (
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:bg-white hover:text-slate-950"
                >
                  New Item
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      title: event.target.value,
                    }))
                  }
                  required
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                  Link
                </label>
                <input
                  value={form.url}
                  onChange={(event) => handleUrlChange(event.target.value)}
                  placeholder="Paste YouTube, Twitch, Instagram, X, LinkedIn, Owncast, or project URL"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Platform
                  </label>
                  <select
                    value={form.platform}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        platform: event.target.value as StudioPlatform | "",
                      }))
                    }
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                  >
                    {platformOptions.map((option) => (
                      <option key={option.value || "auto"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Content Type
                  </label>
                  <select
                    value={form.contentType}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        contentType: event.target.value as StudioContentType,
                      }))
                    }
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                  >
                    {contentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Visibility
                    </label>
                    <select
                    value={form.visibility}
                    onChange={(event) =>
                        setForm((currentForm) => ({
                        ...currentForm,
                        visibility: event.target.value as StudioVisibility,
                        isHiddenFeature: event.target.value === "lab",
                        }))
                    }
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                    >
                    <option value="public">Public</option>
                    <option value="lab">Lab / Konami</option>
                    <option value="draft">Private Draft</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Placement
                    </label>
                    <select
                    value={form.placement}
                    onChange={(event) =>
                        setForm((currentForm) => ({
                        ...currentForm,
                        placement: event.target.value as StudioPlacement,
                        }))
                    }
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                    >
                    <option value="selected-posts">Selected Posts</option>
                    <option value="selected-projects">Selected Projects</option>
                    <option value="visual-bridge">Visual Bridge</option>
                    <option value="repair-work">Repair Work</option>
                    <option value="project-videos">Project Videos</option>
                    <option value="livestream-replays">Livestream Replays</option>
                    <option value="portfolio-updates">Portfolio Updates</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Media Type
                    </label>
                    <select
                    value={form.mediaType}
                    onChange={(event) =>
                        setForm((currentForm) => ({
                        ...currentForm,
                        mediaType: event.target.value as StudioMediaType,
                        }))
                    }
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                    >
                    <option value="link">Link</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="before-after">Before / After</option>
                    </select>
                </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      description: event.target.value,
                    }))
                  }
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-blue-300/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                  Thumbnail
                </label>

                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    value={form.thumbnail}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        thumbnail: event.target.value,
                      }))
                    }
                    placeholder="/studio-uploads/example.jpg"
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                  />

                    <MediaUploadButton
                      label={isUploading ? "Uploading..." : "Upload Thumbnail"}
                      targetField="thumbnail"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={isUploading}
                      onUpload={handleTargetedUpload}
                    />
                </div>

                {form.thumbnail && (
                <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <Image
                    src={form.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized
                    />
                </div>
                )}

                {form.mediaType === "before-after" && (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                        Before Image
                    </label>
                    <input
                        value={form.beforeImage}
                        onChange={(event) =>
                        setForm((currentForm) => ({
                            ...currentForm,
                            beforeImage: event.target.value,
                        }))
                        }
                        placeholder="/studio-uploads/before-image.jpg"
                        className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                    />
                    </div>

                    <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                        After Image
                    </label>
                    <input
                        value={form.afterImage}
                        onChange={(event) =>
                        setForm((currentForm) => ({
                            ...currentForm,
                            afterImage: event.target.value,
                        }))
                        }
                        placeholder="/studio-uploads/after-image.jpg"
                        className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                    />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 md:col-span-2">
                      <MediaUploadButton
                        label="Upload Before Image"
                        targetField="beforeImage"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isUploading}
                        onUpload={handleTargetedUpload}
                      />

                      <MediaUploadButton
                        label="Upload After Image"
                        targetField="afterImage"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isUploading}
                        onUpload={handleTargetedUpload}
                      />
                    </div>
                </div>
                )}

                {form.mediaType === "video" && (
                <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Video / GIF Source
                    </label>
                    <input
                    value={form.videoSrc}
                    onChange={(event) =>
                        setForm((currentForm) => ({
                        ...currentForm,
                        videoSrc: event.target.value,
                        }))
                    }
                    placeholder="/studio-uploads/demo.mp4"
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"

                    />

                    <div className="mt-4">
                      <MediaUploadButton
                        label="Upload Video / GIF"
                        targetField="videoSrc"
                        accept="video/mp4,video/webm,image/gif"
                        disabled={isUploading}
                        onUpload={handleTargetedUpload}
                      />
                    </div>

                    <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/70">
                    <input
                      type="checkbox"
                      checked={form.videoAutoplay}
                      onChange={(event) =>
                        setForm((currentForm) => ({
                          ...currentForm,
                          videoAutoplay: event.target.checked,
                        }))
                      }
                    />
                    Autoplay video on load
                  </label>
                </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Published At
                  </label>
                  <input
                    value={form.publishedAt}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        publishedAt: event.target.value,
                      }))
                    }
                    placeholder="2026, Aug 2026, or exact date"
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-white/40">
                    Tags
                  </label>
                  <input
                    value={form.tags}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        tags: event.target.value,
                      }))
                    }
                    placeholder="portfolio, repair, youtube"
                    className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white outline-none focus:border-blue-300/60"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/70">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        isFeatured: event.target.checked,
                      }))
                    }
                  />
                  Featured
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-2xl bg-blue-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:scale-[1.01] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : form.id ? "Update Item" : "Save Item"}
              </button>
            </form>
          </section>

          <aside className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                    Live Stack
                  </p>
                  <h2 className="text-2xl font-black">Read-only status</h2>
                </div>

                <button
                  type="button"
                  onClick={loadLiveStack}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:bg-white hover:text-slate-950"
                >
                  Refresh
                </button>
              </div>

              {liveStack ? (
                <div className="space-y-3">
                  {liveStack.services.map((service) => (
                    <div
                      key={service.id}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-black">{service.label}</p>
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em]",
                            service.isReachable
                              ? "bg-green-300/15 text-green-100"
                              : "bg-red-300/15 text-red-100",
                          ].join(" ")}
                        >
                          {service.isReachable ? "Online" : "Check"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/50">
                        {service.status}
                      </p>

                      {service.error && (
                        <p className="mt-2 text-xs text-red-100/70">
                          {service.error}
                        </p>
                      )}
                    </div>
                  ))}

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                    Checked: {new Date(liveStack.checkedAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-6 text-white/50">
                  Unlock Studio or press refresh to check the portfolio live API
                  and Restreamer reachability.
                </p>
              )}
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                    Saved Items
                  </p>
                  <h2 className="text-2xl font-black">{items.length} total</h2>
                </div>

                <button
                  type="button"
                  onClick={loadContent}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:bg-white hover:text-slate-950"
                >
                  Reload
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-3xl font-black">{publicItems.length}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                    Public
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-3xl font-black">{hiddenItems.length}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                    Hidden
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
        </>
        )}

        {activeTab === "experience" && (
          <StudioExperiencePanel token={token} hasToken={hasToken} />
        )}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="mb-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
              Content Library
            </p>
            <h2 className="text-2xl font-black">Saved Studio content</h2>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-black/25"
                >
                  <div className="relative aspect-video bg-slate-900">
                    {item.thumbnail ? (
                    <Image
                        src={item.thumbnail}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                    />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-black uppercase tracking-[0.2em] text-white/30">
                        No thumbnail
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/75">
                      {item.platform ?? "No platform"}
                    </div>

                    {item.isHiddenFeature && (
                      <div className="absolute right-4 top-4 rounded-full bg-blue-300/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-blue-100">
                        Hidden
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                      {item.contentType}
                    </p>

                    <h3 className="text-xl font-black">{item.title}</h3>

                    {item.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/55">
                        {item.description}
                      </p>
                    )}

                    {item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/45"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setForm(itemToForm(item));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950"
                      >
                        Edit
                      </button>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/60 transition hover:bg-white hover:text-slate-950"
                        >
                          Open
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full border border-red-300/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-red-100/70 transition hover:bg-red-300 hover:text-slate-950"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
              <p className="text-lg font-black">No Studio items yet.</p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/50">
                Add your first post, video, repair showcase, or Photoshop update
                using the form above.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}