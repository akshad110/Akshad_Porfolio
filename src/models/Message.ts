import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";
import type { MessageStatus } from "@/types";

export type MessageDoc = {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus | string;
  createdAt: Date;
  updatedAt: Date;
};

const MessageSchema = new Schema<MessageDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["UNREAD", "READ", "REPLIED", "ARCHIVED"],
      default: "UNREAD",
      index: true,
    },
  },
  { timestamps: true },
);

export const MessageModel =
  (mongoose.models?.Message as Model<MessageDoc> | undefined) ||
  mongoose.model<MessageDoc>("Message", MessageSchema);
