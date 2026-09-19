import { Suspense } from "react";
import { Hero } from "@/components/hero/Hero";
import { AboutPreview } from "@/components/about/AboutPreview";
import { Education } from "@/components/education/Education";
import { FeaturedProjects } from "@/components/projects/FeaturedProjects";
import { SkillsPreview } from "@/components/skills/SkillsPreview";
import { CompetitiveProgramming } from "@/components/competitive/CompetitiveProgramming";
import { AchievementHoverPreview } from "@/components/content/AchievementHoverPreview";
import { CertificationScatter } from "@/components/content/CertificationScatter";
import { ServicesTimeline } from "@/components/services/ServicesTimeline";
import { ServicesTicker } from "@/components/services/ServicesTicker";
import { Contact } from "@/components/contact/Contact";
import { Testimonials } from "@/components/content/Testimonials";
import {
  getFeaturedAchievementShowcase,
  getFeaturedCertificationShowcase,
  getPublishedTestimonials,
} from "@/lib/content/queries";
import { createMetadata } from "@/lib/metadata";
import { ScrollToNextPage } from "@/components/animations/ScrollToNextPage";
import { HomeSectionScroller } from "@/components/navigation/HomeSectionScroller";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Full Stack Developer & Creative Technologist",
  description:
    "Akshad Vengurlekar is a full-stack developer building AI-powered products, interactive web experiences, and reliable client software.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HomeSectionScroller />
      <ScrollToNextPage>
        <Hero />
        <AboutPreview />
      </ScrollToNextPage>
      <Education />
      <Suspense fallback={null}>
        <FeaturedProjects />
      </Suspense>
      <Suspense fallback={null}>
        <SkillsPreview />
      </Suspense>
      <Suspense fallback={null}>
        <CompetitiveProgramming />
      </Suspense>
      <Suspense fallback={null}>
        <HomeShowcase />
      </Suspense>
      <ServicesTimeline />
      <ServicesTicker />
      <Contact />
      <Suspense fallback={null}>
        <HomeQuotes />
      </Suspense>
    </>
  );
}

async function HomeShowcase() {
  const [achievements, certifications] = await Promise.all([
    getFeaturedAchievementShowcase(),
    getFeaturedCertificationShowcase(),
  ]);
  return (
    <>
      <AchievementHoverPreview items={achievements} />
      <CertificationScatter items={certifications} />
    </>
  );
}

async function HomeQuotes() {
  const quotes = await getPublishedTestimonials();
  return <Testimonials items={quotes} />;
}
