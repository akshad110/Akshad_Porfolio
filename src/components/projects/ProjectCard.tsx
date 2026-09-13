import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { cn, formatProjectRange } from "@/lib/utils";

export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "group border-border bg-background-secondary",
        featured ? "grid gap-8 border-y py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : "rounded-lg border p-6",
      )}
    >
      <Link href={`/projects/${project.slug}`} className="block overflow-hidden rounded-lg">
        <div className="relative aspect-[16/10] overflow-hidden bg-blue-slate-200">
          {project.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail}
              alt={`${project.title} preview`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-end p-8">
              <span className="font-heading text-6xl text-white/15">0{index + 1}</span>
            </div>
          )}
        </div>
      </Link>
      <div>
        <p className="section-kicker">
          0{index + 1} / {project.category}
        </p>
        <h3 className="font-heading mt-3 text-3xl md:text-5xl">{project.title}</h3>
        {formatProjectRange(project.startDate, project.endDate) ? (
          <p className="mt-2 text-sm text-muted">{formatProjectRange(project.startDate, project.endDate)}</p>
        ) : null}
        <p className="mt-4 max-w-xl text-foreground-secondary italic">{project.description || project.shortDescription}</p>
        <p className="mt-4 text-sm tracking-wide text-muted">{project.skills.slice(0, 5).join(" · ")}</p>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 font-heading text-sm tracking-[0.16em] uppercase hover:text-accent-hover"
        >
          Explore Project <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
