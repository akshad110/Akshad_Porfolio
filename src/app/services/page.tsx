import { ServicesPageContent } from "@/components/services/ServicesPageContent";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Full-stack development, frontend, APIs, e-commerce, interactive web experiences, and CI/CD from Akshad Vengurlekar.",
  path: "/services",
});

export default function ServicesPage() {
  return <ServicesPageContent />;
}
