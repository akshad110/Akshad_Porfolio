import { getPublishedProjects } from "@/lib/content/queries";
import { Container, EmptyState } from "@/components/ui/Section";
import { ProjectsMasonry } from "@/components/projects/ProjectsMasonry";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { optimizedMediaUrl } from "@/lib/utils";

// Always read live admin data — ISR was caching seed fallback (3 projects) on cold starts.
export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "My Projects",
  description: "Published full-stack, AI, and e-commerce projects by Akshad Vengurlekar.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const preloadThumbs = projects
    .slice(0, 4)
    .map((project) => optimizedMediaUrl(project.thumbnail || project.images[0], 700))
    .filter((src): src is string => Boolean(src));

  return (
    <div className="section-space pt-24 md:pt-32">
      {preloadThumbs.map((href) => (
        <link key={href} rel="preload" as="image" href={href} />
      ))}
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
            <EmptyState
              title="No projects available yet"
              text="Publish projects from the admin dashboard to show them here."
            />
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
