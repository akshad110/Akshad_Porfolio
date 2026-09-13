export function StatusPill({ value }: { value?: string }) {
  const text = String(value ?? "").toLowerCase();
  const tone =
    text === "published" || text === "replied" || text === "read"
      ? "admin-pill-live"
      : text === "draft" || text === "unread"
        ? "admin-pill-draft"
        : text === "archived"
          ? "admin-pill-muted"
          : "admin-pill-accent";
  return <span className={`admin-pill ${tone}`}>{value || "—"}</span>;
}
