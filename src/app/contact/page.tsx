import { Contact } from "@/components/contact/Contact";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Start a conversation with Akshad Vengurlekar about full-stack product work, interfaces, and interactive web experiences.",
  path: "/contact",
});

export default function ContactPage() {
  return <Contact autoOpen />;
}
