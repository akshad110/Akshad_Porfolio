import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content/queries";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const staticRoutes = ["", "/about", "/projects", "/services", "/contact"];

  return [
    ...staticRoutes.map((path) => ({
      url: siteUrl(path || "/"),
      lastModified: new Date(),
    })),
    ...projects.map((project) => ({
      url: siteUrl(`/projects/${project.slug}`),
      lastModified: new Date(project.updatedAt),
    })),
  ];
}
