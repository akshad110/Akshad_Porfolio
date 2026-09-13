import { getPublishedSkills } from "@/lib/content/queries";
import { Container, SectionHeading } from "@/components/ui/Section";
import { SkillsLogoCarousel } from "@/components/skills/SkillsLogoCarousel";

export async function SkillsPreview() {
  const skills = await getPublishedSkills();
  const withLogos = skills.filter((skill) => skill.icon);
  const logos = withLogos.length ? withLogos : skills.filter((skill) => skill.category !== "CS Fundamentals");

  return (
    <section id="skills" className="section-space bg-background-secondary">
      <Container>
        <SectionHeading
          kicker="Capability"
          title="Skills"
          description="A technical vocabulary shaped by shipping products, not collecting logos."
        />
      </Container>
      <div className="mt-8 sm:mt-12 md:mt-16">
        <SkillsLogoCarousel skills={logos} />
      </div>
    </section>
  );
}
