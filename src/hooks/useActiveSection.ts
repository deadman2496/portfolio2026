"use client";

import { useEffect, useMemo, useState } from "react";

type UseActiveSectionOptions = {
  anchorRatio?: number;
};

export function useActiveSection(
  sectionIds: string[],
  options?: UseActiveSectionOptions,
) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "");

  const stableSectionKey = useMemo(() => sectionIds.join("|"), [sectionIds]);
  const anchorRatio = options?.anchorRatio ?? 0.42;

  useEffect(() => {
    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * anchorRatio;

      let closestSection = sectionIds[0] ?? "";
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (!section) continue;

        const rect = section.getBoundingClientRect();

        const sectionCrossesAnchor =
          rect.top <= viewportAnchor && rect.bottom >= viewportAnchor;

        const distance = sectionCrossesAnchor
          ? 0
          : Math.min(
              Math.abs(rect.top - viewportAnchor),
              Math.abs(rect.bottom - viewportAnchor),
            );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = id;
        }
      }

      setActiveSection(closestSection);
    }

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [stableSectionKey, anchorRatio, sectionIds]);

  return activeSection;
}