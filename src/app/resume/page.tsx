import { Download } from "lucide-react";
import { site } from "@/data/site";
import { createMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Section";

export const metadata = createMetadata({
  title: "Resume",
  description: "View and download Akshad Vengurlekar's resume.",
  path: "/resume",
});

export default function ResumePage() {
  const fileName = "Akshad-Vengurlekar-Resume.pdf";

  return (
    <div className="pt-20 md:pt-24">
      <div className="sticky top-[4.25rem] z-20 border-b border-border bg-[#0e0f0f]/92 backdrop-blur-md md:top-[4.75rem]">
        <Container className="flex max-w-5xl items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="section-kicker text-[0.7rem]">Resume</p>
            <h1 className="font-heading truncate text-sm tracking-[0.12em] uppercase sm:text-base">
              Akshad Vengurlekar
            </h1>
          </div>
          <a
            href={site.resume}
            download={fileName}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 font-heading text-xs tracking-[0.14em] text-background uppercase transition-colors hover:bg-accent-hover sm:px-5 sm:text-sm"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        </Container>
      </div>

      <Container className="max-w-5xl section-space pt-6 md:pt-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-background-secondary shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <iframe
            title="Akshad Vengurlekar resume"
            src={`${site.resume}#toolbar=0&view=FitH`}
            className="h-[78dvh] w-full bg-white"
          />
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          If the preview does not load,{" "}
          <a href={site.resume} download={fileName} className="text-accent-soft underline-offset-2 hover:underline">
            download the PDF
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
