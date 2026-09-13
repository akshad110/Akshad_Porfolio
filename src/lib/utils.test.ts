import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/schemas";

describe("slugify", () => {
  it("creates SEO-friendly slugs", () => {
    expect(slugify("Nexume AI")).toBe("nexume-ai");
    expect(slugify("Tasneem Mukhwas")).toBe("tasneem-mukhwas");
  });
});

describe("contactSchema", () => {
  it("rejects short messages", () => {
    const result = contactSchema.safeParse({
      name: "A",
      email: "bad",
      subject: "Hi",
      message: "Hey",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid message", () => {
    const result = contactSchema.safeParse({
      name: "Akshad",
      email: "akshadvengurlekar35@gmail.com",
      subject: "Project inquiry",
      message: "I would like to discuss a full-stack product.",
    });
    expect(result.success).toBe(true);
  });
});
