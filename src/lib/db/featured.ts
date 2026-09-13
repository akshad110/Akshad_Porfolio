import { Types } from "mongoose";
import { FEATURED_LIMIT } from "@/types";

type FeaturedModel = {
  countDocuments: (filter: Record<string, unknown>) => Promise<number>;
};

export async function assertFeaturedLimit(
  model: FeaturedModel,
  isFeatured: boolean,
  excludeId?: string,
  limit = FEATURED_LIMIT,
) {
  if (!isFeatured) return;
  const filter: Record<string, unknown> = { isFeatured: true };
  if (excludeId && Types.ObjectId.isValid(excludeId)) {
    filter._id = { $ne: excludeId };
  }
  const count = await model.countDocuments(filter);
  if (count >= limit) {
    throw new Error(`Only ${limit} items can be featured. Unfeature another item first.`);
  }
}

export function toId(doc: { _id: { toString(): string } }) {
  return doc._id.toString();
}
