import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { ContentStatus } from "@/types";

export type AchievementDoc = {
  title: string;
  organization?: string;
  date?: string;
  description: string;
  image?: string;
  category?: string;
  link?: string;
  status: ContentStatus | string;
  isFeatured: boolean;
  featuredOrder?: number;
};

const AchievementSchema = new Schema<AchievementDoc>(
  {
    title: { type: String, required: true, trim: true },
    organization: String,
    date: String,
    description: { type: String, required: true },
    image: String,
    category: String,
    link: String,
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    featuredOrder: { type: Number, min: 1, max: 3 },
  },
  { timestamps: true },
);

export const AchievementModel =
  (mongoose.models?.Achievement as Model<AchievementDoc> | undefined) ||
  mongoose.model<AchievementDoc>("Achievement", AchievementSchema);
