"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import BeforeAfterSlider from "@/components/projects/BeforeAfterSlider";

type StudioProjectItem = {
  id: string;
  platform?: string;
  title: string;
  description?: string;
  url?: string;
  contentType?: string;
  placement?: string;
  mediaType?: "link" | "image" | "video" | "before-after";
  thumbnail?: string;
  beforeImage?: string;
  afterImage?: string;
  videoSrc?: string;
  videoAutoplay?: boolean;
  publishedAt?: string;
  tags?: string[];
  isHiddenFeature?: boolean;
};

type StudioSelectedProjectsProps = {
  showHiddenProjects?: boolean;
};

function getProjectLabel(item: StudioProjectItem) {
  switch (item.contentType) {
    case "photoshop":
      return "Photoshop / Visual";
    case "repair":
      return "Repair Project";
    case "development-project":
      return "Development Project";
    case "project-video":
      return "Project Video";
    case "portfolio-update":
      return "Portfolio Update";
    default:
      return "Project";
  }
}

function getProjectDateParts(value?: string) {
  if (!value) {
    return {
      desktop: "Project",
      mobile: "Project",
    };
  }

  const yearMatch = value.match(/\b(20\d{2}|19\d{2})\b/);
  const year = yearMatch?.[0] ?? value;

  return {
    desktop: value,
    mobile: year,
  };
}

function getProjectFallbackImage(item: StudioProjectItem) {
  if (item.thumbnail) return item.thumbnail;
  if (item.afterImage) return item.afterImage;
  if (item.beforeImage) return item.beforeImage;

  return "";
}

function renderProjectMedia(item: StudioProjectItem, fallbackImage: string) {
  if (item.mediaType === "before-after" && item.beforeImage && item.afterImage) {
    return (
      <BeforeAfterSlider
        beforeSrc={item.beforeImage}
        afterSrc={item.afterImage}
        beforeAlt={`${item.title} before`}
        afterAlt={`${item.title} after`}
        title={item.title}
        description={item.description}
        mediaClassName="aspect-video"
        variant="media"
        showLabels={false}
      />
    );
  }

  if (item.mediaType === "video" && item.videoSrc) {
    return (
      <video
        src={item.videoSrc}
        controls={!item.videoAutoplay}
        autoPlay={Boolean(item.videoAutoplay)}
        muted
        loop={Boolean(item.videoAutoplay)}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }

  if (fallbackImage) {
    if (item.url) {
      return (
        <Link href={item.url} target="_blank" rel="noreferrer">
          <Image
            src={fallbackImage}
            alt={item.title}
            fill
            sizes="(min-width: 1280px) 50vw, 100vw"
            className="object-cover transition duration-300 hover:scale-[1.02]"
            unoptimized
          />
        </Link>
      );
    }

    return (
      <Image
        src={fallbackImage}
        alt={item.title}
        fill
        sizes="(min-width: 1280px) 50vw, 100vw"
        className="object-cover"
        unoptimized
      />
    );
  }

  return (
    <div className="flex h-full items-center justify-center text-xs font-black uppercase tracking-[0.2em] text-white/30">
      No preview
    </div>
  );
}

export default function StudioSelectedProjects({
  showHiddenProjects = false,
}: StudioSelectedProjectsProps) {
  const [items, setItems] = useState<StudioProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/studio/public-content?placement=selected-projects&lab=${
            showHiddenProjects ? "true" : "false"
          }`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          if (isMounted) {
            setItems([]);
          }
          return;
        }

        const data = await response.json();

        if (isMounted) {
          setItems(Array.isArray(data.items) ? data.items : []);
        }
      } catch {
        if (isMounted) {
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [showHiddenProjects]);

  const visibleItems = useMemo(() => items.filter((item) => item.title), [items]);

  if (!isLoading && visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="mb-6">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-blue-300">
          Selected Projects
        </p>

        <h3 className="text-3xl font-black tracking-tight md:text-4xl">
          Dynamic studio-powered project highlights.
        </h3>

        <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
          Featured visual work, repairs, development builds, and project demos
          managed directly from the portfolio studio.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {visibleItems.map((item) => {
          const label = getProjectLabel(item);
          const dateParts = getProjectDateParts(item.publishedAt);
          const fallbackImage = getProjectFallbackImage(item);

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.25)]"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                {renderProjectMedia(item, fallbackImage)}

                {item.mediaType !== "before-after" && (
                  <div className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/85 backdrop-blur-xl">
                    <span className="hidden md:inline">{dateParts.desktop}</span>
                    <span className="md:hidden">{dateParts.mobile}</span>
                  </div>
                )}
                
                {item.isHiddenFeature && (
                  <div className="absolute right-4 top-4 rounded-full bg-blue-300/20 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-blue-100 backdrop-blur-xl">
                    Lab
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-white/35">
                  {label}
                </p>

                <h4 className="text-2xl font-black tracking-tight">{item.title}</h4>

                {item.description && (
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {item.description}
                  </p>
                )}

                {item.tags && item.tags.length > 0 && (
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

                {item.url && (
                  <div className="mt-5">
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950 transition hover:scale-[1.02]"
                    >
                      Open Project
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}