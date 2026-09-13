import type { Project } from "@/types";

const now = "2026-01-01T00:00:00.000Z";

function demo(
  index: number,
  title: string,
  category: Project["category"],
  img: string,
): Project {
  return {
    id: `demo-${index}`,
    title,
    slug: `demo-${index}`,
    category,
    shortDescription: "Demo gallery item for layout. Replace this from the admin panel.",
    description:
      "This is a placeholder project used to fill the masonry gallery. Publish real work from the admin dashboard to replace it.",
    skills: ["React", "Node.js", "Tailwind CSS"],
    githubAccess: "NOT_AVAILABLE",
    thumbnail: img,
    images: [img],
    status: "PUBLISHED",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  };
}

export const demoProjects: Project[] = [
  demo(
    4,
    "Demo — Product Console",
    "Developer Tool",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=900",
  ),
  demo(
    5,
    "Demo — Motion Study",
    "3D Web",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=900",
  ),
  demo(
    6,
    "Demo — Commerce Lab",
    "E-Commerce",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=900",
  ),
  demo(
    7,
    "Demo — Interface Kit",
    "Web Development",
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=900",
  ),
  demo(
    8,
    "Demo — Data Board",
    "Other",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=900",
  ),
];

export function withDemoProjects(published: Project[], count = 8): Project[] {
  if (published.length >= count) return published;
  const used = new Set(published.map((item) => item.slug));
  const extras = demoProjects.filter((item) => !used.has(item.slug));
  return [...published, ...extras].slice(0, count);
}
