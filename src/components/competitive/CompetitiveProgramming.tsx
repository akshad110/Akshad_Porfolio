import { getCompetitiveStackProfiles } from "@/lib/content/queries";
import { Container, EmptyState, SectionHeading } from "@/components/ui/Section";
import { StackflowCards } from "@/components/competitive/StackflowCards";

export async function CompetitiveProgramming() {
  const profiles = await getCompetitiveStackProfiles();

  return (
    <section id="competitive-programming" className="pt-[clamp(3rem,7vw,10rem)] pb-6 md:pb-8">
      <Container className="pointer-events-none">
        <SectionHeading
          kicker="Problem Solving"
          title="Competitive Programming"
          description="Daily practice that keeps the engineering sharp."
        />
      </Container>

      <div className="mt-6 pointer-events-none">
        {profiles.length ? (
          <StackflowCards profiles={profiles} />
        ) : (
          <Container>
            <EmptyState
              title="Profiles coming soon"
              text="Competitive programming profiles can be added from the admin."
            />
          </Container>
        )}
      </div>
    </section>
  );
}
