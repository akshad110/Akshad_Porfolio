const COLORS: Record<string, string> = {
  java: "#E76F00",
  javascript: "#F7DF1E",
  c: "#00599C",
  python: "#3776AB",
  typescript: "#3178C6",
  react: "#61DAFB",
  "tailwind-css": "#38BDF8",
  gsap: "#88CE02",
  nodejs: "#5FA04E",
  expressjs: "#EDEDED",
  redis: "#FF4438",
  mongodb: "#47A248",
  mysql: "#4479A1",
  postgresql: "#4169E1",
  git: "#F05032",
  github: "#E6E6E6",
  postman: "#FF6C37",
  docker: "#2496ED",
  aws: "#FF9900",
  "ci-cd": "#2088FF",
  webrtc: "#333333",
  websocket: "#E6E6E6",
  razorpay: "#072654",
  "strapi-cms": "#4945FF",
  "shadcn-ui": "#E6E6E6",
  "restful-apis": "#009688",
};

function tileSvg(label: string, color: string) {
  const text = label.replace(/[^A-Za-z0-9+]/g, "").slice(0, 3).toUpperCase() || "SK";
  const fill = color.startsWith("#") && ["#EDEDED", "#E6E6E6"].includes(color) ? "#111111" : "#0E0F0F";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="36" fill="${color}"/>
    <text x="80" y="96" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="700" fill="${fill}">${text}</text>
  </svg>`;
}

export function skillLogoSrc(icon: string | undefined, slug: string, name?: string) {
  if (icon) return icon;
  const color = COLORS[slug] ?? "#22B3D7";
  const label = name?.slice(0, 3) ?? slug.slice(0, 3);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(tileSvg(label, color))}`;
}
