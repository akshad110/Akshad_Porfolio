"use server";

import { revalidatePath } from "next/cache";
import { connectDb } from "@/lib/db/connect";
import { requireAdmin } from "@/lib/auth-utils";
import { ProjectModel } from "@/models/Project";
import { SkillModel } from "@/models/Skill";
import { AchievementModel } from "@/models/Achievement";
import { CertificationModel } from "@/models/Certification";
import { MessageModel } from "@/models/Message";
import { TestimonialModel } from "@/models/Testimonial";
import { assertFeaturedLimit } from "@/lib/db/featured";
import { saveImageUpload, saveProjectUploads } from "@/lib/uploads";
import { FEATURED_LIMIT, PROJECT_FEATURED_LIMIT } from "@/types";
import {
  achievementSchema,
  certificationSchema,
  projectSchema,
  skillSchema,
  testimonialSchema,
} from "@/lib/validation/schemas";
import { slugify } from "@/lib/utils";
import type { MessageStatus } from "@/types";

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/contact");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/skills");
  revalidatePath("/admin/achievements");
  revalidatePath("/admin/certifications");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/testimonials");
}

export async function saveProject(formData: FormData, id?: string) {
  await requireAdmin();
  await connectDb();

  const skillsRaw = String(formData.get("skills") ?? "");
  const description = String(formData.get("description") ?? "");
  const existing = [0, 1, 2]
    .map((index) => String(formData.get(`imageKeep${index}`) ?? "").trim())
    .filter(Boolean);

  let images: string[] = existing;
  try {
    images = await saveProjectUploads(formData, existing);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to upload images." };
  }

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(String(formData.get("title") ?? "")),
    category: formData.get("category") || "Other",
    description,
    shortDescription: description.slice(0, 180),
    skills: skillsRaw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    liveLink: formData.get("liveLink") || undefined,
    githubLink: formData.get("githubLink") || undefined,
    githubAccess: "REQUEST_ACCESS",
    thumbnail: images[0],
    images,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    status: "PUBLISHED",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid project." };
  }

  try {
    await assertFeaturedLimit(ProjectModel, parsed.data.isFeatured, id, PROJECT_FEATURED_LIMIT);
    if (id) {
      await ProjectModel.findByIdAndUpdate(id, parsed.data);
    } else {
      await ProjectModel.create(parsed.data);
    }
    revalidatePublic();
    revalidatePath(`/projects/${parsed.data.slug}`);
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save project." };
  }
}

export async function setProjectFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await connectDb();
  try {
    await assertFeaturedLimit(ProjectModel, isFeatured, id, PROJECT_FEATURED_LIMIT);
    await ProjectModel.findByIdAndUpdate(id, {
      isFeatured,
      featuredOrder: isFeatured ? PROJECT_FEATURED_LIMIT : undefined,
    });
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update featured state." };
  }
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await connectDb();
  await ProjectModel.findByIdAndDelete(id);
  revalidatePublic();
  return { ok: true };
}

export async function saveSkill(formData: FormData, id?: string) {
  await requireAdmin();
  await connectDb();

  const existing = String(formData.get("imageKeep") ?? "").trim() || undefined;
  let icon = existing;
  try {
    icon = (await saveImageUpload(formData, "image", "skills", existing)) || existing;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to upload image." };
  }

  const rating = Number(formData.get("rating") || 4);
  const usedInCount = Math.min(5, Math.max(1, Number(formData.get("usedInCount") || 1)));
  const parsed = skillSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    category: formData.get("category") || "Tools",
    icon,
    rating,
    proficiency: Math.round(rating * 20),
    usedInCount,
    order: formData.get("order") || 0,
    status: "PUBLISHED",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid skill." };
  }
  try {
    const payload = { ...parsed.data, usedInCount };
    if (id) {
      await SkillModel.findByIdAndUpdate(id, { $set: payload }, { runValidators: true, strict: false });
    } else {
      await SkillModel.create(payload);
    }
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    const duplicate = error && typeof error === "object" && "code" in error && error.code === 11000;
    return { error: duplicate ? "A skill with this name already exists." : "Unable to save skill." };
  }
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await connectDb();
  await SkillModel.findByIdAndDelete(id);
  revalidatePublic();
  return { ok: true };
}

export async function saveAchievement(formData: FormData, id?: string) {
  await requireAdmin();
  await connectDb();

  const existing = String(formData.get("imageKeep") ?? "").trim() || undefined;
  let image = existing;
  try {
    image = (await saveImageUpload(formData, "image", "achievements", existing)) || existing;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to upload image." };
  }

  const parsed = achievementSchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date") || undefined,
    description: formData.get("description"),
    image,
    status: "PUBLISHED",
    isFeatured: formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid achievement." };
  }
  try {
    await assertFeaturedLimit(AchievementModel, parsed.data.isFeatured, id, FEATURED_LIMIT);
    if (id) await AchievementModel.findByIdAndUpdate(id, parsed.data);
    else await AchievementModel.create(parsed.data);
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save achievement." };
  }
}

export async function setAchievementFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await connectDb();
  try {
    await assertFeaturedLimit(AchievementModel, isFeatured, id, FEATURED_LIMIT);
    await AchievementModel.findByIdAndUpdate(id, {
      isFeatured,
      featuredOrder: isFeatured ? FEATURED_LIMIT : undefined,
    });
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update featured state." };
  }
}

export async function deleteAchievement(id: string) {
  await requireAdmin();
  await connectDb();
  await AchievementModel.findByIdAndDelete(id);
  revalidatePublic();
  return { ok: true };
}

export async function saveCertification(formData: FormData, id?: string) {
  await requireAdmin();
  await connectDb();

  const existing = String(formData.get("imageKeep") ?? "").trim() || undefined;
  let image = existing;
  try {
    image = (await saveImageUpload(formData, "image", "certifications", existing)) || existing;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to upload image." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const parsed = certificationSchema.safeParse({
    title,
    organization: title || "Certificate",
    type: "CERTIFICATION",
    description: formData.get("description"),
    image,
    status: "PUBLISHED",
    isFeatured: true,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid certification." };
  }
  try {
    await assertFeaturedLimit(CertificationModel, true, id, FEATURED_LIMIT);
    const featuredCount = await CertificationModel.countDocuments({
      isFeatured: true,
      ...(id ? { _id: { $ne: id } } : {}),
    });
    const payload = { ...parsed.data, featuredOrder: featuredCount + 1 };
    if (id) await CertificationModel.findByIdAndUpdate(id, payload);
    else await CertificationModel.create(payload);
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save certification." };
  }
}

export async function setCertificationFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await connectDb();
  try {
    await assertFeaturedLimit(CertificationModel, isFeatured, id, FEATURED_LIMIT);
    await CertificationModel.findByIdAndUpdate(id, {
      isFeatured,
      featuredOrder: isFeatured ? FEATURED_LIMIT : undefined,
    });
    revalidatePublic();
    return { ok: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to update featured state." };
  }
}

export async function deleteCertification(id: string) {
  await requireAdmin();
  await connectDb();
  await CertificationModel.findByIdAndDelete(id);
  revalidatePublic();
  return { ok: true };
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  await requireAdmin();
  await connectDb();
  await MessageModel.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await connectDb();
  await MessageModel.findByIdAndDelete(id);
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

export async function saveTestimonial(formData: FormData, id?: string) {
  await requireAdmin();
  await connectDb();
  const parsed = testimonialSchema.safeParse({
    quote: formData.get("quote"),
    name: formData.get("name"),
    role: formData.get("role"),
    order: formData.get("order") || 0,
    status: "PUBLISHED",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid testimonial." };
  }
  if (id) await TestimonialModel.findByIdAndUpdate(id, parsed.data);
  else await TestimonialModel.create(parsed.data);
  revalidatePublic();
  return { ok: true };
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await connectDb();
  await TestimonialModel.findByIdAndDelete(id);
  revalidatePublic();
  return { ok: true };
}

export async function updateFeaturedOrder(
  collection: "projects" | "achievements" | "certifications",
  orderedIds: string[],
) {
  await requireAdmin();
  await connectDb();
  if (collection === "projects") {
    await ProjectModel.updateMany({}, { isFeatured: false, featuredOrder: undefined });
    await Promise.all(
      orderedIds.slice(0, PROJECT_FEATURED_LIMIT).map((id, index) =>
        ProjectModel.findByIdAndUpdate(id, { isFeatured: true, featuredOrder: index + 1 }),
      ),
    );
  } else if (collection === "achievements") {
    await AchievementModel.updateMany({}, { isFeatured: false, featuredOrder: undefined });
    await Promise.all(
      orderedIds.slice(0, 3).map((id, index) =>
        AchievementModel.findByIdAndUpdate(id, { isFeatured: true, featuredOrder: index + 1 }),
      ),
    );
  } else {
    await CertificationModel.updateMany({}, { isFeatured: false, featuredOrder: undefined });
    await Promise.all(
      orderedIds.slice(0, 3).map((id, index) =>
        CertificationModel.findByIdAndUpdate(id, { isFeatured: true, featuredOrder: index + 1 }),
      ),
    );
  }
  revalidatePublic();
  return { ok: true };
}
