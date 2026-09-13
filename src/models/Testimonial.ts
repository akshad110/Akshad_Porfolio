import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { ContentStatus } from "@/types";

export type TestimonialDoc = {
  quote: string;
  name: string;
  role: string;
  order: number;
  status: ContentStatus | string;
};

const TestimonialSchema = new Schema<TestimonialDoc>(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "PUBLISHED",
      index: true,
    },
  },
  { timestamps: true },
);

export const TestimonialModel =
  (mongoose.models?.Testimonial as Model<TestimonialDoc> | undefined) ||
  mongoose.model<TestimonialDoc>("Testimonial", TestimonialSchema);
