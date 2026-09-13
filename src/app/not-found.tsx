import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="section-kicker">404</p>
      <h1 className="font-heading mt-4 text-6xl md:text-8xl">Page Not Found</h1>
      <p className="mt-5 max-w-md text-foreground-secondary italic">
        The page you’re looking for doesn’t exist.
      </p>
      <div className="mt-10">
        <Button href="/">Back Home</Button>
      </div>
    </div>
  );
}
