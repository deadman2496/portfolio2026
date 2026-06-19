import Reveal from "@/components/Reveal";
import BeforeAfterSlider from "@/components/projects/BeforeAfterSlider";

const photoshopProjects = [
  {
    title: "Photoshop lighting styles",
    description:
      "touching up on a photo taken in a pop-up event augmenting the lighting",
    beforeSrc: "/images/projects/photoshop/example-1-before.jpg",
    afterSrc: "/images/projects/photoshop/example-1-after.jpg",
    beforeAlt: "Original portrait before Photoshop editing",
    afterAlt: "Portrait after Photoshop editing",
  },
  {
    title: "Photoshop lighting styles",
    description:
      "Removing the background of the city and making it a bit calmer",
    beforeSrc: "/images/projects/photoshop/example-2-before.JPG",
    afterSrc: "/images/projects/photoshop/example-2-after.jpg",
    beforeAlt: "Original image before Photoshop background correction",
    afterAlt: "Image after Photoshop background correction",
  },
];

const repairComparisonProject =  {
    title: "Z fold 3 screen replacement",
    description:
      "a successful repair of a z-fold 3 inner screen",
    beforeSrc: "/images/projects/repairs/z-fold-3-before.png",
    afterSrc: "/images/projects/repairs/z-fold-3-after.png",
    beforeAlt: "Z fold 3 freshly-acquired",
    afterAlt: "Z fold 3 after the fix",
  };

const mediaProjects = [
  {
    title: "Apple Watch screen and battery repair",
    description:
      "Repairing an apple watch from a damaged screen and an old battery",
    videoSrc: "/media/projects/Apple-watch-demo.mp4",
  },
  {
    title: "Legion Go SSD and a battery mod",
    description:
      "Testing modifying the back of a legion go to expand to a 2280 4tb storage and an 81 kw/h battery and lastly a custom 3-D printed backplate for compatibility.",
    videoSrc: "/media/projects/Legion-go-mod.mp4",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              Selected Projects
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Visual work, technical repairs, and interactive builds.
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/65">
              A closer look at the work behind the portfolio: Photoshop edits,
              repair documentation, and web projects built to show practical
              problem solving.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {photoshopProjects.map((project, index) => (
            <Reveal key={project.title} direction="up" delayMs={index * 150}>
              <BeforeAfterSlider {...project} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {mediaProjects.map((project, index) => (
            <Reveal key={project.title} direction="up" delayMs={250 + index * 150}>
              <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
                <div className="relative aspect-video bg-black">
                  <video
                    className="h-full w-full object-cover"
                    src={project.videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-2xl font-black tracking-tight">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {project.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal direction="up" delayMs={550} className="h-full">
                <BeforeAfterSlider {...repairComparisonProject} mediaClassName="aspect-video"/>
            </Reveal>

        </div>
      </div>
    </section>
  );
}
