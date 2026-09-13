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

export const revalidate = 60;

export const metadata = createMetadata({
  title: "Full Stack Developer & Creative Technologist",
  description:
    "Akshad Vengurlekar is a full-stack developer building AI-powered products, interactive web experiences, and reliable client software.",
  path: "/",
});

export default async function HomePage() {
  const [achievements, certifications, quotes] = await Promise.all([
    getFeaturedAchievementShowcase(),
    getFeaturedCertificationShowcase(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <HomeSectionScroller />
      <ScrollToNextPage>
        <Hero />
        <AboutPreview />
      </ScrollToNextPage>
      <Education />
      <FeaturedProjects />
      <SkillsPreview />
      <CompetitiveProgramming />
      <AchievementHoverPreview items={achievements} />
      <CertificationScatter items={certifications} />
      <ServicesTimeline />
      <ServicesTicker />
      <Contact />
      <Testimonials items={quotes} />
    </>
  );
}
