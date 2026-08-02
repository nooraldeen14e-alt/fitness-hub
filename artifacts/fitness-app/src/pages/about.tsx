import React, { useRef, useEffect, Component, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import swissLogo from "@assets/66b7e0a1-9291-41da-82a2-6d89f100f8a3_1785308430142.jpg";
import ScheduleModal from "@/components/ScheduleModal";
import { BrandCubeCanvas } from "@/components/BrandCubeScene";

// ─── WebGL gate ─────────────────────────────────────────────────────────────
function useWebGLSupport() {
  const [ok, setOk] = React.useState<boolean | null>(null);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      setOk(!!gl);
    } catch { setOk(false); }
  }, []);
  return ok;
}

class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

// ─── CSS fallback (no WebGL) — shows orbiting platform labels ────────────────
const PLATFORM_LABELS = [
  "Instagram", "Facebook", "TikTok", "YouTube",
  "Twitter / X", "LinkedIn", "Reels", "Content", "Hashtag", "Analytics",
];

function CSSCubeFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div style={{ width: 480, height: 480, position: "relative" }}>
        {/* Core glow */}
        <div style={{ position: "absolute", inset: "50%", width: 80, height: 80, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, #ff5500 0%, #ff2200 40%, transparent 80%)", filter: "blur(8px)", animation: "cssCorePulse 2.5s ease-in-out infinite" }} />
        {/* Core sphere */}
        <div style={{ position: "absolute", inset: "50%", width: 48, height: 48, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ff6600, #cc2200)", boxShadow: "0 0 24px #ff4400, 0 0 48px #ff220066" }} />
        {/* Equatorial ring */}
        <div style={{ position: "absolute", inset: "50%", width: 120, height: 120, transform: "translate(-50%,-50%)", borderRadius: "50%", border: "1.5px solid rgba(255,85,0,0.6)", animation: "cssRingSpin 4s linear infinite" }} />
        {/* Outer ring */}
        <div style={{ position: "absolute", inset: "50%", width: 200, height: 200, transform: "translate(-50%,-50%)", borderRadius: "50%", border: "1px solid rgba(255,85,0,0.2)", animation: "cssRingSpin 12s linear infinite reverse" }} />

        {/* Orbiting platform labels */}
        {PLATFORM_LABELS.map((label, i) => {
          const angle = (i / PLATFORM_LABELS.length) * 360;
          const delay = -(i / PLATFORM_LABELS.length) * 9;
          const r = i % 2 === 0 ? 175 : 155;
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                inset: "50%",
                width: 0,
                height: 0,
                animation: `cssOrbit${i % 2 === 0 ? "A" : "B"} ${i % 2 === 0 ? 9 : 11}s linear ${delay}s infinite`,
              }}
            >
              <div style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translateX(${r}px)`,
                whiteSpace: "nowrap",
                fontSize: 10,
                fontFamily: "monospace",
                letterSpacing: "0.1em",
                color: "hsl(25,100%,55%)",
                textShadow: "0 0 8px hsl(25,100%,50%)",
                fontWeight: 600,
                textTransform: "uppercase",
              }}>
                {label}
              </div>
            </div>
          );
        })}

        <style>{`
          @keyframes cssCorePulse { 0%,100%{opacity:0.7;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.3)} }
          @keyframes cssRingSpin  { to{transform:translate(-50%,-50%) rotate(360deg)} }
          @keyframes cssOrbitA    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
          @keyframes cssOrbitB    { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(-360deg)} }
        `}</style>
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
const AboutNavbar = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/"><img src={swissLogo} alt="Swissulife Media" className="h-9 w-auto object-contain cursor-pointer" style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} /></Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">Home</Link>
          <div className="relative group">
            <button className="font-sans text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
              We Offer <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl w-64 py-2">
                {["Marketing Strategy","Social Media Management","Google Ads","Podcast Production","Website Design","Event Management","Influencer Marketing","PR Management"].map(s => (
                  <Link key={s} href="/#services" className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">{s}</Link>
                ))}
              </div>
            </div>
          </div>
          <span className="font-sans text-base font-medium text-white cursor-default">About Us</span>
          <Link href="/#contact" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">Contact Us</Link>
        </div>
        <button onClick={() => setScheduleOpen(true)} className="hidden md:inline-flex px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "hsl(25,100%,50%)" }}>Schedule a Meeting</button>
      </nav>
    </>
  );
};

// ─── Section text definitions ─────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "s1", label: "Who We Are",
    heading: <>We turn ideas into<br /><span style={{ color: "hsl(25,100%,50%)" }}>brands people remember.</span></>,
    sub: "Strategy, creativity, content, and performance — built into one complete brand experience.",
    note: "Scroll to explore ↓",
    align: "left",
  },
  {
    id: "s2", label: "Our Services",
    heading: <>Everything your brand<br /><span style={{ color: "hsl(25,100%,50%)" }}>needs to move forward.</span></>,
    sub: "We combine strategy, design, content, and performance to create marketing that works as one connected system.",
    pills: ["Branding", "Social Media", "Content Creation", "Paid Advertising", "Website Design", "Marketing Strategy"],
    align: "left",
  },
  {
    id: "s3", label: "How We Work",
    heading: <>From scattered ideas<br /><span style={{ color: "hsl(25,100%,50%)" }}>to a clear direction.</span></>,
    sub: "We uncover what makes your brand different, build the strategy, create the assets, launch the campaign, and optimize what works.",
    steps: ["Discover", "Strategize", "Create", "Launch", "Grow"],
    align: "left",
  },
  {
    id: "s4", label: "Our Work",
    heading: <>Ideas brought<br /><span style={{ color: "hsl(25,100%,50%)" }}>to life.</span></>,
    sub: "Every campaign, identity, and digital experience is built to attract attention and create measurable growth.",
    work: ["Brand Identity", "Social Campaigns", "Content Systems", "Paid Performance", "Web Experiences", "Video & Motion"],
    align: "right",
  },
  {
    id: "s5", label: "About Us",
    heading: <>Built for brands that<br /><span style={{ color: "hsl(25,100%,50%)" }}>want to stand out.</span></>,
    sub: "A creative marketing agency focused on strategy, visual storytelling, digital experiences, and real business growth.",
    points: ["Creative thinking", "Strategic execution", "Fast communication", "Long-term partnerships"],
    countries: ["🇦🇪 UAE", "🇸🇮 Slovenia", "🇨🇭 Switzerland"],
    align: "right",
  },
  {
    id: "s6", label: "Results & Growth",
    heading: <>Marketing that<br /><span style={{ color: "hsl(25,100%,50%)" }}>creates momentum.</span></>,
    sub: "We build systems that help brands grow, connect with the right audience, and stay memorable.",
    metrics: [
      { value: "3M+",  label: "Monthly Reach" },
      { value: "1.8M", label: "Instagram Reach" },
      { value: "19M+", label: "Influencer Reach" },
      { value: "293K", label: "Monthly Impressions" },
    ],
    align: "left",
  },
  {
    id: "s7", label: "Let's Connect",
    heading: <>Let's build something<br /><span style={{ color: "hsl(25,100%,50%)" }}>unforgettable.</span></>,
    sub: "Tell us where you want your brand to go. We'll create the strategy, content, and digital presence to get there.",
    cta: true,
    align: "left",
  },
];

// ─── Text panel ───────────────────────────────────────────────────────────────
function SectionText({ sec }: { sec: typeof SECTIONS[0] }) {
  const isRight = sec.align === "right";
  return (
    <div className={`h-screen flex items-center px-10 md:px-16 ${isRight ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-20% 0px -20% 0px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-sm ${isRight ? "text-right" : "text-left"}`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary mb-4">{sec.label}</p>
        <h2 className="font-display font-black uppercase text-3xl md:text-4xl leading-tight text-white mb-5">
          {sec.heading}
        </h2>
        <p className="text-white/50 text-sm leading-relaxed mb-5">{sec.sub}</p>

        {"note" in sec && sec.note && (
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest animate-pulse mt-6">{sec.note}</p>
        )}

        {"pills" in sec && sec.pills && (
          <div className="flex flex-wrap gap-2 mt-4">
            {sec.pills.map(p => (
              <span key={p} className="px-3 py-1 rounded-full border border-primary/40 text-primary text-[10px] font-mono uppercase tracking-wider">{p}</span>
            ))}
          </div>
        )}

        {"steps" in sec && sec.steps && (
          <div className="flex flex-col gap-2 mt-4">
            {sec.steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/70 text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>
        )}

        {"work" in sec && sec.work && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {sec.work.map(w => (
              <div key={w} className="border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white/50 font-mono">{w}</div>
            ))}
          </div>
        )}

        {"points" in sec && sec.points && (
          <ul className="flex flex-col gap-2 mt-4">
            {sec.points.map(pt => (
              <li key={pt} className="flex items-center gap-2 text-white/60 text-sm">
                <span className="text-primary text-xs">◆</span>{pt}
              </li>
            ))}
          </ul>
        )}

        {"countries" in sec && sec.countries && (
          <div className="flex gap-3 mt-4 justify-end">
            {sec.countries.map(c => (
              <span key={c} className="text-xs text-white/40 font-mono">{c}</span>
            ))}
          </div>
        )}

        {"metrics" in sec && sec.metrics && (
          <div className="grid grid-cols-2 gap-4 mt-5">
            {sec.metrics.map(m => (
              <div key={m.label}>
                <p className="font-display font-black text-2xl text-primary">{m.value}</p>
                <p className="font-mono text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {"cta" in sec && sec.cta && (
          <div className="flex flex-col gap-3 mt-6" style={{ pointerEvents: "auto" }}>
            <Link href="/#contact"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ background: "hsl(25,100%,50%)" }}>
              Start a Project
            </Link>
            <Link href="/#contact" className="text-sm text-white/40 hover:text-white transition-colors text-center font-mono uppercase tracking-widest text-[10px]">
              Contact Us
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
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
    <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-white/5 z-40">
      <div ref={barRef} style={{ width: "0%", height: "100%", background: "hsl(25,100%,50%)", transition: "none" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  const scrollRef = useRef(0);
  const webGL = useWebGLSupport();

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-black text-white" style={{ height: `${SECTIONS.length * 100}vh` }}>
      <AboutNavbar />

      {/* ── Fixed 3D canvas ── */}
      <div className="fixed inset-0 z-0">
        {webGL === true ? (
          <WebGLBoundary fallback={<CSSCubeFallback />}>
            <BrandCubeCanvas scrollRef={scrollRef} />
          </WebGLBoundary>
        ) : webGL === false ? (
          <CSSCubeFallback />
        ) : null}
        {/* Gradient vignette edges */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)"
        }} />
      </div>

      {/* ── Scrollable text sections (pointer-events:none by default) ── */}
      <div className="relative z-10" style={{ pointerEvents: "none" }}>
        {/* Top padding for navbar */}
        <div style={{ paddingTop: "4rem" }} />
        {SECTIONS.map(sec => (
          <SectionText key={sec.id} sec={sec} />
        ))}
      </div>

      {/* ── Scroll progress bar ── */}
      <ScrollBar scrollRef={scrollRef} />

      {/* ── Section indicator dots ── */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        {SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            title={sec.label}
            onClick={() => {
              const vh = window.innerHeight;
              const totalH = SECTIONS.length * vh;
              const maxScroll = totalH - vh;
              window.scrollTo({ top: (i / (SECTIONS.length - 1)) * maxScroll, behavior: "smooth" });
            }}
            className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-primary transition-colors"
            style={{ padding: 0, border: "none", cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}
