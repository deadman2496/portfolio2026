// import Image from "next/image";
// import Reveal from "@/components/Reveal";

// const images = [
//   {
//     src: "/images/portfolio/portrait-work.png",
//     alt: "Alexis Marroquin portrait",
//     title: "Technical background",
//   },
//   {
//     src: "/images/portfolio/repair-workbench.png",
//     alt: "Computer repair workbench",
//     title: "Repair and diagnostics",
//   },
//   {
//     src: "/images/portfolio/field-work.png",
//     alt: "Field work in New York City",
//     title: "Field operations",
//   },
// ];

// export default function VisualBridge() {
//   return (
//     <section id="visual-bridge" className="bg-slate-950 px-6 py-20 text-white">
//       <div className="mx-auto max-w-6xl">
//         <div className="grid gap-5 md:grid-cols-3">
//           {images.map((image, index) => (
//             <Reveal key={image.src} direction="up" delayMs={index * 150}>
//             <figure
//               key={image.src}
//               className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
//             >
//               <div className="relative aspect-[4/5]">
//                 <Image
//                   src={image.src}
//                   alt={image.alt}
//                   fill
//                   className="object-cover transition duration-700 group-hover:scale-105"
//                 />
//               </div>

//               <figcaption className="p-5 text-sm font-bold uppercase tracking-[0.22em] text-white/55">
//                 {image.title}
//               </figcaption>
//             </figure>
//             </Reveal>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import Reveal from "@/components/Reveal";
import VisualBridgeCard, {
  type VisualBridgeMedia,
} from "@/components/visual-bridge/VisualBridgeCard";

type VisualBridgeItem = {
  id: string;
  title: string;
  media: VisualBridgeMedia[];
};

const visualBridgeItems: VisualBridgeItem[] = [
  {
    id: "technical-background",
    title: "Technical background",
    media: [
       {
        type: "image",
        src: "/images/portfolio/Programming-Sample.png",
        alt: "Alexis Building a Mobile App",
        label: "Technical support",
      },
      {
        type: "image",
        src: "/images/portfolio/Delta-monitoring-sample.JPG",
        alt: "Alexis Monitoring Flights for Catering needs and cleaning needs",
        label: "Supporting Delta and Gate Gourmet Teams.",
      },
      {
        type: "image",
        src: "/images/portfolio/Dispatching-sample.JPG",
        alt: "Alexis Building a Schedule",
        label: "Leadership support, Guidance",
      },
    ],
  },
  {
    id: "repair-diagnostics",
    title: "Repair and diagnostics",
    media: [
       {
        type: "image",
        src: "/images/portfolio/Workbench-sample.png",
        alt: "Alexis Marroquin working with computer technology",
        label: "Technical support",
      },
    ],
  },
  {
    id: "field-operations",
    title: "Field and operational work",
    media: [
       {
        type: "image",
        src: "/images/portfolio/Aclima-sample.jpg",
        alt: "Air-quality monitoring field work in New York",
        label: "Air-Quality Observations",
      },
      {
        type: "video",
        src: "/media/portfolio/Flight-monitoring-sample.mp4",
        poster: "/images/portfolio/air-quality-fieldwork-poster.jpg",
        alt: "Monitoring a Flight for clearance and Catering",
        label: "Delta Flight Check",
      },
      {
        type: "video",
        src: "/media/portfolio/Catering-sample.mp4",
        poster: "/images/portfolio/air-quality-fieldwork-poster.jpg",
        alt: "Preparing to Cater a flight",
        label: "GateGourmet Flight Catering",
      },
    ],
  },
];

export default function VisualBridge() {
  return (
    <section
      id="visual-bridge"
      className="bg-slate-950 px-6 py-20 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-300">
              Experience in action
            </p>

            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Technical work across software, repair, and field operations.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {visualBridgeItems.map((item, index) => (
            <Reveal
              key={item.id}
              direction="up"
              delayMs={index * 150}
              className="h-full"
            >
              <VisualBridgeCard
                title={item.title}
                media={item.media}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}