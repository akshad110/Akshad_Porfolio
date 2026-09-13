import { z } from "zod";
import { CERT_TYPES, CONTENT_STATUS, GITHUB_ACCESS, PROJECT_CATEGORIES, SKILL_CATEGORIES } from "@/types";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email."),
  subject: z.string().trim().min(3, "Please add a subject.").max(120),
  message: z.string().trim().min(10, "Message should be at least 10 characters.").max(4000),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const optionalUrl = z
  .union([z.string().trim().url(), z.literal("")])
  .optional()
  .transform((value) => (value ? value : undefined));

export const projectSchema = z.object({
  title: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, "Use a lowercase SEO-friendly slug."),
  category: z.enum(PROJECT_CATEGORIES).optional(),
  description: z.string().trim().min(10, "Add a project description."),
  shortDescription: z.string().trim().min(10).optional(),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill."),
  liveLink: optionalUrl,
  githubLink: optionalUrl,
  githubAccess: z.enum(GITHUB_ACCESS).optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  video: z.string().optional(),
  status: z.enum(CONTENT_STATUS).optional(),
  isFeatured: z.boolean(),
  featuredOrder: z.coerce.number().int().min(1).max(5).optional(),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  category: z.enum(SKILL_CATEGORIES).optional(),
  icon: z.string().trim().min(1, "Please upload a skill image."),
  proficiency: z.coerce.number().min(0).max(100).optional(),
  rating: z.coerce.number().min(1).max(5),
  description: z.string().optional(),
  order: z.coerce.number().int().min(0).optional(),
  usedInCount: z.coerce.number().int().min(1).max(5).optional(),
  usedInSlugs: z.array(z.string().min(1)).optional(),
  status: z.enum(CONTENT_STATUS).optional(),
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2),
  organization: z.string().optional(),
  date: z.string().optional(),
  description: z.string().trim().min(8),
  image: z.string().optional(),
  category: z.string().optional(),
  link: optionalUrl,
  status: z.enum(CONTENT_STATUS).optional(),
  isFeatured: z.boolean(),
  featuredOrder: z.coerce.number().int().min(1).max(3).optional(),
});

export const certificationSchema = z.object({
  title: z.string().trim().min(2),
  organization: z.string().trim().min(2).optional(),
  type: z.enum(CERT_TYPES).optional(),
  date: z.string().optional(),
  description: z.string().trim().min(8),
  image: z.string().trim().min(1, "Please upload an image."),
  credentialId: z.string().optional(),
  credentialLink: optionalUrl,
  skills: z.array(z.string()).optional(),
  status: z.enum(CONTENT_STATUS).optional(),
  isFeatured: z.boolean(),
  featuredOrder: z.coerce.number().int().min(1).max(3).optional(),
});

export const testimonialSchema = z.object({
  quote: z.string().trim().min(8),
  name: z.string().trim().min(2),
  role: z.string().trim().min(2),
  order: z.coerce.number().int().min(0).optional(),
  status: z.enum(CONTENT_STATUS).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type AchievementInput = z.infer<typeof achievementSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
