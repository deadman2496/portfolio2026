"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRandomItem } from "@/hooks/useRandomItem";

const INTRO_SECONDS = 3.7;

const HERO_TITLES = [
  "Developer",
  "Computer Technician",
  "Creative Problem Solver",
  "IT Support Specialist",
  "Front-End Builder",
  "Repair Technician",
];

const HERO_PORTRAITS = [
  "/images/alexis-cutout.png",
  "/images/alexis-cutout-2.png",
  "/images/alexis-cutout-3.png",
];

const TYPE_SPEED_MS = 58;
const DELETE_SPEED_MS = 34;
const TITLE_HOLD_MS = 1350;

export default function LandingHero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [typedTitle, setTypedTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeletingTitle, setIsDeletingTitle] = useState(false);

  useEffect(() => {
    if (!videoReady) return;

    const timer = window.setTimeout(() => {
      setHeroVisible(true);
    }, INTRO_SECONDS * 2700);

    return () => window.clearTimeout(timer);
  }, [videoReady]);

const heroPortrait = useRandomItem(
  HERO_PORTRAITS,
  HERO_PORTRAITS[0],
);

useEffect(() => {
  if (!heroVisible) return;

  const currentTitle = HERO_TITLES[titleIndex];
  const isTitleComplete = typedTitle === currentTitle;
  const isTitleEmpty = typedTitle.length === 0;

  let delay = isDeletingTitle ? DELETE_SPEED_MS : TYPE_SPEED_MS;

  if (!isDeletingTitle && isTitleComplete) {
    delay = TITLE_HOLD_MS;
  }

  const timer = window.setTimeout(() => {
    if (!isDeletingTitle && isTitleComplete) {
      setIsDeletingTitle(true);
      return;
    }

    if (isDeletingTitle && isTitleEmpty) {
      setIsDeletingTitle(false);
      setTitleIndex((current) => (current + 1) % HERO_TITLES.length);
      return;
    }

    const nextText = isDeletingTitle
      ? currentTitle.slice(0, Math.max(typedTitle.length - 1, 0))
      : currentTitle.slice(0, typedTitle.length + 1);

    setTypedTitle(nextText);
  }, delay);

  return () => window.clearTimeout(timer);
}, [heroVisible, isDeletingTitle, titleIndex, typedTitle]);



  return (
    <main id="home" className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Layer 1: Video */}
      <video
        ref={videoRef}
        className={[
          "absolute inset-0 h-full w-full object-cover transition-all duration-[3500ms] ease-in-out",
          heroVisible
            ? "scale-105 brightness-[0.45] saturate-[0.75]"
            : "scale-100 brightness-100 saturate-125",
        ].join(" ")}
        src="/media/nyc-park-drone.mov"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
      />

      {/* Layer 2: Shadow overlay */}
      <div
        className={[
          "absolute inset-0 transition-opacity duration-[3500ms] ease-in-out",
          heroVisible ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(circle at 70% 45%, rgba(59,130,246,0.22), transparent 28%), linear-gradient(90deg, rgba(0,0,0,0.85), rgba(0,0,0,0.42)), linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.92))",
        }}
      />

      {/* Layers 3 and 4: Text + Portrait */}
      <section className="relative z-20 mx-auto grid min-h-[100svh] w-[min(1180px,calc(100%-40px))] grid-cols-1 items-center gap-10 pt-24 pb-28 md:min-h-[calc(100vh-96px)] md:grid-cols-[1fr_460px] md:py-0">
        {/* Layer 4: Text */}
        <div
          className={[
            "relative z-30 max-w-3xl transition-all delay-300 duration-1800 ease-out",
            heroVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-8 scale-95 opacity-0",
          ].join(" ")}
        >
          <p className="mb-3 text-lg font-semibold text-white/75 md:text-2xl">
            Welcome to the Portfolio for
          </p>

          <h1 className="text-6xl font-black leading-[0.9] tracking-[-0.08em] drop-shadow-2xl md:text-8xl">
            Alexis Marroquin
          </h1>

          <p
            className="mt-7 max-w-2xl text-lg text-white/70 md:text-xl"
            aria-label="Developer, Computer Technician, Creative Problem Solver"
          >
            <span aria-hidden="true">
              {typedTitle || "Developer"}
              <span className="ml-1 inline-block animate-pulse text-blue-200">|</span>
            </span>
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-white px-6 py-4 font-bold text-slate-950 shadow-2xl transition hover:scale-105"
            >
              Explore My Work
            </a>

            <a
              href="#contact"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/15"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Layer 3: Portrait */}
        <div
          className={[
            "pointer-events-none absolute bottom-0 right-[-5rem] z-10 flex justify-center pt-0 transition-all delay-500 duration-1000 md:pointer-events-auto md:relative md:right-auto md:bottom-auto md:z-auto md:self-end md:pt-28 lg:pt-32",
            heroVisible
              ? "translate-x-0 scale-100 opacity-45 md:opacity-100"
              : "translate-x-12 scale-95 opacity-0",
          ].join(" ")}
        >
          <Image
            src={heroPortrait}
            alt="Alexis Marroquin"
            width={754}
            height={984}
            priority
            className="h-auto w-[min(88vw,390px)] object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.75)] md:w-[min(90vw,500px)]"
          />
        </div>
      </section>
    </main>
  );
}