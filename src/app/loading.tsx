import { site } from "@/data/site";

export default function Loading() {
  const poster = site.heroVideoPoster.split("#")[0];
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#0e0f0f]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_88%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,15,15,0.72)_0%,rgba(14,15,15,0.28)_24%,transparent_50%)]" />
    </div>
  );
}
