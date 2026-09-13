import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { GithubAccess, ProjectCategory, ContentStatus } from "@/types";

export type ProjectDoc = {
  title: string;
  slug: string;
  category: ProjectCategory | string;
  shortDescription: string;
  description: string;
  skills: string[];
  liveLink?: string;
  githubLink?: string;
  githubAccess: GithubAccess | string;
  thumbnail?: string;
  images: string[];
  video?: string;
  startDate?: string;
  endDate?: string;
  status: ContentStatus | string;
  isFeatured: boolean;
  featuredOrder?: number;
  createdAt: Date;
  updatedAt: Date;
};

const ProjectSchema = new Schema<ProjectDoc>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String, required: true }],
    liveLink: String,
    githubLink: String,
    githubAccess: {
      type: String,
      enum: ["PUBLIC", "PRIVATE", "REQUEST_ACCESS", "NOT_AVAILABLE"],
      default: "REQUEST_ACCESS",
    },
    thumbnail: String,
    images: { type: [String], default: [] },
    video: String,
    startDate: String,
    endDate: String,
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true },
);

ProjectSchema.index({ status: 1, isFeatured: 1, featuredOrder: 1 });

export const ProjectModel =
  (mongoose.models?.Project as Model<ProjectDoc> | undefined) ||
  mongoose.model<ProjectDoc>("Project", ProjectSchema);
