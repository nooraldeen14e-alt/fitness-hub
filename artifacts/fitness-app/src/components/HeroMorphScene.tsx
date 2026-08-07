/**
 * HeroMorphScene.tsx  — Swissulife premium morphing hero
 *
 * A glossy, abstract 3D object cycles through:
 *   Blob → Cursor → Megaphone → Growth → Rocket → Logo
 * Each transition is driven by smooth GLSL vertex displacement.
 *
 * Phase communication: `onPhaseChange(index)` fires whenever a new
 * phase becomes dominant so the parent can update its HTML label.
 */
import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────
   Timeline
───────────────────────────────────────────────────────────────── */
export const PHASE_NAMES = [
  "Abstract",
  "Cursor",
  "Megaphone",
  "Growth",
  "Rocket",
  "Identity",
] as const;

const HOLD  = [3.5, 2.8, 2.8, 2.8, 2.8, 4.5];   // hold per phase (s)
const TRANS = 1.4;                                  // blend time (s)

const STARTS: number[] = [];
let _acc = 0;
for (let i = 0; i < HOLD.length; i++) {
  STARTS.push(_acc);
  _acc += HOLD[i] + TRANS;
}
const CYCLE = _acc;

function getPhaseInfo(t: number): {
  phaseA: number;
  phaseB: number;
  blend: number;
} {
  const tc = t % CYCLE;
  for (let i = 0; i < HOLD.length; i++) {
    const start = STARTS[i];
    const end   = start + HOLD[i] + TRANS;
    if (tc >= start && tc < end) {
      const within = tc - start;
      if (within < HOLD[i]) {
        return { phaseA: i, phaseB: i, blend: 0 };
      }
      const blend = (within - HOLD[i]) / TRANS;
      const next  = (i + 1) % HOLD.length;
      return { phaseA: i, phaseB: next, blend };
    }
  }
  return { phaseA: 0, phaseB: 0, blend: 0 };
}

/* ─────────────────────────────────────────────────────────────────
   Shaders
───────────────────────────────────────────────────────────────── */
const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPhaseA;
uniform float uPhaseB;
uniform float uBlend;

varying vec3 vWorldPos;
varying vec3 vBaseNormal;

// ── Noise ───────────────────────────────────────────────────────
float h(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}
float n3(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p);
  f = f*f*(3.0-2.0*f);
  float n = i.x + i.y*57.0 + i.z*113.0;
  return mix(
    mix(mix(h(n),h(n+1.0),f.x),mix(h(n+57.0),h(n+58.0),f.x),f.y),
    mix(mix(h(n+113.0),h(n+114.0),f.x),mix(h(n+170.0),h(n+171.0),f.x),f.y),f.z);
}
float fbm(vec3 p) {
  float v=0.0,a=0.5;
  for(int i=0;i<4;i++){v+=a*n3(p);p=p*2.1+vec3(1.7,9.2,3.8);a*=0.5;}
  return v;
}

// ── Shape displacement functions ────────────────────────────────
vec3 blob(vec3 p, float t) {
  float d = fbm(p*1.8+t*0.22)*0.38 + fbm(p*3.8+t*0.16+5.3)*0.09;
  return p*(1.0+d);
}

vec3 cursor(vec3 p, float t) {
  float y=p.y, r=length(p.xz);
  // Teardrop: pointed at bottom, round at top
  float taper = 0.1 + smoothstep(-1.0,0.25,y)*0.9;
  float newR   = r*taper;
  float newY   = y*1.7 - 0.25;
  float nn     = fbm(p*4.5+t*0.22)*0.03;
  return vec3(p.xz*(newR/max(r,0.001)),newY)*(1.0+nn);
}

vec3 megaphone(vec3 p, float t) {
  float y=p.y, r=length(p.xz);
  float flare  = 0.18 + smoothstep(-0.5,1.0,y)*1.9;
  float angle  = atan(p.z,p.x);
  float ridges = sin(angle*8.0)*0.022*smoothstep(-0.3,1.0,y);
  float nn     = fbm(p*3.0+t*0.21)*0.032;
  return vec3(p.xz*(flare*r/max(r,0.001)),y*0.78)*(1.0+ridges+nn);
}

vec3 growth(vec3 p, float t) {
  float y=p.y, r=length(p.xz);
  float angle  = atan(p.z,p.x);
  float barIdx = floor((angle+3.14159)/(6.28318/6.0));
  float bh     = 0.55 + h(barIdx+12.0)*0.85;
  float newY   = y*bh;
  float faceA  = mod(angle+3.14159,6.28318/6.0)-3.14159/6.0;
  float facet  = max(0.25,1.0-abs(faceA)*1.4)*0.55+0.45;
  float nn     = fbm(p*3.5+t*0.16)*0.038;
  return vec3(p.xz*facet,newY)*(1.22+nn);
}

vec3 rocket(vec3 p, float t) {
  float y=p.y, r=length(p.xz);
  float angle    = atan(p.z,p.x);
  float noseTaper= mix(1.0,0.04,smoothstep(0.3,1.0,y));
  float finA     = mod(angle+3.14159,6.28318/3.0)-3.14159/3.0;
  float fin      = max(0.0,0.65-abs(finA)*5.0)*smoothstep(-0.22,-0.72,y)*0.72;
  float newR     = r*noseTaper+fin;
  float nn       = fbm(p*4.5+t*0.3)*0.02;
  return vec3(p.xz*(newR/max(r,0.001)),y*2.4)*(1.0+nn);
}

vec3 logoDisc(vec3 p, float t) {
  float r       = length(p.xz);
  float ring    = smoothstep(0.32,0.48,r)*(1.0-smoothstep(0.75,0.95,r));
  float ripple  = sin(r*14.0-t*4.5)*0.022*smoothstep(0.35,0.82,r);
  float nn      = fbm(p*2.8+t*0.38)*0.028;
  return vec3(p.xz*(1.35+nn),p.y*0.1+ripple)*(0.82+ring*0.38);
}

vec3 applyPhase(float phase, vec3 p, float t) {
  int idx = int(phase);
  vec3 result = blob(p, t);
  if(idx==1) result = cursor(p,t);
  else if(idx==2) result = megaphone(p,t);
  else if(idx==3) result = growth(p,t);
  else if(idx==4) result = rocket(p,t);
  else if(idx==5) result = logoDisc(p,t);
  return result;
}

void main() {
  vBaseNormal = normalize(normalMatrix * normal);

  vec3 base = normalize(position);             // normalised sphere vertex
  vec3 pA   = applyPhase(uPhaseA, base, uTime);
  vec3 pB   = applyPhase(uPhaseB, base, uTime);
  float b   = smoothstep(0.0, 1.0, uBlend);
  vec3 disp = mix(pA, pB, b);

  vec4 wp   = modelMatrix * vec4(disp, 1.0);
  vWorldPos = wp.xyz;

  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uPhaseA;
uniform vec3 uOrange;

varying vec3 vWorldPos;
varying vec3 vBaseNormal;

void main() {
  // Vertex normal (stable diffuse) + screen-space normal (sharp specular)
  vec3 Nv  = normalize(vBaseNormal);
  vec3 Nss = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
  vec3 V   = normalize(cameraPosition - vWorldPos);

  // Ensure both normals face the camera
  if (dot(Nv,  V) < 0.0) Nv  = -Nv;
  if (dot(Nss, V) < 0.0) Nss = -Nss;

  float ndotv = max(0.001, dot(Nv, V));
  float fr    = pow(1.0 - ndotv, 2.3);

  // Key light (warm top-right)
  vec3  L1 = normalize(vec3(2.5, 3.5, 4.0));
  float d1 = max(0.0, dot(Nv, L1));

  // Fill light (cool bottom-left)
  vec3  L2 = normalize(vec3(-2.0, -1.0, 1.5));
  float d2 = max(0.0, dot(Nv, L2));

  // Surface base — always visible thanks to ambient floor
  vec3 base = vec3(0.07, 0.045, 0.09);          // ambient floor
  base += vec3(0.32, 0.14, 0.02) * d1;          // warm key diffuse
  base += vec3(0.04, 0.06, 0.14) * d2;          // cool fill

  // Specular highlights (screen-space normal for sharpness)
  vec3  H1 = normalize(L1 + V);
  float s1 = pow(max(0.0, dot(Nss, H1)), 88.0);
  vec3  H2 = normalize(L2 + V);
  float s2 = pow(max(0.0, dot(Nss, H2)), 42.0);

  // Iridescent rim hue
  float iShift   = sin(ndotv * 5.0 + uTime * 0.9) * 0.5 + 0.5;
  vec3 iridColor = mix(uOrange, vec3(0.6, 0.25, 1.0), iShift * 0.5);

  // Compose
  vec3 color = base;
  color += uOrange * 0.18;                       // constant emissive orange floor
  color += uOrange * fr * 2.6;                   // strong orange rim
  color  = mix(color, iridColor, fr * 0.35);     // iridescent sheen on rim
  color += vec3(1.0, 0.9, 0.6) * s1 * 0.9;      // bright warm specular
  color += vec3(0.45, 0.65, 1.0) * s2 * 0.3;    // cool fill specular

  // SSS back-scatter
  float sss = pow(1.0 - ndotv, 3.5);
  color += uOrange * sss * 0.6;

  // Pulsing emissive during logo phase
  float logoPulse = step(4.5, uPhaseA) * (sin(uTime * 2.8) * 0.5 + 0.5);
  color += uOrange * logoPulse * 0.35 * fr;

  gl_FragColor = vec4(color, 0.9 + fr * 0.1);
}
`;

/* ─────────────────────────────────────────────────────────────────
   MorphingOrb
───────────────────────────────────────────────────────────────── */
const ORANGE_VEC = new THREE.Color("hsl(25,100%,50%)");

function MorphingOrb({
  onPhase,
}: {
  onPhase?: (i: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const prevPhase = useRef(-1);

  const geo = useMemo(() => new THREE.SphereGeometry(1, 72, 72), []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime:   { value: 0 },
          uPhaseA: { value: 0 },
          uPhaseB: { value: 0 },
          uBlend:  { value: 0 },
          uOrange: { value: new THREE.Vector3(ORANGE_VEC.r, ORANGE_VEC.g, ORANGE_VEC.b) },
        },
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { phaseA, phaseB, blend } = getPhaseInfo(t);

    mat.uniforms.uTime.value   = t;
    mat.uniforms.uPhaseA.value = phaseA;
    mat.uniforms.uPhaseB.value = phaseB;
    mat.uniforms.uBlend.value  = blend;

    // Dominant phase = the one that's more "present"
    const dominant = blend < 0.5 ? phaseA : phaseB;
    if (dominant !== prevPhase.current) {
      prevPhase.current = dominant;
      onPhase?.(dominant);
    }

    // Slow idle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(t * 0.12) * 0.18;
    }
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} />;
}

/* ─────────────────────────────────────────────────────────────────
   Particle swarm
───────────────────────────────────────────────────────────────── */
function Particles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { geo, bases } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const bases = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 1.4 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos[i * 3] = bases[i * 3] = x;
      pos[i * 3 + 1] = bases[i * 3 + 1] = y;
      pos[i * 3 + 2] = bases[i * 3 + 2] = z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return { geo: g, bases };
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: ORANGE_VEC,
        size: 0.022,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime();
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = bases[i * 3]     + Math.cos(t * 0.28 + i * 0.71) * 0.08;
      pos[i * 3 + 1] = bases[i * 3 + 1] + Math.sin(t * 0.35 + i * 0.94) * 0.12;
      pos[i * 3 + 2] = bases[i * 3 + 2] + Math.sin(t * 0.22 + i * 0.53) * 0.07;
    }
    geo.attributes.position.needsUpdate = true;
    if (ref.current) ref.current.rotation.y += 0.0008;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ─────────────────────────────────────────────────────────────────
   Thin orbiting rings
───────────────────────────────────────────────────────────────── */
function Rings() {
  const r1 = useRef<THREE.Mesh>(null!);
  const r2 = useRef<THREE.Mesh>(null!);
  const r3 = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (r1.current) { r1.current.rotation.x += 0.007; r1.current.rotation.y += 0.011; }
    if (r2.current) { r2.current.rotation.y -= 0.006; r2.current.rotation.z += 0.009; }
    if (r3.current) { r3.current.rotation.x -= 0.005; r3.current.rotation.z -= 0.007; }
  });

  const ringMat = (opacity: number) =>
    new THREE.MeshBasicMaterial({
      color: ORANGE_VEC,
      transparent: true,
      opacity,
      depthWrite: false,
    });

  return (
    <group>
      <mesh ref={r1}>
        <torusGeometry args={[1.7, 0.009, 8, 80]} />
        <primitive object={ringMat(0.35)} attach="material" />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[2.3, 0.007, 8, 80]} />
        <primitive object={ringMat(0.18)} attach="material" />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[2.9, 0.005, 8, 80]} />
        <primitive object={ringMat(0.1)} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Mouse parallax camera
───────────────────────────────────────────────────────────────── */
function CameraRig() {
  const { mouse } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 5.5));

  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const goalX = mouse.x * 1.2 + Math.sin(t * 0.08) * 0.3;
    const goalY = mouse.y * 0.75 + Math.cos(t * 0.06) * 0.18;
    const goalZ = 5.5 + Math.sin(t * 0.05) * 0.2;

    target.current.x += (goalX - target.current.x) * 0.035;
    target.current.y += (goalY - target.current.y) * 0.035;
    target.current.z += (goalZ - target.current.z) * 0.02;

    camera.position.copy(target.current);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────────
   WebGL check
───────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────
   Root export
───────────────────────────────────────────────────────────────── */
export function HeroMorphScene({
  onPhaseChange,
}: {
  onPhaseChange?: (phaseIndex: number) => void;
}) {
  const handlePhase = useCallback(
    (i: number) => onPhaseChange?.(i),
    [onPhaseChange],
  );

  if (!isWebGLAvailable()) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, hsl(25,100%,8%) 0%, #020202 70%)",
        }}
      />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 46 }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <CameraRig />
      <Rings />
      <MorphingOrb onPhase={handlePhase} />
      <Particles />
      {/* Soft point lights for better illumination */}
      <pointLight position={[3, 4, 3]} color="#ff6200" intensity={3} distance={12} />
      <pointLight position={[-3, -2, 2]} color="#4466ff" intensity={1.5} distance={10} />
      <ambientLight intensity={0.08} />
      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.02}
          luminanceSmoothing={0.85}
          intensity={3.5}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
