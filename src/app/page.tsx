import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import AboutTimeline from "@/components/AboutTimeline";
import AboutStats from "@/components/AboutStats";
import VisualBridge from "@/components/VisualBridge";
import ProjectsSection from "@/components/ProjectsSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingHero />
      <AboutTimeline />
      <AboutStats />
      <VisualBridge />
      <ProjectsSection />
    </>
  )
    
}

