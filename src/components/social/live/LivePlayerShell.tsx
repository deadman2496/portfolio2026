"use client";

import { useState } from "react";
import type { LivePlatformStatus } from "@/types/social";
import OfflineStreamState from "@/components/social/live/OfflineStreamState";

type LivePlayerShellProps = {
  platform: LivePlatformStatus;
};

export default function LivePlayerShell({ platform }: LivePlayerShellProps) {
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);

  if (!platform.isLive) {
    return (
      <OfflineStreamState
        platformLabel={platform.label}
        watchUrl={platform.watchUrl}
      />
    );
  }

  if (!hasStartedPlayback) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-red-400/25 bg-black shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/70 via-slate-950 to-blue-950/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
          <p className="mb-3 rounded-full border border-red-300/25 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-100">
            Live now
          </p>

          <h4 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {platform.label} is live.
          </h4>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 md:text-base">
            Playback stays paused until the visitor chooses to start it.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setHasStartedPlayback(true)}
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
            >
              Play preview
            </button>

            {platform.watchUrl && (
              <a
                href={platform.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                Open platform
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (platform.playableInline && platform.embedUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
        <iframe
          src={platform.embedUrl}
          title={`${platform.label} live player`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="flex aspect-video flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/40 p-6 text-center shadow-2xl">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
        External stream
      </p>

      <h4 className="text-3xl font-black tracking-tight text-white">
        Open {platform.label} to watch.
      </h4>

      <p className="mt-4 max-w-xl text-sm leading-6 text-white/60">
        This platform is wired into the Live Now system, but it does not have an
        inline player connected yet.
      </p>

      {platform.watchUrl && (
        <a
          href={platform.watchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
        >
          Open {platform.label}
        </a>
      )}
    </div>
  );
}