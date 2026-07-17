import type {
  LivePlatformId,
  LivePlatformStatus,
} from "@/types/social";

type LivePlatformTabsProps = {
  platforms: LivePlatformStatus[];
  activePlatformId: LivePlatformId;
  onSelectPlatform: (platformId: LivePlatformId) => void;
};

const liveIndicatorStyles: Record<
  LivePlatformId,
  {
    dot: string;
    text: string;
    border: string;
    glow: string;
    label: string;
  }
> = {
  owncast: {
    dot: "bg-emerald-400",
    text: "text-emerald-100",
    border: "border-emerald-300/35",
    glow: "shadow-[0_0_18px_rgba(52,211,153,0.55)]",
    label: "Live",
  },
  youtube: {
    dot: "bg-red-500",
    text: "text-red-100",
    border: "border-red-400/35",
    glow: "shadow-[0_0_18px_rgba(239,68,68,0.6)]",
    label: "Live",
  },
  twitch: {
    dot: "bg-purple-400",
    text: "text-purple-100",
    border: "border-purple-300/35",
    glow: "shadow-[0_0_18px_rgba(192,132,252,0.6)]",
    label: "Live",
  },
  instagram: {
    dot: "bg-pink-400",
    text: "text-pink-100",
    border: "border-pink-300/35",
    glow: "shadow-[0_0_18px_rgba(244,114,182,0.55)]",
    label: "Live",
  },
  facebook: {
    dot: "bg-blue-400/50",
    text: "text-blue-100/50",
    border: "border-blue-300/20",
    glow: "shadow-[0_0_18px_rgba(85,175,225,0.55)]",
    label: "Live",
  },
};

const offlineIndicatorStyle = {
  dot: "bg-blue-400/75",
  text: "text-blue-100/70",
  border: "border-blue-300/20",
  glow: "shadow-[0_0_12px_rgba(96,165,250,0.25)]",
  label: "Offline",
};

function getIndicatorStyle(platform: LivePlatformStatus) {
  if (platform.isLive) {
    return liveIndicatorStyles[platform.id];
  }

  return offlineIndicatorStyle;
}

export default function LivePlatformTabs({
  platforms,
  activePlatformId,
  onSelectPlatform,
}: LivePlatformTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Live stream platforms"
      className="flex snap-x gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pb-0"
    >
      {platforms.map((platform) => {
        const isActive = platform.id === activePlatformId;
        const indicatorStyle = getIndicatorStyle(platform);

        return (
          <button
            key={platform.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`${platform.label}, ${indicatorStyle.label}`}
            onClick={() => onSelectPlatform(platform.id)}
            className={[
              "group min-w-max snap-start rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-300/70",
              isActive
                ? `bg-white text-slate-950 ${indicatorStyle.border}`
                : "border-white/10 bg-white/[0.04] text-white/65 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <span
                className={[
                  "h-3 w-3 rounded-full",
                  indicatorStyle.dot,
                  indicatorStyle.glow,
                ].join(" ")}
                aria-hidden="true"
              />

              <span className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.16em]">
                  {platform.label}
                </span>

                <span
                  className={[
                    "mt-1 text-[0.65rem] font-black uppercase tracking-[0.18em]",
                    isActive ? "text-slate-600" : indicatorStyle.text,
                  ].join(" ")}
                >
                  {indicatorStyle.label}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}