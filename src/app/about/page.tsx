import { AboutPageContent } from "@/components/about/AboutPageContent";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About Me",
  description:
    "Learn about Akshad Vengurlekar — Computer Science Engineering student, freelance full-stack developer, and competitive programmer.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
