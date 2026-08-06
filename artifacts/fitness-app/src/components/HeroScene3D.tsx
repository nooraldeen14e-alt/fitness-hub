/**
 * HeroScene3D — Marketing Universe
 * Full-screen 3D background for the home hero.
 * Floating holographic metric cards connected to a glowing orange core,
 * surrounded by a particle field. Camera drifts slowly for life.
 */
import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── WebGL capability check — runs once before any canvas is created ────────
function isWebGLAvailable(): boolean {
  try {
    const cv = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (cv.getContext("webgl") || cv.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// ── Static fallback — shown when WebGL is not available ───────────────────
function FallbackBackground() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse 80% 60% at 65% 40%, hsl(25,100%,10%) 0%, #050505 65%)",
    }} />
  );
}

const ORANGE      = new THREE.Color("hsl(25,100%,50%)");
const ORANGE_HEX  = "hsl(25,100%,50%)";
const ORANGE_DIM  = new THREE.Color("hsl(25,100%,35%)");

// ── Metric cards data ──────────────────────────────────────────────────────
const METRICS = [
  { value: "150+", label: "Brands Scaled",   pos: [-3.0,  1.9, -1.2] as [number,number,number] },
  { value: "19M+", label: "Influencer Reach", pos: [ 3.1,  1.6, -0.6] as [number,number,number] },
  { value: "360°", label: "Full Marketing",   pos: [-2.9, -0.2,  0.4] as [number,number,number] },
  { value: "3M+",  label: "Monthly Reach",    pos: [ 3.0, -0.6, -1.0] as [number,number,number] },
  { value: "3",    label: "Countries",        pos: [-1.4, -2.0, -0.7] as [number,number,number] },
  { value: "ROI↑", label: "Proven Results",   pos: [ 1.9, -1.9,  0.3] as [number,number,number] },
];

// ── Canvas texture for each metric card ───────────────────────────────────
function makeMetricTexture(value: string, label: string): THREE.CanvasTexture {
  const W = 320, H = 200;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;

  // Rounded glass background
  ctx.beginPath();
  (ctx as any).roundRect(3, 3, W - 6, H - 6, 22);
  ctx.fillStyle = "rgba(6,6,6,0.88)";
  ctx.fill();

  // Orange border glow
  ctx.strokeStyle = ORANGE_HEX;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Top accent stripe
  ctx.fillStyle = ORANGE_HEX;
  ctx.fillRect(26, 3, W - 52, 3);

  // Value
  ctx.font = "bold 72px Arial, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.shadowColor = ORANGE_HEX;
  ctx.shadowBlur = 18;
  ctx.fillText(value, W / 2, 128);

  // Label
  ctx.shadowBlur = 0;
  ctx.font = "bold 19px monospace, sans-serif";
  ctx.fillStyle = ORANGE_HEX;
  ctx.fillText(label.toUpperCase(), W / 2, 168);

  return new THREE.CanvasTexture(cv);
}

// ── Single floating metric card ────────────────────────────────────────────
function MetricCard({
  value, label, pos, index,
}: { value: string; label: string; pos: [number,number,number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const tex     = useMemo(() => makeMetricTexture(value, label), [value, label]);
  const seed    = index * 1.37;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current) return;
    meshRef.current.position.y = pos[1] + Math.sin(t * 0.38 + seed) * 0.13;
    meshRef.current.rotation.x = Math.sin(t * 0.22 + seed)     * 0.07;
    meshRef.current.rotation.y = Math.sin(t * 0.18 + seed + 1) * 0.09;
  });

  const aspect = 320 / 200;
  const h = 1.42;

  return (
    <mesh ref={meshRef} position={pos}>
      <planeGeometry args={[h * aspect, h]} />
      <meshBasicMaterial map={tex} transparent opacity={0.93} depthWrite={false} />
    </mesh>
  );
}

// ── Thin connection lines: center → each card ──────────────────────────────
function ConnectionLines() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    for (const m of METRICS) {
      pts.push(0, 0, 0, ...m.pos);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: ORANGE_DIM, transparent: true, opacity: 0.3, depthWrite: false }),
    [],
  );

  return <lineSegments geometry={geo} material={mat} />;
}

// ── Central glowing orange core ────────────────────────────────────────────
function CoreSphere() {
  const coreRef  = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current)  coreRef.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);
    if (glowRef.current)  glowRef.current.scale.setScalar(1 + Math.sin(t * 1.1 + 1) * 0.08);
    if (ring1Ref.current) { ring1Ref.current.rotation.x += 0.008; ring1Ref.current.rotation.y += 0.012; }
    if (ring2Ref.current) { ring2Ref.current.rotation.x -= 0.006; ring2Ref.current.rotation.z += 0.009; }
  });

  return (
    <group>
      {/* bright core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color={ORANGE} />
      </mesh>
      {/* outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
      {/* orbiting rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.65, 0.012, 8, 64]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.90, 0.009, 8, 64]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.30} />
      </mesh>
    </group>
  );
}

// ── Ambient particle field ─────────────────────────────────────────────────
function Particles({ count = 180 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { geo, mat, base } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 9 - 1.5;
      pos[i*3] = base[i*3] = x;
      pos[i*3+1] = base[i*3+1] = y;
      pos[i*3+2] = base[i*3+2] = z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ color: ORANGE, size: 0.028, transparent: true, opacity: 0.55, depthWrite: false });
    return { geo: g, mat: m, base };
  }, [count]);

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime();
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i*3+1] = base[i*3+1] + Math.sin(t * 0.4 + i * 0.9) * 0.14;
      pos[i*3]   = base[i*3]   + Math.cos(t * 0.3 + i * 0.7) * 0.06;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return <points geometry={geo} material={mat} />;
}

// ── Grid floor — subtle perspective grid fading into distance ──────────────
function GridFloor() {
  const geo = useMemo(() => {
    const lines: number[] = [];
    const N = 14, step = 0.9, y = -2.8;
    for (let i = -N; i <= N; i++) {
      // x lines (running front→back)
      lines.push(i * step, y, -N * step, i * step, y, N * step);
      // z lines (running left→right)
      lines.push(-N * step, y, i * step, N * step, y, i * step);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    return g;
  }, []);

  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.07, depthWrite: false }),
    [],
  );

  return <lineSegments geometry={geo} material={mat} />;
}

// ── Mouse-driven camera with smooth lerp ──────────────────────────────────
// The camera follows your cursor with a gentle parallax offset.
// When idle it slowly drifts on its own so the scene always feels alive.
function CameraControl() {
  const { mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 7.8));

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();

    // Idle drift blended on top of the mouse offset
    const idleX = Math.sin(t * 0.07) * 0.35;
    const idleY = Math.cos(t * 0.05) * 0.18;

    // Mouse drives the primary offset (±1.8 horizontal, ±1.0 vertical)
    const goalX = mouse.x * 1.8 + idleX;
    const goalY = mouse.y * 1.0 + idleY;
    const goalZ = 7.8 + Math.sin(t * 0.04) * 0.2;

    // Smooth lerp toward the goal
    target.current.x += (goalX - target.current.x) * 0.04;
    target.current.y += (goalY - target.current.y) * 0.04;
    target.current.z += (goalZ - target.current.z) * 0.02;

    camera.position.copy(target.current);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// ── Root export ────────────────────────────────────────────────────────────
export function HeroScene3D() {
  // Detect WebGL before creating any canvas — avoids the uncaught Three.js
  // context error in environments without GPU (headless browsers, etc.)
  if (!isWebGLAvailable()) return <FallbackBackground />;

  return (
    <Canvas
      camera={{ position: [0, 0, 7.8], fov: 52 }}
      dpr={1}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <CameraControl />
      <GridFloor />
      <CoreSphere />
      <ConnectionLines />
      {METRICS.map((m, i) => (
        <MetricCard key={m.value} {...m} index={i} />
      ))}
      <Particles />
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.9} intensity={1.6} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
