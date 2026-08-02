/**
 * BrandCubeScene — The Marketing Ecosystem
 * A scroll-driven cinematic 3D experience. Same camera / scroll timeline as before;
 * only the central object has changed from a cube to a living marketing ecosystem.
 */
import { useRef, useMemo, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Utilities ─────────────────────────────────────────────────────────────
const ss  = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lp  = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

// ─── Camera keyframes — identical to previous version ─────────────────────
const CAM_KF = [
  [0.00,  0,   1.5,   9.0],
  [0.15,  0,   0.3,   6.0],
  [0.28,  5.5, 1.0,   4.5],
  [0.42,  4.0, 2.5,  -3.5],
  [0.57, -5.5, 0.5,   3.0],
  [0.71,  1.0,-3.5,   5.0],
  [0.85,  0,   2.0,  10.0],
  [1.00,  0,   0,     3.2],
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
  { name: "Reels",       r: 2.5, speed: 0.32, phase: Math.PI * 1.32,     axisX: -0.28, axisZ:  0.14, appearsAt: 0.44 },
  { name: "Snapchat",    r: 2.1, speed: 0.20, phase: Math.PI * 1.54,     axisX:  0.14, axisZ:  0.26, appearsAt: 0.47 },
  { name: "WhatsApp",    r: 2.7, speed: 0.27, phase: Math.PI * 1.76,     axisX: -0.16, axisZ: -0.16, appearsAt: 0.50 },
  { name: "Pinterest",   r: 2.3, speed: 0.23, phase: Math.PI * 1.98,     axisX:  0.34, axisZ:  0.08, appearsAt: 0.53 },
];

// ─── Individual element meshes — Social Media themed ──────────────────────

/** 1 — Instagram  #FF0069 hot-pink */
function InstagramMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.50, 0.50, 0.08]} />
        <meshStandardMaterial color="#1a0010" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <torusGeometry args={[0.16, 0.025, 10, 36]} />
        <meshStandardMaterial color="#FF0069" emissive="#FF0069" emissiveIntensity={1.0} />
      </mesh>
      <mesh position={[0, 0, 0.048]}>
        <circleGeometry args={[0.13, 32]} />
        <meshStandardMaterial color="#FF0069" emissive="#FF0069" emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
      {/* yellow corner dot — IG gradient accent */}
      <mesh position={[0.18, 0.18, 0.045]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#FCAF45" emissive="#FCAF45" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/** 2 — Facebook  #0866FF */
function FacebookMesh() {
  return (
    <group>
      <mesh position={[0.05, 0.06, 0]}>
        <boxGeometry args={[0.16, 0.36, 0.07]} />
        <meshStandardMaterial color="#00102a" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0.14, 0.26, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.14, 0.16, 0.07]} />
        <meshStandardMaterial color="#00102a" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.30, 0.18, 0.07]} />
        <meshStandardMaterial color="#00102a" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0.05, 0.06, 0.038]}>
        <boxGeometry args={[0.14, 0.33, 0.005]} />
        <meshStandardMaterial color="#0866FF" emissive="#0866FF" emissiveIntensity={0.85} />
      </mesh>
    </group>
  );
}

/** 3 — TikTok  cyan #69C9D0 + red #EE1D52 */
function TikTokMesh() {
  return (
    <group>
      <mesh position={[-0.08, -0.18, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.07, 24]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0.05, 0.06, 0]}>
        <boxGeometry args={[0.05, 0.44, 0.07]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.95} roughness={0.07} />
      </mesh>
      {/* red flag */}
      <mesh position={[0.14, 0.22, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.18, 0.06, 0.07]} />
        <meshStandardMaterial color="#EE1D52" emissive="#EE1D52" emissiveIntensity={1.0} />
      </mesh>
      {/* cyan head glow */}
      <mesh position={[-0.08, -0.18, 0.038]}>
        <circleGeometry args={[0.10, 24]} />
        <meshStandardMaterial color="#69C9D0" emissive="#69C9D0" emissiveIntensity={0.85} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/** 4 — YouTube  #FF0000 */
function YouTubeMesh() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.64, 0.46, 0.06]} />
        <meshStandardMaterial color="#1a0000" metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0.04, 0, 0.035]}>
        <coneGeometry args={[0.16, 0.26, 3]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0, 0.033]}>
        <boxGeometry args={[0.58, 0.40, 0.004]} />
        <meshStandardMaterial color="#1a0000" emissive="#FF0000" emissiveIntensity={0.07} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** 5 — Twitter / X  white on dark (#ffffff) */
function TwitterMesh() {
  return (
    <group>
      <mesh rotation={[0, 0,  Math.PI / 4]}>
        <boxGeometry args={[0.08, 0.60, 0.07]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.08, 0.60, 0.07]} />
        <meshStandardMaterial color="#0d0d0d" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh rotation={[0, 0,  Math.PI / 4]} position={[0, 0, 0.038]}>
        <boxGeometry args={[0.05, 0.56, 0.005]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]} position={[0, 0, 0.038]}>
        <boxGeometry args={[0.05, 0.56, 0.005]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

/** 6 — LinkedIn  #0A66C2 */
function LinkedInMesh() {
  return (
    <group>
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.52, 0.36, 0.07]} />
        <meshStandardMaterial color="#001220" metalness={0.93} roughness={0.07} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <torusGeometry args={[0.14, 0.035, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#001220" metalness={0.93} roughness={0.07} />
      </mesh>
      <mesh position={[0, -0.04, 0.038]}>
        <boxGeometry args={[0.48, 0.015, 0.005]} />
        <meshStandardMaterial color="#0A66C2" emissive="#0A66C2" emissiveIntensity={0.9} />
      </mesh>
      {([-0.22, 0.22] as number[]).map((x, i) => (
        <mesh key={i} position={[x, -0.04, 0.038]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#0A66C2" emissive="#0A66C2" emissiveIntensity={1.1} />
        </mesh>
      ))}
    </group>
  );
}

/** 7 — Reels  #FF0069 pink + #FCAF45 yellow (IG gradient) */
function ReelsMesh() {
  const ringRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.z = clock.elapsedTime * 1.4;
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.30, 0.56, 0.06]} />
        <meshStandardMaterial color="#1a0010" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0, 0.02, 0.033]}>
        <boxGeometry args={[0.22, 0.42, 0.005]} />
        <meshStandardMaterial color="#FF0069" emissive="#FF0069" emissiveIntensity={0.75} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0, 0.034]}>
        <torusGeometry args={[0.20, 0.022, 8, 6]} />
        <meshStandardMaterial color="#FCAF45" emissive="#FCAF45" emissiveIntensity={1.0} />
      </mesh>
    </group>
  );
}

/** 8 — Snapchat  #FFFC00 yellow */
function ContentMesh() {
  return (
    <group>
      {/* ghost body */}
      <mesh>
        <sphereGeometry args={[0.26, 20, 20]} />
        <meshStandardMaterial color="#1a1a00" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* yellow glow ring */}
      <mesh>
        <torusGeometry args={[0.28, 0.025, 8, 36]} />
        <meshStandardMaterial color="#FFFC00" emissive="#FFFC00" emissiveIntensity={0.9} />
      </mesh>
      {/* eyes */}
      {([-0.08, 0.08] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.06, 0.24]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#FFFC00" emissive="#FFFC00" emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

/** 9 — WhatsApp  #25D366 green */
function HashtagMesh() {
  return (
    <group>
      {/* phone body */}
      <mesh>
        <boxGeometry args={[0.38, 0.62, 0.07]} />
        <meshStandardMaterial color="#001a0c" metalness={0.95} roughness={0.07} />
      </mesh>
      {/* speech bubble (circle) */}
      <mesh position={[0, 0.04, 0.038]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#25D366" emissive="#25D366" emissiveIntensity={0.8} transparent opacity={0.5} />
      </mesh>
      {/* bubble ring */}
      <mesh position={[0, 0.04, 0.039]}>
        <torusGeometry args={[0.18, 0.02, 8, 32]} />
        <meshStandardMaterial color="#25D366" emissive="#25D366" emissiveIntensity={1.0} />
      </mesh>
      {/* bubble tail */}
      <mesh position={[-0.08, -0.12, 0.038]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.04, 0.1, 3]} />
        <meshStandardMaterial color="#25D366" emissive="#25D366" emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

/** 10 — Pinterest  #BD081C red */
function AnalyticsMesh() {
  return (
    <group>
      {/* pin head circle */}
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.22, 0.04, 10, 36]} />
        <meshStandardMaterial color="#1a0002" metalness={0.95} roughness={0.07} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#BD081C" emissive="#BD081C" emissiveIntensity={0.6} transparent opacity={0.35} />
      </mesh>
      {/* pin needle going down */}
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.025, 0.005, 0.48, 10]} />
        <meshStandardMaterial color="#BD081C" emissive="#BD081C" emissiveIntensity={0.9} />
      </mesh>
      {/* pin tip dot */}
      <mesh position={[0, -0.39, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#BD081C" emissive="#BD081C" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

const ELEMENT_MESHES = [
  InstagramMesh, FacebookMesh, TikTokMesh, YouTubeMesh, TwitterMesh,
  LinkedInMesh, ReelsMesh, ContentMesh, HashtagMesh, AnalyticsMesh,
];

// ─── Single orbiting element ───────────────────────────────────────────────
function OrbitElement({
  def, index, scrollRef, posRef,
}: {
  def: typeof ELEMENTS[0];
  index: number;
  scrollRef: MutableRefObject<number>;
  posRef: MutableRefObject<THREE.Vector3[]>;
}) {
  const groupRef  = useRef<THREE.Group>(null!);
  const axis      = useMemo(() => new THREE.Vector3(def.axisX, 1, def.axisZ).normalize(), [def.axisX, def.axisZ]);
  const baseVec   = useMemo(() => new THREE.Vector3(def.r, 0, 0), [def.r]);
  const tmpVec    = useMemo(() => new THREE.Vector3(), []);
  const MeshComp  = ELEMENT_MESHES[index];

  useFrame(({ clock }, delta) => {
    const s = scrollRef.current;
    const t = clock.elapsedTime;

    // Always visible — no scroll gate on visibility
    groupRef.current.scale.setScalar(1);

    // Orbit position
    const angle = def.speed * t + def.phase;
    tmpVec.copy(baseVec).applyAxisAngle(axis, angle);
    groupRef.current.position.copy(tmpVec);

    // Store for connection lines
    posRef.current[index] = groupRef.current.position.clone();

    // Gentle self-rotation for visual interest
    groupRef.current.rotation.x += delta * 0.18;
    groupRef.current.rotation.z += delta * 0.12;
  });

  return (
    <group ref={groupRef} scale={0}>
      <MeshComp />
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

// ─── Central Core ──────────────────────────────────────────────────────────
function CentralCore({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const outerRef  = useRef<THREE.Mesh>(null!);
  const innerRef  = useRef<THREE.Mesh>(null!);
  const ringRef   = useRef<THREE.Mesh>(null!);
  const lightRef  = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const s = scrollRef.current;
    const t = clock.elapsedTime;
    const pulse = Math.sin(t * 2.4) * 0.06;
    const sectionProgress = clamp(s / 0.15);       // 0→1 as section 1 plays
    const fullBloom = ss(clamp((s - 0.72) / 0.12)); // max in section 6

    const glow = lp(0.6, 2.8, fullBloom) + pulse;
    const iMat = innerRef.current.material as THREE.MeshStandardMaterial;
    const oMat = outerRef.current.material as THREE.MeshStandardMaterial;
    iMat.emissiveIntensity = glow;
    oMat.emissiveIntensity = glow * 0.25;
    lightRef.current.intensity = glow * 10 + pulse * 4;

    // Outer shell breathes
    const sc = 1 + Math.sin(t * 1.8) * 0.04;
    outerRef.current.scale.setScalar(sc);

    // Equatorial ring rotates
    ringRef.current.rotation.y = t * 0.5;
    ringRef.current.rotation.x = t * 0.3;

    // Core sphere visible only once scroll begins (starts on load)
    innerRef.current.visible = true;
  });

  return (
    <>
      <pointLight ref={lightRef} color="#ff5500" intensity={6} distance={10} />

      {/* Outer glass shell */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#ff3300"
          emissiveIntensity={0.15}
          metalness={0.1}
          roughness={0.0}
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Inner core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff2200"
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Equatorial ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.62, 0.018, 8, 64]} />
        <meshStandardMaterial color="#ff5500" emissive="#ff4400" emissiveIntensity={0.7} />
      </mesh>
    </>
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

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    // Gentle idle yaw on the whole system
    groupRef.current.rotation.y += delta * 0.04;
    groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <CentralCore scrollRef={scrollRef} />
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
      {/* Environment lighting */}
      <ambientLight intensity={0.07} />
      <pointLight position={[ 6,  5, 4]} color="#ff6600" intensity={14} distance={22} />
      <pointLight position={[-5, -3, 3]} color="#ff2200" intensity={8}  distance={20} />
      <pointLight position={[ 0,  0,-6]} color="#ffffff" intensity={4}  distance={16} />
      <pointLight position={[ 0,  6, 0]} color="#ffaa44" intensity={5}  distance={18} />

      <Particles scrollRef={scrollRef} />
      <MarketingEcosystem scrollRef={scrollRef} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} intensity={1.5} radius={0.78} mipmapBlur />
      </EffectComposer>
    </>
  );
}

// ─── Exported canvas — identical interface as before ───────────────────────
export function BrandCubeCanvas({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 9], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, window.devicePixelRatio > 1 ? 1.5 : 1]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
