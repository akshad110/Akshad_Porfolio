import { tryConnectDb } from "@/lib/db/connect";
import { ProjectModel } from "@/models/Project";
import { SkillModel } from "@/models/Skill";
import { AchievementModel } from "@/models/Achievement";
import { CertificationModel } from "@/models/Certification";
import { CompetitiveModel } from "@/models/Competitive";
import { seedAchievements, seedCertifications, seedCompetitive, seedProjects, seedSkills } from "@/data/seed";
import { testimonials as fallbackQuotes } from "@/data/site";
import { TestimonialModel } from "@/models/Testimonial";
import type { Achievement, Certification, CompetitiveProfile, Project, Skill, Testimonial } from "@/types";
import { FEATURED_LIMIT, PROJECT_FEATURED_LIMIT } from "@/types";

function withIds<T>(items: T[], prefix: string): Array<T & { id: string }> {
  return items.map((item, index) => ({
    ...item,
    id: `${prefix}-${index + 1}`,
  }));
}

const fallbackProjects: Project[] = seedProjects.map((project, index) => ({
  ...project,
  id: `project-${index + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const fallbackSkills: Skill[] = withIds(seedSkills, "skill");
const fallbackAchievements: Achievement[] = withIds(seedAchievements, "achievement");
const fallbackCertifications: Certification[] = withIds(seedCertifications, "cert");
const fallbackCompetitive: CompetitiveProfile[] = withIds(seedCompetitive, "cp");

function mapProject(doc: Record<string, unknown>): Project {
  return {
    id: String(doc._id),
    title: String(doc.title),
    slug: String(doc.slug),
    category: doc.category as Project["category"],
    shortDescription: String(doc.shortDescription || doc.description || ""),
    description: String(doc.description),
    skills: (doc.skills as string[]) ?? [],
    liveLink: doc.liveLink as string | undefined,
    githubLink: doc.githubLink as string | undefined,
    githubAccess: (doc.githubAccess as Project["githubAccess"]) ?? "REQUEST_ACCESS",
    thumbnail: doc.thumbnail as string | undefined,
    images: (doc.images as string[]) ?? [],
    video: doc.video as string | undefined,
    startDate: doc.startDate as string | undefined,
    endDate: doc.endDate as string | undefined,
    status: doc.status as Project["status"],
    isFeatured: Boolean(doc.isFeatured),
    featuredOrder: doc.featuredOrder as number | undefined,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  };
}

function mapAchievement(doc: Record<string, unknown>): Achievement {
  return {
    id: String(doc._id),
    title: String(doc.title),
    organization: doc.organization as string | undefined,
    date: doc.date as string | undefined,
    description: String(doc.description),
    image: doc.image as string | undefined,
    category: doc.category as string | undefined,
    link: doc.link as string | undefined,
    status: doc.status as Achievement["status"],
    isFeatured: Boolean(doc.isFeatured),
    featuredOrder: doc.featuredOrder as number | undefined,
  };
}

function mapCertification(doc: Record<string, unknown>): Certification {
  return {
    id: String(doc._id),
    title: String(doc.title),
    organization: String(doc.organization),
    type: doc.type as Certification["type"],
    date: doc.date as string | undefined,
    description: doc.description as string | undefined,
    image: doc.image as string | undefined,
    credentialId: doc.credentialId as string | undefined,
    credentialLink: doc.credentialLink as string | undefined,
    skills: (doc.skills as string[]) ?? [],
    status: doc.status as Certification["status"],
    isFeatured: Boolean(doc.isFeatured),
    featuredOrder: doc.featuredOrder as number | undefined,
  };
}

/** Only use seed/fallback when Mongo is unavailable — never override live admin data. */
function offline<T>(items: T[]): T[] {
  return items;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const db = await tryConnectDb();
  if (!db) return offline(fallbackProjects.filter((item) => item.status === "PUBLISHED"));
  const docs = await ProjectModel.find({ status: "PUBLISHED" }).sort({ updatedAt: -1 }).lean();
  return docs.map((doc) => mapProject(doc as Record<string, unknown>));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const db = await tryConnectDb();
  if (!db) {
    return offline(
      fallbackProjects
        .filter((item) => item.status === "PUBLISHED" && item.isFeatured)
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
        .slice(0, PROJECT_FEATURED_LIMIT),
    );
  }

  const featured = await ProjectModel.find({ status: "PUBLISHED", isFeatured: true })
    .sort({ featuredOrder: 1 })
    .limit(PROJECT_FEATURED_LIMIT)
    .lean();
  if (featured.length) {
    return featured.map((doc) => mapProject(doc as Record<string, unknown>));
  }

  // Admin published projects still show even if none are marked featured yet.
  const latest = await ProjectModel.find({ status: "PUBLISHED" })
    .sort({ updatedAt: -1 })
    .limit(PROJECT_FEATURED_LIMIT)
    .lean();
  return latest.map((doc) => mapProject(doc as Record<string, unknown>));
}

const SLIDER_COUNT = 5;

export async function getSliderProjects(count = SLIDER_COUNT): Promise<Project[]> {
  const published = await getPublishedProjects();
  if (!published.length) return [];

  const featured = published
    .filter((item) => item.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
  const rest = published.filter((item) => !item.isFeatured);
  const pool = featured.length ? [...featured, ...rest] : published;

  return Array.from({ length: Math.min(count, pool.length) }, (_, index) => pool[index % pool.length]);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = await tryConnectDb();
  if (!db) {
    return offline(fallbackProjects).find((item) => item.slug === slug && item.status === "PUBLISHED") ?? null;
  }
  const doc = await ProjectModel.findOne({ slug, status: "PUBLISHED" }).lean();
  return doc ? mapProject(doc as Record<string, unknown>) : null;
}

function attachUsedIn(skills: Skill[], projects: Array<{ title: string; slug: string; skills: string[] }>): Skill[] {
  return skills.map((skill) => {
    const fromSlugs = (skill.usedInSlugs ?? [])
      .map((slug) => projects.find((project) => project.slug === slug))
      .filter((project): project is { title: string; slug: string; skills: string[] } => Boolean(project))
      .map((project) => ({ title: project.title, slug: project.slug }));
    const usedIn =
      fromSlugs.length > 0
        ? fromSlugs
        : projects
            .filter((project) => project.skills.includes(skill.name))
            .map((project) => ({ title: project.title, slug: project.slug }));
    return { ...skill, usedIn };
  });
}

export async function getPublishedSkills(): Promise<Skill[]> {
  const db = await tryConnectDb();
  if (!db) {
    return attachUsedIn(
      offline(fallbackSkills.filter((item) => item.status === "PUBLISHED")),
      offline(fallbackProjects.filter((item) => item.status === "PUBLISHED")),
    );
  }
  const docs = await SkillModel.find({ status: "PUBLISHED" }).sort({ order: 1, name: 1 }).lean();
  const projects = await ProjectModel.find({ status: "PUBLISHED" }, { title: 1, slug: 1, skills: 1 }).lean();
  return docs.map((doc) => {
    const savedSlugs = ((doc.usedInSlugs as string[] | undefined) ?? []).filter(Boolean);
    const usedIn = savedSlugs.length
      ? projects
          .filter((project) => savedSlugs.includes(String(project.slug)))
          .map((project) => ({ title: String(project.title), slug: String(project.slug) }))
      : projects
          .filter((project) => (project.skills as string[]).includes(doc.name as string))
          .map((project) => ({ title: String(project.title), slug: String(project.slug) }));
    const rating = Number(doc.rating ?? (Number(doc.proficiency ?? 70) / 20));
    const storedCount = Number(doc.usedInCount);
    const usedInCount =
      Number.isFinite(storedCount) && storedCount > 0
        ? Math.min(5, storedCount)
        : usedIn.length
          ? Math.min(5, usedIn.length)
          : undefined;
    return {
      id: String(doc._id),
      name: String(doc.name),
      slug: String(doc.slug),
      category: doc.category as Skill["category"],
      icon: doc.icon as string | undefined,
      proficiency: Number(doc.proficiency ?? Math.round(rating * 20)),
      rating,
      description: doc.description as string | undefined,
      order: Number(doc.order ?? 0),
      status: doc.status as Skill["status"],
      usedInCount: usedInCount as Skill["usedInCount"],
      usedInSlugs: savedSlugs,
      usedIn,
    };
  });
}

export async function getFeaturedAchievements(): Promise<Achievement[]> {
  const db = await tryConnectDb();
  if (!db) {
    return offline(
      fallbackAchievements
        .filter((item) => item.status === "PUBLISHED" && item.isFeatured)
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
        .slice(0, FEATURED_LIMIT),
    );
  }
  const featured = await AchievementModel.find({ status: "PUBLISHED", isFeatured: true })
    .sort({ featuredOrder: 1 })
    .limit(FEATURED_LIMIT)
    .lean();
  if (featured.length) {
    return featured.map((doc) => mapAchievement(doc as Record<string, unknown>));
  }
  const latest = await AchievementModel.find({ status: "PUBLISHED" })
    .sort({ date: -1, updatedAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();
  return latest.map((doc) => mapAchievement(doc as Record<string, unknown>));
}

export async function getFeaturedAchievementShowcase(): Promise<Achievement[]> {
  return (await getFeaturedAchievements()).slice(0, FEATURED_LIMIT);
}

export async function getPublishedAchievements(): Promise<Achievement[]> {
  const db = await tryConnectDb();
  if (!db) return offline(fallbackAchievements.filter((item) => item.status === "PUBLISHED"));
  const docs = await AchievementModel.find({ status: "PUBLISHED" }).sort({ date: -1 }).lean();
  return docs.map((doc) => mapAchievement(doc as Record<string, unknown>));
}

export async function getFeaturedCertifications(): Promise<Certification[]> {
  const db = await tryConnectDb();
  if (!db) {
    return offline(
      fallbackCertifications
        .filter((item) => item.status === "PUBLISHED" && item.isFeatured)
        .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
        .slice(0, FEATURED_LIMIT),
    );
  }
  const featured = await CertificationModel.find({ status: "PUBLISHED", isFeatured: true })
    .sort({ featuredOrder: 1, updatedAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();
  if (featured.length) {
    return featured.map((doc) => mapCertification(doc as Record<string, unknown>));
  }
  const latest = await CertificationModel.find({ status: "PUBLISHED" })
    .sort({ date: -1, updatedAt: -1 })
    .limit(FEATURED_LIMIT)
    .lean();
  return latest.map((doc) => mapCertification(doc as Record<string, unknown>));
}

export async function getFeaturedCertificationShowcase(): Promise<Certification[]> {
  return (await getFeaturedCertifications()).slice(0, FEATURED_LIMIT);
}

export async function getPublishedCertifications(): Promise<Certification[]> {
  const db = await tryConnectDb();
  if (!db) return offline(fallbackCertifications.filter((item) => item.status === "PUBLISHED"));
  const docs = await CertificationModel.find({ status: "PUBLISHED" }).sort({ date: -1 }).lean();
  return docs.map((doc) => mapCertification(doc as Record<string, unknown>));
}

export async function getCompetitiveProfiles(): Promise<CompetitiveProfile[]> {
  const db = await tryConnectDb();
  if (!db) return offline(fallbackCompetitive.filter((item) => item.status === "PUBLISHED"));
  const docs = await CompetitiveModel.find({ status: "PUBLISHED" }).sort({ order: 1 }).lean();
  return docs.map((doc) => ({
    id: String(doc._id),
    platform: String(doc.platform),
    handle: doc.handle as string | undefined,
    description: String(doc.description),
    image: doc.image as string | undefined,
    link: doc.link as string | undefined,
    stats: doc.stats as string | undefined,
    order: Number(doc.order ?? 0),
    status: doc.status as CompetitiveProfile["status"],
  }));
}

export async function getCompetitiveStackProfiles(): Promise<CompetitiveProfile[]> {
  const profiles = await getCompetitiveProfiles();
  if (profiles.length) return profiles;
  const db = await tryConnectDb();
  if (db) return profiles;
  return offline(fallbackCompetitive);
}

export function getSkillsUsedIn(skillName: string, projects: Project[]) {
  return projects.filter((project) => project.skills.includes(skillName));
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const fallback: Testimonial[] = fallbackQuotes.map((item, index) => ({
    id: `quote-${index + 1}`,
    quote: item.quote,
    name: item.name,
    role: item.role,
    order: index,
    status: "PUBLISHED",
  }));
  const db = await tryConnectDb();
  if (!db) return offline(fallback);
  const docs = await TestimonialModel.find({ status: "PUBLISHED" }).sort({ order: 1, createdAt: -1 }).lean();
  if (!docs.length) return [];
  return docs.map((doc) => ({
    id: String(doc._id),
    quote: String(doc.quote),
    name: String(doc.name),
    role: String(doc.role),
    order: Number(doc.order ?? 0),
    status: doc.status as Testimonial["status"],
  }));
}
