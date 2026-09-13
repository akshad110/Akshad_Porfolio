import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="admin-heading text-3xl md:text-4xl">{title}</h1>
        {subtitle ? <p className="admin-mono mt-2 text-[11px] tracking-[0.16em] text-[#6b7180] uppercase">{subtitle}</p> : null}
      </div>
      {children ? <div className={cn("flex flex-wrap items-center gap-2")}>{children}</div> : null}
    </div>
  );
}

export function BentoTile({
  children,
  hero,
  className,
}: {
  children: React.ReactNode;
  hero?: boolean;
  className?: string;
}) {
  return <section className={cn("admin-tile p-5 md:p-6", hero && "admin-tile-hero", className)}>{children}</section>;
}
