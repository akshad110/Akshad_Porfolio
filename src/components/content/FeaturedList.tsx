import Link from "next/link";
import type { Achievement, Certification } from "@/types";
import { Button } from "@/components/ui/Button";
import { Container, EmptyState, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

export function FeaturedList({
  kicker,
  title,
  description,
  href,
  items,
  emptyTitle,
  className,
}: {
  kicker: string;
  title: string;
  description: string;
  href: string;
  items: Array<Achievement | Certification>;
  emptyTitle: string;
  className?: string;
}) {
  return (
    <section className={cn(className ?? "section-space")}>
      <Container>
        <SectionHeading kicker={kicker} title={title} description={description} />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.length ? (
            items.map((item, index) => (
              <article key={item.id} className="rounded-lg border border-border bg-background-secondary p-6">
                <p className="section-kicker">0{index + 1}</p>
                <h3 className="font-heading mt-3 text-2xl">{item.title}</h3>
                {"organization" in item && item.organization ? (
                  <p className="mt-2 text-muted">{item.organization}</p>
                ) : null}
                <p className="mt-4 text-foreground-secondary italic">
                  {"description" in item ? item.description : null}
                </p>
              </article>
            ))
          ) : (
            <div className="md:col-span-3">
              <EmptyState title={emptyTitle} text="Featured items are selected from the admin CMS." />
            </div>
          )}
        </div>
        <div className="mt-10">
          <Button href={href} variant="secondary">
            See More
          </Button>
        </div>
      </Container>
    </section>
  );
}

export function AchievementGrid({ items }: { items: Achievement[] }) {
  if (!items.length) {
    return <EmptyState title="No achievements published yet" text="Add and publish achievements from the admin." />;
  }
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-border bg-background-secondary p-6">
          <h3 className="font-heading text-2xl">{item.title}</h3>
          <p className="mt-2 text-muted">
            {[item.organization, item.date].filter(Boolean).join(" · ")}
          </p>
          <p className="mt-4 text-foreground-secondary italic">{item.description}</p>
          {item.link ? (
            <Link href={item.link} className="mt-4 inline-block text-sm text-accent-bright" target="_blank">
              View
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export function CertificationGrid({ items }: { items: Certification[] }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No certifications published yet"
        text="Add and publish certifications or courses from the admin."
      />
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-border bg-background-secondary p-6">
          <p className="section-kicker">{item.type === "COURSE" ? "Course" : "Certification"}</p>
          <h3 className="font-heading mt-2 text-2xl">{item.title}</h3>
          <p className="mt-2 text-muted">
            {[item.organization, item.date].filter(Boolean).join(" · ")}
          </p>
          {item.description ? <p className="mt-4 text-foreground-secondary italic">{item.description}</p> : null}
          {item.credentialLink ? (
            <a
              href={item.credentialLink}
              className="mt-4 inline-block text-sm text-accent-bright"
              target="_blank"
              rel="noopener noreferrer"
            >
              View credential
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}
