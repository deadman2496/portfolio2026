type OfflineStreamStateProps = {
  platformLabel: string;
  watchUrl?: string;
};

export default function OfflineStreamState({
  platformLabel,
  watchUrl,
}: OfflineStreamStateProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl">
      <video
        src="/media/social/offline-loop.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/75 to-blue-950/50" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="mb-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white/50">
          Offline
        </p>

        <h4 className="text-3xl font-black tracking-tight text-white md:text-5xl">
          {platformLabel} is offline.
        </h4>

        <p className="mt-4 max-w-xl text-sm leading-6 text-white/60 md:text-base">
          When a stream is live, this area will switch into a playable stream
          card. For now, this fallback keeps the section from feeling broken.
        </p>

        {watchUrl && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
          >
            Open stream page
          </a>
        )}
      </div>
    </div>
  );
}