export type ServiceVisualId = "layers" | "palette" | "server" | "store" | "cube";

const VISUALS: ServiceVisualId[] = ["layers", "palette", "server", "store", "cube"];

export function visualForIndex(index: number): ServiceVisualId {
  return VISUALS[index % VISUALS.length];
}

export function ServiceVisual({ id }: { id: ServiceVisualId }) {
  switch (id) {
    case "layers":
      return <LayersMark />;
    case "palette":
      return <PaletteMark />;
    case "server":
      return <ServerMark />;
    case "store":
      return <StoreMark />;
    case "cube":
      return <CubeMark />;
    default:
      return null;
  }
}

function LayersMark() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="svc-layer-a" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#6a7178" />
          <stop offset="100%" stopColor="#2b2c2e" />
        </radialGradient>
        <radialGradient id="svc-layer-b" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#8c9eab" />
          <stop offset="100%" stopColor="#393b3e" />
        </radialGradient>
        <radialGradient id="svc-layer-c" cx="35%" cy="20%" r="75%">
          <stop offset="0%" stopColor="#d9dbdc" />
          <stop offset="100%" stopColor="#4c5c68" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="208" rx="52" ry="9" fill="rgba(0,0,0,0.38)" />
      <rect x="52" y="96" width="136" height="84" rx="18" fill="url(#svc-layer-a)" />
      <rect x="64" y="74" width="112" height="28" rx="12" fill="url(#svc-layer-b)" />
      <rect x="76" y="52" width="88" height="28" rx="12" fill="url(#svc-layer-c)" />
      <rect x="70" y="118" width="48" height="8" rx="4" fill="#22b3d7" />
      <rect x="70" y="136" width="92" height="6" rx="3" fill="rgba(248,248,248,0.28)" />
      <rect x="70" y="150" width="70" height="6" rx="3" fill="rgba(248,248,248,0.18)" />
    </svg>
  );
}

function PaletteMark() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="svc-pal" cx="32%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#b4b7b9" />
        </radialGradient>
        <radialGradient id="svc-brush" cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#d9dbdc" />
          <stop offset="100%" stopColor="#4c5c68" />
        </radialGradient>
      </defs>
      <ellipse cx="118" cy="208" rx="50" ry="9" fill="rgba(0,0,0,0.38)" />
      <path
        d="M64 108c0-36 34-62 70-62 32 0 58 20 64 46 5 20-8 34-26 34h-16c-10 22-34 34-56 26-26-10-36-26-36-44z"
        fill="url(#svc-pal)"
      />
      <circle cx="98" cy="96" r="10" fill="#2b2c2e" />
      <circle cx="126" cy="86" r="10" fill="#1985a1" />
      <circle cx="150" cy="102" r="10" fill="#393b3e" />
      <circle cx="106" cy="124" r="10" fill="#8e9297" />
      <path d="M176 118c22 6 34 26 26 46-8 16-26 22-40 10l-22-34c10-6 22-16 36-22z" fill="url(#svc-brush)" />
    </svg>
  );
}

function ServerMark() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="svc-srv" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4c5c68" />
          <stop offset="100%" stopColor="#1c1e1f" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="208" rx="52" ry="9" fill="rgba(0,0,0,0.38)" />
      <rect x="58" y="62" width="124" height="36" rx="12" fill="url(#svc-srv)" />
      <rect x="58" y="104" width="124" height="36" rx="12" fill="#2b2c2e" />
      <rect x="58" y="146" width="124" height="36" rx="12" fill="url(#svc-srv)" />
      <circle cx="80" cy="80" r="5" fill="#22b3d7" />
      <circle cx="80" cy="122" r="5" fill="#8e9297" />
      <circle cx="80" cy="164" r="5" fill="#22b3d7" />
      <rect x="96" y="76" width="60" height="8" rx="4" fill="rgba(248,248,248,0.22)" />
      <rect x="96" y="118" width="60" height="8" rx="4" fill="rgba(248,248,248,0.16)" />
      <rect x="96" y="160" width="60" height="8" rx="4" fill="rgba(248,248,248,0.22)" />
    </svg>
  );
}

function StoreMark() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="svc-bag" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#f1f1f1" />
          <stop offset="100%" stopColor="#8e9297" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="208" rx="48" ry="9" fill="rgba(0,0,0,0.38)" />
      <path d="M78 98h84l-10 78H88z" fill="url(#svc-bag)" />
      <path
        d="M96 98c0-20 10-36 24-36s24 16 24 36"
        fill="none"
        stroke="#4c5c68"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect x="104" y="126" width="32" height="22" rx="5" fill="#1985a1" />
    </svg>
  );
}

function CubeMark() {
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="svc-cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8c9eab" />
          <stop offset="100%" stopColor="#4c5c68" />
        </linearGradient>
        <linearGradient id="svc-cube-r" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#393b3e" />
          <stop offset="100%" stopColor="#1c1e1f" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="208" rx="50" ry="9" fill="rgba(0,0,0,0.38)" />
      <path d="M120 54l58 32v64l-58 32-58-32V86z" fill="#2b2c2e" />
      <path d="M120 54l58 32-58 32-58-32z" fill="url(#svc-cube-top)" />
      <path d="M120 118l58-32v64l-58 32z" fill="url(#svc-cube-r)" />
      <path d="M120 118l-58-32v64l58 32z" fill="#151718" />
      <path d="M120 54v64" stroke="#22b3d7" strokeWidth="2.2" />
    </svg>
  );
}
