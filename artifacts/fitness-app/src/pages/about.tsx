import React, { useRef, useEffect, Component, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import swissLogo from "@assets/66b7e0a1-9291-41da-82a2-6d89f100f8a3_1785308430142.jpg";
import ScheduleModal from "@/components/ScheduleModal";

// ─── WebGL Error Boundary ──────────────────────────────────────────────────
class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

// ─── CSS fallback gem (no WebGL needed) ───────────────────────────────────
function CSSGem() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div style={{ position: "relative", width: 420, height: 420 }}>
        {/* Outer glow */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(ellipse, hsl(25,100%,50%) 0%, transparent 70%)",
          filter: "blur(60px)", opacity: 0.35,
          animation: "spin 8s linear infinite",
        }} />
        {/* Rotating rings */}
        {[0, 60, 120].map((deg, i) => (
          <div key={i} style={{
            position: "absolute", inset: 20 + i * 25, borderRadius: "50%",
            border: `1px solid hsl(25,100%,50%,${0.4 - i * 0.1})`,
            animation: `spin ${6 + i * 2}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
          }} />
        ))}
        {/* Core diamond via CSS clip */}
        <div style={{
          position: "absolute", inset: "50%", width: 160, height: 160,
          transform: "translate(-50%,-50%) rotate(45deg)",
          background: "linear-gradient(135deg, #1a0a00, #ff5500 50%, #1a0a00)",
          opacity: 0.85,
          animation: "spin 12s linear infinite",
        }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── WebGL support detection ───────────────────────────────────────────────
function useWebGLSupport() {
  const [ok, setOk] = React.useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      setOk(!!gl);
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

// ─── Scroll progress ref (no re-renders) ───────────────────────────────────
function useScrollRef(sectionId: string) {
  const progress = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      progress.current = scrollable > 0
        ? Math.max(0, Math.min(1, -rect.top / scrollable))
        : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionId]);
  return progress;
}

// ─── 3D Gem mesh ───────────────────────────────────────────────────────────
function GemMesh({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const wireRef  = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t    = scrollRef.current;
    const time = clock.elapsedTime;

    // Scroll drives the main rotation; idle adds gentle float
    const yRot = t * Math.PI * 4 + time * 0.08;
    const xRot = t * Math.PI * 1.6 + Math.sin(time * 0.4) * 0.08;
    const zRot = Math.sin(time * 0.25) * 0.04;

    outerRef.current.rotation.set(xRot, yRot, zRot);
    innerRef.current.rotation.set(-xRot * 0.6, -yRot * 0.5 + time * 0.05, zRot);
    wireRef.current.rotation.set( xRot * 0.3,   yRot * 1.2,                -zRot);

    // Subtle scale pulse
    const scale = 1 + Math.sin(time * 0.9) * 0.015;
    outerRef.current.scale.setScalar(scale);
  });

  return (
    <group>
      {/* Solid faceted gem — dark metallic with orange emissive */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.9, 0]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#ff4400"
          emissiveIntensity={0.25}
          metalness={1}
          roughness={0.08}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial
          color="#ff5500"
          emissive="#ff3300"
          emissiveIntensity={0.9}
          metalness={0.2}
          roughness={0.4}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshBasicMaterial color="#ff5500" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────
function GemScene({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 48 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.05} />
      {/* Orange key light — top right */}
      <pointLight position={[4, 4, 3]}  color="#ff6600" intensity={18} distance={20} />
      {/* Warm fill — bottom left */}
      <pointLight position={[-4, -3, 2]} color="#ff3300" intensity={8}  distance={20} />
      {/* Cold rim — back */}
      <pointLight position={[0, 0, -5]} color="#ffffff" intensity={4}  distance={20} />
      {/* Top accent */}
      <pointLight position={[0, 5, 1]}  color="#ffaa44" intensity={6}  distance={20} />
      <GemMesh scrollRef={scrollRef} />
    </Canvas>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
const AboutNavbar = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <img src={swissLogo} alt="Swissulife Media" className="h-9 w-auto object-contain cursor-pointer"
            style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors duration-200">Home</Link>
          <div className="relative group">
            <button className="font-sans text-sm font-medium text-primary hover:text-white transition-colors duration-200 flex items-center gap-1">
              We Offer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-64 py-2">
                {["Marketing Strategy","Social Media Management","Google Ads","Podcast Production","Website Design","Event Management","Influencer Marketing","PR Management"].map((s) => (
                  <Link key={s} href="/#services" className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors">{s}</Link>
                ))}
              </div>
            </div>
          </div>
          <span className="font-sans text-base font-medium text-white cursor-default">About Us</span>
          <Link href="/#contact" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors duration-200">Contact Us</Link>
        </div>
        <button onClick={() => setScheduleOpen(true)}
          className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "hsl(25,100%,50%)" }}>
          Schedule a Meeting
        </button>
      </nav>
    </>
  );
};

// ─── Data ──────────────────────────────────────────────────────────────────
const values = [
  { num: "01", title: "Transparency",  desc: "We keep clients in the loop at every stage — full visibility into strategy, spend, and results." },
  { num: "02", title: "Result-Driven", desc: "Every campaign is built around measurable KPIs. We don't celebrate activity — we celebrate growth." },
  { num: "03", title: "Creativity",    desc: "Bold ideas backed by data. We combine artistic vision with analytical thinking to make brands unforgettable." },
  { num: "04", title: "Partnership",   desc: "We treat every client's business as our own — your goals are our goals, your wins are our wins." },
];

const process = [
  { num: "01", title: "Discovery",  desc: "Deep-dive into your brand, industry, audience and competitors. We don't guess — we research." },
  { num: "02", title: "Strategy",   desc: "A tailored roadmap built from insights: messaging, channels, budget, and KPIs that actually matter." },
  { num: "03", title: "Identity",   desc: "Crafting the visual and verbal language of your brand — logo, palette, tone and all touchpoints." },
  { num: "04", title: "Execution",  desc: "Content creation, campaign launch, community management and influencer activation — all in-house." },
  { num: "05", title: "Impact",     desc: "Continuous tracking and optimisation. Monthly reports with honest numbers and clear next moves." },
];

const stats = [
  { value: "3M+",  label: "Monthly Reach" },
  { value: "1.8M", label: "Instagram Reach" },
  { value: "293K", label: "Monthly Impressions" },
  { value: "0",    label: "Compromises" },
];

// ─── Page ──────────────────────────────────────────────────────────────────
export default function About() {
  const scrollRef = useScrollRef("gem-section");
  const webGL = useWebGLSupport();

  return (
    <div className="bg-black min-h-screen text-white">
      <AboutNavbar />

      {/* ══════════════════════════════════════════════
          HERO — sticky 3D gem, scroll to rotate
      ══════════════════════════════════════════════ */}
      <section id="gem-section" style={{ height: "240vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Ambient orange glow behind gem */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(25,100%,50%) 0%, transparent 65%)", filter: "blur(90px)", opacity: 0.18 }} />

          {/* 3D canvas — full viewport; CSS fallback when WebGL unavailable */}
          <div className="absolute inset-0 pointer-events-none">
            {webGL === true
              ? <GemScene scrollRef={scrollRef} />
              : <CSSGem />}
          </div>

          {/* Left text overlay */}
          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-[55%]">
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="font-mono text-primary uppercase text-xs tracking-[0.35em] mb-6">
              Who We Are
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-none mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)" }}>
              About<br />
              <span style={{ color: "hsl(25,100%,50%)" }}>Swissulife</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-white/55 text-lg leading-relaxed max-w-lg mb-12">
              Swissulife Media is a 360° result-oriented digital marketing agency — headquartered in Dubai, with a presence across UAE, Slovenia, and Switzerland.
            </motion.p>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Scroll to explore</span>
                <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent ml-1" />
              </div>
            </motion.div>
          </div>

          {/* Scroll progress bar */}
          <ScrollBar scrollRef={scrollRef} />
        </div>
      </section>

      {/* ── 3 COUNTRIES ── */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-mono text-white/30 uppercase text-xs tracking-widest mb-8">( Our Global Presence )</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { flag: "🇦🇪", name: "UAE",         city: "Dubai",      desc: "Headquarters & Primary Operations" },
              { flag: "🇸🇮", name: "Slovenia",    city: "Ljubljana",  desc: "European Creative Hub" },
              { flag: "🇨🇭", name: "Switzerland", city: "Zürich",     desc: "Strategy & Brand Consulting" },
            ].map((c, i) => (
              <motion.div key={c.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative group rounded-2xl border border-white/10 p-8 overflow-hidden hover:border-primary/60 transition-colors duration-300"
                style={{ background: "rgba(255,255,255,0.025)" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="text-5xl mb-5 block">{c.flag}</span>
                <h3 className="font-display font-black text-3xl text-white uppercase mb-1">{c.name}</h3>
                <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "hsl(25,100%,50%)" }}>{c.city}</p>
                <p className="text-white/40 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest">( Mission )</p>
          </div>
          <div className="md:col-span-8">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl font-medium leading-tight text-white">
              We deliver innovative and impactful marketing solutions that empower our clients to achieve their business goals and{" "}
              <span style={{ color: "hsl(25,100%,50%)" }} className="italic">inspire their audiences</span>.
            </motion.h2>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 border-t border-white/10" style={{ background: "hsl(25,100%,50%)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-black">
              <p className="font-display font-black text-5xl md:text-6xl">{s.value}</p>
              <p className="font-mono text-xs uppercase tracking-widest mt-2 opacity-70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( Our Values )</p>
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase">What We <br /><span style={{ color: "hsl(25,100%,50%)" }}>Stand For</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-t-2 pt-6" style={{ borderColor: "hsl(25,100%,50%)" }}>
                <span className="font-mono text-xs" style={{ color: "hsl(25,100%,50%)" }}>{v.num}</span>
                <h3 className="font-display text-2xl text-white mt-2 mb-3">{v.title}</h3>
                <p className="font-sans text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="py-24 px-6 border-t border-white/10" style={{ background: "#050505" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( How We Work )</p>
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase">Our <br /><span style={{ color: "hsl(25,100%,50%)" }}>Process</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {process.map((p, i) => (
              <motion.div key={p.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="font-mono text-xs" style={{ color: "hsl(25,100%,50%)" }}>{p.num}</span>
                <h3 className="font-display text-xl text-white mt-3 mb-3">{p.title}</h3>
                <p className="font-sans text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( Industries We Serve )</p>
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase">Our <span style={{ color: "hsl(25,100%,50%)" }}>Niches</span></h2>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            {["Fashion & Retail","Food & Beverages","Jewelry","Healthcare","Sports","E-Commerce","Entertainment","Beauty & Cosmetics","Events","Real Estate","Technology","Media"].map((industry, i) => (
              <motion.span key={industry} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-5 py-2.5 rounded-full border text-sm font-mono uppercase tracking-wide text-white/70 hover:border-primary hover:text-primary transition-colors cursor-default"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                {industry}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-white/10 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-none mb-8">
            Ready to <br /><span style={{ color: "hsl(25,100%,50%)" }}>Dominate?</span>
          </h2>
          <Link href="/#contact"
            className="inline-flex items-center px-10 py-4 rounded-full text-white font-semibold text-base hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}>
            Schedule a Meeting
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={swissLogo} alt="Swissulife Media" className="h-8 w-auto object-contain"
            style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} />
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">© {new Date().getFullYear()} Swissulife Media. All rights reserved.</p>
          <div className="flex gap-6 font-mono text-xs text-white/40 uppercase tracking-wide">
            <a href="tel:+971505725515" className="hover:text-primary transition-colors">+971 50 572 5515</a>
            <a href="mailto:sales@swissulife.com" className="hover:text-primary transition-colors">sales@swissulife.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Scroll progress bar (live DOM update, no re-render) ───────────────────
function ScrollBar({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (barRef.current) barRef.current.style.width = `${scrollRef.current * 100}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollRef]);
  return (
    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-20">
      <div ref={barRef} className="h-full transition-none" style={{ width: "0%", background: "hsl(25,100%,50%)" }} />
    </div>
  );
}
