import { Download } from "lucide-react";
import { site } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export const metadata = createMetadata({
  title: "Resume",
  description: "View and download Akshad Vengurlekar's resume.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="section-space pt-24 md:pt-28">
      <Container className="max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Resume</p>
            <h1 className="font-heading mt-3 text-[clamp(2rem,7vw,3.5rem)]">Akshad Vengurlekar</h1>
            <p className="mt-2 text-foreground-secondary italic">Open the PDF below or download a copy.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={site.resume}
              download="Akshad-Vengurlekar-Resume.pdf"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3 font-heading text-sm tracking-[0.14em] text-background uppercase transition-colors hover:bg-accent-hover"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <Button href="/contact" variant="secondary">
              Hire Me
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-background-secondary shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <iframe
            title="Akshad Vengurlekar resume"
            src={`${site.resume}#view=FitH`}
            className="h-[78dvh] w-full bg-white"
          />
        </div>
      </Container>
    </div>
  );
}
