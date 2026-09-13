import bcrypt from "bcryptjs";
import { connectDb } from "../src/lib/db/connect";
import { AdminModel } from "../src/models/Admin";
import { ProjectModel } from "../src/models/Project";
import { SkillModel } from "../src/models/Skill";
import { AchievementModel } from "../src/models/Achievement";
import { CertificationModel } from "../src/models/Certification";
import { CompetitiveModel } from "../src/models/Competitive";
import { seedCompetitive, seedProjects, seedSkills } from "../src/data/seed";
import { testimonials as seedTestimonials } from "../src/data/site";
import { TestimonialModel } from "../src/models/Testimonial";

async function seed() {
  await connectDb();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await AdminModel.findOneAndUpdate(
      { email },
      { email, passwordHash, name: "Akshad Vengurlekar" },
      { upsert: true },
    );
  }

  for (const skill of seedSkills) {
    if (!skill.icon) continue;
    const existing = await SkillModel.findOne({ slug: skill.slug }).lean();
    const keepUpload =
      typeof existing?.icon === "string" && existing.icon.startsWith("/uploads/");

    await SkillModel.findOneAndUpdate(
      { slug: skill.slug },
      {
        $set: {
          name: skill.name,
          slug: skill.slug,
          category: skill.category,
          icon: keepUpload ? existing.icon : skill.icon,
          rating: existing?.rating ?? skill.rating ?? 4,
          proficiency: skill.proficiency,
          usedInCount: existing?.usedInCount ?? skill.usedInCount,
          order: skill.order,
          status: "PUBLISHED",
        },
      },
      { upsert: true },
    );
  }

  if ((await SkillModel.countDocuments()) === 0) {
    await SkillModel.insertMany(seedSkills);
  }

  if ((await ProjectModel.countDocuments()) === 0) {
    await ProjectModel.insertMany(seedProjects);
  }

  for (const profile of seedCompetitive) {
    await CompetitiveModel.findOneAndUpdate(
      { platform: profile.platform },
      {
        $set: {
          platform: profile.platform,
          handle: profile.handle,
          description: profile.description,
          image: profile.image,
          link: profile.link,
          stats: profile.stats,
          order: profile.order,
          status: "PUBLISHED",
        },
      },
      { upsert: true },
    );
  }

  if ((await AchievementModel.countDocuments()) === 0) {
    // Intentionally empty — add achievements from /admin/achievements
  }

  if ((await CertificationModel.countDocuments()) === 0) {
    // Intentionally empty — add certifications from /admin/certifications
  }

  for (const [index, item] of seedTestimonials.entries()) {
    await TestimonialModel.findOneAndUpdate(
      { name: item.name },
      {
        $set: {
          quote: item.quote,
          name: item.name,
          role: item.role,
          order: index,
          status: "PUBLISHED",
        },
      },
      { upsert: true },
    );
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
