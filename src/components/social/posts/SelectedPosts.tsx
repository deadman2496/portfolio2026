"use client";

import { useEffect, useMemo, useState } from "react";
import { selectedSocialPosts } from "@/data/socialPosts";
import type {
  SelectedSocialPlatform,
  SelectedSocialPost,
} from "@/types/social";
import SocialPostCard from "@/components/social/posts/SocialPostCard";

type SelectedPostsFilter = "all" | SelectedSocialPlatform;

type PlatformOption = {
  id: SelectedPostsFilter;
  label: string;
  isHiddenFeature?: boolean;
};

const platformOptions: PlatformOption[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "instagram",
    label: "Instagram",
  },
  {
    id: "youtube",
    label: "YouTube",
  },
  {
    id: "twitch",
    label: "Twitch",
  },
  {
    id: "x",
    label: "X",
    isHiddenFeature: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    isHiddenFeature: true,
  },
];

const selectedPostPlatformIds = new Set<SelectedSocialPlatform>([
  "instagram",
  "youtube",
  "twitch",
  "x",
  "linkedin",
]);

type SelectedPostsProps = {
  showHiddenPlatforms?: boolean;
};

function isSelectedSocialPlatform(
  value: unknown,
): value is SelectedSocialPlatform {
  return (
    typeof value === "string" &&
    selectedPostPlatformIds.has(value as SelectedSocialPlatform)
  );
}

function shouldShowPost(
  post: SelectedSocialPost,
  activeFilter: SelectedPostsFilter,
  showHiddenPlatforms: boolean,
) {
  if (post.isHiddenFeature && !showHiddenPlatforms) {
    return false;
  }

  if (activeFilter === "all") {
    return true;
  }

  return post.platform === activeFilter;
}

function shouldShowPlatformOption(
  option: PlatformOption,
  showHiddenPlatforms: boolean,
  posts: SelectedSocialPost[],
) {
  if (option.id === "all") return true;
  if (!option.isHiddenFeature) return true;

  const hasVisiblePostForPlatform = posts.some(
    (post) => post.platform === option.id && !post.isHiddenFeature,
  );

  return showHiddenPlatforms || hasVisiblePostForPlatform;
}

export default function SelectedPosts({
  showHiddenPlatforms = false,
}: SelectedPostsProps) {
  const [activeFilter, setActiveFilter] =
    useState<SelectedPostsFilter>("all");
  const [studioPosts, setStudioPosts] = useState<SelectedSocialPost[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadStudioPosts() {
      try {
        const response = await fetch(
          `/api/studio/public-content?placement=selected-posts&lab=${
            showHiddenPlatforms ? "true" : "false"
          }`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) return;

        const data = await response.json();

        const publicStudioPosts = Array.isArray(data.items)
          ? (data.items as SelectedSocialPost[]).filter((post) =>
              isSelectedSocialPlatform(post.platform),
            )
          : [];

        if (isMounted) {
          setStudioPosts(publicStudioPosts);
        }
      } catch {
        // Keep hardcoded fallback posts if Studio content cannot load.
      }
    }

    loadStudioPosts();

    return () => {
      isMounted = false;
    };
  }, [showHiddenPlatforms]);

  const combinedPosts = useMemo(() => {
    const studioPostIds = new Set(studioPosts.map((post) => post.id));

    return [
      ...studioPosts,
      ...selectedSocialPosts.filter((post) => !studioPostIds.has(post.id)),
    ];
  }, [studioPosts]);

  const visiblePlatformOptions = useMemo(
    () =>
      platformOptions.filter((option) =>
        shouldShowPlatformOption(option, showHiddenPlatforms, combinedPosts),
      ),
    [combinedPosts, showHiddenPlatforms],
  );

  const visiblePosts = useMemo(
    () =>
      combinedPosts.filter((post) =>
        shouldShowPost(post, activeFilter, showHiddenPlatforms),
      ),
    [activeFilter, combinedPosts, showHiddenPlatforms],
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-blue-300">
            Selected Posts
          </p>

          <h3 className="text-3xl font-black tracking-tight md:text-4xl">
            Hand-picked updates from the platforms I use.
          </h3>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
            These are manually selected posts, videos, and updates that connect
            directly to my projects, repair work, and portfolio progress.
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Selected post platform filters"
        className="mb-6 flex flex-wrap gap-3"
      >
        {visiblePlatformOptions.map((option) => {
          const isActive = activeFilter === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(option.id)}
              className={[
                "rounded-full border px-4 py-3 text-xs font-black uppercase tracking-[0.16em] transition focus:outline-none focus:ring-2 focus:ring-blue-300/70",
                isActive
                  ? "border-white bg-white text-slate-950"
                  : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/10 hover:text-white",
                option.isHiddenFeature
                  ? "border-dashed border-blue-300/30"
                  : "",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/35 md:hidden">
        Swipe to browse posts
      </p>

      {visiblePosts.length > 0 ? (
        <div
          aria-label="Selected social posts"
          className={[
            "flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3",
          ].join(" ")}
        >
          {visiblePosts.map((post) => (
            <div
              key={post.id}
              className="min-w-[82%] snap-start sm:min-w-[360px] md:min-w-0"
            >
              <SocialPostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
          <p className="text-lg font-black text-white">
            No selected posts here yet.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/55">
            This platform is wired in, but there are no public posts selected
            for it yet.
          </p>
        </div>
      )}
    </div>
  );
}