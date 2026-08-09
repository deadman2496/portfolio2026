"use client";

import { useEffect, useState } from "react";
import type {
  LivePlatformId,
  LiveStatusResponse,
} from "@/types/social";
import { selectActivePlatform } from "@/lib/social/selectActivePlatform";
import LivePlatformTabs from "@/components/social/live/LivePlatformTabs";
import LivePlayerShell from "@/components/social/live/LivePlayerShell";

function formatCheckedAt(checkedAt: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(checkedAt));
}

type LiveNowProps = {
  showHiddenPlatforms?: boolean;
};

function getVisiblePlatforms(
  platforms: LiveStatusResponse["platforms"],
  showHiddenPlatforms: boolean,
) {
  return platforms.filter((platform) => {
    if (platform.id === "owncast" || platform.id === "twitch") {
      return true;
    }

    return showHiddenPlatforms;
  });
}

export default function LiveNow({
  showHiddenPlatforms = false,
}: LiveNowProps) {
  const [status, setStatus] = useState<LiveStatusResponse | null>(null);
  const [activePlatformId, setActivePlatformId] =
    useState<LivePlatformId>("owncast");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadLiveStatuses(isManualRefresh = false) {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      setErrorMessage("");

      const response = await fetch("/api/social/live-status", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load live statuses.");
      }

      const data = (await response.json()) as LiveStatusResponse;
      const visiblePlatforms = getVisiblePlatforms(
        data.platforms,
        showHiddenPlatforms,
      );

      setStatus(data);
      setActivePlatformId(selectActivePlatform(visiblePlatforms));
    } catch {
      setErrorMessage(
        "Live status is temporarily unavailable. The default stream panel is still available.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLiveStatuses();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const visiblePlatforms = status
  ? getVisiblePlatforms(status.platforms, showHiddenPlatforms)
  : [];

  const activePlatform =
    visiblePlatforms.find((platform) => platform.id === activePlatformId) ??
    visiblePlatforms[0];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-red-300">
            Live Now
          </p>

          <h3 className="text-3xl font-black tracking-tight md:text-4xl">
            Streams stay ready without autoplaying.
          </h3>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
            This checks which platform is live, chooses the best active tab, and
            keeps playback paused until the visitor presses play.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadLiveStatuses(true)}
          disabled={isRefreshing}
          className="w-fit rounded-full border border-white/15 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing ? "Checking..." : "Refresh status"}
        </button>
      </div>

      {status && (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
          Last checked {formatCheckedAt(status.checkedAt)}
        </p>
      )}

      {errorMessage && (
        <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-sm font-bold text-yellow-100/80">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-8 text-center">
          <p className="text-lg font-black text-white">
            Checking live status...
          </p>
        </div>
      )}

      {!isLoading && status && activePlatform && (
        <>
          <LivePlatformTabs
            platforms={visiblePlatforms}
            activePlatformId={activePlatform.id}
            onSelectPlatform={setActivePlatformId}
          />

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-white">
                {activePlatform.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/50">
                {activePlatform.description}
              </p>
            </div>

            <p className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white/50">
              {activePlatform.statusLabel}
            </p>
          </div>
        </div>
          <div className="mt-6">
            <LivePlayerShell 
              key={activePlatform.id}
              platform={activePlatform}
            />
          </div>

          {/* <div className="mt-5 grid gap-3 md:grid-cols-4">
            {status.platforms.map((platform) => (
              <div
                key={platform.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      platform.isLive ? "bg-red-400" : "bg-white/25",
                    ].join(" ")}
                    aria-hidden="true"
                  />

                  <p className="text-sm font-black text-white">
                    {platform.label}
                  </p>
                </div>

                <p className="text-xs leading-5 text-white/50">
                  {platform.description}
                </p>
              </div>
            ))}
          </div> */}


        </>
      )}
    </div>
  );
}