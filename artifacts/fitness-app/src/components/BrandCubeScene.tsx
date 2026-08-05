/**
 * BrandCubeScene — The Marketing Ecosystem
 * A scroll-driven cinematic 3D experience. Same camera / scroll timeline as before;
 * only the central object has changed from a cube to a living marketing ecosystem.
 */
import { useRef, useMemo, type MutableRefObject } from "react";
import {
  siInstagram, siFacebook, siTiktok, siYoutube, siX, siSnapchat,
} from "simple-icons";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Utilities ─────────────────────────────────────────────────────────────
const ss  = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

// ─── Camera keyframes — orbit around building through the icon cloud ───────
// Camera sweeps a full 360° around the building at roughly the same radius as
// the orbiting social icons (r ≈ 3.5–5.5), so scrolling feels like flying
// through the constellation of platforms.
const CAM_KF = [
  [0.00,   0,   2.0,  8.5],   // opening wide shot — building in frame
  [0.10,   0,   1.5,  5.5],   // glide in toward icon orbit
  [0.20,  -3.5, 0.8,  3.5],   // sweep left — first icons close by
  [0.32,  -5.2, 0.3,  0.0],   // left side of building
  [0.44,  -3.5,-0.5, -3.5],   // back-left — passing behind
  [0.55,   0,   0.5, -5.5],   // directly behind — building dead ahead
  [0.66,   4.0, 1.0, -3.5],   // back-right
  [0.76,   5.5, 1.5,  0.0],   // right side
  [0.86,   3.5, 2.0,  4.0],   // front-right — returning
  [1.00,   0,   1.5,  5.5],   // front settled — full orbit complete
];

function getCamPos(s: number): [number, number, number] {
  const t = clamp(s);
  let a = CAM_KF[0], b = CAM_KF[CAM_KF.length - 1];
  for (let i = 0; i < CAM_KF.length - 1; i++) {
    if (t >= CAM_KF[i][0] && t <= CAM_KF[i + 1][0]) { a = CAM_KF[i]; b = CAM_KF[i + 1]; break; }
  }
  const span = b[0] - a[0];
  const lo = span > 0 ? ss((t - a[0]) / span) : 0;
  return [lp(a[1], b[1], lo), lp(a[2], b[2], lo), lp(a[3], b[3], lo)];
}

// ─── Orbital element definitions ───────────────────────────────────────────
// appearsAt: scroll progress (0–1) when this element becomes visible
const ELEMENTS = [
  { name: "Instagram",   r: 2.2, speed: 0.28, phase: 0,                  axisX:  0.12, axisZ:  0.18, appearsAt: 0.15 },
  { name: "Facebook",    r: 2.6, speed: 0.21, phase: Math.PI * 0.22,     axisX:  0.30, axisZ:  0.06, appearsAt: 0.18 },
  { name: "TikTok",      r: 2.0, speed: 0.34, phase: Math.PI * 0.44,     axisX: -0.20, axisZ:  0.22, appearsAt: 0.21 },
  { name: "YouTube",     r: 2.4, speed: 0.19, phase: Math.PI * 0.66,     axisX:  0.24, axisZ: -0.10, appearsAt: 0.30 },
  { name: "Twitter / X", r: 2.8, speed: 0.30, phase: Math.PI * 0.88,     axisX: -0.10, axisZ:  0.28, appearsAt: 0.33 },
  { name: "LinkedIn",    r: 2.2, speed: 0.25, phase: Math.PI * 1.10,     axisX:  0.18, axisZ: -0.22, appearsAt: 0.36 },
  { name: "Snapchat",    r: 2.1, speed: 0.20, phase: Math.PI * 1.54,     axisX:  0.14, axisZ:  0.26, appearsAt: 0.47 },
];

// ─── Platform icon sprites — canvas-texture billboards ────────────────────

// LinkedIn SVG path (no simple-icons entry in this version)
const LINKEDIN_PATH = "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.276 2.368 4.276 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

const PLATFORM_CARDS = [
  { name: "Instagram",  color: "#FF0069", path: siInstagram.path },
  { name: "Facebook",   color: "#0866FF", path: siFacebook.path  },
  { name: "TikTok",     color: "#69C9D0", path: siTiktok.path    },
  { name: "YouTube",    color: "#FF0000", path: siYoutube.path   },
  { name: "X",          color: "#e7e9ea", path: siX.path         },
  { name: "LinkedIn",   color: "#0A66C2", path: LINKEDIN_PATH    },
  { name: "Snapchat",   color: "#a89e00", path: siSnapchat.path  },
] as const;

const CARD_W = 200;
const CARD_H = 232;

function makePlatformTexture(name: string, color: string, iconPath: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width  = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d")!;

  // ── Rounded-rect background ──────────────────────────────────────────────
  const r = 24, pad = 4;
  ctx.beginPath();
  ctx.moveTo(pad + r, pad);
  ctx.lineTo(CARD_W - pad - r, pad);
  ctx.arcTo(CARD_W - pad, pad, CARD_W - pad, pad + r, r);
  ctx.lineTo(CARD_W - pad, CARD_H - pad - r);
  ctx.arcTo(CARD_W - pad, CARD_H - pad, CARD_W - pad - r, CARD_H - pad, r);
  ctx.lineTo(pad + r, CARD_H - pad);
  ctx.arcTo(pad, CARD_H - pad, pad, CARD_H - pad - r, r);
  ctx.lineTo(pad, pad + r);
  ctx.arcTo(pad, pad, pad + r, pad, r);
  ctx.closePath();
  ctx.fillStyle   = color + "28";
  ctx.fill();
  ctx.strokeStyle = color + "cc";
  ctx.lineWidth   = 4;
  ctx.stroke();

  // ── Platform icon (SVG path, 24×24 viewBox → 92×92 px) ──────────────────
  const iconPx = 92;
  const ix = (CARD_W - iconPx) / 2;
  ctx.save();
  ctx.translate(ix, 28);
  ctx.scale(iconPx / 24, iconPx / 24);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(iconPath));
  ctx.restore();

  // ── Name label ────────────────────────────────────────────────────────────
  ctx.font      = "bold 19px monospace, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.fillText(name.toUpperCase(), CARD_W / 2, CARD_H - 14);

  return new THREE.CanvasTexture(canvas);
}

function PlatformSprite({ index }: { index: number }) {
  const card = PLATFORM_CARDS[index];
  const mat  = useMemo(() => {
    const tex = makePlatformTexture(card.name, card.color, card.path);
    return new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  }, [card.name, card.color, card.path]);

  const aspect = CARD_H / CARD_W;
  return <sprite material={mat} scale={[0.80, 0.80 * aspect, 1]} />;
}

// ─── Single orbiting element ───────────────────────────────────────────────
function OrbitElement({
  def, index, scrollRef, posRef,
}: {
  def: typeof ELEMENTS[0];
  index: number;
  scrollRef: MutableRefObject<number>;
  posRef: MutableRefObject<THREE.Vector3[]>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const axis     = useMemo(() => new THREE.Vector3(def.axisX, 1, def.axisZ).normalize(), [def.axisX, def.axisZ]);
  const baseVec  = useMemo(() => new THREE.Vector3(def.r, 0, 0), [def.r]);
  const tmpVec   = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const angle = def.speed * t + def.phase;
    tmpVec.copy(baseVec).applyAxisAngle(axis, angle);
    groupRef.current.position.copy(tmpVec);
    posRef.current[index] = groupRef.current.position.clone();
  });

  return (
    <group ref={groupRef}>
      <PlatformSprite index={index} />
    </group>
  );
}

// ─── Connection lines (Section 5+: scroll ≥ 0.58) ─────────────────────────
function ConnectionLines({
  scrollRef, posRef,
}: {
  scrollRef: MutableRefObject<number>;
  posRef: MutableRefObject<THREE.Vector3[]>;
}) {
  const n = ELEMENTS.length;
  // 10 adjacent pairs in ring + 5 skip-one connections
  const pairs = useMemo(() => {
    const p: [number, number][] = [];
    for (let i = 0; i < n; i++) p.push([i, (i + 1) % n]);
    for (let i = 0; i < 5; i++) p.push([i * 2, ((i * 2) + 3) % n]);
    return p;
  }, []);

  const lineRefs  = useRef<THREE.Line[]>([]);
  const geoRefs   = useRef<THREE.BufferGeometry[]>([]);

  // Build geometry once
  const lines = useMemo(() =>
    pairs.map((_, i) => {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      geoRefs.current[i] = geo;
      const mat = new THREE.LineBasicMaterial({ color: "#ff5500", transparent: true, opacity: 0 });
      return new THREE.Line(geo, mat);
    }),
  [pairs]);

  useFrame(() => {
    const s = scrollRef.current;
    const appear  = ss(clamp((s - 0.58) / 0.14));
    const fadeOut = ss(clamp((s - 0.88) / 0.10));
    const opacity = appear * (1 - fadeOut) * 0.45;

    pairs.forEach(([a, b], i) => {
      const pa = posRef.current[a], pb = posRef.current[b];
      if (!pa || !pb) return;
      const geo = geoRefs.current[i];
      const arr = geo.attributes.position as THREE.BufferAttribute;
      arr.setXYZ(0, pa.x, pa.y, pa.z);
      arr.setXYZ(1, pb.x, pb.y, pb.z);
      arr.needsUpdate = true;
      (lineRefs.current[i]?.material as THREE.LineBasicMaterial).opacity = opacity;
    });
  });

  return (
    <>
      {lines.map((line, i) => (
        <primitive
          key={i}
          object={line}
          ref={(el: THREE.Line) => { lineRefs.current[i] = el; }}
        />
      ))}
    </>
  );
}

// ─── Company Building (reference: dark-navy HQ tower) ─────────────────────
function CompanyBuilding({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const groupRef  = useRef<THREE.Group>(null!);
  const interiorRef = useRef<THREE.PointLight>(null!);
  const lobbyRef  = useRef<THREE.PointLight>(null!);
  const beaconRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const s = scrollRef.current;
    const breathe = Math.sin(t * 1.6) * 0.3 + 1;
    const bloom   = ss(clamp((s - 0.72) / 0.12));
    interiorRef.current.intensity = (0.8 + bloom * 2) * breathe;
    lobbyRef.current.intensity    = (1.2 + bloom * 1.5) * breathe;
    const bMat = beaconRef.current.material as THREE.MeshBasicMaterial;
    bMat.opacity = Math.sin(t * 4) * 0.4 + 0.6;
    // Tower stays still — no vertical float
  });

  // ── palette ──────────────────────────────────────────────────────────────
  const NAVY   = "#1a3358";   // rich dark-navy façade (clearly blue, not black)
  const NGLASS = "#1e3d70";   // brighter navy-blue cylinder glass
  const GOLD   = "#ffffff";   // white trim
  const AMBER  = "#ffffff";   // white floor-line glow
  const WHITE  = "#e8eeff";   // illuminated signage

  // 15 evenly-spaced floor rings / lines
  const FLOORS = Array.from({ length: 15 }, (_, i) => -1.70 + i * 0.245);

  return (
    <group ref={groupRef}>
      {/* Warm interior cylinder glow */}
      <pointLight ref={interiorRef} position={[0, 0, 0]}   color="#ffffff" intensity={0.8} distance={6} />
      {/* Warm lobby entrance glow */}
      <pointLight ref={lobbyRef}    position={[0, -1.8, 0.6]} color="#ffffff" intensity={1.2} distance={4} />

      {/* ══ LEFT WING ══ */}
      <mesh position={[-0.60, 0, 0]}>
        <boxGeometry args={[0.38, 3.70, 0.72]} />
        <meshStandardMaterial color={NAVY} metalness={0.88} roughness={0.16} />
      </mesh>

      {/* ══ RIGHT WING ══ */}
      <mesh position={[0.60, 0, 0]}>
        <boxGeometry args={[0.38, 3.70, 0.72]} />
        <meshStandardMaterial color={NAVY} metalness={0.88} roughness={0.16} />
      </mesh>

      {/* ══ CENTRAL SECTION — flat facade with window grid ══ */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.62, 3.72, 0.72]} />
        <meshStandardMaterial color={NAVY} metalness={0.88} roughness={0.16} />
      </mesh>

      {/* ── Window grid on front face (4 cols × 15 rows) ── */}
      {FLOORS.map((y, ri) =>
        ([-0.21, -0.07, 0.07, 0.21] as number[]).map((x, ci) => (
          <mesh key={`w-${ri}-${ci}`} position={[x, y, 0.365]}>
            <boxGeometry args={[0.094, 0.082, 0.003]} />
            <meshBasicMaterial color="#a8c4ff" transparent opacity={0.88} />
          </mesh>
        ))
      )}

      {/* ── Floor lines on left wing front face ── */}
      {FLOORS.map((y, i) => (
        <mesh key={`lf-${i}`} position={[-0.60, y, 0.364]}>
          <boxGeometry args={[0.36, 0.014, 0.004]} />
          <meshBasicMaterial color={AMBER} />
        </mesh>
      ))}

      {/* ── Floor lines on right wing front face ── */}
      {FLOORS.map((y, i) => (
        <mesh key={`rf-${i}`} position={[0.60, y, 0.364]}>
          <boxGeometry args={[0.36, 0.014, 0.004]} />
          <meshBasicMaterial color={AMBER} />
        </mesh>
      ))}

      {/* ── Outer corner gold trim strips ── */}
      {([-0.795, 0.795] as number[]).map((x, i) => (
        <mesh key={`ot-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[0.020, 3.72, 0.020]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      ))}

      {/* ── Inner gold trim (wing–cylinder junction) ── */}
      {([-0.41, 0.41] as number[]).map((x, i) => (
        <mesh key={`it-${i}`} position={[x, 0, 0]}>
          <boxGeometry args={[0.014, 3.72, 0.014]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      ))}

      {/* ══ CROWN / PARAPET ══ */}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[1.62, 0.32, 0.76]} />
        <meshStandardMaterial color={NAVY} metalness={0.88} roughness={0.14} />
      </mesh>
      {/* Crown top gold edge */}
      <mesh position={[0, 2.22, 0]}>
        <boxGeometry args={[1.64, 0.022, 0.78]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
      {/* Crown bottom gold edge */}
      <mesh position={[0, 1.89, 0]}>
        <boxGeometry args={[1.64, 0.016, 0.78]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>

      {/* ══ LOBBY / BASE ══ */}
      <mesh position={[0, -2.05, 0]}>
        <boxGeometry args={[1.85, 0.55, 0.95]} />
        <meshStandardMaterial color={NAVY} metalness={0.88} roughness={0.18} />
      </mesh>
      {/* Lobby glass front — warm amber glow */}
      <mesh position={[0, -1.98, 0.484]}>
        <boxGeometry args={[1.40, 0.40, 0.006]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.50} />
      </mesh>
      {/* Canopy overhang */}
      <mesh position={[0, -1.74, 0.54]}>
        <boxGeometry args={[0.90, 0.022, 0.18]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
      {/* Lobby pillars */}
      {([-0.46, 0.46] as number[]).map((x, i) => (
        <mesh key={`lp-${i}`} position={[x, -1.86, 0.49]}>
          <boxGeometry args={[0.035, 0.38, 0.035]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      ))}
      {/* Lobby top gold strip */}
      <mesh position={[0, -1.77, 0]}>
        <boxGeometry args={[1.87, 0.018, 0.97]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>

      {/* ══ ANTENNA SPIRE ══ */}
      <mesh position={[0, 2.52, 0]}>
        <cylinderGeometry args={[0.010, 0.010, 0.58, 6]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
      {/* Red beacon */}
      <mesh ref={beaconRef} position={[0, 2.82, 0]}>
        <sphereGeometry args={[0.024, 6, 6]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={1} />
      </mesh>

      {/* ══ SIGNAGE — crown front ══ */}
      <Text
        position={[0, 2.06, 0.385]}
        fontSize={0.118}
        color="#ff6a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.50}
        textAlign="center"
        letterSpacing={0.06}
        outlineColor="#ff5500"
        outlineWidth={0.006}
        outlineBlur={0.03}
        outlineOpacity={0.6}
      >
        Swissulife Media
      </Text>

      {/* ══ SIGNAGE — crown back ══ */}
      <Text
        position={[0, 2.06, -0.385]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.118}
        color="#ff6a1a"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.50}
        textAlign="center"
        letterSpacing={0.06}
        outlineColor="#ff5500"
        outlineWidth={0.006}
        outlineBlur={0.03}
        outlineOpacity={0.6}
      >
        Swissulife Media
      </Text>
    </group>
  );
}

// ─── Particle field ─────────────────────────────────────────────────────────
function Particles({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const s = scrollRef.current;
    const fade = 1 - ss(clamp(s / 0.22));
    (pointsRef.current.material as THREE.PointsMaterial).opacity = fade * 0.45;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.018;
    pointsRef.current.rotation.x = clock.elapsedTime * 0.009;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial color="#ff6622" size={0.055} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// ─── Marketing Ecosystem (root group) ─────────────────────────────────────
function MarketingEcosystem({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const groupRef  = useRef<THREE.Group>(null!);
  const posRef    = useRef<THREE.Vector3[]>(ELEMENTS.map(() => new THREE.Vector3()));

  useFrame(() => {
    // Tower is fixed — no idle rotation on the ecosystem group
  });

  return (
    <group ref={groupRef}>
      <CompanyBuilding scrollRef={scrollRef} />
      {ELEMENTS.map((def, i) => (
        <OrbitElement key={def.name} def={def} index={i} scrollRef={scrollRef} posRef={posRef} />
      ))}
      <ConnectionLines scrollRef={scrollRef} posRef={posRef} />
    </group>
  );
}

// ─── Scene + camera animation ──────────────────────────────────────────────
function Scene({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const camTarget = useRef(new THREE.Vector3(0, 1.5, 9));

  useFrame(({ camera }, delta) => {
    const [tx, ty, tz] = getCamPos(scrollRef.current);
    camTarget.current.set(tx, ty, tz);
    camera.position.lerp(camTarget.current, delta * 2.2);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* Environment lighting — reduced to 2 point lights for performance */}
      <ambientLight intensity={0.18} color="#b0c8ff" />
      <pointLight position={[ 6,  5, 4]} color="#c8d8ff" intensity={12} distance={24} />
      <pointLight position={[-5, -3, 3]} color="#f5a042" intensity={7}  distance={22} />

      <Particles scrollRef={scrollRef} />
      <MarketingEcosystem scrollRef={scrollRef} />

      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.65} intensity={0.7} radius={0.4} />
      </EffectComposer>
    </>
  );
}

// ─── Exported canvas — identical interface as before ───────────────────────
export function BrandCubeCanvas({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 9], fov: 50, near: 0.1, far: 100 }}
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
