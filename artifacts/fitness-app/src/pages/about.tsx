import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ScheduleModal from "@/components/ScheduleModal";
import MobileNav from "@/components/MobileNav";
import GlobeScene from "@/components/GlobeScene";

// ─── Navbar ──────────────────────────────────────────────────────────────────
const AboutNavbar = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <span className="font-display font-bold text-white tracking-widest uppercase text-lg cursor-pointer">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">Home</Link>

          {/* We Offer dropdown */}
          <div className="relative group">
            <button className="font-sans text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
              We Offer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
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
                ].map(s => (
                  <Link key={s.slug} href={`/services/${s.slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Industries dropdown */}
          <div className="relative group">
            <button className="font-sans text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
              Industries
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-56 py-2">
                {[
                  { label: "Architecture",           slug: "architecture"        },
                  { label: "Fashion & Apparel",     slug: "fashion-apparel"     },
                  { label: "Fitness & Wellness",    slug: "fitness-wellness"    },
                  { label: "Food & Beverage",       slug: "food-beverage"       },
                  { label: "Fragrance & Beauty",    slug: "fragrance-beauty"    },
                  { label: "Technology & SaaS",     slug: "technology-saas"     },
                  { label: "Automotive",            slug: "automotive"          },
                  { label: "Entertainment & Media", slug: "entertainment-media" },
                  { label: "Government",            slug: "government"          },
                ].map(({ label, slug }) => (
                  <Link key={slug} href={`/industries/${slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <span className="font-sans text-sm font-medium text-white cursor-default">About Us</span>
          <Link href="/contact" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">Contact Us</Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScheduleOpen(true)}
            className="hidden md:inline-flex px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}
          >
            Schedule a Meeting
          </button>
          <MobileNav active="about" />
        </div>
      </nav>
    </>
  );
};

// ─── Client ticker types & pill ───────────────────────────────────────────────
type SimpleIcon = { path: string; hex: string; title: string };
type ClientEntry = { name: string; si?: SimpleIcon; logoUrl?: string };

const LogoPill = ({ c }: { c: ClientEntry }) => {
  const [imgFailed, setFailed] = React.useState(false);
  const logo = () => {
    if (c.si) return (
      <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, flexShrink: 0 }}>
        <path d={c.si.path} fill={`#${c.si.hex}`} />
      </svg>
    );
    if (c.logoUrl && !imgFailed) return (
      <img src={c.logoUrl} alt={c.name} onError={() => setFailed(true)}
        draggable={false} style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
    );
    return null;
  };
  return (
    <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] whitespace-nowrap select-none">
      {logo()}
      <span className="font-sans font-semibold text-sm text-white/60">{c.name}</span>
    </div>
  );
};

const ClientsTicker = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const local = (f: string) => `${base}/logos/${f}`;

  const clients: ClientEntry[] = [
    { name: "Sharjah Paintball Park", logoUrl: local("sharjah-paintball.png") },
    { name: "Righteous Properties",   logoUrl: local("righteous-properties.png") },
    { name: "Shurooq Al Sharqia",     logoUrl: local("shurooq-al-sharqia.png") },
    { name: "fäm Properties",         logoUrl: local("fam-properties.png") },
    { name: "Seventy Fitness & Spa",  logoUrl: local("seventy-fitness.png") },
    { name: "Glitza by Ghaliaa",      logoUrl: local("glitza.png") },
    { name: "Sharqi Gents Salon",     logoUrl: local("sharqi-salon.png") },
    { name: "Sharjah Chamber",        logoUrl: local("sharjah-chamber.png") },
    { name: "Rani",                   logoUrl: local("rani.png") },
    { name: "Blue Sapphire Token",    logoUrl: local("blue-sapphire-token.png") },
    { name: "Meaza",                  logoUrl: local("meaza.png") },
    { name: "Corniche Hotel Sharjah", logoUrl: local("corniche-hotel.png") },
    { name: "Charms Education",       logoUrl: local("charms-education.png") },
    { name: "Ferrari",                logoUrl: local("ferrari.png") },
    { name: "Lexus",                  logoUrl: local("lexus.png") },
    { name: "Sharjah Excellence Award", logoUrl: local("sharjah-excellence-award.png") },
    { name: "Geely",                  logoUrl: local("geely.png") },
    { name: "Escapology Sharjah",     logoUrl: local("escapology.png") },
    { name: "Altitude The Gym",       logoUrl: local("altitude-gym.png") },
    { name: "Audi",                   logoUrl: local("audi.png") },
    { name: "Univ. of Sharjah",       logoUrl: local("university-of-sharjah.png") },
    { name: "Rashed Bugaraa",         logoUrl: local("rashed-bugaraa.png") },
    { name: "Savva All Day Lounge",   logoUrl: local("savva-lounge.png") },
    { name: "Rolls Royce",            logoUrl: local("rolls-royce.png") },
    { name: "Fashion Factor",         logoUrl: local("fashion-factor.png") },
    { name: "Sharjah Golf & Shooting Club", logoUrl: local("sharjah-golf-club.png") },
  ];

  const row1 = clients.filter((_, i) => i % 2 === 0);
  const row2 = clients.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-8 overflow-hidden" style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <style>{`
        @keyframes about-ticker-l { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes about-ticker-r { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .about-tl { display:flex; width:max-content; animation:about-ticker-l 30s linear infinite; }
        .about-tr { display:flex; width:max-content; animation:about-ticker-r 36s linear infinite; }
        .about-tl:hover,.about-tr:hover { animation-play-state:paused; }
      `}</style>

      <div className="overflow-hidden mb-3">
        <div className="about-tl">
          {[...row1, ...row1].map((c, i) => <div key={i} className="px-2"><LogoPill c={c} /></div>)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="about-tr">
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

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Work overlay data ────────────────────────────────────────────────────────
const SERVICES = [
  { num: "01", name: "Social Media Management", slug: "social-media-management" },
  { num: "02", name: "Paid Advertising",         slug: "paid-advertising" },
  { num: "03", name: "Influencer Marketing",     slug: "influencer-marketing" },
  { num: "04", name: "Branding & Identity",      slug: "branding-identity" },
  { num: "05", name: "Content Production",       slug: "content-production" },
  { num: "06", name: "Marketing Strategy",       slug: "marketing-strategy" },
];
const INDUSTRY_LIST = [
  { name: "Fashion & Apparel",     slug: "fashion-apparel" },
  { name: "Fitness & Wellness",    slug: "fitness-wellness" },
  { name: "Food & Beverage",       slug: "food-beverage" },
  { name: "Fragrance & Beauty",    slug: "fragrance-beauty" },
  { name: "Technology & SaaS",     slug: "technology-saas" },
  { name: "Automotive",            slug: "automotive" },
  { name: "Entertainment & Media", slug: "entertainment-media" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function About() {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [workOpen,     setWorkOpen]     = React.useState(false);

  return (
    <div className="bg-[#050505] text-white font-sans overflow-x-hidden">
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />

      {/* ── View Our Work overlay ───────────────────────────────────────────── */}
      <motion.div
        initial={false}
        animate={workOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 280 }}
        className="fixed inset-0 z-[999] flex flex-col overflow-y-auto"
        style={{ background: "#050505", pointerEvents: workOpen ? "auto" : "none" }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between px-8 md:px-16 py-6 border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <span className="font-display font-black text-white tracking-tight">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
          <button
            onClick={() => setWorkOpen(false)}
            className="w-10 h-10 rounded-full border flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all font-sans text-lg"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >✕</button>
        </div>

        {/* content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* LEFT — Services */}
          <div className="px-8 md:px-16 py-14 border-r" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] mb-10" style={{ color: "hsl(25,100%,50%)" }}>What We Do</p>
            <div className="flex flex-col gap-1">
              {SERVICES.map((s, i) => (
                <motion.div
                  key={s.slug}
                  animate={workOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  transition={{ delay: workOpen ? 0.08 + i * 0.07 : 0, duration: 0.45 }}
                >
                  <Link
                    href={`/services/${s.slug}`}
                    onClick={() => setWorkOpen(false)}
                    className="group flex items-center gap-6 py-5 border-b hover:border-orange-500/40 transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <span className="font-mono text-[11px] w-6 shrink-0" style={{ color: "hsl(25,100%,50%)" }}>{s.num}</span>
                    <span className="font-display font-black uppercase text-2xl md:text-3xl text-white/80 group-hover:text-white transition-colors leading-tight">{s.name}</span>
                    <span className="ml-auto text-white/20 group-hover:text-orange-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 text-lg">↗</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT — Industries */}
          <div className="px-8 md:px-16 py-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] mb-10" style={{ color: "hsl(25,100%,50%)" }}>Industries We Serve</p>
            <div className="flex flex-wrap gap-3">
              {INDUSTRY_LIST.map((ind, i) => (
                <motion.div
                  key={ind.slug}
                  animate={workOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
                  transition={{ delay: workOpen ? 0.18 + i * 0.06 : 0, duration: 0.4 }}
                >
                  <Link
                    href={`/industries/${ind.slug}`}
                    onClick={() => setWorkOpen(false)}
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border font-display font-bold text-sm uppercase tracking-wider text-white/60 hover:text-white hover:border-orange-500 transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)" }}
                  >
                    {ind.name}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500">↗</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* bottom cta */}
            <motion.div
              animate={workOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: workOpen ? 0.7 : 0, duration: 0.5 }}
              className="mt-16 p-8 rounded-2xl border"
              style={{ borderColor: "rgba(255,98,0,0.25)", background: "rgba(255,98,0,0.04)" }}
            >
              <p className="font-display font-black uppercase text-xl text-white mb-2">Don't see your industry?</p>
              <p className="text-white/40 text-sm mb-5">We work across every vertical. If you have ambition, we have the system.</p>
              <button
                onClick={() => { setWorkOpen(false); setScheduleOpen(true); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-display font-bold text-sm uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
                style={{ background: "hsl(25,100%,50%)" }}
              >
                Let's Talk <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AboutNavbar />

      {/* ══════════════════════════════════════════════════════
          HERO — split: left text / right photo
      ══════════════════════════════════════════════════════ */}
      <section className="flex min-h-screen">

        {/* LEFT */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-[48%] px-8 md:px-16 lg:px-20 pt-36 pb-20">

          {/* label */}
          <motion.p
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5"
            style={{ color: "hsl(25,100%,50%)" }}
          >
            Who We Are
          </motion.p>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase leading-[0.9] tracking-tight mb-8"
            style={{ fontSize: "clamp(3.2rem, 7vw, 6rem)" }}
          >
            About <span style={{ color: "hsl(25,100%,50%)" }}>Us</span>
          </motion.h1>

          {/* divider */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-[2px] origin-left mb-8"
            style={{ background: "hsl(25,100%,50%)" }}
          />

          {/* body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="space-y-5 mb-10 max-w-md"
          >
            <p className="text-white/70 text-base leading-relaxed">
              Swissulife Media is the leading full-service digital marketing agency for ambitious brands across the UAE, Switzerland, and Slovenia. We excel in social media, paid advertising, content production, and creative strategy.
            </p>
            <p className="text-white/55 text-base leading-relaxed">
              As strategic consultants and content architects, we innovate and elevate your marketing with a boutique approach, tailor-made solutions, unparalleled creativity, and measurable results across every channel.
            </p>
            <p className="text-white/55 text-base leading-relaxed">
              We've built and scaled 150+ brands. If your business has ambition, we have the system to back it.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => setScheduleOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
              style={{ background: "hsl(25,100%,50%)" }}
            >
              Get in Touch <ArrowRight size={15} />
            </button>
            <button
              onClick={() => setWorkOpen(true)}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full border font-display font-bold text-sm uppercase tracking-widest text-white/70 hover:text-white hover:border-white/40 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.18)" }}
            >
              View Our Work
              <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </button>
          </motion.div>
        </div>

        {/* RIGHT — Globe panel */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="hidden lg:flex w-[52%] relative overflow-hidden"
          style={{ background: "#050505" }}
        >
          {/* left edge fade */}
          <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
            style={{ background: "linear-gradient(to right, #050505 0%, transparent 100%)" }} />

          {/* Globe canvas — fills panel */}
          <div className="absolute inset-0 flex items-center justify-center">
            <GlobeScene />
          </div>

          {/* Country labels */}
          <div className="absolute top-1/2 right-8 z-20 -translate-y-1/2 flex flex-col gap-3">
            {[
              { flag: "🇦🇪", name: "UAE" },
              { flag: "🇨🇭", name: "Switzerland" },
              { flag: "🇸🇮", name: "Slovenia" },
            ].map(({ flag, name }) => (
              <div key={name} className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                <span className="text-sm">{flag}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">{name}</span>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "hsl(25,100%,50%)" }} />
              </div>
            ))}
          </div>

          {/* stats overlay — bottom */}
          <div className="absolute bottom-8 left-12 z-20 flex gap-10">
            {[
              { val: "150+", label: "Brands Scaled" },
              { val: "19M+", label: "Total Reach" },
              { val: "3",    label: "Countries" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p className="font-display font-black text-white" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.4rem)", lineHeight: 1 }}>{val}</p>
                <p className="font-mono text-white/30 uppercase tracking-widest mt-1.5" style={{ fontSize: "0.58rem" }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <ClientsTicker />

      {/* ══════════════════════════════════════════════════════
          BRAND MANIFESTO
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden" style={{ background: "#050505" }}>
        {/* background texture — faint diagonal lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, #FF6200 0px, #FF6200 1px, transparent 1px, transparent 60px)",
          }} />

        {/* big orange glow behind text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,98,0,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto text-center">

          {/* eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-mono text-[11px] uppercase tracking-[0.4em] mb-10"
            style={{ color: "hsl(25,100%,50%)" }}
          >
            Our Belief
          </motion.p>

          {/* main statement — word-by-word reveal */}
          {[
            { text: "We don't run", orange: false },
            { text: "ads.", orange: false },
            { text: "We build", orange: false },
            { text: "empires.", orange: true },
          ].reduce<React.ReactNode[]>((acc, word, i) => {
            acc.push(
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.14 }}
                className={`inline-block mr-[0.22em] font-display font-black uppercase leading-none ${word.orange ? "" : "text-white"}`}
                style={word.orange
                  ? { color: "hsl(25,100%,50%)", fontSize: "clamp(3.2rem,8vw,7rem)" }
                  : { fontSize: "clamp(3.2rem,8vw,7rem)" }
                }
              >
                {word.text}
              </motion.span>
            );
            return acc;
          }, [])}

          {/* divider line */}
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto my-12 h-px w-32 origin-left"
            style={{ background: "hsl(25,100%,50%)" }}
          />

          {/* three supporting lines */}
          {[
            "We've scaled 150+ brands across the GCC and Europe — not by following trends, but by setting them.",
            "Every reel, every ad, every strategy is built with one obsession: measurable, undeniable growth.",
            "If your brand has ambition, we have the system to back it.",
          ].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.85 + i * 0.15 }}
              className="mx-auto max-w-2xl font-sans text-base md:text-lg leading-relaxed mb-4 last:mb-0"
              style={{ color: i === 2 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)" }}
            >
              {line}
            </motion.p>
          ))}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHAT WE DO
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-8 md:px-16 lg:px-24" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: "hsl(25,100%,50%)" }}>What We Do</p>
            <h2 className="font-display font-black uppercase text-4xl md:text-5xl leading-tight">
              Every tool your<br />brand needs.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {[
              { num: "01", name: "Social Media Management", slug: "social-media-management", detail: "Content, scheduling & community management across all platforms." },
              { num: "02", name: "Paid Advertising",         slug: "paid-advertising",         detail: "High-ROAS campaigns on Meta, Google, TikTok and Snapchat." },
              { num: "03", name: "Influencer Marketing",     slug: "influencer-marketing",     detail: "Access to a 19M+ reach network of verified creators." },
              { num: "04", name: "Branding & Identity",      slug: "branding-identity",        detail: "Logo, visual language, tone of voice and brand positioning." },
              { num: "05", name: "Content Production",       slug: "content-production",       detail: "Video, photography, reels, podcasts and copywriting." },
              { num: "06", name: "Marketing Strategy",       slug: "marketing-strategy",       detail: "Full-funnel strategy, audience research and growth roadmaps." },
            ].map((s, i) => (
              <Reveal key={s.name} delay={i * 0.07}>
                <Link href={`/services/${s.slug}`}>
                  <div
                    className="group relative p-8 h-full flex flex-col cursor-pointer overflow-hidden transition-all duration-300 hover:bg-[#0d0d0d]"
                    style={{ background: "#050505" }}
                  >
                    {/* hover accent line */}
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: "hsl(25,100%,50%)" }} />

                    <span className="font-mono text-[11px] mb-6 block" style={{ color: "hsl(25,100%,50%)" }}>{s.num}</span>
                    <h3 className="font-display font-black text-xl uppercase mb-3 text-white group-hover:text-white leading-tight flex-1">{s.name}</h3>
                    <p className="text-white/35 text-sm leading-relaxed mb-6">{s.detail}</p>
                    <span className="inline-flex items-center gap-1 text-white/25 group-hover:text-orange-500 font-mono text-[11px] uppercase tracking-widest transition-colors">
                      Explore <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHERE WE OPERATE
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-8 md:px-16 lg:px-24" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-16 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: "hsl(25,100%,50%)" }}>Where We Operate</p>
            <h2 className="font-display font-black uppercase text-4xl md:text-5xl">Global reach, local understanding.</h2>
            <p className="text-white/40 text-base mt-4 max-w-lg mx-auto">Three offices. One unified team. Serving clients across the Middle East, Europe, and beyond.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { flag: "🇦🇪", name: "UAE",         city: "Dubai — Trade Centre" },
              { flag: "🇨🇭", name: "Switzerland", city: "Geneva" },
              { flag: "🇸🇮", name: "Slovenia",    city: "Ljubljana" },
            ].map((c, i) => (
              <Reveal key={c.name} delay={i * 0.1}>
                <div className="rounded-2xl border border-white/8 p-8 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <span className="text-4xl">{c.flag}</span>
                  <div>
                    <p className="font-display font-black text-xl uppercase text-white mb-1">{c.name}</p>
                    <p className="font-mono text-[11px] text-white/35 uppercase tracking-widest">{c.city}</p>
                  </div>
                  <div className="w-8 h-[2px]" style={{ background: "hsl(25,100%,50%)" }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════ */}
      <section className="py-28 px-8 md:px-16 lg:px-24" style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Reveal className="max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 border border-white/8"
            style={{ background: "rgba(255,98,0,0.04)" }}
          >
            <div className="max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] mb-5" style={{ color: "hsl(25,100%,50%)" }}>Let's Build</p>
              <h2 className="font-display font-black uppercase text-4xl md:text-5xl leading-tight mb-5">Ready to be next?</h2>
              <p className="text-white/50 text-base leading-relaxed">
                Tell us where you want your brand to go. We'll build the strategy, content, and digital presence to get you there — across every platform, in every market.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <button
                onClick={() => setScheduleOpen(true)}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
                style={{ background: "hsl(25,100%,50%)" }}
              >
                Start a Project <ArrowRight size={15} />
              </button>
              <Link href="/contact"
                className="text-[10px] font-mono uppercase tracking-widest text-white/30 hover:text-white transition-colors text-center">
                Or get in touch →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-8 md:px-16 lg:px-24 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display font-black text-white/30 text-sm tracking-tight">
          SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-white/20">
          © {new Date().getFullYear()} Swissulife Media. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
