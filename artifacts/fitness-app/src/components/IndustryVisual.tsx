import React, { useRef, useEffect } from "react";

// ─── 3D Math ──────────────────────────────────────────────────────────────────
type Vec3 = [number, number, number];
type Edge = [number, number];

const rotY = ([x, y, z]: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
};
const rotX = ([x, y, z]: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
};
const proj = ([x, y, z]: Vec3, dist = 4, fov = 300): [number, number, number] => {
  const d = z + dist;
  return [(x / d) * fov, (y / d) * fov, z];
};

// ─── Geometry builders ────────────────────────────────────────────────────────
function mkBox(cx: number, cy: number, cz: number, w: number, h: number, d: number, off = 0) {
  const [hw, hh, hd] = [w / 2, h / 2, d / 2];
  const v: Vec3[] = [
    [cx - hw, cy - hh, cz - hd], [cx + hw, cy - hh, cz - hd],
    [cx + hw, cy - hh, cz + hd], [cx - hw, cy - hh, cz + hd],
    [cx - hw, cy + hh, cz - hd], [cx + hw, cy + hh, cz - hd],
    [cx + hw, cy + hh, cz + hd], [cx - hw, cy + hh, cz + hd],
  ];
  const e: Edge[] = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ].map(([a, b]) => [a + off, b + off]);
  return { v, e };
}

function mkCircle(cx: number, cy: number, cz: number, r: number, seg = 16, axis: "xy"|"xz" = "xy", off = 0) {
  const v: Vec3[] = [];
  const e: Edge[] = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    v.push(axis === "xz"
      ? [cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r]
      : [cx + Math.cos(a) * r, cy + Math.sin(a) * r, cz]);
    e.push([off + i, off + (i + 1) % seg]);
  }
  return { v, e };
}

// ─── Combined geometry builder ────────────────────────────────────────────────
type Geom = { verts: Vec3[]; edges: Edge[] };

function combine(...parts: { v: Vec3[]; e: Edge[] }[]): Geom {
  const verts: Vec3[] = [];
  const edges: Edge[] = [];
  let off = 0;
  for (const { v, e } of parts) {
    verts.push(...v);
    edges.push(...e.map(([a, b]) => [a + off, b + off] as Edge));
    off += v.length;
  }
  return { verts, edges };
}

// ─── Geometries per industry ──────────────────────────────────────────────────
const geometries: Record<string, () => Geom> = {

  "automotive": () => {
    // Stylised sports car
    const body  = mkBox(0, 0.15, 0, 2.8, 0.55, 1.1);
    const cabin = mkBox(-0.1, -0.25, 0, 1.6, 0.5, 0.9);
    const hood  = { v: [] as Vec3[], e: [] as Edge[] };
    // Windshield line
    const wsV: Vec3[] = [[-0.9, 0, -0.45], [-0.9, 0, 0.45], [-0.9, -0.5, -0.42], [-0.9, -0.5, 0.42]];
    const wsE: Edge[] = [[0,1],[2,3],[0,2],[1,3]];
    // 4 wheels
    const wFL = mkCircle( 0.95,  0.45, -0.55, 0.36, 14, "xy");
    const wFR = mkCircle( 0.95,  0.45,  0.55, 0.36, 14, "xy");
    const wRL = mkCircle(-0.95,  0.45, -0.55, 0.36, 14, "xy");
    const wRR = mkCircle(-0.95,  0.45,  0.55, 0.36, 14, "xy");
    // Wheel axles
    const axleF: Vec3[] = [[ 0.95,  0.45, -0.55], [ 0.95,  0.45,  0.55]];
    const axleR: Vec3[] = [[-0.95,  0.45, -0.55], [-0.95,  0.45,  0.55]];
    const axleE: Edge[] = [[0,1]];

    const ws = { v: wsV, e: wsE };
    const af = { v: axleF, e: axleE };
    const ar = { v: axleR, e: axleE };

    return combine(body, cabin, ws, wFL, wFR, wRL, wRR, af, ar);
  },

  "luxury-lifestyle": () => {
    // Diamond / gemstone
    const seg = 8;
    const topRing: Vec3[] = Array.from({ length: seg }, (_, i) => {
      const a = (i / seg) * Math.PI * 2;
      return [Math.cos(a) * 1.0, -0.1, Math.sin(a) * 1.0];
    });
    const botRing: Vec3[] = Array.from({ length: seg }, (_, i) => {
      const a = (i / seg) * Math.PI * 2 + Math.PI / seg;
      return [Math.cos(a) * 0.55, 0.45, Math.sin(a) * 0.55];
    });
    const crownTop: Vec3 = [0, -0.8, 0];
    const pavilionBottom: Vec3 = [0, 1.2, 0];

    const verts: Vec3[] = [crownTop, ...topRing, ...botRing, pavilionBottom];
    const edges: Edge[] = [];
    // Crown: apex → top ring
    for (let i = 0; i < seg; i++) edges.push([0, 1 + i]);
    // Top ring
    for (let i = 0; i < seg; i++) edges.push([1 + i, 1 + (i + 1) % seg]);
    // Girdle: top ring → bot ring
    for (let i = 0; i < seg; i++) {
      edges.push([1 + i, 1 + seg + i]);
      edges.push([1 + i, 1 + seg + (i + seg - 1) % seg]);
    }
    // Bot ring
    for (let i = 0; i < seg; i++) edges.push([1 + seg + i, 1 + seg + (i + 1) % seg]);
    // Pavilion: bot ring → bottom apex
    for (let i = 0; i < seg; i++) edges.push([1 + seg + i, 1 + seg * 2]);

    return { verts, edges };
  },

  "real-estate": () => {
    // Modern house / building
    const base   = mkBox(0, 0.45, 0, 2.0, 0.9, 1.2);
    const wing   = mkBox(0.6, 0.1, 0, 0.8, 0.2, 1.2);
    // Roof prism
    const rV: Vec3[] = [
      [-1.0, -0.1, -0.6], [1.0, -0.1, -0.6],
      [-1.0, -0.1,  0.6], [1.0, -0.1,  0.6],
      [0,   -0.75, -0.6], [0,   -0.75,  0.6],
    ];
    const rE: Edge[] = [[0,1],[2,3],[0,2],[1,3],[0,4],[1,4],[2,5],[3,5],[4,5]];
    // Window grid
    const win1V: Vec3[] = [[-0.5, 0.1, -0.61],[-0.1, 0.1, -0.61],[-0.5, 0.5, -0.61],[-0.1, 0.5, -0.61]];
    const win2V: Vec3[] = [[ 0.1, 0.1, -0.61],[ 0.5, 0.1, -0.61],[ 0.1, 0.5, -0.61],[ 0.5, 0.5, -0.61]];
    const winE: Edge[] = [[0,1],[2,3],[0,2],[1,3]];
    const roof  = { v: rV, e: rE };
    const w1    = { v: win1V, e: winE };
    const w2    = { v: win2V, e: winE };
    return combine(base, wing, roof, w1, w2);
  },

  "fashion-apparel": () => {
    // Dress-form / mannequin torso
    // Body: hourglass approximated with stacked ellipses
    const levels = [
      { y: -1.0, rx: 0.28, rz: 0.2 }, // neck
      { y: -0.7, rx: 0.52, rz: 0.35 }, // shoulders
      { y: -0.4, rx: 0.6,  rz: 0.38 },
      { y:  0.0, rx: 0.42, rz: 0.3 }, // waist
      { y:  0.3, rx: 0.5,  rz: 0.36 },
      { y:  0.7, rx: 0.64, rz: 0.42 }, // hips
      { y:  1.0, rx: 0.6,  rz: 0.38 },
    ];
    const seg = 12;
    const verts: Vec3[] = [];
    const edges: Edge[] = [];
    let off = 0;
    for (const { y, rx, rz } of levels) {
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        verts.push([Math.cos(a) * rx, y, Math.sin(a) * rz]);
        edges.push([off + i, off + (i + 1) % seg]);
      }
      off += seg;
    }
    // Vertical lines connecting levels
    for (let i = 0; i < seg; i += 2) {
      for (let l = 0; l < levels.length - 1; l++) {
        edges.push([l * seg + i, (l + 1) * seg + i]);
      }
    }
    // Stand
    const standV: Vec3[] = [[0, 1.0, 0], [0, 1.5, 0]];
    const standE: Edge[] = [[0, 1]];
    const baseV: Vec3[] = [];
    const baseE: Edge[] = [];
    const bseg = 14;
    for (let i = 0; i < bseg; i++) {
      const a = (i / bseg) * Math.PI * 2;
      baseV.push([Math.cos(a) * 0.5, 1.5, Math.sin(a) * 0.35]);
      baseE.push([i, (i + 1) % bseg]);
    }
    verts.push(...standV, ...baseV);
    edges.push(...standE.map(([a,b]): Edge => [a + off, b + off]));
    off += standV.length;
    edges.push(...baseE.map(([a,b]): Edge => [a + off, b + off]));
    return { verts, edges };
  },

  "fitness-wellness": () => {
    // Dumbbell
    const bar = mkBox(0, 0, 0, 2.4, 0.12, 0.12);
    const wL1 = mkCircle(-1.05, 0, 0, 0.45, 14, "xy");
    const wL2 = mkCircle(-1.2,  0, 0, 0.45, 14, "xy");
    const wR1 = mkCircle( 1.05, 0, 0, 0.45, 14, "xy");
    const wR2 = mkCircle( 1.2,  0, 0, 0.45, 14, "xy");
    // Connectors
    const connV: Vec3[] = [
      [-1.05, 0.45, 0], [-1.2, 0.45, 0], [-1.05, -0.45, 0], [-1.2, -0.45, 0],
      [ 1.05, 0.45, 0], [ 1.2,  0.45, 0], [ 1.05, -0.45, 0], [ 1.2,  -0.45, 0],
    ];
    const connE: Edge[] = [[0,1],[2,3],[4,5],[6,7]];
    return combine(bar, wL1, wL2, wR1, wR2, { v: connV, e: connE });
  },

  "food-beverage": () => {
    // Chef's cloche (dome cover on plate)
    // Plate
    const plate = mkCircle(0, 0.7, 0, 1.1, 18, "xz");
    const plateInner = mkCircle(0, 0.7, 0, 0.85, 18, "xz");
    // Dome rings
    const rings = [
      { y: 0.6, r: 0.95 }, { y: 0.3, r: 1.0 }, { y: 0.0, r: 0.88 },
      { y: -0.3, r: 0.65 }, { y: -0.6, r: 0.35 }, { y: -0.85, r: 0.1 },
    ];
    const seg = 16;
    const verts: Vec3[] = [...plate.v, ...plateInner.v];
    const edges: Edge[] = [...plate.e, ...plateInner.e];
    let off = plate.v.length + plateInner.v.length;
    const ringOffsets: number[] = [];
    for (const { y, r } of rings) {
      ringOffsets.push(off);
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        verts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
        edges.push([off + i, off + (i + 1) % seg]);
      }
      off += seg;
    }
    // Vertical lines on dome
    for (let i = 0; i < seg; i += 2) {
      for (let l = 0; l < rings.length - 1; l++) {
        edges.push([ringOffsets[l] + i, ringOffsets[l + 1] + i]);
      }
    }
    return { verts, edges };
  },

  "fragrance-beauty": () => {
    // Perfume bottle
    const body   = mkBox(0, 0.3, 0, 0.9, 1.4, 0.5);
    const neck   = mkBox(0, -0.7, 0, 0.35, 0.3, 0.3);
    const cap    = mkBox(0, -0.95, 0, 0.5, 0.22, 0.4);
    const capTop = mkBox(0, -1.1, 0, 0.4, 0.08, 0.35);
    // Label lines
    const lblV: Vec3[] = [
      [-0.38, -0.1, -0.26], [0.38, -0.1, -0.26],
      [-0.38,  0.1, -0.26], [0.38,  0.1, -0.26],
      [-0.38, -0.1,  0.26], [0.38, -0.1,  0.26],
      [-0.38,  0.1,  0.26], [0.38,  0.1,  0.26],
    ];
    const lblE: Edge[] = [[0,1],[2,3],[0,2],[1,3],[4,5],[6,7],[4,6],[5,7]];
    return combine(body, neck, cap, capTop, { v: lblV, e: lblE });
  },

  "technology-saas": () => {
    // Floating circuit cube with orbiting rings
    const core = mkBox(0, 0, 0, 1.0, 1.0, 1.0);
    const ring1 = mkCircle(0, 0, 0, 1.5, 20, "xz");
    const ring2 = mkCircle(0, 0, 0, 1.7, 20, "xy");
    // Data nodes on orbit
    const nodeV: Vec3[] = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return [Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5];
    });
    const nodeE: Edge[] = nodeV.flatMap((_, i) => [[i, 0 /* connect to center */]] as Edge[]);
    // Inner connections
    const innerV: Vec3[] = [
      [-0.5, 0.5, -0.5],[0.5, 0.5, 0.5],[0.5, -0.5, -0.5],[-0.5, -0.5, 0.5]
    ];
    const innerE: Edge[] = [[0,1],[1,2],[2,3],[3,0],[0,2],[1,3]];
    return combine(core, ring1, ring2, { v: nodeV, e: nodeE }, { v: innerV, e: innerE });
  },

  "ecommerce-retail": () => {
    // Shopping bag
    const body = mkBox(0, 0.3, 0, 1.4, 1.6, 0.85);
    // Handle left
    const hLV: Vec3[] = [
      [-0.5, -0.55, -0.43], [-0.5, -0.55, 0.43],
      [-0.5, -0.95, -0.43], [-0.5, -0.95, 0.43],
    ];
    const hLE: Edge[] = [[0,1],[2,3],[0,2],[1,3]];
    // Handle right
    const hRV: Vec3[] = [
      [0.5, -0.55, -0.43], [0.5, -0.55, 0.43],
      [0.5, -0.95, -0.43], [0.5, -0.95, 0.43],
    ];
    const hRE: Edge[] = [[0,1],[2,3],[0,2],[1,3]];
    // Logo placeholder
    const logV: Vec3[] = [
      [-0.3, 0.2, -0.43], [0.3, 0.2, -0.43],
      [-0.3, 0.55, -0.43], [0.3, 0.55, -0.43],
    ];
    const logE: Edge[] = [[0,1],[2,3],[0,2],[1,3]];
    return combine(body,
      { v: hLV, e: hLE }, { v: hRV, e: hRE }, { v: logV, e: logE }
    );
  },

  "healthcare-clinics": () => {
    // DNA double helix
    const turns = 3;
    const steps = 60;
    const verts: Vec3[] = [];
    const edges: Edge[] = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const angle = t * turns * Math.PI * 2;
      const y = (t - 0.5) * 3.0;
      verts.push([Math.cos(angle) * 0.7, y, Math.sin(angle) * 0.7]);          // strand A
      verts.push([Math.cos(angle + Math.PI) * 0.7, y, Math.sin(angle + Math.PI) * 0.7]); // strand B
    }
    // Backbone edges
    for (let i = 0; i < steps - 1; i++) {
      edges.push([i * 2, (i + 1) * 2]);         // strand A
      edges.push([i * 2 + 1, (i + 1) * 2 + 1]); // strand B
    }
    // Rungs (base pairs) every 4 steps
    for (let i = 0; i < steps; i += 4) {
      edges.push([i * 2, i * 2 + 1]);
    }
    return { verts, edges };
  },

  "entertainment-media": () => {
    // Clapperboard
    const board = mkBox(0, 0.3, 0, 2.0, 1.2, 0.12);
    // Top hinged bar (angled)
    const barV: Vec3[] = [
      [-1.0, -0.35, -0.07], [1.0, -0.35, -0.07],
      [-0.8, -0.65, -0.07], [1.0, -0.65, -0.07],
      [-1.0, -0.35,  0.07], [1.0, -0.35,  0.07],
      [-0.8, -0.65,  0.07], [1.0, -0.65,  0.07],
    ];
    const barE: Edge[] = [
      [0,1],[2,3],[0,2],[1,3],[4,5],[6,7],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]
    ];
    // Stripe lines on board
    const stripes: Vec3[] = [];
    const stripeE: Edge[] = [];
    for (let i = 0; i < 5; i++) {
      const x = -0.8 + i * 0.4;
      stripes.push([x, -0.1, -0.07], [x + 0.3, 0.6, -0.07]);
      stripeE.push([i * 2, i * 2 + 1]);
    }
    // Film reel (circle with spokes)
    const reel = mkCircle(0.55, 0.25, -0.07, 0.28, 16, "xy");
    const spokeV: Vec3[] = Array.from({ length: 3 }, (_, i) => {
      const a = (i / 3) * Math.PI * 2;
      return [0.55 + Math.cos(a) * 0.2, 0.25 + Math.sin(a) * 0.2, -0.07];
    });
    const center: Vec3 = [0.55, 0.25, -0.07];
    const reelOff = board.v.length + barV.length + stripes.length + reel.v.length;
    const allVerts: Vec3[] = [...board.v, ...barV, ...stripes, ...reel.v, center, ...spokeV];
    const off0 = 0, off1 = board.v.length, off2 = off1 + barV.length;
    const off3 = off2 + stripes.length, off4 = off3 + reel.v.length;
    const allEdges: Edge[] = [
      ...board.e,
      ...barE.map(([a,b]): Edge => [a+off1, b+off1]),
      ...stripeE.map(([a,b]): Edge => [a+off2, b+off2]),
      ...reel.e.map(([a,b]): Edge => [a+off3, b+off3]),
      ...[0,1,2].map((i): Edge => [off4, off4+1+i]),
    ];
    return { verts: allVerts, edges: allEdges };
  },

  "fragrance-beauty-alt": () => ({
    verts: [], edges: [],
  }),
};

// ─── Canvas renderer ──────────────────────────────────────────────────────────
interface IndustryVisualProps {
  slug: string;
}

export default function IndustryVisual({ slug }: IndustryVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const geoFactory = geometries[slug];

  // Fallback: rotating cube
  const geo = geoFactory ? geoFactory() : (() => {
    const b = mkBox(0,0,0,1.4,1.4,1.4);
    return { verts: b.v, edges: b.e };
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let startTime = performance.now();

    // Per-slug tilt offsets so each industry feels unique
    const tiltMap: Record<string, number> = {
      automotive: 0.18,
      "luxury-lifestyle": 0.22,
      "real-estate": 0.12,
      "fashion-apparel": 0.08,
      "fitness-wellness": 0.20,
      "food-beverage": 0.14,
      "fragrance-beauty": 0.10,
      "technology-saas": 0.28,
      "ecommerce-retail": 0.12,
      "healthcare-clinics": 0.0,
      "entertainment-media": 0.10,
    };
    const xTilt = tiltMap[slug] ?? 0.15;

    const render = () => {
      const t = (performance.now() - startTime) / 1000;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const ry = t * 0.38;
      const rx = Math.sin(t * 0.25) * xTilt;
      const cx = W / 2, cy = H / 2;

      // Transform + project all vertices
      const projected = geo.verts.map(v => {
        let rv = rotY(v, ry);
        rv = rotX(rv, rx);
        const [px, py, pz] = proj(rv, 4.5, 280);
        return { x: cx + px, y: cy + py, z: rv[2] };
      });

      // Sort edges back-to-front
      const sorted = geo.edges.map(([a, b]) => ({
        a, b,
        avgZ: (projected[a]?.z ?? 0 + projected[b]?.z ?? 0) / 2,
      })).sort((x, y) => y.avgZ - x.avgZ);

      // Glow backdrop
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.45);
      grd.addColorStop(0, "rgba(255,98,0,0.06)");
      grd.addColorStop(1, "rgba(255,98,0,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // Draw edges
      for (const { a, b, avgZ } of sorted) {
        const pa = projected[a], pb = projected[b];
        if (!pa || !pb) continue;
        const depth = Math.max(0.05, Math.min(1, (1.5 - avgZ) / 2.2));
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `rgba(255,98,0,${(0.18 + depth * 0.82).toFixed(2)})`;
        ctx.lineWidth = 0.8 + depth * 1.6;
        ctx.stroke();
      }

      // Draw vertex dots (only front-facing ones)
      for (const { x, y, z } of projected) {
        const d = Math.max(0, Math.min(1, (0.8 - z) / 1.2));
        if (d < 0.25) continue;
        const r = 1.5 + d * 2.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,98,0,${(d * 0.9).toFixed(2)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, [slug]);

  return (
    <canvas
      ref={canvasRef}
      width={520}
      height={480}
      className="w-full h-full max-w-lg mx-auto"
      style={{ display: "block" }}
    />
  );
}
