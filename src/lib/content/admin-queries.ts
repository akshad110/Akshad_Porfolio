import { tryConnectDb } from "@/lib/db/connect";
import { ProjectModel } from "@/models/Project";
import { SkillModel } from "@/models/Skill";
import { AchievementModel } from "@/models/Achievement";
import { CertificationModel } from "@/models/Certification";
import { MessageModel } from "@/models/Message";
import { TestimonialModel } from "@/models/Testimonial";

export async function getAdminStats() {
  const db = await tryConnectDb();
  if (!db) {
    return {
      projects: 0,
      skills: 0,
      achievements: 0,
      certifications: 0,
      messages: 0,
      unread: 0,
      testimonials: 0,
      featuredProjects: 0,
      featuredAchievements: 0,
      featuredCertifications: 0,
      publishedProjects: 0,
    };
  }
  const [
    projects,
    skills,
    achievements,
    certifications,
    messages,
    unread,
    testimonials,
    featuredProjects,
    featuredAchievements,
    featuredCertifications,
    publishedProjects,
  ] = await Promise.all([
    ProjectModel.countDocuments(),
    SkillModel.countDocuments(),
    AchievementModel.countDocuments(),
    CertificationModel.countDocuments(),
    MessageModel.countDocuments(),
    MessageModel.countDocuments({ status: "UNREAD" }),
    TestimonialModel.countDocuments(),
    ProjectModel.countDocuments({ isFeatured: true }),
    AchievementModel.countDocuments({ isFeatured: true }),
    CertificationModel.countDocuments({ isFeatured: true }),
    ProjectModel.countDocuments({ status: "PUBLISHED" }),
  ]);
  return {
    projects,
    skills,
    achievements,
    certifications,
    messages,
    unread,
    testimonials,
    featuredProjects,
    featuredAchievements,
    featuredCertifications,
    publishedProjects,
  };
}

export async function getAdminProjects() {
  const db = await tryConnectDb();
  if (!db) return [];
  return ProjectModel.find().sort({ updatedAt: -1 }).lean();
}

export async function getAdminProject(id: string) {
  const db = await tryConnectDb();
  if (!db) return null;
  return ProjectModel.findById(id).lean();
}

export async function getAdminProjectOptions() {
  const db = await tryConnectDb();
  if (!db) return [];
  const docs = await ProjectModel.find({ status: "PUBLISHED" }, { title: 1, slug: 1 }).sort({ title: 1 }).lean();
  return docs.map((doc) => ({ title: String(doc.title), slug: String(doc.slug) }));
}

export async function getAdminSkills() {
  const db = await tryConnectDb();
  if (!db) return [];
  return SkillModel.find().sort({ order: 1 }).lean();
}

export async function getAdminSkill(id: string) {
  const db = await tryConnectDb();
  if (!db) return null;
  return SkillModel.findById(id).lean();
}

export async function getAdminAchievements() {
  const db = await tryConnectDb();
  if (!db) return [];
  return AchievementModel.find().sort({ updatedAt: -1 }).lean();
}

export async function getAdminAchievement(id: string) {
  const db = await tryConnectDb();
  if (!db) return null;
  return AchievementModel.findById(id).lean();
}

export async function getAdminCertifications() {
  const db = await tryConnectDb();
  if (!db) return [];
  return CertificationModel.find().sort({ updatedAt: -1 }).lean();
}

export async function getAdminCertification(id: string) {
  const db = await tryConnectDb();
  if (!db) return null;
  return CertificationModel.findById(id).lean();
}

export async function getAdminMessages() {
  const db = await tryConnectDb();
  if (!db) return [];
  return MessageModel.find().sort({ createdAt: -1 }).lean();
}

export async function getAdminMessage(id: string) {
  const db = await tryConnectDb();
  if (!db) return null;
  return MessageModel.findById(id).lean();
}

export async function getAdminTestimonials() {
  const db = await tryConnectDb();
  if (!db) return [];
  return TestimonialModel.find().sort({ order: 1, updatedAt: -1 }).lean();
}

export async function getAdminTestimonial(id: string) {
  const db = await tryConnectDb();
  if (!db) return null;
  return TestimonialModel.findById(id).lean();
}
