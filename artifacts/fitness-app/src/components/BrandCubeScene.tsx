/**
 * BrandCubeScene — a scroll-driven cinematic 3D experience.
 * The Brand Cube assembles, rotates, and transforms as the visitor scrolls.
 */
import { useRef, useMemo, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ─── Utilities ─────────────────────────────────────────────────────────────
const ss = (t: number) => { const c = Math.max(0, Math.min(1, t)); return c * c * (3 - 2 * c); };
const lp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

// ─── Camera keyframes [scrollProgress, x, y, z] ───────────────────────────
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

// ─── Cube panel definitions ────────────────────────────────────────────────
//    assembled pos, assembled rot (euler xyz), scatter start, open direction
const PANEL_DEF = [
  { ap:[0,0,1.03],  ar:[0,0,0],              sc:[0,0,9],   od:[0,0,1]  },
  { ap:[0,0,-1.03], ar:[0,Math.PI,0],        sc:[0,0,-9],  od:[0,0,-1] },
  { ap:[1.03,0,0],  ar:[0,-Math.PI/2,0],     sc:[9,0,0],   od:[1,0,0]  },
  { ap:[-1.03,0,0], ar:[0, Math.PI/2,0],     sc:[-9,0,0],  od:[-1,0,0] },
  { ap:[0,1.03,0],  ar:[-Math.PI/2,0,0],     sc:[0,9,0],   od:[0,1,0]  },
  { ap:[0,-1.03,0], ar:[ Math.PI/2,0,0],     sc:[0,-9,0],  od:[0,-1,0] },
];

// ─── Single Panel ─────────────────────────────────────────────────────────
function CubePanel({ def, scrollRef }: { def: (typeof PANEL_DEF)[0]; scrollRef: MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    const s = scrollRef.current;
    const asm   = ss(clamp(s / 0.16));
    const open3 = ss(clamp((s - 0.30) / 0.13));
    const shut3 = ss(clamp((s - 0.46) / 0.10));
    const open7 = ss(clamp((s - 0.87) / 0.12));
    const openAmt = open3 * (1 - shut3) * 1.6 + open7 * 2.6;

    meshRef.current.position.set(
      lp(def.sc[0], def.ap[0], asm) + def.od[0] * openAmt,
      lp(def.sc[1], def.ap[1], asm) + def.od[1] * openAmt,
      lp(def.sc[2], def.ap[2], asm) + def.od[2] * openAmt,
    );
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = lp(0.04, 0.5, open7);
    mat.opacity = lp(1.0, 0.55, clamp(open7 * 1.2));
  });

  return (
    <mesh ref={meshRef} rotation={def.ar as [number,number,number]}>
      <boxGeometry args={[2, 2, 0.06]} />
      <meshStandardMaterial
        color="#0c0c0c"
        emissive="#ff4400"
        emissiveIntensity={0.04}
        metalness={0.96}
        roughness={0.07}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

// ─── Cube panel edge glow (thin border strips) ────────────────────────────
function EdgeGlow({ def, scrollRef }: { def: (typeof PANEL_DEF)[0]; scrollRef: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    const s = scrollRef.current;
    const asm   = ss(clamp(s / 0.16));
    const open3 = ss(clamp((s - 0.30) / 0.13));
    const shut3 = ss(clamp((s - 0.46) / 0.10));
    const open7 = ss(clamp((s - 0.87) / 0.12));
    const openAmt = open3 * (1 - shut3) * 1.6 + open7 * 2.6;
    ref.current.position.set(
      lp(def.sc[0], def.ap[0], asm) + def.od[0] * openAmt,
      lp(def.sc[1], def.ap[1], asm) + def.od[1] * openAmt,
      lp(def.sc[2], def.ap[2], asm) + def.od[2] * openAmt,
    );
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.18 + open7 * 0.4;
  });
  return (
    <mesh ref={ref} rotation={def.ar as [number,number,number]}>
      <boxGeometry args={[2.01, 2.01, 0.065]} />
      <meshBasicMaterial color="#ff5500" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

// ─── Inner core ───────────────────────────────────────────────────────────
function CubeCore({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const lightRef  = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const s = scrollRef.current;
    const t = clock.elapsedTime;
    const asm   = ss(clamp(s / 0.16));
    const open3 = ss(clamp((s - 0.30) / 0.13));
    const shut3 = ss(clamp((s - 0.46) / 0.10));
    const open7 = ss(clamp((s - 0.87) / 0.12));
    const glow = (open3 * (1 - shut3) * 0.6 + open7 * 2.2) * asm;

    const mat = sphereRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = glow + Math.sin(t * 2.2) * 0.08 * asm;
    lightRef.current.intensity = glow * 12 + Math.sin(t * 1.5) * 0.6 * asm;
  });

  return (
    <>
      <pointLight ref={lightRef} color="#ff5500" intensity={0} distance={7} />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff3300" emissiveIntensity={0} metalness={0.1} roughness={0.5} />
      </mesh>
    </>
  );
}

// ─── Particle field (fades after section 1) ───────────────────────────────
function Particles({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const geo = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const s = scrollRef.current;
    const fade = 1 - ss(clamp(s / 0.22));
    const t = clock.elapsedTime;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = fade * 0.55;
    // Gentle drift
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = t * 0.01;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial color="#ff6622" size={0.06} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// ─── Network lines (section 6: 0.73–0.87) ────────────────────────────────
function NetworkLines({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!);

  const lines = useMemo(() => {
    const dirs: [number, number, number][] = [];
    for (let i = 0; i < 24; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      dirs.push([
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
      ]);
    }
    return dirs;
  }, []);

  const lineRefs = useRef<THREE.Line[]>([]);

  useFrame(({ clock }) => {
    const s = scrollRef.current;
    const appear  = ss(clamp((s - 0.73) / 0.14));
    const fadeOut = ss(clamp((s - 0.88) / 0.10));
    const opacity = appear * (1 - fadeOut);
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.06;

    lineRefs.current.forEach((line) => {
      if (!line) return;
      (line.material as THREE.LineBasicMaterial).opacity = opacity * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((dir, i) => {
        const pts = [
          new THREE.Vector3(dir[0] * 1.1, dir[1] * 1.1, dir[2] * 1.1),
          new THREE.Vector3(dir[0] * 6,   dir[1] * 6,   dir[2] * 6),
        ];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive
            key={i}
            object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: "#ff5500", transparent: true, opacity: 0 }))}
            ref={(el: THREE.Line) => { lineRefs.current[i] = el; }}
          />
        );
      })}
    </group>
  );
}

// ─── Cube group (wraps all panels) ────────────────────────────────────────
function BrandCube({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef({ x: 0, y: 0, z: 0 });

  useFrame(({ clock }, delta) => {
    const s = scrollRef.current;
    const t = clock.elapsedTime;

    // Scroll drives Y rotation, idle adds gentle float on X
    target.current.y = s * Math.PI * 3.2 + t * 0.06;
    target.current.x = Math.sin(t * 0.4) * 0.08 + s * 0.6;
    target.current.z = Math.sin(t * 0.3) * 0.04;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, target.current.x, delta * 1.5);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, target.current.y, delta * 1.5);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, target.current.z, delta * 1.5);
  });

  return (
    <group ref={groupRef}>
      {PANEL_DEF.map((def, i) => (
        <group key={i}>
          <CubePanel def={def} scrollRef={scrollRef} />
          <EdgeGlow def={def} scrollRef={scrollRef} />
        </group>
      ))}
      <CubeCore scrollRef={scrollRef} />
    </group>
  );
}

// ─── Scene + camera animation ─────────────────────────────────────────────
function Scene({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const camTarget = useRef(new THREE.Vector3(0, 1.5, 9));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera }, delta) => {
    const [tx, ty, tz] = getCamPos(scrollRef.current);
    camTarget.current.set(tx, ty, tz);
    camera.position.lerp(camTarget.current, delta * 2.2);
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.08} />
      <pointLight position={[6,  5, 4]}  color="#ff6600" intensity={14} distance={22} />
      <pointLight position={[-5,-3, 3]}  color="#ff2200" intensity={8}  distance={20} />
      <pointLight position={[0,  0,-6]}  color="#ffffff" intensity={4}  distance={16} />
      <pointLight position={[0,  6, 0]}  color="#ffaa44" intensity={5}  distance={18} />

      <Particles scrollRef={scrollRef} />
      <NetworkLines scrollRef={scrollRef} />
      <BrandCube scrollRef={scrollRef} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} intensity={1.4} radius={0.75} mipmapBlur />
      </EffectComposer>
    </>
  );
}

// ─── Exported canvas wrapper ──────────────────────────────────────────────
export function BrandCubeCanvas({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 9], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, window.devicePixelRatio > 1 ? 1.5 : 1]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
