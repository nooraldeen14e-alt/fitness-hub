/**
 * HeroNetworkScene.tsx — Social Follower Network (Canvas 2D)
 *
 * Pure HTML Canvas 2D so it renders on the very first paint and
 * appears correctly in screenshots / static captures. Nodes are
 * soft-glowing circles (radial gradient), edges are semi-transparent
 * lines, data pulses sprint along brand→influencer edges, and the
 * whole graph drifts on a slow Y-axis rotation.
 */
import { useRef, useEffect } from "react";

/* ─── palette ────────────────────────────────────────────────────── */
const ORG   = "#FF6200";
const ORG2  = "#FF8C42";
const WARM  = "#ffd8a8";
const COOL  = "#88b8e8";
const PULSE = "#ff9944";

/* ─── tiny deterministic hash ────────────────────────────────────── */
const sr = (n: number) => Math.abs(Math.sin(n * 127.1) * 43758.5453) % 1;

/* ─── node definitions (3-D coords, projected at runtime) ─────────── */
interface Node3D { id: number; x: number; y: number; z: number; r: number; col: string }

const BRAND: Node3D[] = [
  { id: 0, x:  0.0, y:  0.0, z:  0.0, r: 22, col: ORG  },
  { id: 1, x: -1.0, y:  0.5, z: -0.5, r: 14, col: ORG2 },
  { id: 2, x:  0.9, y: -0.3, z: -0.6, r: 13, col: ORG2 },
  { id: 3, x: -0.5, y: -0.9, z:  0.6, r: 14, col: ORG2 },
  { id: 4, x:  0.7, y:  0.9, z:  0.4, r: 12, col: ORG2 },
];

const INFLUENCER: Node3D[] = [
  { id:  5, x: -2.0, y:  0.8, z: -0.2, r: 9,  col: WARM },
  { id:  6, x:  1.9, y:  0.5, z: -0.9, r: 10, col: WARM },
  { id:  7, x: -1.2, y:  1.9, z:  0.7, r: 10, col: WARM },
  { id:  8, x:  1.5, y: -1.8, z:  0.3, r: 8,  col: WARM },
  { id:  9, x: -1.8, y: -1.2, z: -0.6, r: 9,  col: WARM },
  { id: 10, x:  2.2, y:  1.2, z:  0.5, r: 8,  col: WARM },
  { id: 11, x: -0.3, y: -2.2, z: -0.4, r: 10, col: WARM },
  { id: 12, x:  0.3, y:  2.0, z: -1.0, r: 9,  col: WARM },
];

const FOLLOWER: Node3D[] = Array.from({ length: 22 }, (_, i) => {
  const theta = sr(i * 7)     * Math.PI * 2;
  const phi   = Math.acos(2 * sr(i * 7 + 1) - 1);
  const rr    = 3.0 + sr(i * 7 + 2) * 1.1;
  return {
    id: 13 + i,
    x: rr * Math.sin(phi) * Math.cos(theta),
    y: rr * Math.sin(phi) * Math.sin(theta),
    z: rr * Math.cos(phi),
    r: 3 + Math.round(sr(i * 7 + 3) * 3),
    col: COOL,
  };
});

const ALL: Node3D[] = [...BRAND, ...INFLUENCER, ...FOLLOWER];

/* ─── edges ──────────────────────────────────────────────────────── */
interface Edge { a: number; b: number; tier: "brand" | "inf" | "fol" }
const EDGES: Edge[] = [
  { a: 0, b: 1, tier: "brand" }, { a: 0, b: 2, tier: "brand" },
  { a: 0, b: 3, tier: "brand" }, { a: 0, b: 4, tier: "brand" },
  { a: 1, b: 5,  tier: "inf" }, { a: 1, b: 7,  tier: "inf" },
  { a: 2, b: 6,  tier: "inf" }, { a: 2, b: 8,  tier: "inf" },
  { a: 3, b: 9,  tier: "inf" }, { a: 3, b: 11, tier: "inf" },
  { a: 4, b: 10, tier: "inf" }, { a: 4, b: 12, tier: "inf" },
  { a: 1, b: 9,  tier: "inf" }, { a: 2, b: 10, tier: "inf" },
  ...([5,6,7,8,9,10,11,12] as number[]).flatMap((inf, ii) =>
    [0,1,2].map(j => ({
      a: inf, b: 13 + ((ii * 3 + j) % 22), tier: "fol" as const,
    }))
  ),
];

const PULSE_EDGES = EDGES.filter(e => e.tier !== "fol");

/* ─── projection ─────────────────────────────────────────────────── */
const SCALE  = 92;  // world-unit → pixel scale
const FOV    = 650; // perspective distance

function project(
  node: Node3D,
  ry: number,   // Y-axis rotation angle
  ox: number,   // screen centre X
  oy: number,   // screen centre Y
) {
  // Y-axis rotation
  const cx = Math.cos(ry), sx = Math.sin(ry);
  const wx = node.x * cx - node.z * sx;
  const wy = node.y;
  const wz = node.x * sx + node.z * cx + 6; // push slightly away from camera
  const persp = FOV / (FOV + wz * SCALE * 0.5);
  return {
    sx: ox + wx * SCALE * persp,
    sy: oy + wy * SCALE * persp,
    persp,
    depth: wz,
  };
}

/* ─── draw glow circle ───────────────────────────────────────────── */
function glowCircle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  col: string, alpha: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.8);
  g.addColorStop(0,    col + "ff");
  g.addColorStop(0.30, col + "cc");
  g.addColorStop(0.65, col + "44");
  g.addColorStop(1.0,  col + "00");
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.8, 0, Math.PI * 2);
  ctx.fill();
  // Solid core
  ctx.globalAlpha = alpha;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/* ─── pulse state ─────────────────────────────────────────────────── */
interface Pulse { edge: number; t: number; speed: number; delay: number; active: boolean }
const pulses: Pulse[] = Array.from({ length: 10 }, (_, i) => ({
  edge:   i % PULSE_EDGES.length,
  t:      0,
  speed:  0.35 + sr(i * 3.7) * 0.3,
  delay:  sr(i * 5.3) * 3.5,
  active: false,
}));

/* ─── star field (static seeds) ──────────────────────────────────── */
const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: sr(i * 11)     * 1.0,  // fraction of width
  y: sr(i * 11 + 1) * 1.0,  // fraction of height
  r: 0.6 + sr(i * 11 + 2) * 1.2,
  a: 0.12 + sr(i * 11 + 3) * 0.3,
}));

/* ─── main component ──────────────────────────────────────────────── */
export function HeroNetworkScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const t0Ref     = useRef<number | null>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cv  = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    /* resize canvas to match CSS size */
    const resize = () => {
      cv.width  = cv.offsetWidth  * window.devicePixelRatio;
      cv.height = cv.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    /* mouse parallax */
    const onMouse = (e: MouseEvent) => {
      const rect = cv.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
        y: ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouse);

    /* animation loop */
    const draw = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts;
      const elapsed = (ts - t0Ref.current) / 1000; // seconds
      const dt = 1 / 60;

      const W = cv.offsetWidth;
      const H = cv.offsetHeight;

      // Clear
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of STARS) {
        ctx.globalAlpha = s.a * (0.7 + 0.3 * Math.sin(elapsed * 0.4 + s.r));
        ctx.fillStyle = "#8899bb";
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Y-rotation: slow auto-spin + mouse parallax
      const ry = elapsed * 0.04
        + mouseRef.current.x * 0.12
        + Math.sin(elapsed * 0.07) * 0.08;
      const rx = mouseRef.current.y * 0.06
        + Math.sin(elapsed * 0.05) * 0.04;
      const floatY = Math.sin(elapsed * 0.18) * 8;

      // Network is centred right-of-middle so left text gradient doesn't cover it
      const OX = W * 0.68;
      const OY = H * 0.50 + floatY;

      // Project all nodes
      const proj = ALL.map(n => {
        // Also apply rx (tilt) for a bit of depth feel
        const cy = Math.cos(rx), sy = Math.sin(rx);
        const ty = n.y * cy - n.z * sy;
        const tz = n.y * sy + n.z * cy;
        const fake = { ...n, y: ty, z: tz };
        return { node: n, ...project(fake, ry, OX, OY) };
      });

      // Sort by depth (back-to-front)
      const sorted = [...proj].sort((a, b) => b.depth - a.depth);

      // ── edges ──
      for (const e of EDGES) {
        const pa = proj[e.a];
        const pb = proj[e.b];
        const col  = e.tier === "brand" ? "#ff6200"
                   : e.tier === "inf"   ? "#886644"
                   :                      "#334466";
        const alpha = e.tier === "brand" ? 0.5
                    : e.tier === "inf"   ? 0.32
                    :                      0.16;

        const grd = ctx.createLinearGradient(pa.sx, pa.sy, pb.sx, pb.sy);
        grd.addColorStop(0, col + "88");
        grd.addColorStop(1, col + "22");
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = grd;
        ctx.lineWidth = e.tier === "brand" ? 1.4 : e.tier === "inf" ? 0.9 : 0.5;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // ── nodes (back-to-front) ──
      for (const p of sorted) {
        const n = p.node;
        const r = n.r * p.persp * 1.15;
        const alpha =
          n.id === 0 ? 1.0 :
          n.col === ORG2 ? 0.92 :
          n.col === WARM ? 0.80 :
          0.65;
        glowCircle(ctx, p.sx, p.sy, r, n.col, alpha);
      }

      // ── data pulses ──
      for (const pulse of pulses) {
        if (!pulse.active) {
          pulse.delay -= dt;
          if (pulse.delay <= 0) {
            pulse.active = true;
            pulse.t      = 0;
            pulse.edge   = Math.floor(sr(elapsed * 13 + pulse.delay) * PULSE_EDGES.length);
            pulse.speed  = 0.28 + sr(elapsed * 7 + pulse.delay) * 0.35;
          }
          continue;
        }
        pulse.t += pulse.speed * dt;
        if (pulse.t >= 1) {
          pulse.active = false;
          pulse.delay  = 0.3 + sr(elapsed * 3.3 + pulse.t) * 2.2;
          continue;
        }
        const edge = PULSE_EDGES[pulse.edge];
        if (!edge) { pulse.active = false; continue; }
        const pa = proj[edge.a];
        const pb = proj[edge.b];
        const px = pa.sx + (pb.sx - pa.sx) * pulse.t;
        const py = pa.sy + (pb.sy - pa.sy) * pulse.t;
        const pr = 3.5 * pa.persp;
        glowCircle(ctx, px, py, pr, PULSE, 1.0);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
