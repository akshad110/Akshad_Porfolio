import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: {
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="section-kicker mb-4">{kicker}</p>
      <h2 className="font-heading text-[clamp(1.75rem,6.5vw,3.75rem)] leading-tight font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-secondary italic md:mt-5 md:text-xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-background-secondary px-6 py-12 text-center">
      <p className="font-heading text-xl">{title}</p>
      <p className="mt-2 text-muted">{text}</p>
    </div>
  );
}
