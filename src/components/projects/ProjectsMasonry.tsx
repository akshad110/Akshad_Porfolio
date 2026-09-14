"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types";
import { MasonryGallery, type MasonryItem } from "@/components/projects/MasonryGallery";
import { ProjectModal } from "@/components/projects/ProjectModal";

export function ProjectsMasonry({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);

  const items = useMemo<MasonryItem[]>(
    () =>
      projects.map((project) => ({
        id: project.id,
        img: project.thumbnail || project.images[0] || "",
        height: 460,
        title: project.title,
      })),
    [projects],
  );

  const byId = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);

  return (
    <>
      <MasonryGallery
        items={items}
        scaleOnHover
        colorShiftOnHover
        onItemClick={(item) => {
          const project = byId.get(item.id);
          if (project) setActive(project);
        }}
      />
      {active ? <ProjectModal project={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}
