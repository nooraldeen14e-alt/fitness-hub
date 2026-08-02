import React, { useRef, useEffect, Component, type ReactNode } from "react";
import {
  siInstagram, siFacebook, siTiktok, siYoutube, siX,
  siSnapchat,
} from "simple-icons";
import { motion } from "framer-motion";
import { Link } from "wouter";
import swissLogo from "@assets/66b7e0a1-9291-41da-82a2-6d89f100f8a3_1785308430142.jpg";
import ScheduleModal from "@/components/ScheduleModal";
import { BrandCubeCanvas } from "@/components/BrandCubeScene";
import MobileNav from "@/components/MobileNav";

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
const PLATFORM_ICONS = [
  { name: "Instagram",   color: "#FF0069", icon: siInstagram },
  { name: "Facebook",    color: "#0866FF", icon: siFacebook  },
  { name: "TikTok",      color: "#69C9D0", icon: siTiktok    },
  { name: "YouTube",     color: "#FF0000", icon: siYoutube   },
  { name: "Twitter / X", color: "#ffffff", icon: siX         },
  { name: "LinkedIn",    color: "#0A66C2", icon: null        },
  { name: "Snapchat",    color: "#FFFC00", icon: siSnapchat  },
];

function CSSCubeFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <div style={{ width: 480, height: 480, position: "relative" }}>
        {/* ── CSS Building — matches reference photo ── */}
        <div style={{
          position: "absolute", inset: "50%",
          transform: "translate(-50%, -50%)",
          width: 110, height: 230,
          display: "flex", flexDirection: "column", alignItems: "center",
          animation: "cssBuildingFloat 4s ease-in-out infinite",
        }}>
          {/* Antenna + red beacon */}
          <div style={{ width: 1.5, height: 18, background: "#ffffff", marginBottom: 0 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff0000",
            boxShadow: "0 0 8px #ff0000, 0 0 16px #ff000066", marginTop: -2,
            animation: "cssBuildingPulse 1.2s ease-in-out infinite" }} />

          {/* Crown / parapet — carries "swissulife media" */}
          <div style={{
            width: 108, marginTop: 2,
            background: "#1a3358",
            border: "1px solid #ffffff44",
            borderTop: "2px solid #ffffff",
            borderBottom: "1px solid #ffffff66",
            padding: "5px 6px 5px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            boxShadow: "0 0 12px #ffffff22",
          }}>
            <div style={{
              fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.12em",
              color: "#ff5500", fontWeight: 700, whiteSpace: "nowrap",
              textShadow: "0 0 12px #ff550099",
            }}>Swissulife Media</div>
          </div>

          {/* Main tower body — two side wings + central cylinder */}
          <div style={{
            width: 108, flex: 1, position: "relative",
            display: "flex", alignItems: "stretch",
            boxShadow: "0 0 40px #ffffff22",
          }}>
            {/* Left wing */}
            <div style={{
              width: 28, background: "#0d1b2e",
              borderLeft: "2px solid #ffffff",
              position: "relative", overflow: "hidden",
            }}>
              {/* Amber floor lines */}
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{
                  position: "absolute", left: 2, right: 2,
                  top: `${8 + i * 8}%`, height: 1.5,
                  background: "#ffffff", boxShadow: "0 0 4px #ffffff", opacity: 0.75,
                }} />
              ))}
            </div>

            {/* Central section — window grid */}
            <div style={{
              flex: 1, background: "#1a3358",
              position: "relative", overflow: "hidden",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(12, 1fr)",
              gap: 2, padding: 3,
            }}>
              {Array.from({ length: 48 }, (_, i) => (
                <div key={i} style={{
                  background: "#a8c4ff22",
                  border: "1px solid #a8c4ff55",
                  borderRadius: 1,
                  boxShadow: "0 0 3px #a8c4ff44",
                }} />
              ))}
            </div>

            {/* Right wing */}
            <div style={{
              width: 28, background: "#0d1b2e",
              borderRight: "2px solid #ffffff",
              position: "relative", overflow: "hidden",
            }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{
                  position: "absolute", left: 2, right: 2,
                  top: `${8 + i * 8}%`, height: 1.5,
                  background: "#ffffff", boxShadow: "0 0 4px #ffffff", opacity: 0.75,
                }} />
              ))}
            </div>
          </div>

          {/* Lobby / base — wider, warm glass glow */}
          <div style={{
            width: 118, height: 22,
            background: "#0d1b2e",
            borderTop: "1.5px solid #ffffff",
            boxShadow: "0 0 14px #ffffff44",
            position: "relative", overflow: "hidden",
          }}>
            {/* Warm amber glass glow across lobby front */}
            <div style={{
              position: "absolute", left: "10%", right: "10%", top: 3, bottom: 3,
              background: "rgba(245,160,66,0.18)", borderRadius: 2,
            }} />
          </div>
        </div>

        {/* Orbiting platform labels */}
        {PLATFORM_ICONS.map(({ name, color, icon }, i) => {
          const delay = -(i / PLATFORM_ICONS.length) * 9;
          const r = i % 2 === 0 ? 178 : 152;
          return (
            <div
              key={name}
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}>
                {/* Icon tile */}
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 8,
                  background: `${color}18`,
                  border: `1px solid ${color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 12px ${color}44`,
                }}>
                  {icon ? (
                    <svg viewBox="0 0 24 24" width={16} height={16} fill={color}>
                      <path d={icon.path} />
                    </svg>
                  ) : (
                    /* LinkedIn — no simple-icon, render "in" text */
                    <span style={{ color, fontSize: 11, fontWeight: 900, fontFamily: "sans-serif", lineHeight: 1 }}>in</span>
                  )}
                </div>
                {/* Label */}
                <span style={{
                  color,
                  fontSize: 8,
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  textShadow: `0 0 8px ${color}66`,
                }}>
                  {name}
                </span>
              </div>
            </div>
          );
        })}

        <style>{`
          @keyframes cssBuildingFloat { 0%,100%{transform:translate(-50%,-50%) translateY(0px)} 50%{transform:translate(-50%,-50%) translateY(-6px)} }
          @keyframes cssBuildingPulse { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
          @keyframes cssOrbitA        { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(360deg)} }
          @keyframes cssOrbitB        { from{transform:translate(-50%,-50%) rotate(0deg)}   to{transform:translate(-50%,-50%) rotate(-360deg)} }
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
        <Link href="/">
          <span className="font-display font-bold text-white tracking-widest uppercase text-lg">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
        </Link>
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
          <Link href="/contact" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">Contact Us</Link>
        </div>
        <div className="flex items-center gap-3">
        <button onClick={() => setScheduleOpen(true)} className="hidden md:inline-flex px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: "hsl(25,100%,50%)" }}>Schedule a Meeting</button>
          <MobileNav active="about" />
        </div>
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
