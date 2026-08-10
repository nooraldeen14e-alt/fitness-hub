/**
 * GlobeScene — Canvas 2D rotating Earth with real country borders
 * • Fetches world-atlas 110m TopoJSON from CDN, decodes arcs inline
 * • Fills UAE, Switzerland, Slovenia in orange; other countries in subtle teal
 * • Pulsing orange markers on the three countries
 * • Social platform icons orbit in a tilted ellipse
 */
import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  siInstagram, siFacebook, siTiktok, siYoutube, siX, siSnapchat,
} from "simple-icons";

// ── LinkedIn icon path ────────────────────────────────────────────────────────
const LINKEDIN_PATH =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.276 2.368 4.276 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const PLATFORMS = [
  { name: "Instagram", color: "#FF0069", path: siInstagram.path },
  { name: "Facebook",  color: "#0866FF", path: siFacebook.path  },
  { name: "TikTok",    color: "#69C9D0", path: siTiktok.path    },
  { name: "YouTube",   color: "#FF0000", path: siYoutube.path   },
  { name: "X",         color: "#e7e9ea", path: siX.path         },
  { name: "LinkedIn",  color: "#0A66C2", path: LINKEDIN_PATH    },
  { name: "Snapchat",  color: "#a89e00", path: siSnapchat.path  },
];

// ISO numeric IDs (world-atlas) + lat/lon for marker placement
const HIGHLIGHT = new Set([784, 756, 705]); // UAE, Switzerland, Slovenia
const MARKERS = [
  { name: "UAE",         lat:  24.47, lon:  54.37 },
  { name: "Switzerland", lat:  46.82, lon:   8.23 },
  { name: "Slovenia",    lat:  46.12, lon:  14.81 },
];

// ── TopoJSON arc decoder ─────────────────────────────────────────────────────
// Each arc is delta-encoded integers. scale + translate come from topology.transform.
type TopoRing  = [number, number][];   // [[lon,lat], ...]
type CountryShape = { id: number; rings: TopoRing[] };

function decodeTopo(topo: any): CountryShape[] {
  const { scale, translate } = topo.transform as { scale: [number,number]; translate: [number,number] };

  // Decode a single arc → array of [lon, lat] in degrees
  function decodeArc(raw: number[][]): TopoRing {
    let x = 0, y = 0;
    return raw.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number];
    });
  }

  const decodedArcs: TopoRing[] = topo.arcs.map(decodeArc);

  // Stitch arcs referenced by a polygon ring
  function stitchRing(indices: number[]): TopoRing {
    return indices.flatMap(i => {
      const arc = i < 0 ? [...decodedArcs[~i]].reverse() : decodedArcs[i];
      return arc.slice(0, -1); // drop duplicate join point
    });
  }

  const shapes: CountryShape[] = [];

  for (const geom of topo.objects.countries.geometries) {
    const id = geom.id as number;
    const rings: TopoRing[] = [];

    if (geom.type === "Polygon") {
      for (const ring of geom.arcs as number[][]) rings.push(stitchRing(ring));
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.arcs as number[][][])
        for (const ring of poly) rings.push(stitchRing(ring));
    }

    shapes.push({ id, rings });
  }

  return shapes;
}

// ── Orthographic projection ──────────────────────────────────────────────────
function project(
  lon: number, lat: number, rotation: number, R: number, cx: number, cy: number
) {
  const phi   = lat * (Math.PI / 180);
  const theta = lon * (Math.PI / 180) - rotation;
  return {
    x: cx + R * Math.cos(phi) * Math.sin(theta),
    y: cy - R * Math.sin(phi),
    z:      R * Math.cos(phi) * Math.cos(theta), // > 0 → front hemisphere
  };
}

// ── Platform icon canvases ────────────────────────────────────────────────────
function makeIconCanvas(name: string, color: string, svgPath: string): HTMLCanvasElement {
  const S = 72;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.beginPath();
  ctx.roundRect(2, 2, S - 4, S - 4, 14);
  ctx.fillStyle = color + "22"; ctx.fill();
  ctx.strokeStyle = color + "99"; ctx.lineWidth = 2; ctx.stroke();
  const px = 34, ox = (S - px) / 2, oy = (S - px) / 2;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(px / 24, px / 24);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(svgPath));
  ctx.restore();
  return c;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const rotRef    = useRef<number>(0.55);   // start showing Middle East
  const timeRef   = useRef<number>(0);
  const [shapes, setShapes] = useState<CountryShape[]>([]);

  const iconCanvases = useMemo(
    () => PLATFORMS.map(p => makeIconCanvas(p.name, p.color, p.path)),
    []
  );

  // Fetch world-atlas once
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(topo => setShapes(decodeTopo(topo)))
      .catch(() => {/* silently fall back to no borders */});
  }, []);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const obs = new ResizeObserver(() => {
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    });
    obs.observe(parent);
    canvas.width  = parent.clientWidth;
    canvas.height = parent.clientHeight;
    return () => obs.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      rotRef.current  += dt * 0.10;
      timeRef.current += dt;
      const rot = rotRef.current;
      const t   = timeRef.current;

      const W  = canvas.width;
      const H  = canvas.height;
      const R  = Math.min(W, H) * 0.36;
      const cx = W * 0.46;
      const cy = H * 0.50;

      ctx.clearRect(0, 0, W, H);

      // ── Sphere base ──────────────────────────────────────────────────────
      const baseGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.05, cx, cy, R);
      baseGrad.addColorStop(0,   "#0d1f38");
      baseGrad.addColorStop(0.7, "#061225");
      baseGrad.addColorStop(1,   "#020810");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // ── Clip to sphere ───────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2);
      ctx.clip();

      // ── Country fills ────────────────────────────────────────────────────
      for (const shape of shapes) {
        const isHL = HIGHLIGHT.has(shape.id);

        for (const ring of shape.rings) {
          ctx.beginPath();
          let drawing = false;
          for (const [lon, lat] of ring) {
            const { x, y, z } = project(lon, lat, rot, R, cx, cy);
            if (z < 0) { drawing = false; continue; }
            if (!drawing) { ctx.moveTo(x, y); drawing = true; }
            else ctx.lineTo(x, y);
          }
          ctx.closePath();

          if (isHL) {
            ctx.fillStyle = "rgba(255,98,0,0.50)";
            ctx.fill();
            ctx.strokeStyle = "rgba(255,140,40,0.85)";
            ctx.lineWidth = 1.0;
            ctx.stroke();
          } else {
            ctx.fillStyle = "rgba(30,80,140,0.30)";
            ctx.fill();
            ctx.strokeStyle = "rgba(60,120,200,0.22)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ── Graticule (subtle lat/lon grid) ──────────────────────────────────
      ctx.globalAlpha = 0.07;
      // lat lines every 30°
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const { x, y, z } = project(lon, lat, rot, R, cx, cy);
          if (z < 0) { started = false; continue; }
          if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = lat === 0 ? "rgba(255,98,0,1)" : "rgba(255,98,0,0.6)";
        ctx.lineWidth   = lat === 0 ? 1.2 : 0.7;
        ctx.stroke();
      }
      // lon lines every 30°
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 3) {
          const { x, y, z } = project(lon, lat, rot, R, cx, cy);
          if (z < 0) { started = false; continue; }
          if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(255,98,0,0.5)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.restore(); // end sphere clip

      // ── Atmosphere ───────────────────────────────────────────────────────
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.91, cx, cy, R * 1.14);
      atmo.addColorStop(0,   "rgba(20,80,160,0.22)");
      atmo.addColorStop(0.6, "rgba(20,60,120,0.06)");
      atmo.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.14, 0, Math.PI * 2);
      ctx.fillStyle = atmo; ctx.fill();

      // Rim light
      const rim = ctx.createRadialGradient(cx, cy, R * 0.78, cx, cy, R);
      rim.addColorStop(0,   "rgba(40,110,255,0)");
      rim.addColorStop(0.7, "rgba(40,110,255,0)");
      rim.addColorStop(1,   "rgba(60,130,255,0.22)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = rim; ctx.fill();

      // ── Country markers ───────────────────────────────────────────────────
      for (const m of MARKERS) {
        const { x, y, z } = project(m.lon, m.lat, rot, R, cx, cy);
        if (z < R * 0.1) continue; // only draw when clearly on front

        const p  = (Math.sin(t * 2.4) + 1) / 2;
        const p2 = (Math.sin(t * 2.4 + Math.PI) + 1) / 2;

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 16);
        glow.addColorStop(0, `rgba(255,140,40,${0.7 * p})`);
        glow.addColorStop(1, "rgba(255,98,0,0)");
        ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        // Ring 1
        ctx.beginPath(); ctx.arc(x, y, 7 + 4 * p, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,140,40,${0.8 * (1 - p * 0.4)})`;
        ctx.lineWidth = 1.4; ctx.stroke();

        // Ring 2
        ctx.beginPath(); ctx.arc(x, y, 12 + 4 * p2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,98,0,${0.4 * (1 - p2 * 0.4)})`;
        ctx.lineWidth = 0.9; ctx.stroke();

        // Core
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FF7020"; ctx.fill();
        ctx.strokeStyle = "#FF9040"; ctx.lineWidth = 1; ctx.stroke();
      }

      // ── Orbit ring ────────────────────────────────────────────────────────
      const OR  = R * 1.58;
      const ORY = R * 0.44;
      const TILT = -20 * (Math.PI / 180);

      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(TILT);
      ctx.scale(1, ORY / OR);
      ctx.beginPath(); ctx.arc(0, 0, OR, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(255,98,0,0.10)"; ctx.lineWidth = 1.2; ctx.stroke();

      // ── Orbiting platform icons ────────────────────────────────────────────
      const ICON_SZ = 44;
      const positions = PLATFORMS.map((_, i) => {
        const base  = (i / PLATFORMS.length) * Math.PI * 2;
        const speed = 0.26 + i * 0.015;
        const angle = base + t * speed;
        const rx = Math.cos(angle) * OR;
        const ry = Math.sin(angle) * ORY;
        const x  = cx + rx * Math.cos(TILT) - ry * Math.sin(TILT);
        const y  = cy + rx * Math.sin(TILT) + ry * Math.cos(TILT);
        return { i, x, y, depth: Math.sin(angle) };
      });
      positions.sort((a, b) => a.depth - b.depth);

      for (const { i, x, y, depth } of positions) {
        const scale = 0.60 + depth * 0.40;
        const alpha = 0.35 + depth * 0.65;
        const sz = ICON_SZ * scale;
        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.drawImage(iconCanvases[i], x - sz / 2, y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shapes, iconCanvases]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
