import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { ContentStatus } from "@/types";

export type CompetitiveDoc = {
  platform: string;
  handle?: string;
  description: string;
  image?: string;
  link?: string;
  stats?: string;
  order: number;
  status: ContentStatus | string;
};

const CompetitiveSchema = new Schema<CompetitiveDoc>(
  {
    platform: { type: String, required: true, trim: true },
    handle: String,
    description: { type: String, required: true },
    image: String,
    link: String,
    stats: String,
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "PUBLISHED",
    },
  },
  { timestamps: true },
);

export const CompetitiveModel =
  (mongoose.models?.CompetitiveProfile as Model<CompetitiveDoc> | undefined) ||
  mongoose.model<CompetitiveDoc>("CompetitiveProfile", CompetitiveSchema);
