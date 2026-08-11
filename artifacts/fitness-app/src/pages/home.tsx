import React from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import ScheduleModal from "@/components/ScheduleModal";
import MobileNav from "@/components/MobileNav";
import { ArrowRight, X, Play, Volume2, VolumeX } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { HeroNetworkScene } from "@/components/HeroNetworkScene";
// simple-icons — locally bundled official SVG logos with brand colours
import {
  siToyota, siAudi, siVolkswagen, siFerrari, siPorsche, siInfiniti, siRollsroyce,
  siApple, siSamsung, siAdidas, siDior, siFarfetch,
  siKfc, siMcdonalds, siDhl, siRedbull, siDeliveroo, siCarrefour,
} from "simple-icons";

/* ── Glowing cursor ── */
const GlowCursor = () => {
  const [pos, setPos] = React.useState({ x: -200, y: -200 });
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const hide = () => setVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", hide);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseleave", hide); };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        transition: "left 0.06s linear, top 0.06s linear, opacity 0.3s ease",
      }}
    >
      {/* outer glow */}
      <div className="absolute rounded-full"
        style={{ width: 40, height: 40, top: -20, left: -20, background: "hsl(25,100%,50%)", opacity: 0.15, filter: "blur(12px)" }} />
      {/* inner dot */}
      <div className="absolute rounded-full"
        style={{ width: 10, height: 10, top: -5, left: -5, background: "hsl(25,100%,50%)", opacity: 0.9 }} />
    </div>
  );
};

/* ── Clients logo ticker (two-row infinite scroll) ── */
type LogoPillEntry = { name: string; si?: { path: string; hex: string; title: string }; logoUrl?: string };

const LogoPill = ({ c }: { c: LogoPillEntry }) => {
  const [imgFailed, setFailed] = React.useState(false);
  const logo = () => {
    if (c.si) return (
      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0 }}>
        <path d={c.si.path} fill={`#${c.si.hex}`} />
      </svg>
    );
    if (c.logoUrl && !imgFailed) return (
      <img src={c.logoUrl} alt={c.name} onError={() => setFailed(true)}
        draggable={false} style={{ width: 16, height: 16, objectFit: "contain", flexShrink: 0 }} />
    );
    return null;
  };
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] whitespace-nowrap select-none">
      {logo()}
      <span className="font-sans font-semibold text-xs text-white/60">{c.name}</span>
    </div>
  );
};

const ClientsTicker = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const local = (f: string) => `${base}/logos/${f}`;

  const clients: LogoPillEntry[] = [
    { name: "Toyota",      si: siToyota },
    { name: "Audi",        si: siAudi },
    { name: "Volkswagen",  si: siVolkswagen },
    { name: "Ferrari",     logoUrl: local("ferrari.svg") },
    { name: "Porsche",     si: siPorsche },
    { name: "Infiniti",    si: siInfiniti },
    { name: "Rolls Royce", si: siRollsroyce },
    { name: "Lexus",       logoUrl: local("lexus.svg") },
    { name: "Apple",       si: siApple },
    { name: "Samsung",     si: siSamsung },
    { name: "Canon",       logoUrl: local("canon.svg") },
    { name: "Amazon",      logoUrl: local("amazon.svg") },
    { name: "Adidas",      si: siAdidas },
    { name: "Dior",        si: siDior },
    { name: "Farfetch",    si: siFarfetch },
    { name: "Chanel",      logoUrl: local("chanel.svg") },
    { name: "L'Oréal",     logoUrl: local("loreal.svg") },
    { name: "KFC",         si: siKfc },
    { name: "McDonald's",  si: siMcdonalds },
    { name: "Red Bull",    si: siRedbull },
    { name: "Costa Coffee",logoUrl: local("costa.svg") },
    { name: "Subway",      logoUrl: local("subway.svg") },
    { name: "Carrefour",   si: siCarrefour },
    { name: "DHL",         si: siDhl },
    { name: "Deliveroo",   si: siDeliveroo },
    { name: "Talabat",     logoUrl: local("talabat.svg") },
    { name: "Emaar",       logoUrl: local("emaar.svg") },
    { name: "DAMAC",       logoUrl: local("damac.svg") },
    { name: "Noon",        logoUrl: local("noon.svg") },
    { name: "Escapology",  logoUrl: local("escapology.png") },
    { name: "Liv Bank",    logoUrl: local("liv.svg") },
    { name: "Rani",        logoUrl: local("rani.png") },
    { name: "Univ. of Sharjah", logoUrl: local("sharjah-uni.png") },
    { name: "Sharjah Chamber",  logoUrl: local("sharjah-chamber.png") },
  ];

  const row1 = clients.filter((_, i) => i % 2 === 0);
  const row2 = clients.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative overflow-hidden" style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 98, paddingBottom: 16 }}>
      <style>{`
        @keyframes home-ticker-l { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes home-ticker-r { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .home-tl { display:flex; width:max-content; animation:home-ticker-l 30s linear infinite; }
        .home-tr { display:flex; width:max-content; animation:home-ticker-r 36s linear infinite; }
        .home-tl:hover,.home-tr:hover { animation-play-state:paused; }
      `}</style>

      <div className="overflow-hidden mb-3">
        <div className="home-tl">
          {[...row1, ...row1].map((c, i) => <div key={i} className="px-2"><LogoPill c={c} /></div>)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="home-tr">
          {[...row2, ...row2].map((c, i) => <div key={i} className="px-2"><LogoPill c={c} /></div>)}
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to right,#080808,transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(to left,#080808,transparent)" }} />
    </section>
  );
};

/* ── Services ticker ── */
const ServicesTicker = () => {
  const items = [
    "Marketing Strategy", "Social Media Management", "Google Ads",
    "Podcast Production", "Website Design", "Event Management",
    "Influencer Marketing", "PR Management",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y py-5" style={{ borderColor: "hsl(25,100%,50%,0.25)", background: "#050505" }}>
      <div className="flex animate-ticker" style={{ width: "max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-6 px-6 whitespace-nowrap">
            <span className="font-display font-bold text-lg uppercase tracking-widest"
              style={{ color: i % 2 === 0 ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.25)" }}>
              {item}
            </span>
            <span style={{ color: "hsl(25,100%,50%)", opacity: 0.4 }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NoiseOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-20 mix-blend-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full opacity-40">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

const TOP_BAR_LOCS = [
  { code: "ae", city: "Dubai",     label: "UAE" },
  { code: "ch", city: "Geneva",    label: "Switzerland" },
  { code: "si", city: "Ljubljana", label: "Slovenia" },
];

const TopBar = () => {
  // Duplicate 4× so the loop is seamless at any screen width
  const items = [...TOP_BAR_LOCS, ...TOP_BAR_LOCS, ...TOP_BAR_LOCS, ...TOP_BAR_LOCS];
  return (
    <div
      className="fixed left-0 right-0 overflow-hidden border-b border-white/5"
      style={{ top: 64, height: 34, background: "#0a0a0a", zIndex: 39 }}
    >
      <style>{`
        @keyframes topbar-drift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .topbar-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: topbar-drift 28s linear infinite;
        }
        .topbar-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="topbar-track h-full">
        {items.map((loc, i) => (
          <div key={i} className="flex items-center" style={{ padding: "0 28px" }}>
            <img
              src={`https://flagcdn.com/w40/${loc.code}.png`}
              alt={loc.city}
              style={{ width: 18, height: 13, borderRadius: 2, objectFit: "cover", marginRight: 8 }}
            />
            <span className="font-mono font-bold text-[11px] tracking-widest uppercase" style={{ color: "hsl(25,100%,50%)" }}>{loc.label}</span>
            <span className="font-mono font-bold text-white text-[11px] ml-2">{loc.city}</span>
            <span style={{ marginLeft: 28, color: "hsl(25,100%,50%)", opacity: 0.3, fontSize: 8 }}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [active, setActive] = React.useState("home");

  React.useEffect(() => {
    const sections: { id: string; el: HTMLElement | null }[] = [
      { id: "home",  el: document.getElementById("hero") },
      { id: "offer", el: document.getElementById("services") },
      { id: "about", el: document.getElementById("agency") },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.el === entry.target);
            if (match) setActive(match.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => { if (s.el) observer.observe(s.el); });
    return () => observer.disconnect();
  }, []);

  const linkClass = (id: string) =>
    `font-sans font-medium transition-all duration-300 ${
      active === id
        ? "text-white text-base"
        : "text-primary text-sm hover:text-white"
    }`;

  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-display font-bold text-white tracking-widest uppercase text-lg">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#hero" className={linkClass("home")}>Home</a>

          {/* We Offer dropdown */}
          <div className="relative group">
            <button className={linkClass("offer") + " flex items-center gap-1"}>
              We Offer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
            {/* Dropdown panel */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-64 py-2">
                {[
                  { label: "Marketing Strategy",      slug: "marketing-strategy" },
                  { label: "Social Media Management", slug: "social-media-management" },
                  { label: "Google Ads",              slug: "google-ads" },
                  { label: "Podcast Production",      slug: "podcast-production" },
                  { label: "Website Design",          slug: "website-design" },
                  { label: "Event Management",        slug: "event-management" },
                  { label: "Influencer Marketing",    slug: "influencer-marketing" },
                  { label: "PR Management",           slug: "pr-management" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Industries dropdown */}
          <div className="relative group">
            <button className={linkClass("industries") + " flex items-center gap-1"}>
              Industries
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-56 py-2">
                {[
                  { label: "Architecture",          slug: "architecture"       },
                  { label: "Fashion & Apparel",    slug: "fashion-apparel"    },
                  { label: "Fitness & Wellness",   slug: "fitness-wellness"   },
                  { label: "Food & Beverage",      slug: "food-beverage"      },
                  { label: "Fragrance & Beauty",   slug: "fragrance-beauty"   },
                  { label: "Real Estate",          slug: "real-estate"        },
                  { label: "Technology & SaaS",    slug: "technology-saas"    },
                  { label: "Automotive",           slug: "automotive"         },
                  { label: "Healthcare & Clinics", slug: "healthcare-clinics" },
                  { label: "Entertainment & Media",slug: "entertainment-media"},
                  { label: "Government",           slug: "government"         },
                ].map(({ label, slug }) => (
                  <Link
                    key={slug}
                    href={`/industries/${slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about"   className={linkClass("about")}>About Us</Link>
          <Link href="/contact" className={linkClass("contact")}>Contact Us</Link>
        </div>

        {/* CTA + mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScheduleOpen(true)}
            className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}
          >
            Schedule a Meeting
          </button>
          <MobileNav active="home" />
        </div>
      </motion.nav>
    </>
  );
};

const CyclingText = ({ words }: { words: string[] }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % words.length), 2500);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="inline-block relative overflow-hidden" style={{ minWidth: "18ch", verticalAlign: "bottom" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
          style={{ color: "hsl(25,100%,50%)" }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const Hero = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <section
        id="hero"
        className="relative w-full bg-[#050505] overflow-hidden"
        style={{ minHeight: "82vh" }}
      >
        {/* subtle radial glow behind center text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 50%, hsl(25,100%,50%,0.07) 0%, transparent 70%)",
            zIndex: 1,
          }}
        />

        {/* ── Three-column grid ── */}
        <div className="relative w-full h-full flex items-end" style={{ zIndex: 2 }}>

          {/* LEFT person */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block flex-shrink-0 relative self-end"
            style={{ width: "clamp(200px, 22vw, 340px)" }}
          >
            <img
              src="/person-left-nobg.png"
              alt="Team member"
              className="w-full object-cover object-top select-none pointer-events-none"
              style={{ height: "clamp(340px, 65vh, 660px)", display: "block" }}
              draggable={false}
            />
          </motion.div>

          {/* CENTER content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-36 pb-16 md:pb-20">

            {/* label */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-mono text-[11px] uppercase tracking-[0.3em] mb-6"
              style={{ color: "hsl(25,100%,50%)" }}
            >
              Swissulife Media
            </motion.p>

            {/* headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.9] tracking-tight text-white mb-6"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5.2rem)", maxWidth: "14ch" }}
            >
              Do You Want To{" "}
              <span style={{ color: "hsl(25,100%,50%)", textShadow: "0 0 60px hsl(25,100%,50%,0.4)" }}>
                Scale
              </span>{" "}
              Your Business?
            </motion.h1>

            {/* sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="text-white/50 text-base md:text-lg leading-relaxed mb-10"
              style={{ maxWidth: "36ch" }}
            >
              Work with the team that has built and scaled brands across
              the GCC and Europe — from zero to millions.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-14"
            >
              <button
                onClick={() => setScheduleOpen(true)}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-black text-sm uppercase tracking-widest text-white transition-all duration-300 hover:shadow-[0_0_40px_hsl(25,100%,50%,0.6)] hover:scale-[1.03]"
                style={{ background: "hsl(25,100%,50%)" }}
              >
                I'm Ready to Scale
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border font-sans text-sm font-medium text-white/70 hover:text-white hover:border-white/40 transition-all duration-300"
                style={{ borderColor: "rgba(255,255,255,0.18)" }}
              >
                More About Us
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="flex items-center gap-8 md:gap-14"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "1.75rem" }}
            >
              {[
                { val: "150+", label: "Brands Scaled" },
                { val: "19M+", label: "Total Reach" },
                { val: "3",    label: "Countries" },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-display font-black text-white" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", lineHeight: 1 }}>{val}</p>
                  <p className="font-mono text-white/30 uppercase tracking-widest mt-1.5" style={{ fontSize: "0.58rem" }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT person */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block flex-shrink-0 relative self-end"
            style={{ width: "clamp(200px, 22vw, 340px)" }}
          >
            <img
              src="/person-right-nobg.png"
              alt="Team member"
              className="w-full object-cover object-top select-none pointer-events-none"
              style={{ height: "clamp(340px, 65vh, 660px)", display: "block" }}
              draggable={false}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};



/* ─────────────────────────────────────────────────────────────────
   Official-logo client card
   si        → simple-icons (locally bundled SVG + brand hex — works in preview & prod)
   logoUrl   → Clearbit transparent PNG  (works in prod; graceful fallback in sandbox)
   neither   → dashed placeholder
───────────────────────────────────────────────────────────────── */
type SimpleIcon = { path: string; hex: string; title: string };
type ClientEntry = {
  name: string;
  si?: SimpleIcon;          // simple-icons entry
  logoUrl?: string;         // Clearbit / other URL fallback
  dark?: boolean;           // dark card background
};

const ClientCard = ({ c }: { c: ClientEntry }) => {
  const [tilt, setTilt]     = React.useState<React.CSSProperties>({});
  const [imgFailed, setFailed] = React.useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - left) / width - 0.5;
    const ry = (e.clientY - top) / height - 0.5;
    setTilt({
      transform: `perspective(500px) rotateY(${rx * 18}deg) rotateX(${-ry * 18}deg) scale(1.07)`,
      boxShadow: `${-rx * 12}px ${ry * 12}px 24px rgba(255,100,0,0.26)`,
      transition: "transform 0.08s ease, box-shadow 0.08s ease",
      zIndex: 10,
    });
  };
  const onLeave = () => setTilt({
    transform: "perspective(500px) rotateY(0deg) rotateX(0deg) scale(1)",
    boxShadow: "none",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    zIndex: 1,
  });

  const bg = "#fff";
  const borderColor = "rgba(0,0,0,0.11)";
  const textColor   = "rgba(0,0,0,0.28)";

  const renderContent = () => {
    /* 1 — simple-icons: inline SVG with official brand colour */
    if (c.si) {
      const color = `#${c.si.hex}`;
      return (
        <svg
          role="img"
          viewBox="0 0 24 24"
          aria-label={c.name}
          style={{ width: "60%", height: "60%", flexShrink: 0 }}
        >
          <path d={c.si.path} fill={color} />
        </svg>
      );
    }

    /* 2 — Clearbit / external PNG (works in prod; falls back to placeholder in sandbox) */
    if (c.logoUrl && !imgFailed) {
      return (
        <img
          src={c.logoUrl}
          alt={c.name}
          onError={() => setFailed(true)}
          draggable={false}
          style={{ width: "72%", height: "72%", objectFit: "contain",
                   pointerEvents: "none", userSelect: "none" }}
        />
      );
    }

    /* 3 — placeholder */
    return (
      <div
        className="w-full h-full rounded-xl flex items-center justify-center"
        style={{ border: `1.5px dashed ${borderColor}` }}
      >
        <span style={{
          fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: textColor,
          textAlign: "center", lineHeight: 1.4, padding: "0 6px",
        }}>{c.name}</span>
      </div>
    );
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      title={c.name}
      style={{ willChange: "transform", background: bg, ...tilt }}
      className="rounded-2xl aspect-square flex items-center justify-center p-[15%] cursor-default overflow-hidden bg-foreground"
    >
      {renderContent()}
    </div>
  );
};

const VideoModal = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <AnimatePresence>
      <>
        <style>{`
          @keyframes vm-glow-pop {
            0%   { box-shadow: 0 0 0 0 hsl(25,100%,50%,0.7), 0 40px 120px rgba(0,0,0,0.9); }
            40%  { box-shadow: 0 0 60px 20px hsl(25,100%,50%,0.35), 0 40px 120px rgba(0,0,0,0.9); }
            100% { box-shadow: 0 0 40px 8px hsl(25,100%,50%,0.12), 0 40px 120px rgba(0,0,0,0.9); }
          }
        `}</style>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-[998]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(18px)" }}
          onClick={onClose}
        />
        {/* Panel */}
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10 pointer-events-none"
          style={{ perspective: 1200 }}
          initial={{ scale: 0.55, opacity: 0, y: 60, rotateX: 8 }}
          animate={{ scale: 1,    opacity: 1, y: 0,  rotateX: 0 }}
          exit={{    scale: 0.75, opacity: 0, y: 30, rotateX: 4 }}
          transition={{ type: "spring", damping: 22, stiffness: 260, mass: 0.8 }}
        >
          <div
            className="relative w-full max-w-4xl rounded-3xl overflow-hidden pointer-events-auto"
            style={{ background: "#000", animation: "vm-glow-pop 0.7s ease forwards" }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={`${base}/${src}`}
              controls
              autoPlay
              className="w-full bg-black"
              style={{ maxHeight: "80vh", display: "block" }}
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full text-white hover:scale-110 transition-transform"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

const WORK_ITEMS = [
  { video: "work-vid-1.mp4", category: "Fitness",          client: "Altitude Gym",    size: "large" },
  { video: "work-vid-2.mp4", category: "Fragrance",        client: "Fragrance Brand", size: "small" },
  { video: "work-vid-3.mp4", category: "Fashion",          client: "Blends Abaya",    size: "small" },
  { video: "work-vid-4.mp4", category: "Automobile",        client: "Latest Work",     size: "large" },
];

const TiltCard = ({ item, isLarge, index }: { item: typeof WORK_ITEMS[0]; isLarge: boolean; index: number }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const [gloss, setGloss] = React.useState({ x: 50, y: 50 });
  const [hovered, setHovered] = React.useState(false);
  const [modalSrc, setModalSrc] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState(true);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -18, y: (px - 0.5) * 18 });
    setGloss({ x: px * 100, y: py * 100 });
  };

  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      className={`${isLarge ? "md:col-span-7" : "md:col-span-5"}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      {modalSrc && <VideoModal src={modalSrc} onClose={() => setModalSrc(null)} />}
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        onClick={() => item.video && setModalSrc(item.video)}
        className="relative overflow-hidden rounded-2xl cursor-pointer w-full"
        style={{
          aspectRatio: isLarge ? "16/10" : "4/3",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
          transition: hovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Image or Video */}
        {item.video ? (
          <video
            ref={videoRef}
            src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/${item.video}`}
            autoPlay muted loop playsInline
            className="w-full h-full object-contain bg-black"
            style={{ transition: "transform 0.6s ease", transform: hovered ? "scale(1.03)" : "scale(1)" }}
          />
        ) : (
          <img
            src={item.img}
            alt={item.client}
            className="w-full h-full object-cover"
            style={{ transition: "transform 0.6s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />
        )}

        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        {/* Orange vignette on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at bottom left, hsl(25,100%,50%,0.25) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Gloss shine following cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${gloss.x}% ${gloss.y}%, rgba(255,255,255,0.12) 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Category tag */}
        <div className="absolute top-4 left-4" style={{ transform: "translateZ(20px)" }}>
          <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 text-white/70 bg-black/50 backdrop-blur-sm">
            {item.category}
          </span>
        </div>

        {/* Play button (centre) + Mute button (top-right) — video cards only */}
        {item.video && (
          <>
            {/* Centre play button — opens modal */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
              style={{ opacity: hovered ? 1 : 0 }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm">
                <Play size={22} className="text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Mute toggle — top right */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/80 transition-all"
              style={{ transform: "translateZ(20px)" }}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </>
        )}

        {/* Bottom info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5"
          style={{
            transform: `translateZ(20px) translateY(${hovered ? 0 : 6}px)`,
            transition: "transform 0.4s ease",
          }}
        >
          <p className="font-display font-bold text-white text-xl mb-1">{item.client}</p>
          <div
            className="flex items-center gap-2 overflow-hidden"
            style={{
              maxHeight: hovered ? 24 : 0,
              opacity: hovered ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.35s ease",
            }}
          >
            <span className="w-5 h-[2px] rounded-full shrink-0" style={{ background: "hsl(25,100%,50%)" }} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">View project</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProofOfWork = () => (
  <section className="py-24 px-6 bg-black">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary mb-3">Selected Projects</p>
          <h2 className="font-display font-bold text-5xl md:text-7xl uppercase text-white leading-none">
            Proof of<br /><span style={{ color: "hsl(25,100%,50%)" }}>Work</span>
          </h2>
        </div>
        <Link href="/contact">
          <motion.button
            whileHover={{ x: 4 }}
            className="hidden md:flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
          >
            Start a project <ArrowRight size={14} />
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {WORK_ITEMS.map((item, i) => (
          <TiltCard key={i} item={item} isLarge={item.size === "large"} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const OurClients = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const local = (file: string) => `${base}/logos/${file}`;
  const cb = (d: string) => `https://logo.clearbit.com/${d}`;

  const clients: ClientEntry[] = [
    { name: "Toyota",      si: siToyota },
    { name: "Audi",        si: siAudi },
    { name: "Volkswagen",  si: siVolkswagen },
    { name: "Ferrari",     logoUrl: local("ferrari.svg") },
    { name: "Porsche",     si: siPorsche },
    { name: "Infiniti",    si: siInfiniti },
    { name: "Rolls Royce", si: siRollsroyce },
    { name: "Lexus",       logoUrl: local("lexus.svg") },
    { name: "GEELY",       logoUrl: local("geely.svg") },
    { name: "Apple",       si: siApple,   dark: true },
    { name: "Samsung",     si: siSamsung },
    { name: "Canon",       logoUrl: local("canon.svg") },
    { name: "Amazon",      logoUrl: local("amazon.svg") },
    { name: "Adidas",      si: siAdidas,   dark: true },
    { name: "Dior",        si: siDior,     dark: true },
    { name: "Farfetch",    si: siFarfetch, dark: true },
    { name: "Chanel",      logoUrl: local("chanel.svg") },
    { name: "L'Oréal",     logoUrl: local("loreal.svg") },
    { name: "KFC",         si: siKfc },
    { name: "McDonald's",  si: siMcdonalds },
    { name: "Red Bull",    si: siRedbull,   dark: true },
    { name: "Costa Coffee",logoUrl: local("costa.svg") },
    { name: "Subway",      logoUrl: local("subway.svg") },
    { name: "Quaker",      logoUrl: local("quaker.png") },
    { name: "Oreo",        logoUrl: local("oreo.png") },
    { name: "Carrefour",   si: siCarrefour },
    { name: "Noon",        logoUrl: local("noon.svg") },
    { name: "DHL",         si: siDhl },
    { name: "Deliveroo",   si: siDeliveroo, dark: true },
    { name: "Talabat",     logoUrl: local("talabat.svg") },
    { name: "Emaar",       logoUrl: local("emaar.svg") },
    { name: "DAMAC",       logoUrl: local("damac.svg") },
    { name: "fäm Properties", logoUrl: local("fam.svg") },
    { name: "Escapology",  logoUrl: local("escapology.png") },
    { name: "Liv Bank",    logoUrl: local("liv.svg") },
    { name: "Rani",        logoUrl: local("rani.png") },
    { name: "Univ. of Sharjah", logoUrl: local("sharjah-uni.png") },
    { name: "Sharjah Chamber",  logoUrl: local("sharjah-chamber.png") },
  ];

  return (
    <section id="clients" className="relative py-24 px-6 overflow-hidden" style={{ background: "#050505" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(25,100%,50%) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-primary uppercase tracking-[0.35em] text-xs mb-3">Some of our</p>
          <h2 className="font-display font-bold text-6xl md:text-8xl uppercase text-white/80">Clients</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {clients.map((c) => (
            <ClientCard key={c.name} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
};



const Stats = () => {
  const data = [
    { name: "Q1", value: 100 },
    { name: "Q2", value: 250 },
    { name: "Q3", value: 180 },
    { name: "Q4", value: 400 },
    { name: "Q5", value: 380 },
    { name: "Q6", value: 700 },
    { name: "Q7", value: 650 },
    { name: "Q8", value: 1000 }
  ];

  return (
    <section className="py-14 px-6 bg-primary text-black relative overflow-hidden">
      {/* Wavy background line */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={12} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { value: "3M+",  label: "Total Reach Per Month" },
            { value: "1.8M", label: "Instagram Reach" },
            { value: "293K", label: "Monthly Impressions" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className={`flex flex-col justify-center py-6 md:py-0 md:px-12 ${i > 0 ? "border-t md:border-t-0 md:border-l border-black/20" : ""}`}
            >
              <h4 className="font-display font-black leading-none mb-2" style={{ fontSize: "clamp(3.5rem,7vw,5.5rem)" }}>{stat.value}</h4>
              <p className="font-mono uppercase text-[11px] font-bold tracking-[0.25em] opacity-70">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



const Contact = () => {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api-server/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-black py-24 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-black text-5xl md:text-6xl uppercase text-white mb-14"
        >
          Reach Out
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ── Left: info + form ── */}
          <div className="flex flex-col gap-10">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                  ),
                  label: "LOCATION",
                  lines: ["Dubai,", "United Arab Emirates"],
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>
                  ),
                  label: "PHONE",
                  lines: ["+971 50 572 5515"],
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                  ),
                  label: "EMAIL",
                  lines: ["anas@swissulife.com"],
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  ),
                  label: "HOURS",
                  lines: ["Sunday – Thursday", "9:00 AM – 6:00 PM"],
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 text-primary">
                    {item.icon}
                    <span className="font-mono text-xs font-bold tracking-widest">{item.label}</span>
                  </div>
                  <div className="font-sans text-sm text-white/70 leading-relaxed">
                    {item.lines.map((l, i) => <p key={i}>{l}</p>)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 rounded-2xl p-8 border border-white/10"
            >
              <h3 className="font-display font-black text-2xl uppercase text-white mb-6">Drop a Line</h3>
              {sent ? (
                <p className="text-primary font-mono text-sm">Message sent! We'll be in touch soon.</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {[
                    { key: "name", label: "NAME", type: "text", placeholder: "Your name" },
                    { key: "email", label: "EMAIL", type: "email", placeholder: "your@email.com" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5 block">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key as "name" | "email"]}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1.5 block">MESSAGE</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your project…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3 rounded-lg font-mono text-sm uppercase tracking-widest text-white font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: "hsl(25,100%,50%)" }}
                  >
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* ── Right: map ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/10 min-h-[500px] lg:min-h-full"
          >
            <iframe
              title="Swissulife Media Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462562.61292108404!2d54.94793630000001!3d25.075323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbf7a3b4b5909f72f!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "500px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const Footer = () => {
  return (
    <footer id="footer" className="bg-black pt-32 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Contact />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 border-t border-white/10 pt-12 mt-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <span className="font-display font-bold text-white tracking-widest uppercase text-xl">
                SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
              </span>
            </div>
            <p className="font-sans text-muted-foreground text-sm max-w-sm">
              Personalized, high-quality digital marketing services with a tailored approach. Cutting-edge strategies for effective results.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 font-sans text-muted-foreground text-sm">
              <li><a href="tel:+971505725515" className="hover:text-primary transition-colors">+971 50 572 5515</a></li>
              <li><a href="mailto:anas@swissulife.com" className="hover:text-primary transition-colors">anas@swissulife.com</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-6">Socials</h4>
            <ul className="space-y-4 font-sans text-muted-foreground text-sm">
              <li>
                <a href="https://instagram.com/swissulifemedia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  @swissulifemedia
                </a>
              </li>
              <li>
                <a href="https://wa.me/971505725515" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 32 32" fill="currentColor"><path d="M16 .5C7.44.5.5 7.44.5 16c0 2.75.72 5.37 2.08 7.67L.5 31.5l8.06-2.06A15.43 15.43 0 0016 31.5C24.56 31.5 31.5 24.56 31.5 16S24.56.5 16 .5zm0 28.3a13.2 13.2 0 01-6.73-1.84l-.48-.29-4.79 1.22 1.27-4.65-.31-.5A13.22 13.22 0 0116 2.7c7.3 0 13.22 5.93 13.22 13.22S23.3 29.2 16 29.2zm7.26-9.9c-.4-.2-2.35-1.16-2.71-1.29-.37-.13-.63-.2-.9.2s-1.03 1.29-1.27 1.56c-.23.26-.47.3-.87.1a10.9 10.9 0 01-3.21-1.98 12.04 12.04 0 01-2.22-2.76c-.23-.4-.02-.61.17-.81.18-.18.4-.47.6-.7.19-.24.26-.4.39-.67.13-.26.07-.5-.03-.7-.1-.2-.9-2.16-1.23-2.96-.32-.78-.65-.67-.9-.68l-.76-.01c-.27 0-.7.1-1.06.5-.37.4-1.4 1.37-1.4 3.33s1.43 3.86 1.63 4.13c.2.26 2.82 4.3 6.83 6.03.95.41 1.7.66 2.28.84.96.3 1.83.26 2.52.16.77-.12 2.35-.96 2.68-1.89.33-.92.33-1.71.23-1.88-.1-.16-.36-.26-.76-.46z"/></svg>
                  +971 50 572 5515
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="bg-black min-h-screen text-foreground selection:bg-primary selection:text-white">
      <NoiseOverlay />
      <TopBar />
      <Navbar />
      
      <main>
        <ClientsTicker />
        <Hero />
        <ServicesTicker />
        <ProofOfWork />
        <OurClients />
      </main>

      <Footer />
    </div>
  );
}
