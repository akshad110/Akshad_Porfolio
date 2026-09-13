import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { ContentStatus, SkillCategory } from "@/types";

export type SkillDoc = {
  name: string;
  slug: string;
  category: SkillCategory | string;
  icon?: string;
  proficiency: number;
  rating?: number;
  description?: string;
  order: number;
  usedInCount?: number;
  usedInSlugs: string[];
  status: ContentStatus | string;
};

const SkillSchema = new Schema<SkillDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, index: true },
    icon: String,
    proficiency: { type: Number, min: 0, max: 100, default: 70 },
    rating: { type: Number, min: 1, max: 5, default: 4 },
    description: String,
    order: { type: Number, default: 0 },
    usedInCount: { type: Number, min: 1, max: 5 },
    usedInSlugs: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "PUBLISHED",
      index: true,
    },
  },
  { timestamps: true },
);

export const SkillModel =
  (mongoose.models?.Skill as Model<SkillDoc> | undefined) ||
  mongoose.model<SkillDoc>("Skill", SkillSchema);

if (!SkillModel.schema.path("usedInCount")) {
  SkillModel.schema.add({ usedInCount: { type: Number, min: 1, max: 5 } });
}
