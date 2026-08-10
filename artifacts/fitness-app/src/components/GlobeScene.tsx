/**
 * GlobeScene — Pure Canvas 2D globe (no WebGL / Three.js)
 * • Rotating sphere with orange grid lines
 * • Glowing pulsing markers for UAE, Switzerland, Slovenia
 * • Social platform icons orbiting in a tilted ellipse
 */
import React, { useRef, useEffect, useMemo } from "react";
import {
  siInstagram, siFacebook, siTiktok, siYoutube, siX, siSnapchat,
} from "simple-icons";

// ── LinkedIn path (not in simple-icons at this version) ──────────────────────
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

// UAE, Switzerland, Slovenia  — lat/lon
const MARKERS = [
  { name: "UAE",         lat:  24.47, lon:  54.37 },
  { name: "Switzerland", lat:  46.82, lon:   8.23 },
  { name: "Slovenia",    lat:  46.12, lon:  14.81 },
];

// ── Pre-render each platform card to an offscreen canvas ─────────────────────
function makeIconCanvas(name: string, color: string, svgPath: string): HTMLCanvasElement {
  const S = 72;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;

  // Background pill
  const r = 14;
  ctx.beginPath();
  ctx.roundRect(2, 2, S - 4, S - 4, r);
  ctx.fillStyle = color + "22";
  ctx.fill();
  ctx.strokeStyle = color + "99";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Icon (SVG path, 24×24 viewBox → 38×38 px centred)
  const px = 34;
  const ox = (S - px) / 2;
  const oy = (S - px) / 2;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(px / 24, px / 24);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(svgPath));
  ctx.restore();

  return c;
}

// ── Convert lat/lon to canvas screen coords on the rotating globe ─────────────
function project(
  lat: number, lon: number, rotation: number, R: number, cx: number, cy: number
): { x: number; y: number; visible: boolean } {
  const phi   = lat * (Math.PI / 180);
  const theta = lon * (Math.PI / 180) - rotation;

  const x3 =  R * Math.cos(phi) * Math.sin(theta);   // screen-x
  const y3 = -R * Math.sin(phi);                      // screen-y (up)
  const z3 =  R * Math.cos(phi) * Math.cos(theta);   // depth (positive = front)

  return { x: cx + x3, y: cy + y3, visible: z3 > -R * 0.05 };
}

// ── Draw a single lon line (from lat -85 to 85) ───────────────────────────────
function drawLonLine(
  ctx: CanvasRenderingContext2D,
  lon: number, rotation: number, R: number, cx: number, cy: number,
  alpha: number
) {
  const steps = 60;
  let started = false;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const lat = -85 + (170 / steps) * i;
    const { x, y, visible } = project(lat, lon, rotation, R, cx, cy);
    if (!visible) { started = false; continue; }
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = `rgba(255,98,0,${alpha})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

// ── Draw a single lat line (full circle) ─────────────────────────────────────
function drawLatLine(
  ctx: CanvasRenderingContext2D,
  lat: number, rotation: number, R: number, cx: number, cy: number,
  alpha: number
) {
  const steps = 120;
  let started = false;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const lon = -180 + (360 / steps) * i;
    const { x, y, visible } = project(lat, lon, rotation, R, cx, cy);
    if (!visible) { started = false; continue; }
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = lat === 0
    ? `rgba(255,98,0,${alpha * 2.2})`   // equator brighter
    : `rgba(255,98,0,${alpha})`;
  ctx.lineWidth = lat === 0 ? 1.2 : 0.8;
  ctx.stroke();
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GlobeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const rotRef    = useRef(0);           // globe rotation (radians)
  const timeRef   = useRef(0);

  // Pre-render icon canvases once
  const iconCanvases = useMemo(
    () => PLATFORMS.map(p => makeIconCanvas(p.name, p.color, p.path)),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let last = performance.now();

    const draw = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      rotRef.current  += delta * 0.12;   // globe spin speed
      timeRef.current += delta;
      const rot = rotRef.current;
      const t   = timeRef.current;

      const W  = canvas.width;
      const H  = canvas.height;
      const R  = Math.min(W, H) * 0.34;
      const cx = W / 2;
      const cy = H / 2;

      // ── Clear ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // ── Sphere base ────────────────────────────────────────────────────────
      const sphereGrad = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.25, R * 0.1, cx, cy, R);
      sphereGrad.addColorStop(0,   "#0d1f3c");
      sphereGrad.addColorStop(0.6, "#061020");
      sphereGrad.addColorStop(1,   "#020810");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // ── Clip to sphere for grid lines ──────────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, 0, Math.PI * 2);
      ctx.clip();

      // Longitude lines every 30°
      for (let lon = 0; lon < 360; lon += 30) {
        drawLonLine(ctx, lon, rot, R, cx, cy, 0.13);
      }
      // Latitude lines every 30°
      for (let lat = -60; lat <= 60; lat += 30) {
        drawLatLine(ctx, lat, rot, R, cx, cy, lat === 0 ? 0.2 : 0.11);
      }

      ctx.restore();

      // ── Atmosphere glow ────────────────────────────────────────────────────
      const atmoGrad = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.12);
      atmoGrad.addColorStop(0,   "rgba(20,80,160,0.20)");
      atmoGrad.addColorStop(0.5, "rgba(20,60,120,0.06)");
      atmoGrad.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atmoGrad;
      ctx.fill();

      // Rim light
      const rimGrad = ctx.createRadialGradient(cx, cy, R * 0.80, cx, cy, R);
      rimGrad.addColorStop(0,   "rgba(30,100,200,0)");
      rimGrad.addColorStop(0.7, "rgba(30,100,200,0)");
      rimGrad.addColorStop(1,   "rgba(50,120,255,0.18)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = rimGrad;
      ctx.fill();

      // ── Country markers ────────────────────────────────────────────────────
      MARKERS.forEach(m => {
        const { x, y, visible } = project(m.lat, m.lon, rot, R, cx, cy);
        if (!visible) return;

        const pulse  = Math.sin(t * 2.2) * 0.4 + 0.6;
        const pulse2 = Math.sin(t * 2.2 + Math.PI) * 0.4 + 0.6;

        // Outer glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 14);
        glow.addColorStop(0,   `rgba(255,98,0,${0.55 * pulse})`);
        glow.addColorStop(1,   "rgba(255,98,0,0)");
        ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        // Pulsing ring 1
        ctx.beginPath();
        ctx.arc(x, y, 7 + 4 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,98,0,${0.7 * (1 - pulse * 0.3)})`;
        ctx.lineWidth = 1.2; ctx.stroke();

        // Pulsing ring 2 (offset)
        ctx.beginPath();
        ctx.arc(x, y, 11 + 4 * pulse2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,98,0,${0.35 * (1 - pulse2 * 0.3)})`;
        ctx.lineWidth = 0.8; ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FF6200"; ctx.fill();
      });

      // ── Orbiting platform icons ─────────────────────────────────────────────
      const ORBIT_RX   = R * 1.55;       // orbit x-radius (wide)
      const ORBIT_RY   = R * 0.45;       // orbit y-radius (tilted, squished)
      const TILT       = -18 * (Math.PI / 180);   // tilt of orbit plane
      const ICON_SIZE  = 44;

      // Draw orbit ring
      ctx.beginPath();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(TILT);
      ctx.scale(1, ORBIT_RY / ORBIT_RX);
      ctx.arc(0, 0, ORBIT_RX, 0, Math.PI * 2);
      ctx.restore();
      ctx.strokeStyle = "rgba(255,98,0,0.10)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw icons (back-to-front by depth)
      const iconPositions = PLATFORMS.map((_, i) => {
        const baseAngle = (i / PLATFORMS.length) * Math.PI * 2;
        const speed     = 0.28 + i * 0.015;
        const angle     = baseAngle + t * speed;

        // Elliptical orbit with tilt
        const rx = Math.cos(angle) * ORBIT_RX;
        const ry = Math.sin(angle) * ORBIT_RY;
        const x  = cx + rx * Math.cos(TILT) - ry * Math.sin(TILT);
        const y  = cy + rx * Math.sin(TILT) + ry * Math.cos(TILT);
        const depth = Math.sin(angle);   // -1 = back, +1 = front

        return { i, x, y, depth };
      });

      // Sort back to front
      iconPositions.sort((a, b) => a.depth - b.depth);

      iconPositions.forEach(({ i, x, y, depth }) => {
        const scale = 0.65 + depth * 0.35;   // bigger when in front
        const alpha = 0.4 + depth * 0.6;
        const sz    = ICON_SIZE * scale;

        ctx.globalAlpha = Math.max(0.15, alpha);
        ctx.drawImage(iconCanvases[i], x - sz / 2, y - sz / 2, sz, sz);
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [iconCanvases]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const obs = new ResizeObserver(() => {
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
    });
    obs.observe(parent);
    canvas.width  = parent.clientWidth;
    canvas.height = parent.clientHeight;
    return () => obs.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
