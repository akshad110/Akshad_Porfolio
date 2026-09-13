export const CONTENT_STATUS = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type ContentStatus = (typeof CONTENT_STATUS)[number];

export const GITHUB_ACCESS = [
  "PUBLIC",
  "PRIVATE",
  "REQUEST_ACCESS",
  "NOT_AVAILABLE",
] as const;
export type GithubAccess = (typeof GITHUB_ACCESS)[number];

export const PROJECT_CATEGORIES = [
  "AI",
  "Web Development",
  "Full Stack",
  "3D Web",
  "E-Commerce",
  "Developer Tool",
  "Mobile",
  "Automation",
  "Other",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const SKILL_CATEGORIES = [
  "Language",
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Tools",
  "CS Fundamentals",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const CERT_TYPES = ["CERTIFICATION", "COURSE"] as const;
export type CertificationType = (typeof CERT_TYPES)[number];

export const MESSAGE_STATUS = ["UNREAD", "READ", "REPLIED", "ARCHIVED"] as const;
export type MessageStatus = (typeof MESSAGE_STATUS)[number];

export const USED_IN_COUNTS = [1, 2, 3, 4, 5] as const;
export type UsedInCount = (typeof USED_IN_COUNTS)[number];

export type Skill = {
  id: string;
  name: string;
  slug: string;
  category: SkillCategory;
  icon?: string;
  proficiency: number;
  rating?: number;
  description?: string;
  order: number;
  status: ContentStatus;
  usedInCount?: UsedInCount;
  usedInSlugs?: string[];
  usedIn?: Array<{ title: string; slug: string }>;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  shortDescription: string;
  description: string;
  skills: string[];
  liveLink?: string;
  githubLink?: string;
  githubAccess: GithubAccess;
  thumbnail?: string;
  images: string[];
  video?: string;
  startDate?: string;
  endDate?: string;
  status: ContentStatus;
  isFeatured: boolean;
  featuredOrder?: number;
  createdAt: string;
  updatedAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  organization?: string;
  date?: string;
  description: string;
  image?: string;
  category?: string;
  link?: string;
  status: ContentStatus;
  isFeatured: boolean;
  featuredOrder?: number;
};

export type Certification = {
  id: string;
  title: string;
  organization: string;
  type: CertificationType;
  date?: string;
  description?: string;
  image?: string;
  credentialId?: string;
  credentialLink?: string;
  skills: string[];
  status: ContentStatus;
  isFeatured: boolean;
  featuredOrder?: number;
};

export type CompetitiveProfile = {
  id: string;
  platform: string;
  handle?: string;
  description: string;
  image?: string;
  link?: string;
  stats?: string;
  order: number;
  status: ContentStatus;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  order: number;
  status: ContentStatus;
};

export const FEATURED_LIMIT = 3;
export const PROJECT_FEATURED_LIMIT = 5;
