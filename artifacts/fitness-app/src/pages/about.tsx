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
          animation: "none",
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
              color: "#ffaa66", fontWeight: 700, whiteSpace: "nowrap",
              textShadow: "0 0 6px #ff5500bb, 0 0 14px #ff550055",
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
                {[
                  { label: "Marketing Strategy",      slug: "marketing-strategy" },
                  { label: "Social Media Management", slug: "social-media-management" },
                  { label: "Google Ads",              slug: "google-ads" },
                  { label: "Podcast Production",      slug: "podcast-production" },
                  { label: "Website Design",          slug: "website-design" },
                  { label: "Event Management",        slug: "event-management" },
                  { label: "Influencer Marketing",    slug: "influencer-marketing" },
                  { label: "PR Management",           slug: "pr-management" },
                ].map(s => (
                  <Link key={s.slug} href={`/services/${s.slug}`} className="block px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">{s.label}</Link>
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

// ─── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "s1", label: "Who We Are", align: "left", variant: "intro",
    heading: "We are Swissulife Media.",
    sub: "A full-service digital marketing agency operating across 3 countries — UAE, Switzerland & Slovenia. We've built and scaled 150+ brands with strategy, content, paid media, and creative direction that actually converts.",
    badges: ["150+ Clients", "3 Countries", "360° Marketing"],
    note: "Scroll to explore ↓",
  },
  {
    id: "s2", label: "The Numbers", align: "right", variant: "stats",
    heading: "Results speak louder.",
    stats: [
      { value: "150+", label: "Brands Handled" },
      { value: "3",    label: "Countries" },
      { value: "19M+", label: "Influencer Reach" },
      { value: "3M+",  label: "Monthly Reach" },
    ],
  },
  {
    id: "s3", label: "What We Do", align: "left", variant: "services",
    heading: "Every tool your brand needs.",
    services: [
      { icon: "◈", name: "Social Media Management",  detail: "Content, scheduling, community" },
      { icon: "◉", name: "Paid Advertising",         detail: "Meta, Google, TikTok ads" },
      { icon: "◎", name: "Influencer Marketing",     detail: "19M+ reach network" },
      { icon: "◆", name: "Branding & Identity",      detail: "Logo, visual language, tone" },
      { icon: "▸", name: "Content Production",       detail: "Video, photo, copywriting" },
      { icon: "◐", name: "Marketing Strategy",       detail: "Funnels, positioning, growth" },
    ],
  },
  {
    id: "s4", label: "How We Work", align: "right", variant: "timeline",
    heading: "From brief to breakthrough.",
    steps: [
      { num: "01", title: "Discover",   desc: "Audit your brand, market, and competitors" },
      { num: "02", title: "Strategize", desc: "Build a roadmap tailored to your goals" },
      { num: "03", title: "Create",     desc: "Produce the content and assets" },
      { num: "04", title: "Launch",     desc: "Execute campaigns across channels" },
      { num: "05", title: "Optimise",   desc: "Measure, learn, and scale what works" },
    ],
  },
  {
    id: "s5", label: "Where We Operate", align: "left", variant: "countries",
    heading: "Global reach, local understanding.",
    sub: "Three offices. One unified team. We serve clients across the Middle East, Europe, and beyond.",
    countries: [
      { flag: "🇦🇪", name: "UAE",          city: "Dubai — Trade Center" },
      { flag: "🇨🇭", name: "Switzerland",  city: "Geneva" },
      { flag: "🇸🇮", name: "Slovenia",     city: "Ljubljana" },
    ],
  },
  {
    id: "s6", label: "Track Record", align: "right", variant: "brag",
    heading: "150+ brands trusted us with their growth.",
    lines: [
      "Fashion labels that now own their niche.",
      "Gyms that tripled their digital footfall.",
      "F&B brands with lines out the door.",
      "Fragrance houses with global audiences.",
      "Tech startups that look like industry leaders.",
    ],
    sub: "If your brand has ambition, we have the system to back it.",
  },
  {
    id: "s7", label: "Let's Build", align: "left", variant: "cta",
    heading: "Ready to be next?",
    sub: "Tell us where you want your brand to go. We'll build the strategy, content, and digital presence to get you there — across every platform, in every market.",
  },
];

// ─── Section text panels ───────────────────────────────────────────────────────
function SectionText({ sec }: { sec: typeof SECTIONS[0] }) {
  const isRight = sec.align === "right";

  const wrap = (children: React.ReactNode) => (
    <div className={`h-screen flex items-center px-10 md:px-16 ${isRight ? "justify-end" : "justify-start"}`}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-18% 0px -18% 0px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-xs ${isRight ? "text-right" : "text-left"}`}
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-primary mb-3">{sec.label}</p>
        {children}
      </motion.div>
    </div>
  );

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (sec.variant === "intro") return wrap(
    <>
      <h2 className="font-display font-black text-3xl md:text-4xl leading-tight text-white mb-4 uppercase">
        {sec.heading}
      </h2>
      <p className="text-white/50 text-[13px] leading-relaxed mb-5">{sec.sub}</p>
      {"badges" in sec && sec.badges && (
        <div className="flex flex-wrap gap-2">
          {sec.badges.map((b: string) => (
            <span key={b} className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold text-black"
              style={{ background: "hsl(25,100%,50%)" }}>{b}</span>
          ))}
        </div>
      )}
      {"note" in sec && sec.note && (
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest animate-pulse mt-6">{sec.note as string}</p>
      )}
    </>
  );

  // ── STATS ─────────────────────────────────────────────────────────────────────
  if (sec.variant === "stats") return wrap(
    <>
      <h2 className="font-display font-black text-2xl text-white uppercase mb-6">{sec.heading}</h2>
      {"stats" in sec && sec.stats && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {sec.stats.map((m: { value: string; label: string }, i: number) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display font-black leading-none mb-1"
                style={{ fontSize: "clamp(2rem,6vw,3rem)", color: "hsl(25,100%,50%)" }}>{m.value}</p>
              <p className="font-mono text-[9px] text-white/35 uppercase tracking-widest">{m.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  // ── SERVICES ──────────────────────────────────────────────────────────────────
  if (sec.variant === "services") return wrap(
    <>
      <h2 className="font-display font-black text-2xl text-white uppercase mb-5">{sec.heading}</h2>
      {"services" in sec && sec.services && (
        <div className="flex flex-col gap-0">
          {sec.services.map((s: { icon: string; name: string; detail: string }, i: number) => (
            <motion.div key={s.name}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 py-2.5 border-b border-white/[0.06] group"
            >
              <span className="text-primary text-xs mt-0.5 shrink-0">{s.icon}</span>
              <div>
                <p className="text-white text-[13px] font-semibold leading-none mb-0.5">{s.name}</p>
                <p className="text-white/30 text-[10px] font-mono">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  // ── TIMELINE ─────────────────────────────────────────────────────────────────
  if (sec.variant === "timeline") return wrap(
    <>
      <h2 className="font-display font-black text-2xl text-white uppercase mb-5">{sec.heading}</h2>
      {"steps" in sec && sec.steps && (
        <div className="flex flex-col gap-0">
          {sec.steps.map((s: { num: string; title: string; desc: string }, i: number) => (
            <motion.div key={s.num}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 py-3 border-b border-white/[0.06]"
            >
              <span className="font-mono text-[10px] text-primary font-bold mt-0.5 shrink-0">{s.num}</span>
              <div>
                <p className="text-white text-sm font-bold leading-none mb-1">{s.title}</p>
                <p className="text-white/35 text-[11px]">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  // ── COUNTRIES ─────────────────────────────────────────────────────────────────
  if (sec.variant === "countries") return wrap(
    <>
      <h2 className="font-display font-black text-2xl text-white uppercase mb-2">{sec.heading}</h2>
      <p className="text-white/40 text-[12px] leading-relaxed mb-5">{"sub" in sec ? sec.sub as string : ""}</p>
      {"countries" in sec && sec.countries && (
        <div className="flex flex-col gap-3">
          {sec.countries.map((c: { flag: string; name: string; city: string }, i: number) => (
            <motion.div key={c.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03]"
            >
              <span className="text-2xl">{c.flag}</span>
              <div>
                <p className="text-white text-sm font-bold leading-none mb-0.5">{c.name}</p>
                <p className="text-white/35 text-[10px] font-mono">{c.city}</p>
              </div>
              <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "hsl(25,100%,50%)" }} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  // ── BRAG ─────────────────────────────────────────────────────────────────────
  if (sec.variant === "brag") return wrap(
    <>
      <h2 className="font-display font-black text-2xl text-white uppercase mb-5 leading-snug">{sec.heading}</h2>
      {"lines" in sec && sec.lines && (
        <div className="flex flex-col gap-2 mb-5">
          {sec.lines.map((line: string, i: number) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.09, duration: 0.5 }}
              className="flex items-start gap-2"
            >
              <span className="text-primary text-xs mt-1 shrink-0">→</span>
              <p className="text-white/65 text-[13px] leading-snug">{line}</p>
            </motion.div>
          ))}
        </div>
      )}
      <p className="text-primary text-[11px] font-mono italic">{"sub" in sec ? sec.sub as string : ""}</p>
    </>
  );

  // ── CTA ───────────────────────────────────────────────────────────────────────
  if (sec.variant === "cta") return wrap(
    <>
      <h2 className="font-display font-black text-3xl md:text-4xl text-white uppercase mb-4 leading-tight">{sec.heading}</h2>
      <p className="text-white/45 text-[13px] leading-relaxed mb-7">{"sub" in sec ? sec.sub as string : ""}</p>
      <div className="flex flex-col gap-3" style={{ pointerEvents: "auto" }}>
        <Link href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 rounded-full text-black font-bold text-sm hover:opacity-90 transition-opacity"
          style={{ background: "hsl(25,100%,50%)" }}>
          Start a Project →
        </Link>
        <Link href="/contact"
          className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white transition-colors text-center">
          Get in Touch
        </Link>
      </div>
    </>
  );

  return null;
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
