import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader, BentoTile } from "@/components/admin/AdminPageHeader";
import { PROJECT_FEATURED_LIMIT } from "@/types";

type Stats = {
  projects: number;
  skills: number;
  achievements: number;
  certifications: number;
  messages: number;
  unread: number;
  testimonials: number;
  featuredProjects: number;
  publishedProjects: number;
};

type ActivityItem = {
  id: string;
  name: string;
  title: string;
  time: string;
  kind: "signup" | "upgrade" | "failed" | "workspace" | "downgrade";
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  views: string;
  conv: string;
  rising: boolean;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function polyline(values: number[], width: number, height: number, pad = 4) {
  if (!values.length) return "";
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  return values
    .map((value, index) => {
      const x = pad + (index / Math.max(values.length - 1, 1)) * (width - pad * 2);
      const y = height - pad - ((value - min) / span) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function RevenueChart({ series, labels }: { series: number[]; labels: string[] }) {
  const width = 640;
  const height = 220;
  const padL = 44;
  const padR = 12;
  const padT = 28;
  const padB = 28;
  const max = Math.max(...series, 4);
  const yMax = Math.ceil(max / 4) * 4 || 4;
  const ticks = [0, yMax * 0.33, yMax * 0.66, yMax].map((n) => Math.round(n));
  const points = series.map((value, index) => {
    const x = padL + (index / Math.max(series.length - 1, 1)) * (width - padL - padR);
    const y = padT + (1 - value / yMax) * (height - padT - padB);
    return { x, y, value };
  });
  const peak = points.reduce((best, point) => (point.value >= best.value ? point : best), points[0] ?? { x: 0, y: 0, value: 0 });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${padL},${height - padB} ${line} ${points.at(-1)?.x ?? padL},${height - padB}`;
  const peakLabel = labels[series.indexOf(peak.value)] ?? labels.at(-2) ?? "Peak";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 h-[220px] w-full" role="img" aria-label="Content activity">
      <defs>
        <linearGradient id="pulseFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22b3d7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22b3d7" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((tick) => {
        const y = padT + (1 - tick / yMax) * (height - padT - padB);
        return (
          <g key={tick}>
            <line x1={padL} x2={width - padR} y1={y} y2={y} stroke="#393b3e" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} textAnchor="end" fill="#6b7180" fontSize="10" fontFamily="IBM Plex Mono, monospace">
              {tick}
            </text>
          </g>
        );
      })}
      <polygon points={area} fill="url(#pulseFill)" />
      <polyline points={line} fill="none" stroke="#22b3d7" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {peak.value > 0 ? (
        <>
          <line x1={peak.x} x2={peak.x} y1={peak.y} y2={peak.y - 22} stroke="#22b3d7" strokeWidth="1" />
          <circle cx={peak.x} cy={peak.y} r="5" fill="#0e0f0f" stroke="#22b3d7" strokeWidth="2" />
          <rect x={peak.x - 54} y={peak.y - 42} width="108" height="20" rx="8" fill="#0e0f0f" stroke="#393b3e" />
          <text x={peak.x} y={peak.y - 28} textAnchor="middle" fill="#f2f3f7" fontSize="10" fontFamily="IBM Plex Mono, monospace">
            {peakLabel} · {peak.value}
          </text>
        </>
      ) : null}
      {labels.map((label, index) => {
        const x = padL + (index / Math.max(labels.length - 1, 1)) * (width - padL - padR);
        return (
          <text key={label} x={x} y={height - 8} textAnchor="middle" fill="#6b7180" fontSize="10" fontFamily="IBM Plex Mono, monospace">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const width = 220;
  const height = 42;
  const points = polyline(values.length ? values : [2, 3, 2, 4, 3, 5, 4], width, height);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-6 h-10 w-full" aria-hidden>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MicroBars({ values }: { values: number[] }) {
  const bars = values.length ? values : [4, 6, 5, 7, 6, 8, 10];
  const max = Math.max(...bars, 1);
  return (
    <svg viewBox="0 0 220 42" className="mt-6 h-10 w-full" aria-hidden>
      {bars.slice(0, 7).map((value, index) => {
        const h = Math.max(6, (value / max) * 34);
        return (
          <rect
            key={index}
            x={index * 30 + 8}
            y={42 - h}
            width="16"
            height={h}
            rx="3"
            fill="#f5b544"
            opacity={index === Math.min(bars.length, 7) - 1 ? 1 : 0.45 + index * 0.07}
          />
        );
      })}
    </svg>
  );
}

function TrendSpark({ rising }: { rising: boolean }) {
  const values = rising ? [2, 3, 3, 5, 6, 8] : [8, 7, 6, 5, 4, 3];
  return (
    <svg viewBox="0 0 72 22" className="h-5 w-[72px]" aria-hidden>
      <polyline
        points={polyline(values, 72, 22, 2)}
        fill="none"
        stroke={rising ? "#34d399" : "#fb7185"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Donut({
  segments,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 58;
  const stroke = 16;
  const c = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 160" className="h-44 w-44">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#393b3e" strokeWidth={stroke} />
        {segments.map((item) => {
          const len = (item.value / total) * c;
          const dash = `${len} ${c - len}`;
          const node = (
            <circle
              key={item.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
              strokeLinecap="butt"
            />
          );
          offset += len;
          return node;
        })}
        <text x="80" y="76" textAnchor="middle" fill="#f2f3f7" fontSize="18" fontFamily="IBM Plex Mono, monospace">
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" fill="#6b7180" fontSize="9" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.4">
          RECORDS
        </text>
      </svg>
      <ul className="mt-4 w-full space-y-2">
        {segments.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[#a6abb8]">
              <span className="size-2 rounded-full" style={{ background: item.color }} />
              {item.label}
            </span>
            <span className="admin-mono text-[#f2f3f7]">{Math.round((item.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(100, Math.round((value / Math.max(goal, 1)) * 100));
  const radius = 48;
  const c = 2 * Math.PI * radius;
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <svg viewBox="0 0 120 120" className="h-32 w-32">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#393b3e" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#22b3d7"
          strokeWidth="10"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" fill="#f2f3f7" fontSize="22" fontFamily="Manrope, sans-serif" fontWeight="800">
          {pct}%
        </text>
      </svg>
      <p className="admin-eyebrow mt-3">Featured goal · {goal}</p>
      <p className="admin-mono mt-1 text-sm text-[#a6abb8]">{value} live slots</p>
    </div>
  );
}

const statusColor: Record<ActivityItem["kind"], string> = {
  upgrade: "#34d399",
  signup: "#22b3d7",
  failed: "#fb7185",
  workspace: "#2dd4bf",
  downgrade: "#f5b544",
};

export function AdminDashboard({
  stats,
  series,
  labels,
  skillSpark,
  certBars,
  activity,
  projects,
}: {
  stats: Stats;
  series: number[];
  labels: string[];
  skillSpark: number[];
  certBars: number[];
  activity: ActivityItem[];
  projects: ProjectRow[];
}) {
  const total =
    stats.projects + stats.skills + stats.achievements + stats.certifications + stats.testimonials;
  const segments = [
    { label: "Projects", value: stats.projects, color: "#2dd4bf" },
    { label: "Skills", value: stats.skills, color: "#22b3d7" },
    { label: "Achievements", value: stats.achievements, color: "#f5b544" },
    { label: "Certifications", value: stats.certifications, color: "#8b7cff" },
  ];

  return (
    <>
      <AdminPageHeader title="Overview" subtitle="Portfolio console · live content index">
        <div className="admin-seg">
          <button type="button">Day</button>
          <button type="button" className="is-active">
            Week
          </button>
          <button type="button">Month</button>
        </div>
        <a
          className="admin-btn-ghost"
          href={`data:application/json,${encodeURIComponent(JSON.stringify(stats, null, 2))}`}
          download="pulse-overview.json"
        >
          Export
        </a>
        <Link href="/admin/projects/new" className="admin-btn-primary">
          <Plus className="size-3.5" />
          New project
        </Link>
      </AdminPageHeader>

      <div className="admin-bento">
        <BentoTile hero className="admin-span-hero">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="admin-eyebrow">Total records</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="admin-heading text-4xl md:text-5xl">{total.toLocaleString()}</p>
                <span className={stats.unread ? "admin-delta is-up" : "admin-delta is-up"}>
                  {stats.unread ? `▲ ${stats.unread} unread` : `▲ ${stats.publishedProjects} live`}
                </span>
              </div>
            </div>
            <div className="admin-seg">
              <button type="button">12M</button>
              <button type="button" className="is-active">
                30D
              </button>
              <button type="button">7D</button>
            </div>
          </div>
          <RevenueChart series={series} labels={labels} />
        </BentoTile>

        <BentoTile>
          <p className="admin-eyebrow">Skills</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="admin-mono text-3xl">{stats.skills.toLocaleString()}</p>
            <span className="admin-delta is-up">▲ catalog</span>
          </div>
          <Sparkline values={skillSpark} color="#2dd4bf" />
        </BentoTile>

        <BentoTile>
          <p className="admin-eyebrow">Certifications</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="admin-mono text-3xl">{stats.certifications.toLocaleString()}</p>
            <span className="admin-delta is-up">▲ courses</span>
          </div>
          <MicroBars values={certBars} />
        </BentoTile>

        <BentoTile className="admin-span-tall">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="admin-heading text-lg">Live activity</h2>
            <span className="flex items-center gap-2 text-xs text-[#34d399]">
              <span className="size-2 rounded-full bg-[#34d399]" />
              live
            </span>
          </div>
          <div className="admin-feed">
            {activity.length ? (
              activity.map((item) => (
                <div key={item.id} className="admin-feed-row">
                  <span className="admin-avatar">{initials(item.name)}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#f2f3f7]">{item.title}</p>
                    <p className="admin-mono text-[11px] text-[#6b7180]">{item.time}</p>
                  </div>
                  <span className="admin-status-dot" style={{ background: statusColor[item.kind] }} />
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6b7180]">No messages yet.</p>
            )}
          </div>
        </BentoTile>

        <BentoTile className="admin-span-tall">
          <h2 className="admin-heading mb-2 text-lg">Traffic sources</h2>
          <p className="admin-eyebrow mb-4">Content mix</p>
          <Donut segments={segments} />
        </BentoTile>

        <BentoTile>
          <GoalRing value={stats.featuredProjects} goal={PROJECT_FEATURED_LIMIT} />
        </BentoTile>

        <BentoTile className="admin-span-wide">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="admin-heading text-lg">Top pages</h2>
            <Link href="/admin/projects" className="text-sm font-semibold text-[#22b3d7]">
              View all
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Conv.</th>
                  <th>7-day trend</th>
                </tr>
              </thead>
              <tbody>
                {projects.length ? (
                  projects.map((row) => (
                    <tr key={row.id}>
                      <td className="admin-path">/{row.slug}</td>
                      <td className="text-right">{row.views}</td>
                      <td className="text-right">{row.conv}</td>
                      <td>
                        <TrendSpark rising={row.rising} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-[#6b7180]">
                      No projects yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </BentoTile>
      </div>
    </>
  );
}
