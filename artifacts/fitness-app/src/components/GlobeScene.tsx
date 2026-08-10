/**
 * GlobeScene — Canvas 2D globe with real borders, country labels, highlights
 * • world-atlas 110m TopoJSON decoded inline
 * • UAE, Switzerland, Slovenia filled bright orange + labeled boldly
 * • Other countries labeled (large ones only) in subtle white
 * • Pulsing markers + social icons orbiting
 */
import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  siInstagram, siFacebook, siTiktok, siYoutube, siX, siSnapchat,
} from "simple-icons";

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

const HIGHLIGHT_IDS = new Set([784, 756, 705]); // UAE, Switzerland, Slovenia
const MARKERS = [
  { name: "UAE",         lat:  24.47, lon:  54.37 },
  { name: "Switzerland", lat:  46.82, lon:   8.23 },
  { name: "Slovenia",    lat:  46.12, lon:  14.81 },
];

// ── ISO 3166-1 numeric → display name (countries that get labels) ─────────────
const ISO_NAMES: Record<number, string> = {
  4: "Afghanistan", 8: "Albania", 12: "Algeria", 24: "Angola",
  32: "Argentina", 36: "Australia", 40: "Austria", 50: "Bangladesh",
  56: "Belgium", 64: "Bhutan", 68: "Bolivia", 76: "Brazil",
  100: "Bulgaria", 104: "Myanmar", 116: "Cambodia", 120: "Cameroon",
  124: "Canada", 144: "Sri Lanka", 152: "Chile", 156: "China",
  170: "Colombia", 180: "DR Congo", 191: "Croatia", 192: "Cuba",
  203: "Czech Republic", 208: "Denmark", 218: "Ecuador",
  818: "Egypt", 231: "Ethiopia", 246: "Finland", 250: "France",
  276: "Germany", 288: "Ghana", 300: "Greece", 320: "Guatemala",
  324: "Guinea", 332: "Haiti", 356: "India", 360: "Indonesia",
  364: "Iran", 368: "Iraq", 372: "Ireland", 376: "Israel",
  380: "Italy", 388: "Jamaica", 392: "Japan", 400: "Jordan",
  398: "Kazakhstan", 404: "Kenya", 408: "North Korea", 410: "South Korea",
  414: "Kuwait", 418: "Laos", 422: "Lebanon", 426: "Lesotho",
  434: "Libya", 454: "Malawi", 458: "Malaysia", 484: "Mexico",
  496: "Mongolia", 504: "Morocco", 508: "Mozambique", 524: "Nepal",
  528: "Netherlands", 554: "New Zealand", 566: "Nigeria",
  578: "Norway", 586: "Pakistan", 591: "Panama", 604: "Peru",
  608: "Philippines", 616: "Poland", 620: "Portugal",
  630: "Puerto Rico", 634: "Qatar", 642: "Romania", 643: "Russia",
  682: "Saudi Arabia", 686: "Senegal", 694: "Sierra Leone",
  703: "Slovakia", 705: "Slovenia", 706: "Somalia",
  710: "South Africa", 724: "Spain", 729: "Sudan", 752: "Sweden",
  756: "Switzerland", 760: "Syria", 762: "Tajikistan",
  764: "Thailand", 792: "Turkey", 800: "Uganda", 804: "Ukraine",
  784: "UAE", 826: "United Kingdom", 840: "United States",
  858: "Uruguay", 860: "Uzbekistan", 862: "Venezuela",
  704: "Vietnam", 887: "Yemen", 894: "Zambia", 716: "Zimbabwe",
  // Small / labeled-if-visible
  792: "Turkey", 504: "Morocco", 288: "Ghana",
};

// Minimum approx area (in deg²) to show a label — filters tiny islands
const MIN_AREA_FOR_LABEL: Record<number, boolean> = {};

// ── TopoJSON decoder ─────────────────────────────────────────────────────────
type TopoRing = [number, number][];
type CountryShape = {
  id: number;
  rings: TopoRing[];
  centroid: [number, number];
  approxArea: number;   // rough bounding-box area in deg²
};

function decodeTopo(topo: any): CountryShape[] {
  const { scale, translate } = topo.transform as {
    scale: [number, number]; translate: [number, number];
  };

  const decodedArcs: TopoRing[] = topo.arcs.map((raw: number[][]) => {
    let x = 0, y = 0;
    return raw.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]] as [number, number];
    });
  });

  function stitchRing(indices: number[]): TopoRing {
    return indices.flatMap(i => {
      const arc = i < 0 ? [...decodedArcs[~i]].reverse() : decodedArcs[i];
      return arc.slice(0, -1);
    });
  }

  function centroidOf(ring: TopoRing): [number, number] {
    let lx = 0, ly = 0;
    for (const [x, y] of ring) { lx += x; ly += y; }
    return [lx / ring.length, ly / ring.length];
  }

  function approxArea(ring: TopoRing): number {
    let minX = 180, maxX = -180, minY = 90, maxY = -90;
    for (const [x, y] of ring) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    return (maxX - minX) * (maxY - minY);
  }

  const shapes: CountryShape[] = [];
  for (const geom of topo.objects.countries.geometries) {
    const id = geom.id as number;
    const rings: TopoRing[] = [];
    if (geom.type === "Polygon") {
      for (const r of geom.arcs as number[][]) rings.push(stitchRing(r));
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.arcs as number[][][])
        for (const r of poly) rings.push(stitchRing(r));
    }
    if (!rings.length) continue;
    // Use the largest ring for centroid / area
    const main = rings.reduce((a, b) => (b.length > a.length ? b : a));
    shapes.push({ id, rings, centroid: centroidOf(main), approxArea: approxArea(main) });
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
    z:      R * Math.cos(phi) * Math.cos(theta),
  };
}

// ── Platform icon canvases ────────────────────────────────────────────────────
function makeIconCanvas(name: string, color: string, svgPath: string): HTMLCanvasElement {
  const S = 72;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.beginPath(); ctx.roundRect(2, 2, S - 4, S - 4, 14);
  ctx.fillStyle = color + "22"; ctx.fill();
  ctx.strokeStyle = color + "99"; ctx.lineWidth = 2; ctx.stroke();
  const px = 34, ox = (S - px) / 2, oy = (S - px) / 2;
  ctx.save(); ctx.translate(ox, oy); ctx.scale(px / 24, px / 24);
  ctx.fillStyle = color; ctx.fill(new Path2D(svgPath)); ctx.restore();
  return c;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function GlobeScene() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const rotRef     = useRef<number>(0.55);
  const timeRef    = useRef<number>(0);
  const [shapes, setShapes] = useState<CountryShape[]>([]);

  const iconCanvases = useMemo(
    () => PLATFORMS.map(p => makeIconCanvas(p.name, p.color, p.path)),
    []
  );

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(topo => setShapes(decodeTopo(topo)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const parent = canvas.parentElement!;
    const obs = new ResizeObserver(() => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    });
    obs.observe(parent);
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      rotRef.current  += dt * 0.09;
      timeRef.current += dt;
      const rot = rotRef.current;
      const t   = timeRef.current;

      const W  = canvas.width;
      const H  = canvas.height;
      const R  = Math.min(W, H) * 0.36;
      const cx = W * 0.46;
      const cy = H * 0.50;

      ctx.clearRect(0, 0, W, H);

      const hlPulse = 0.80 + 0.20 * Math.sin(t * 2.5);

      // ── Sphere base ──────────────────────────────────────────────────────
      const bg = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.3, R * 0.05, cx, cy, R);
      bg.addColorStop(0, "#0d1f38"); bg.addColorStop(0.7, "#061225"); bg.addColorStop(1, "#020810");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();

      // ── PRE-CLIP: large glow halos behind highlighted countries ───────────
      // These are drawn BEFORE the clip so shadowBlur isn't cut off
      for (const shape of shapes) {
        if (!HIGHLIGHT_IDS.has(shape.id)) continue;
        const [clon, clat] = shape.centroid;
        const cp = project(clon, clat, rot, R, cx, cy);
        if (cp.z < R * 0.05) continue;

        const glowR = R * 0.40 * hlPulse;
        const grad = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, glowR);
        grad.addColorStop(0,   `rgba(255,130,0,${0.55 * hlPulse})`);
        grad.addColorStop(0.35,`rgba(255,90,0,${0.28 * hlPulse})`);
        grad.addColorStop(1,   "rgba(255,60,0,0)");
        ctx.beginPath(); ctx.arc(cp.x, cp.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
      }

      // ── Clip to sphere ───────────────────────────────────────────────────
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2); ctx.clip();

      // ── Non-highlighted country fills ────────────────────────────────────
      for (const shape of shapes) {
        if (HIGHLIGHT_IDS.has(shape.id)) continue;
        for (const ring of shape.rings) {
          ctx.beginPath();
          let pen = false;
          for (const [lon, lat] of ring) {
            const p = project(lon, lat, rot, R, cx, cy);
            if (p.z < 0) { pen = false; continue; }
            pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
          }
          ctx.closePath();
          ctx.fillStyle = "rgba(25,75,135,0.32)"; ctx.fill();
          ctx.strokeStyle = "rgba(55,115,195,0.22)"; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }

      // ── Highlighted country fills — vivid orange on top ──────────────────
      for (const shape of shapes) {
        if (!HIGHLIGHT_IDS.has(shape.id)) continue;
        const [clon, clat] = shape.centroid;
        const cp = project(clon, clat, rot, R, cx, cy);
        if (cp.z < R * 0.05) continue;

        for (const ring of shape.rings) {
          ctx.beginPath();
          let pen = false;
          for (const [lon, lat] of ring) {
            const p = project(lon, lat, rot, R, cx, cy);
            if (p.z < -R * 0.05) { pen = false; continue; }
            pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
          }
          ctx.closePath();

          // Solid vivid fill
          ctx.fillStyle = `rgba(255,105,0,${0.92 * hlPulse})`; ctx.fill();

          // Bright glowing border
          ctx.shadowColor = "rgba(255,200,60,1)";
          ctx.shadowBlur = 12;
          ctx.strokeStyle = "rgba(255,230,100,1)";
          ctx.lineWidth = 2.0 + 0.8 * Math.sin(t * 4);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // ── Graticule ────────────────────────────────────────────────────────
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath(); let pen = false;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p = project(lon, lat, rot, R, cx, cy);
          if (p.z < 0) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = lat === 0 ? "rgba(255,98,0,0.18)" : "rgba(255,98,0,0.07)";
        ctx.lineWidth = lat === 0 ? 1.1 : 0.6; ctx.stroke();
      }
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath(); let pen = false;
        for (let lat = -85; lat <= 85; lat += 3) {
          const p = project(lon, lat, rot, R, cx, cy);
          if (p.z < 0) { pen = false; continue; }
          pen ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), pen = true);
        }
        ctx.strokeStyle = "rgba(255,98,0,0.07)"; ctx.lineWidth = 0.6; ctx.stroke();
      }

      // ── Country labels ───────────────────────────────────────────────────
      for (const shape of shapes) {
        const name = ISO_NAMES[shape.id];
        if (!name) continue;

        const isHL = HIGHLIGHT_IDS.has(shape.id);
        // Non-highlighted: only show if large enough
        if (!isHL && shape.approxArea < 80) continue;

        const [clon, clat] = shape.centroid;
        const p = project(clon, clat, rot, R, cx, cy);
        if (p.z < R * 0.12) continue; // must be clearly on front face

        if (isHL) {
          // Highlighted country label — bold orange, readable
          const fontSize = Math.max(9, Math.min(13, R * 0.032));
          ctx.font = `bold ${fontSize}px 'Inter', sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Text shadow / halo for legibility
          ctx.shadowColor = "rgba(0,0,0,0.9)";
          ctx.shadowBlur = 6;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(name, p.x, p.y);
          ctx.shadowBlur = 0;

          // Orange overlay
          ctx.shadowColor = "rgba(255,110,0,0.6)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = "#FFB060";
          ctx.fillText(name, p.x, p.y);
          ctx.shadowBlur = 0;
        } else {
          // Normal country label — small, subtle white
          const fontSize = Math.max(7, Math.min(10, R * 0.024));
          ctx.font = `${fontSize}px 'Inter', sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = "rgba(0,0,0,0.85)";
          ctx.shadowBlur = 4;
          ctx.fillStyle = "rgba(200,215,240,0.70)";
          ctx.fillText(name, p.x, p.y);
          ctx.shadowBlur = 0;
        }
      }

      ctx.restore(); // end sphere clip

      // ── Atmosphere ───────────────────────────────────────────────────────
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.91, cx, cy, R * 1.14);
      atmo.addColorStop(0, "rgba(20,80,160,0.22)");
      atmo.addColorStop(0.6, "rgba(20,60,120,0.07)");
      atmo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.14, 0, Math.PI * 2); ctx.fillStyle = atmo; ctx.fill();
      const rim = ctx.createRadialGradient(cx, cy, R * 0.78, cx, cy, R);
      rim.addColorStop(0, "rgba(40,110,255,0)"); rim.addColorStop(0.7, "rgba(40,110,255,0)"); rim.addColorStop(1, "rgba(60,130,255,0.22)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = rim; ctx.fill();

      // ── Country beacons — large, unmissable spotlights ───────────────────
      const BEACON_DATA = [
        { name: "UAE",         lat: 24.47, lon: 54.37, flag: "🇦🇪" },
        { name: "Switzerland", lat: 46.82, lon:  8.23, flag: "🇨🇭" },
        { name: "Slovenia",    lat: 46.12, lon: 14.81, flag: "🇸🇮" },
      ];

      for (const m of BEACON_DATA) {
        const p = project(m.lon, m.lat, rot, R, cx, cy);
        if (p.z < R * 0.15) continue;  // skip when on back hemisphere

        const pulse  = (Math.sin(t * 2.2) + 1) / 2;
        const pulse2 = (Math.sin(t * 2.2 + Math.PI * 0.66) + 1) / 2;
        const pulse3 = (Math.sin(t * 2.2 + Math.PI * 1.33) + 1) / 2;

        // ── Layer 1: huge soft glow blob ──────────────────────────────────
        const bigR = R * (0.22 + 0.05 * pulse);
        const bigGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, bigR);
        bigGlow.addColorStop(0,    `rgba(255,140,0,${0.55 * hlPulse})`);
        bigGlow.addColorStop(0.3,  `rgba(255,100,0,${0.30 * hlPulse})`);
        bigGlow.addColorStop(0.7,  `rgba(255,60,0,${0.10 * hlPulse})`);
        bigGlow.addColorStop(1,    "rgba(255,40,0,0)");
        ctx.beginPath(); ctx.arc(p.x, p.y, bigR, 0, Math.PI * 2);
        ctx.fillStyle = bigGlow; ctx.fill();

        // ── Layer 2: three expanding rings ────────────────────────────────
        const rings = [
          { r: 18 + 14 * pulse,  a: 0.85 * (1 - pulse  * 0.6), w: 2.0 },
          { r: 26 + 14 * pulse2, a: 0.55 * (1 - pulse2 * 0.5), w: 1.4 },
          { r: 36 + 14 * pulse3, a: 0.30 * (1 - pulse3 * 0.4), w: 1.0 },
        ];
        for (const ring of rings) {
          ctx.beginPath(); ctx.arc(p.x, p.y, ring.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,190,60,${ring.a})`;
          ctx.lineWidth = ring.w; ctx.stroke();
        }

        // ── Layer 3: 8-point starburst light rays ─────────────────────────
        const rayLen = 18 + 8 * pulse;
        const rayAlpha = 0.6 + 0.4 * pulse;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(t * 0.5);
        ctx.strokeStyle = `rgba(255,220,100,${rayAlpha})`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
          ctx.lineTo(Math.cos(a) * (9 + rayLen), Math.sin(a) * (9 + rayLen));
          ctx.stroke();
        }
        ctx.restore();

        // ── Layer 4: bright core dot ──────────────────────────────────────
        const dotGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
        dotGrad.addColorStop(0, "#FFFFFF");
        dotGrad.addColorStop(0.3, "#FFCC60");
        dotGrad.addColorStop(1, "rgba(255,120,0,0)");
        ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = dotGrad; ctx.fill();

        // ── Layer 5: floating name badge ──────────────────────────────────
        // Badge floats above & slightly right of the beacon
        const badgeX = p.x + (p.x < cx ? -90 : 16);
        const badgeY = p.y - 40 - 8 * pulse;
        const label  = m.name.toUpperCase();

        // Connector line
        ctx.beginPath();
        ctx.moveTo(p.x + (p.x < cx ? -10 : 10), p.y - 8);
        ctx.lineTo(badgeX + (p.x < cx ? 80 : 0), badgeY + 12);
        ctx.strokeStyle = `rgba(255,180,60,${0.55 + 0.2 * pulse})`;
        ctx.lineWidth = 1.2; ctx.stroke();

        // Badge background
        const bw = 80, bh = 26, br = 6;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, bw, bh, br);
        ctx.fillStyle = `rgba(255,100,0,${0.80 + 0.15 * pulse})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,220,100,${0.9})`;
        ctx.lineWidth = 1.2; ctx.stroke();

        // Badge text
        const fs = Math.max(9, R * 0.028);
        ctx.font = `bold ${fs}px 'Inter', monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 3;
        ctx.fillText(label, badgeX + bw / 2, badgeY + bh / 2);
        ctx.shadowBlur = 0;
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }

      // ── Orbit ring ────────────────────────────────────────────────────────
      const OR   = R * 1.58;
      const ORY  = R * 0.44;
      const TILT = -20 * (Math.PI / 180);
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(TILT); ctx.scale(1, ORY / OR);
      ctx.beginPath(); ctx.arc(0, 0, OR, 0, Math.PI * 2); ctx.restore();
      ctx.strokeStyle = "rgba(255,98,0,0.10)"; ctx.lineWidth = 1.2; ctx.stroke();

      // ── Orbiting icons ────────────────────────────────────────────────────
      const ICON_SZ = 44;
      const positions = PLATFORMS.map((_, i) => {
        const base = (i / PLATFORMS.length) * Math.PI * 2;
        const angle = base + t * (0.26 + i * 0.015);
        const rx = Math.cos(angle) * OR;
        const ry = Math.sin(angle) * ORY;
        return {
          i,
          x: cx + rx * Math.cos(TILT) - ry * Math.sin(TILT),
          y: cy + rx * Math.sin(TILT) + ry * Math.cos(TILT),
          depth: Math.sin(angle),
        };
      });
      positions.sort((a, b) => a.depth - b.depth);
      for (const { i, x, y, depth } of positions) {
        const scale = 0.60 + depth * 0.40;
        const sz = ICON_SZ * scale;
        ctx.globalAlpha = Math.max(0.15, 0.35 + depth * 0.65);
        ctx.drawImage(iconCanvases[i], x - sz / 2, y - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [shapes, iconCanvases]);

  return (
    <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
  );
}
