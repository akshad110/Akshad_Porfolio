import { getFeaturedProjects } from "@/lib/content/queries";
import { Button } from "@/components/ui/Button";
import { Container, EmptyState, SectionHeading } from "@/components/ui/Section";
import { PortfolioSlider } from "@/components/projects/PortfolioSlider";

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();

  return (
    <section className="section-space overflow-hidden">
      <Container>
        <SectionHeading
          kicker="Selected Work"
          title="Featured Projects"
          description="Featured work from the studio. Toggle projects from the admin panel — up to five at a time."
        />
      </Container>

      <div className="mt-14 lg:mt-16">
        {projects.length ? (
          <PortfolioSlider projects={projects} />
        ) : (
          <Container>
            <EmptyState
              title="No featured projects yet"
              text="Publish projects from the admin dashboard to fill this slider."
            />
          </Container>
        )}
      </div>

      <Container>
        <div className="mt-12">
          <Button href="/projects" variant="secondary">
            See more
          </Button>
        </div>
      </Container>
    </section>
  );
}
