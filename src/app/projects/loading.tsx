export default function Loading() {
  return (
    <div className="container-page section-space pt-24 md:pt-32">
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-12 w-2/3 max-w-md animate-pulse rounded bg-white/10" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse rounded-xl bg-white/8" />
        ))}
      </div>
    </div>
  );
}
