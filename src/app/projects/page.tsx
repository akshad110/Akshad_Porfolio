import { getPublishedProjects } from "@/lib/content/queries";
import { withDemoProjects } from "@/data/demoProjects";
import { Container, EmptyState } from "@/components/ui/Section";
import { ProjectsMasonry } from "@/components/projects/ProjectsMasonry";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";

export const revalidate = 30;

export const metadata = createMetadata({
  title: "My Projects",
  description: "Published full-stack, AI, and e-commerce projects by Akshad Vengurlekar.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const published = await getPublishedProjects();
  const projects = withDemoProjects(published, 8);

  return (
    <div className="section-space pt-24 md:pt-32">
      <Container>
        <p className="section-kicker">Work</p>
        <h1 className="font-heading mt-3 text-[clamp(2rem,8vw,4.5rem)] md:mt-4">My Projects</h1>
        <p className="mt-4 max-w-2xl text-base text-foreground-secondary italic sm:mt-5 sm:text-lg md:text-xl">
          A growing body of shipped products — from AI tools to alumni networks to commerce.
        </p>
        <div className="mt-10 sm:mt-16">
          {projects.length ? (
            <ProjectsMasonry projects={projects} />
          ) : (
            <EmptyState title="No projects available yet" text="Published projects will appear here." />
          )}
        </div>
        <div className="mt-10 sm:mt-12">
          <Button href="/contact" variant="secondary">
            Discuss a project
          </Button>
        </div>
      </Container>
    </div>
  );
}
