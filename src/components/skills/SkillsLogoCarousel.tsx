"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";
import type { Skill } from "@/types";
import { skillLogoSrc } from "@/lib/skillLogos";

const MAX_SCREEN_WIDTH_BUFFER = 2800;
const TILE_BG = "#2b2c2e";
const TILE_BORDER = "rgba(255,255,255,0.22)";
const ITEM_HEIGHT_DESKTOP = 108;
const ITEM_HEIGHT_MOBILE = 72;
const GAP_DESKTOP = 72;
const GAP_MOBILE = 36;
const SPEED = 22;
const MAX_BLUR = 0;
const MIN_SCALE = 0.64;
const MAX_SCALE = 1.16;
const EASING = 2.1;
const LOGO_INSET_DESKTOP = 14;
const LOGO_INSET_MOBILE = 10;

type LogoHit = {
  skillIndex: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
  scale: number;
};

function getImageWidth(_image: HTMLImageElement | null, fallbackSize: number) {
  return fallbackSize;
}

function samplePixel(data: Uint8ClampedArray, width: number, x: number, y: number) {
  const index = (y * width + x) * 4;
  return [data[index], data[index + 1], data[index + 2], data[index + 3]] as const;
}

async function knockOutBackdrop(image: HTMLImageElement) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || !height) return image;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return image;

  context.drawImage(image, 0, 0);
  const frame = context.getImageData(0, 0, width, height);
  const pixels = frame.data;
  const corners = [
    samplePixel(pixels, width, 0, 0),
    samplePixel(pixels, width, width - 1, 0),
    samplePixel(pixels, width, 0, height - 1),
    samplePixel(pixels, width, width - 1, height - 1),
  ];
  if (corners.every((corner) => corner[3] < 24)) return image;

  const average = corners
    .reduce((sum, corner) => [sum[0] + corner[0], sum[1] + corner[1], sum[2] + corner[2]], [0, 0, 0])
    .map((value) => value / 4);
  const light = average[0] > 200 && average[1] > 200 && average[2] > 200;
  const dark = average[0] < 40 && average[1] < 40 && average[2] < 40;
  if (!light && !dark) return image;

  const threshold = light ? 46 : 32;
  const seen = new Uint8Array(width * height);
  const stack: number[] = [];
  const visit = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (seen[index]) return;
    seen[index] = 1;
    stack.push(index);
  };
  for (let x = 0; x < width; x += 1) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (stack.length) {
    const index = stack.pop()!;
    const pixel = index * 4;
    const similar =
      pixels[pixel + 3] < 18 ||
      (Math.abs(pixels[pixel] - average[0]) < threshold &&
        Math.abs(pixels[pixel + 1] - average[1]) < threshold &&
        Math.abs(pixels[pixel + 2] - average[2]) < threshold);
    if (!similar) continue;
    pixels[pixel + 3] = 0;
    const x = index % width;
    const y = Math.floor(index / width);
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  context.putImageData(frame, 0, 0);
  const cleaned = new Image();
  cleaned.src = canvas.toDataURL("image/png");
  await new Promise<void>((resolve) => {
    cleaned.onload = () => resolve();
    cleaned.onerror = () => resolve();
  });
  return cleaned.naturalWidth ? cleaned : image;
}

function calculateMagnification(
  distanceFromCenter: number,
  screenCenter: number,
  avgScale: number,
  scaleConstant: number,
  piDivCenter: number,
  centerDivPi: number,
  minScale: number,
) {
  if (Math.abs(distanceFromCenter) <= screenCenter) {
    return {
      warpedX: avgScale * distanceFromCenter + scaleConstant * centerDivPi * Math.sin(distanceFromCenter * piDivCenter),
      finalScale: avgScale + scaleConstant * Math.cos(distanceFromCenter * piDivCenter),
    };
  }
  const sign = Math.sign(distanceFromCenter);
  return {
    warpedX: sign * (avgScale * screenCenter) + minScale * (distanceFromCenter - sign * screenCenter),
    finalScale: minScale,
  };
}

function skillStars(skill: Skill) {
  if (typeof skill.rating === "number") return Math.max(0, Math.min(5, skill.rating));
  return Math.max(0, Math.min(5, skill.proficiency / 20));
}

export function SkillsLogoCarousel({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState<{ skill: Skill; x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeIdRef = useRef<string | null>(null);
  const lastActiveRef = useRef<{ skill: Skill; x: number; y: number } | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, []);

  const topLane = useMemo(() => skills.slice(0, Math.ceil(skills.length / 2)), [skills]);
  const bottomLane = useMemo(() => {
    const rest = skills.slice(Math.ceil(skills.length / 2));
    return rest.length ? rest : topLane;
  }, [skills, topLane]);

  const showSkill = useCallback((next: { skill: Skill; x: number; y: number }) => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    activeIdRef.current = next.skill.id;
    setActive((prev) => {
      if (prev?.skill.id === next.skill.id) return prev;
      lastActiveRef.current = next;
      return next;
    });
  }, []);

  const hideSkill = useCallback((immediate = false) => {
    const clear = () => {
      activeIdRef.current = null;
      setActive(null);
      hideTimerRef.current = null;
    };
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (immediate) {
      clear();
      return;
    }
    hideTimerRef.current = window.setTimeout(clear, 180);
  }, []);

  const card = active ?? lastActiveRef.current;

  if (!skills.length) return null;

  return (
    <div className="space-y-5 sm:space-y-8" data-grid-ignore>
      <Logo3DLane
        skills={topLane}
        direction="left"
        activeIdRef={activeIdRef}
        onShow={showSkill}
        onHide={hideSkill}
      />
      <Logo3DLane
        skills={bottomLane}
        direction="right"
        activeIdRef={activeIdRef}
        onShow={showSkill}
        onHide={hideSkill}
      />
      {mounted && card
        ? createPortal(
            <SkillHoverCard skill={card.skill} x={card.x} y={card.y} visible={Boolean(active)} />,
            document.body,
          )
        : null}
    </div>
  );
}

const Logo3DLane = memo(function Logo3DLane({
  skills,
  direction,
  activeIdRef,
  onShow,
  onHide,
}: {
  skills: Skill[];
  direction: "left" | "right";
  activeIdRef: MutableRefObject<string | null>;
  onShow: (value: { skill: Skill; x: number; y: number }) => void;
  onHide: (immediate?: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globalOffsetRef = useRef(direction === "right" ? 900 : 0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const lastDragXRef = useRef(0);
  const hitsRef = useRef<LogoHit[]>([]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Array<HTMLImageElement | null>>([]);

  const isMobile = containerWidth > 0 && containerWidth < 768;
  const itemHeight = isMobile ? ITEM_HEIGHT_MOBILE : ITEM_HEIGHT_DESKTOP;
  const gap = isMobile ? GAP_MOBILE : GAP_DESKTOP;
  const logoInset = isMobile ? LOGO_INSET_MOBILE : LOGO_INSET_DESKTOP;
  const baseItemHeight = itemHeight / MAX_SCALE;
  const canvasPaddingY = Math.ceil(MAX_BLUR) * 3;
  const extendedCanvasHeight = itemHeight + canvasPaddingY * 2;
  const dirMultiplier = direction === "right" ? -1 : 1;

  const sources = useMemo(
    () => skills.map((skill) => skillLogoSrc(skill.icon, skill.slug, skill.name)),
    [skills],
  );

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const apply = () => setContainerWidth(node.clientWidth || node.getBoundingClientRect().width);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    const pending: HTMLImageElement[] = [];
    Promise.all(
      sources.map(
        (src) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            if (!src) return resolve(null);
            const image = new Image();
            pending.push(image);
            if (!src.startsWith("data:")) image.crossOrigin = "anonymous";
            image.onload = async () => resolve(await knockOutBackdrop(image));
            image.onerror = () => resolve(null);
            image.src = src;
          }),
      ),
    ).then((results) => {
      if (alive) setLoadedImages(results);
    });
    return () => {
      alive = false;
      pending.forEach((image) => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      });
    };
  }, [sources]);

  const { renderCount, widths } = useMemo(() => {
    const itemWidths = skills.map((_, index) => getImageWidth(loadedImages[index] ?? null, baseItemHeight));
    const setWidth = itemWidths.reduce((sum, width) => sum + width + gap, 0);
    const setsNeeded = Math.max(2, Math.ceil(MAX_SCREEN_WIDTH_BUFFER / (setWidth || 1)));
    return { renderCount: setsNeeded * Math.max(skills.length, 1), widths: itemWidths };
  }, [skills, loadedImages, baseItemHeight, gap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || containerWidth === 0 || !skills.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let lastTime = performance.now();
    let isVisible = true;
    let hasRenderedOnce = false;
    let lastRenderedOffset = globalOffsetRef.current;
    let currentSpeed = SPEED;

    const screenCenter = containerWidth / 2;
    const piDivCenter = Math.PI / screenCenter;
    const centerDivPi = screenCenter / Math.PI;
    const positions = new Float32Array(renderCount);
    let wrapLength = 0;
    let maxW = 0;
    for (let i = 0; i < renderCount; i++) {
      const texIdx = i % skills.length;
      const w = widths[texIdx] || baseItemHeight;
      if (w > maxW) maxW = w;
      positions[i] = wrapLength;
      wrapLength += w + gap;
    }
    const minXBound = -maxW * 2;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = extendedCanvasHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const render = (currentTime: number) => {
      if (!isVisible) return;
      const scaleConstant = (MAX_SCALE - MIN_SCALE) / 2;
      const avgScale = MIN_SCALE + scaleConstant;
      const scaleRange = MAX_SCALE - MIN_SCALE;
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      const dt = Math.min(delta / 1000, 1 / 30);
      const targetSpeed = isHoveredRef.current || isDraggingRef.current ? 0 : SPEED;
      currentSpeed += (targetSpeed - currentSpeed) * (1 - Math.exp(-EASING * dt));
      globalOffsetRef.current += currentSpeed * dt * dirMultiplier;
      if (wrapLength > 0) {
        globalOffsetRef.current = ((globalOffsetRef.current % wrapLength) + wrapLength) % wrapLength;
      }

      const offsetChanged = Math.abs(globalOffsetRef.current - lastRenderedOffset) > 0.001;
      const isIdle = Math.abs(currentSpeed) < 0.01 && !offsetChanged;
      if (isIdle && hasRenderedOnce) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      hasRenderedOnce = true;
      lastRenderedOffset = globalOffsetRef.current;

      ctx.clearRect(0, 0, containerWidth, extendedCanvasHeight);
      const nextHits: LogoHit[] = [];

      for (let i = 0; i < renderCount; i++) {
        const texIdx = i % skills.length;
        const img = loadedImages[texIdx] ?? null;
        const w = widths[texIdx] || baseItemHeight;
        const baseX = positions[i];
        let relativeX = (baseX - globalOffsetRef.current - minXBound) % wrapLength;
        if (relativeX < 0) relativeX += wrapLength;
        const currentX = relativeX + minXBound;
        const unwarpedCenter = currentX + w / 2;
        const distanceFromCenter = unwarpedCenter - screenCenter;
        const { warpedX, finalScale } = calculateMagnification(
          distanceFromCenter,
          screenCenter,
          avgScale,
          scaleConstant,
          piDivCenter,
          centerDivPi,
          MIN_SCALE,
        );
        const finalX = screenCenter + warpedX - w / 2;
        const depthRatio = (finalScale - MIN_SCALE) / scaleRange;
        const opacity = 0.72 + 0.28 * depthRatio;
        const centerX = finalX + w / 2;
        const centerY = extendedCanvasHeight / 2;
        const drawSize = w * finalScale;
        if (centerX + drawSize < -40 || centerX - drawSize > containerWidth + 40) continue;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(finalScale, finalScale);
        ctx.globalAlpha = opacity;
        ctx.filter = "none";
        const drawX = -w / 2;
        const drawY = -baseItemHeight / 2;
        const radius = w * 0.22;
        ctx.beginPath();
        ctx.roundRect(drawX, drawY, w, baseItemHeight, radius);
        ctx.fillStyle = TILE_BG;
        ctx.fill();
        ctx.strokeStyle = TILE_BORDER;
        ctx.lineWidth = 1.25 / finalScale;
        ctx.stroke();
        if (img) {
          const box = Math.max(8, baseItemHeight - logoInset * 2);
          const fit = Math.min(box / img.naturalWidth, box / img.naturalHeight);
          const dw = img.naturalWidth * fit;
          const dh = img.naturalHeight * fit;
          ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        }
        ctx.restore();

        nextHits.push({
          skillIndex: texIdx,
          cx: centerX,
          cy: centerY - canvasPaddingY,
          w: w * finalScale,
          h: baseItemHeight * finalScale,
          scale: finalScale,
        });
      }
      hitsRef.current = nextHits;
      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isVisible = true;
        lastTime = performance.now();
        if (!animationFrameId) animationFrameId = requestAnimationFrame(render);
      } else {
        isVisible = false;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      }
    });
    observer.observe(container);
    animationFrameId = requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [containerWidth, loadedImages, renderCount, widths, baseItemHeight, extendedCanvasHeight, skills, canvasPaddingY, dirMultiplier, gap, logoInset]);

  const hitSkill = (clientX: number, clientY: number) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return null;
    const x = clientX - box.left;
    const y = clientY - box.top;
    const matches: LogoHit[] = [];
    for (const hit of hitsRef.current) {
      const padX = Math.max(hit.w * 0.58, 40);
      const padY = Math.max(hit.h * 0.58, 40);
      if (Math.abs(x - hit.cx) <= padX && Math.abs(y - hit.cy) <= padY) {
        matches.push(hit);
      }
    }
    if (!matches.length) return null;
    const sticky = matches.find((hit) => skills[hit.skillIndex]?.id === activeIdRef.current);
    const best = sticky ?? matches.reduce((winner, hit) => (hit.scale > winner.scale ? hit : winner));
    return {
      skill: skills[best.skillIndex],
      x: box.left + best.cx,
      y: box.top + best.cy - best.h / 2,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ height: itemHeight + (isMobile ? 28 : 48), cursor: "grab", touchAction: "pan-y" }}
      onPointerEnter={() => {
        isHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false;
        isDraggingRef.current = false;
        onHide();
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        isDraggingRef.current = true;
        lastDragXRef.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (isDraggingRef.current) {
          globalOffsetRef.current -= (event.clientX - lastDragXRef.current) * dirMultiplier;
          lastDragXRef.current = event.clientX;
          onHide(true);
          return;
        }
        const hit = hitSkill(event.clientX, event.clientY);
        if (hit) onShow(hit);
      }}
      onPointerUp={(event) => {
        isDraggingRef.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
        event.currentTarget.style.cursor = "grab";
      }}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute top-0 left-0 block"
        style={{
          width: "100%",
          height: extendedCanvasHeight,
          top: -canvasPaddingY,
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />
    </div>
  );
});

function SkillHoverCard({
  skill,
  x,
  y,
  visible,
}: {
  skill: Skill;
  x: number;
  y: number;
  visible: boolean;
}) {
  const rating = skillStars(skill);
  const cardWidth = Math.min(260, window.innerWidth - 32);
  const placeLeft = x > window.innerWidth - cardWidth - 24;
  const left = Math.min(
    Math.max(placeLeft ? x - 12 : x + 12, 16 + (placeLeft ? cardWidth : 0)),
    window.innerWidth - 16 - (placeLeft ? 0 : cardWidth),
  );
  const top = Math.min(Math.max(y - 8, 16), window.innerHeight - 200);

  return (
    <div
      className="pointer-events-none fixed z-[70] w-[min(260px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#141618] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
      style={{
        left,
        top,
        transform: placeLeft ? "translate(-100%, 0)" : "none",
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        transition: "opacity 150ms ease",
      }}
    >
      <p className="font-heading text-lg tracking-tight text-white">{skill.name}</p>
      <div className="mt-3 flex items-center gap-2">
        <StarRow value={rating} />
        <span className="font-heading text-sm text-accent-bright">{rating.toFixed(1)}</span>
      </div>
      <div className="mt-4">
        <p className="text-[10px] tracking-[0.18em] text-muted uppercase">Used in projects</p>
        <p className="mt-2 text-sm text-foreground-secondary">
          {skill.usedInCount
            ? `${skill.usedInCount >= 5 ? "5+" : skill.usedInCount} project${skill.usedInCount === 1 ? "" : "s"}`
            : "Not listed on a published project yet."}
        </p>
      </div>
    </div>
  );
}

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.min(1, Math.max(0, value - index));
        return (
          <span key={index} className="relative h-4 w-4">
            <Star className="absolute inset-0 h-4 w-4 text-white/15" />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-4 w-4 fill-[#22b3d7] text-[#22b3d7]" />
            </span>
          </span>
        );
      })}
    </div>
  );
}
