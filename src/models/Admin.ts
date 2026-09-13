import { Schema, type Model } from "mongoose";
import { mongoose } from "@/lib/db/mongoose";

export type AdminDoc = {
  email: string;
  passwordHash: string;
  name: string;
};

const AdminSchema = new Schema<AdminDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Admin" },
  },
  { timestamps: true },
);

export const AdminModel =
  (mongoose.models?.Admin as Model<AdminDoc> | undefined) ||
  mongoose.model<AdminDoc>("Admin", AdminSchema);
