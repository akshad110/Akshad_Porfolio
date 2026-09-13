import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { CertificationType, ContentStatus } from "@/types";

export type CertificationDoc = {
  title: string;
  organization: string;
  type: CertificationType | string;
  date?: string;
  description?: string;
  image?: string;
  credentialId?: string;
  credentialLink?: string;
  skills: string[];
  status: ContentStatus | string;
  isFeatured: boolean;
  featuredOrder?: number;
};

const CertificationSchema = new Schema<CertificationDoc>(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true },
    type: { type: String, enum: ["CERTIFICATION", "COURSE"], required: true },
    date: String,
    description: String,
    image: String,
    credentialId: String,
    credentialLink: String,
    skills: { type: [String], default: [] },
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

export const CertificationModel =
  (mongoose.models?.Certification as Model<CertificationDoc> | undefined) ||
  mongoose.model<CertificationDoc>("Certification", CertificationSchema);
