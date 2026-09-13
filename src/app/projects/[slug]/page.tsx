import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content/queries";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { site } from "@/data/site";
import { formatProjectRange } from "@/lib/utils";

export const revalidate = 30;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return createMetadata({ title: "Project", description: "Project not found.", path: `/projects/${slug}` });
  return createMetadata({
    title: project.title,
    description: project.description || project.shortDescription,
    path: `/projects/${project.slug}`,
    image: project.thumbnail,
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const all = await getPublishedProjects();
  const currentIndex = all.findIndex((item) => item.slug === project.slug);
  const next = all[(currentIndex + 1) % all.length];

  const gallery = [project.thumbnail, ...project.images].filter(
    (src, index, list): src is string => Boolean(src) && list.indexOf(src) === index,
  ).slice(0, 3);
  const dates = formatProjectRange(project.startDate, project.endDate);

  return (
    <div className="pt-24 md:pt-28">
      <section className="section-space">
        <Container>
          <p className="section-kicker">{project.category}</p>
          <h1 className="font-heading mt-3 max-w-5xl text-[clamp(1.85rem,7vw,4.5rem)] break-words md:mt-4">
            {project.title}
          </h1>
          {dates ? <p className="mt-3 text-sm tracking-wide text-muted sm:mt-4">{dates}</p> : null}
          <p className="mt-5 max-w-3xl text-base text-foreground-secondary italic sm:mt-6 sm:text-lg md:text-xl">
            {project.description}
          </p>
        </Container>
      </section>
      {gallery.length ? (
        <div className="container-page grid gap-3 sm:gap-4 md:grid-cols-3">
          {gallery.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${project.title} ${index + 1}`}
              className="aspect-video h-auto w-full rounded-lg object-cover sm:h-48 md:h-56"
            />
          ))}
        </div>
      ) : null}
      <section className="section-space">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl">Overview</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground-secondary sm:text-lg">{project.description}</p>
          </div>
          <aside className="rounded-lg border border-border bg-background-secondary p-5 sm:p-6">
            <h2 className="font-heading text-xl">Technologies</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <li key={skill} className="rounded-md border border-border px-3 py-1 text-sm">
                  {skill}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              {project.liveLink ? (
                <Button href={project.liveLink} external>
                  Live Website
                </Button>
              ) : null}
              <Button href={`mailto:${site.email}?subject=Source access request: ${project.title}`} variant="secondary">
                Request access for the source code
              </Button>
            </div>
          </aside>
        </Container>
      </section>
      {next && next.slug !== project.slug ? (
        <section className="border-t border-border py-12 sm:py-16">
          <Container>
            <p className="section-kicker">Next project</p>
            <Link
              href={`/projects/${next.slug}`}
              className="font-heading mt-3 block text-2xl break-words hover:text-accent-hover sm:text-3xl md:text-4xl"
            >
              {next.title} →
            </Link>
          </Container>
        </section>
      ) : null}
    </div>
  );
}
