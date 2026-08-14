import type { SelectedSocialPost } from "@/types/social";

const platformLabels: Record<SelectedSocialPost["platform"], string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  twitch: "Twitch",
  x: "X",
  linkedin: "Linkedin",
};

type SocialPostCardProps = {
  post: SelectedSocialPost;
};

export default function SocialPostCard({ post }: SocialPostCardProps) {
  const platformLabel = platformLabels[post.platform];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-xl transition hover:-translate-y-1 hover:border-blue-300/25 hover:bg-white/[0.06]">
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        {post.thumbnail ? (
          <img 
            src={post.thumbnail}
            alt=""
            className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-sm font-black uppercase tracking-[0.2em] text-white/35">
            {platformLabel}
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur-xl">
          {platformLabel}
        </div>

        {post.isHiddenFeature && (
          <div className="absolute right-4 top-4 rounded-full border border-blue-300/20 bg-blue-300/15 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] text-blue-100 backdrop-blur-xl">
            Lab
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          {post.publishedAt && (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
              {post.publishedAt}
            </p>
          )}
        </div>

        <h4 className="text-xl font-black tracking-tight text-white">
          {post.title}
        </h4>

        {post.description && (
          <p className="mt-3 flex-1 text-sm leading-6 text-white/60">
            {post.description}
          </p>
        )}

        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-fit rounded-full bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:scale-[1.02]"
        >
          Open on {platformLabel}
        </a>
      </div>
    </article>
  );
}