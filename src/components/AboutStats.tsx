"use client"
import {useEffect,useRef, useState} from "react";
import { resumeExperience, resumeSkillGroups } from "@/data/resume";
import { useInView } from "@/hooks/useInView";
import Reveal from "@/components/Reveal";


function countExperienceByCategory() {
  return resumeExperience.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
}

export default function AboutStats() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef);

  const [shouldFillCharts, setShouldFillCharts] = useState(false);

useEffect(() => {
  if (!isInView) return;

  const timer = window.setTimeout(() => {
    setShouldFillCharts(true);
  }, 1450);

  return () => window.clearTimeout(timer);
}, [isInView]);

  const categoryCounts = countExperienceByCategory();

  const totalRoles = resumeExperience.length;
  const totalSkillGroups = resumeSkillGroups.length;
  const totalSkills = resumeSkillGroups.reduce(
    (sum, group) => sum + group.skills.length,
    0,
  );

  const chartItems = Object.entries(categoryCounts);

  return (
    <section ref={sectionRef} id="about-stats" className="bg-slate-950 px-6 pb-24 text-white">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
            Career Snapshot
          </p>

          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            A quick breakdown of my background.
          </h2>

          <p className="mt-5 text-lg leading-8 text-white/60">
            My experience combines technical work, development, repair,
            operations, and leadership. The timeline tells the story, while this
            section gives a faster overview.
          </p>
        </div>
        </Reveal>

        <Reveal direction="up" delayMs={150}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/40">
              Timeline Items
            </p>
            <p className="mt-4 text-5xl font-black">{totalRoles}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/40">
              Skill Groups
            </p>
            <p className="mt-4 text-5xl font-black">{totalSkillGroups}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-white/40">
              Listed Skills
            </p>
            <p className="mt-4 text-5xl font-black">{totalSkills}</p>
          </div>
        </div>
        </Reveal>

        <Reveal direction="scale" delayMs={300}>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-2xl font-black">Experience by category</h3>

          <div className="mt-6 space-y-4">
            {chartItems.map(([category, count]) => {
              const percentage = Math.round((count / totalRoles) * 100);

              return (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span>{category}</span>
                    <span className="text-white/45">{count} items</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-blue-300 transition-[width] duration-1000 ease-out"
                      style={{ width: shouldFillCharts ? `${percentage}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}