import type { ResumeExperience } from "@/data/resume";
import {
  getCategoryStyle,
  getTagLabel,
} from "@/components/about/timelineStyles";

type TimelineDetailsContentProps = {
  activeItem: ResumeExperience;
  compact?: boolean;
};

export default function TimelineDetailsContent({
  activeItem,
  compact = false,
}: TimelineDetailsContentProps) {
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em]",
            getCategoryStyle(activeItem.category),
          ].join(" ")}
        >
          {activeItem.category}
        </span>

        <span className="text-sm font-bold text-white/45">
          {activeItem.dateRange}
        </span>
      </div>

      <h3 className={[
    "font-black tracking-tight",
    compact ? "text-2xl" : "text-3xl",
  ].join(" ")}>
        {activeItem.title}
      </h3>

      <p className="mt-2 text-lg font-semibold text-blue-200">
        {activeItem.company}
      </p>

      <p className="mt-1 text-sm font-semibold text-white/45">
        {activeItem.location}
      </p>

      <p className={[
    "text-white/75",
    compact ? "mt-5 text-base leading-7" : "mt-6 text-lg leading-8",
  ].join(" ")}>
        {activeItem.summary}
      </p>

      <div className="mt-7 space-y-3">
        {activeItem.bullets.map((bullet, index) => (
          <div
            key={`${activeItem.id}-bullet-${index}`}
            className={[
            "rounded-2xl border border-white/10 bg-black/20 text-sm text-white/70",
            compact ? "p-3 leading-6" : "p-4 leading-6",
            ].join(" ")}
          >
            {bullet.text}
          </div>
        ))}
      </div>

      {activeItem.tags.length > 0 && (
        <div className="mt-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-white/35">
            Related Focus
          </p>

          <div className="flex flex-wrap gap-2">
            {activeItem.tags
              .filter((tag) => tag !== "general")
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-bold text-blue-200"
                >
                  {getTagLabel(tag)}
                </span>
              ))}
          </div>
        </div>
      )}
    </>
  );
}