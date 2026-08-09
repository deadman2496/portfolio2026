"use client";

import { useState } from "react";
import type { LivePlatformStatus } from "@/types/social";
import OfflineStreamState from "@/components/social/live/OfflineStreamState";

type LivePlayerShellProps = {
  platform: LivePlatformStatus;
};

function getOwncastChatUrl(embedUrl?: string) {
  if (!embedUrl) return undefined;

  try {
    const url = new URL(embedUrl);

    return `${url.origin}/embed/chat/readwrite`;
  } catch {
    return undefined;
  }
}

const livePlayerFrameClassName =
  "relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl min-h-[300px] sm:min-h-[360px] md:aspect-video md:min-h-0";

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

  if (!platform.playableInline) {
      return (
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center shadow-2xl">
          <p className="mx-auto mb-3 w-fit rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/60">
            External platform
          </p>

          <h4 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {platform.label}
          </h4>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/60 md:text-base">
            This platform opens outside the portfolio so the stream can use the official player experience.
          </p>

          {platform.watchUrl && (
            <a
              href={platform.watchUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Open {platform.label}
            </a>
          )}
        </div>
      );
    }

    
  if (!hasStartedPlayback) {
  return (
    <div className="space-y-3">
      <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-red-400/25 bg-black shadow-2xl md:aspect-video md:min-h-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/70 via-slate-950 to-blue-950/60" />

        <div className="relative z-10 flex h-full min-h-[320px] flex-col items-center justify-center p-6 text-center md:min-h-0">
          <p className="mb-3 rounded-full border border-red-300/25 bg-red-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-100">
            Live now
          </p>

          <h4 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {platform.label} is live.
          </h4>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 md:text-base">
            Playback stays paused until the visitor chooses to start it.
          </p>

          <div className="mt-6 hidden flex-wrap items-center justify-center gap-3 md:flex">
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

      <div className="relative z-20 grid gap-3 pb-32 md:hidden">
        <button
          type="button"
          onClick={() => setHasStartedPlayback(true)}
          className="min-h-14 w-full rounded-2xl bg-white px-5 py-4 text-base font-black text-slate-950 shadow-xl transition active:scale-[0.98]"
        >
          Play preview
        </button>

        {platform.watchUrl && (
          <a
            href={platform.watchUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-12 w-full rounded-2xl border border-white/15 px-5 py-4 text-center text-sm font-black text-white/75 transition active:scale-[0.98]"
          >
            Open platform
          </a>
        )}
      </div>
    </div>
  );
}

if (platform.playableInline && platform.embedUrl) {
  const isPersonalStream = platform.id === "owncast";
  const owncastChatUrl = isPersonalStream
    ? getOwncastChatUrl(platform.embedUrl)
    : undefined;

  if (isPersonalStream) {
    return (
      <div className="grid gap-5 pb-32 md:pb-0 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl min-h-[300px] sm:min-h-[360px] md:aspect-[16/8.35] md:min-h-0">
          <iframe
            src={platform.embedUrl}
            title={`${platform.label} live player`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="origin"
            scrolling="no"
            className="h-full w-full border-0"
          />
        </div>

        {owncastChatUrl && (
            <aside className="relative z-20 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
              <iframe
                src={owncastChatUrl}
                title="Owncast stream chat"
                referrerPolicy="origin"
                allow="clipboard-write"
                className="h-[620px] w-full border-0 md:h-[640px] xl:h-full xl:min-h-[540px]"
              />
            </aside>
          )}
      </div>
    );
  }

  return (
  <div className="space-y-3 pb-32 md:pb-0">
    <div className={livePlayerFrameClassName}>
      <iframe
        src={platform.embedUrl}
        title={`${platform.label} live player`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        referrerPolicy="origin"
        scrolling="no"
        className="h-full w-full border-0"
      />
    </div>

    {platform.watchUrl && (
      <a
        href={platform.watchUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/15 px-5 py-4 text-center text-sm font-black text-white/75 transition active:scale-[0.98] md:w-auto md:rounded-full md:py-3 md:hover:bg-white/10 md:hover:text-white"
      >
        Open {platform.label}
      </a>
    )}
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