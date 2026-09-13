import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
  external,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-heading text-sm tracking-[0.14em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" &&
      "bg-foreground text-background hover:bg-accent-hover hover:text-background",
    variant === "secondary" &&
      "border border-border bg-transparent text-foreground hover:border-accent-bright hover:text-accent-hover",
    variant === "ghost" && "text-muted hover:text-foreground",
    className,
  );

  if (href) {
    const isHashLink = href.includes("#");
    if (isHashLink || external) {
      return (
        <a
          href={href}
          className={styles}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={styles} prefetch={false}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={styles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
