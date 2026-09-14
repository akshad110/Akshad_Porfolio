import { Schema, type Model, type Types } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";

export type MediaDoc = {
  _id: Types.ObjectId;
  folder: string;
  filename: string;
  contentType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
};

const MediaSchema = new Schema<MediaDoc>(
  {
    folder: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

export const MediaModel =
  (mongoose.models?.Media as Model<MediaDoc> | undefined) ||
  mongoose.model<MediaDoc>("Media", MediaSchema);
