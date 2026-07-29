import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScheduleModal from "@/components/ScheduleModal";
import { ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import heroBg from "@assets/hero-bg.jpg";
import work1 from "@assets/work-1.jpg";
import work2 from "@assets/work-2.jpg";
import work3 from "@assets/work-3.jpg";
import swissLogo from "@assets/66b7e0a1-9291-41da-82a2-6d89f100f8a3_1785308430142.jpg";

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

const Navbar = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [active, setActive] = React.useState("home");

  React.useEffect(() => {
    const sections: { id: string; el: HTMLElement | null }[] = [
      { id: "home",    el: document.getElementById("hero") },
      { id: "offer",   el: document.getElementById("services") },
      { id: "about",   el: document.getElementById("agency") },
      { id: "contact", el: document.getElementById("contact") },
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
          <img src={swissLogo} alt="Swissulife Media" className="h-9 w-auto object-contain" style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} />
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
                  "Marketing Strategy",
                  "Social Media Management",
                  "Google Ads",

                  "Podcast Production",
                  "Website Design",
                  "Event Management",
                  "Influencer Marketing",
                  "PR Management",
                ].map((s) => (
                  <a
                    key={s}
                    href="#services"
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a href="/about"   className={linkClass("about")}>About Us</a>
          <a href="#contact" className={linkClass("contact")}>Contact Us</a>
        </div>

        {/* CTA */}
        <button
          onClick={() => setScheduleOpen(true)}
          className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "hsl(25,100%,50%)" }}
        >
          Schedule a Meeting
        </button>
      </motion.nav>
    </>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative w-full bg-black overflow-hidden" style={{ minHeight: "100vh" }}>
      <div className="flex flex-col md:flex-row h-full" style={{ minHeight: "100vh" }}>

        {/* ── LEFT: text panel ── */}
        <div className="relative z-10 flex flex-col justify-center px-10 md:px-16 pt-32 pb-16 md:py-0 w-full md:w-[42%] shrink-0">

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono uppercase text-white/30 mb-6"
            style={{ fontSize: "0.65rem", letterSpacing: "0.45em" }}
          >
            Dare to be different?
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase leading-[0.88] mb-8"
            style={{ fontSize: "clamp(3.5rem, 7vw, 6.5rem)" }}
          >
            <span className="block text-white/20 text-2xl tracking-[0.45em] mb-2 font-normal">Meet</span>
            <span style={{ color: "hsl(25,100%,50%)", textShadow: "0 0 80px hsl(25 100% 50% / 0.4)" }}>Swiss</span>
            <span className="text-white">u</span>
            <span style={{ color: "hsl(25,100%,50%)", textShadow: "0 0 80px hsl(25 100% 50% / 0.4)" }}>life</span>
          </motion.h1>

          {/* Orange accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0, height: 3, background: "linear-gradient(90deg, hsl(25,100%,50%), transparent)", borderRadius: 2 }}
            className="w-48 mb-8"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <h2 className="font-display font-bold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}>
              A 360° Result-Oriented<br />
              <span className="text-white/35">Digital Marketing Agency</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm">
              At Swissulife Media, we promise results. Tested strategies, diverse niches, zero compromises.
            </p>

            <a
              href="#agency"
              className="group inline-flex items-center gap-0 px-8 py-3 rounded-full border border-white/30 text-white font-sans text-sm font-medium hover:bg-primary hover:border-primary hover:text-black transition-all duration-300"
            >
              More About Us
              <span className="overflow-hidden w-0 group-hover:w-5 transition-all duration-300 ease-out flex items-center">
                <ArrowRight size={15} className="ml-1 shrink-0" />
              </span>
            </a>
          </motion.div>

          {/* scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-10 md:left-16 flex items-center gap-3"
          >
            <div className="w-px h-12 bg-white/20" style={{ animation: "pulse 2s ease-in-out infinite" }} />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/20">Scroll</span>
          </motion.div>
        </div>

        {/* ── RIGHT: full-bleed image ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full md:flex-1 overflow-hidden"
          style={{ minHeight: "50vh" }}
        >
          <img
            src={heroBg}
            alt="Campaign"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.85 }}
          />
          {/* Left gradient fade into black */}
          <div className="absolute inset-y-0 left-0 w-32 md:w-48"
            style={{ background: "linear-gradient(90deg, #000 0%, transparent 100%)" }} />
          {/* overlay tint */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)" }} />

          {/* floating stat badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="absolute bottom-10 right-10 text-right"
          >
            <p className="font-display font-black text-5xl text-white leading-none">3M+</p>
            <p className="font-mono text-xs uppercase tracking-widest text-white/50 mt-1">Monthly Reach</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};


import subwayLogo from "@assets/logos/subway.png";
import gloriaJeansLogo from "@assets/logos/gloria-jeans.png";
import gulAhmedLogo from "@assets/logos/gul-ahmed.png";
import jazzLogo from "@assets/logos/jazz.png";
import humNetworkLogo from "@assets/logos/hum-network.png";
import serenaHotelsLogo from "@assets/logos/serena-hotels.png";
import dhaLogo from "@assets/logos/dha.png";
import arnNewsLogo from "@assets/logos/arn-news.png";
import lovinDubaiLogo from "@assets/logos/lovin-dubai.png";
import spiceFactoryLogo from "@assets/logos/spice-factory.png";
import englishTableLogo from "@assets/logos/english-table.png";
import beyondPhysioLogo from "@assets/logos/beyond-physio.png";
import casaRicaLogo from "@assets/logos/casa-rica.png";
import multiplierzLogo from "@assets/logos/multiplierz.png";
import northstonesLogo from "@assets/logos/northstones.png";
import midtownLogo from "@assets/logos/midtown.png";
import theGardensLogo from "@assets/logos/the-gardens.png";
import faridBpLogo from "@assets/logos/farid-bp.png";
import mediaGalleriaLogo from "@assets/logos/media-galleria.png";
import choyeKhanaLogo from "@assets/logos/chooye-khana.png";
import tausLogo from "@assets/logos/taus.png";
import drNadasLogo from "@assets/logos/dr-nadas.png";
import britishEmbassyLogo from "@assets/logos/british-embassy.png";
import dhaBuildingLogo from "@assets/logos/dha-building.png";

const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top)  / height - 0.5;
    setStyle({
      transform: `perspective(500px) rotateY(${x * 22}deg) rotateX(${-y * 22}deg) scale(1.08)`,
      boxShadow: `${-x * 14}px ${y * 14}px 28px rgba(255,100,0,0.3)`,
      transition: "transform 0.08s ease, box-shadow 0.08s ease",
      zIndex: 10,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(500px) rotateY(0deg) rotateX(0deg) scale(1)",
      boxShadow: "none",
      transition: "transform 0.4s ease, box-shadow 0.4s ease",
      zIndex: 1,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: "transform", ...style }}
      className="bg-white rounded-2xl aspect-square flex items-center justify-center p-5 cursor-default"
    >
      {children}
    </div>
  );
};

const OurClients = () => {
  const clients = [
    { name: "DHA", logo: dhaLogo },
    { name: "DHA Building Dreams", logo: dhaBuildingLogo },
    { name: "Farid Business Park", logo: faridBpLogo },
    { name: "Multiplierz Group", logo: multiplierzLogo },
    { name: "Media Galleria", logo: mediaGalleriaLogo },
    { name: "The Gardens", logo: theGardensLogo },
    { name: "Midtown", logo: midtownLogo },
    { name: "NorthStones", logo: northstonesLogo },
    { name: "Chooye Khana", logo: choyeKhanaLogo },
    { name: "Tau's", logo: tausLogo },
    { name: "Casa Rica", logo: casaRicaLogo },
    { name: "Gloria Jean's", logo: gloriaJeansLogo },
    { name: "Spice Factory", logo: spiceFactoryLogo },
    { name: "Subway", logo: subwayLogo },
    { name: "The English Table", logo: englishTableLogo },
    { name: "Dr. Nada's Clinic", logo: drNadasLogo },
    { name: "Beyond Physiotherapy", logo: beyondPhysioLogo },
    { name: "Gul Ahmed", logo: gulAhmedLogo },
    { name: "Mobilink", logo: jazzLogo },
    { name: "HUM Network", logo: humNetworkLogo },
    { name: "Serena Hotels", logo: serenaHotelsLogo },
    { name: "British Embassy The Hague", logo: britishEmbassyLogo },
    { name: "ARN News Centre", logo: arnNewsLogo },
    { name: "Lovin Dubai", logo: lovinDubaiLogo },
  ];

  return (
    <section id="clients" className="relative py-32 px-6 overflow-hidden" style={{ background: "#050505" }}>
      {/* Smoke / colour glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(25,100%,50%) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-primary uppercase tracking-[0.35em] text-xs mb-3">Some of our</p>
          <h2 className="font-display font-bold text-6xl md:text-8xl uppercase text-white/80">Clients</h2>
        </motion.div>

        {/* Grid of logo cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {clients.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
            >
              <TiltCard>
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-contain"
                />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { num: "01", title: "Marketing Strategy", desc: "Discovery, brand strategy, identity, audience segmentation and KPI tracking for measurable growth." },
    { num: "02", title: "Social Media Management", desc: "Full-service management across Instagram, Facebook, TikTok, Snapchat and more." },
    { num: "03", title: "Google Ads", desc: "Strategic planning, keyword research, ad copywriting and continuous data-driven optimisation." },
    { num: "04", title: "Audio-Visual Production", desc: "Professional photography, video production, audio editing and sound engineering." },
    { num: "05", title: "Podcast Production", desc: "End-to-end podcast setup, recording, editing and marketing distribution." },
    { num: "06", title: "Website Design", desc: "From wireframes to launch — beautiful, brand-aligned websites built for conversions." },
    { num: "07", title: "Event Management", desc: "Before, during and after — full event coverage including influencer outreach and PR packages." },
    { num: "08", title: "Influencer Marketing", desc: "Access to a curated network of regional influencers with verified reach and engagement." },
    { num: "09", title: "PR Management", desc: "Strategic PR campaigns, media coverage and brand reputation management." },
  ];

  return (
    <section id="services" className="py-32 px-6 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest mb-6">( 02 — Services )</p>
          <h2 className="font-display text-5xl md:text-7xl font-bold uppercase text-white">What We<br />Do</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="relative rounded-2xl p-8 group cursor-default overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              whileHover={{
                background: "rgba(255,100,0,0.06)",
                borderColor: "rgba(255,100,0,0.35)",
                boxShadow: "0 0 30px rgba(255,100,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono text-primary text-xs">{s.num}</span>
              </div>
              <h3 className="font-display text-xl text-white font-bold mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="font-sans text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SelectedWorks = () => {
  const works = [
    { title: "Neon Edge", client: "Aura Fashion", type: "Editorial / Campaign", img: work1, num: "01" },
    { title: "Titanium Core", client: "Chronos Swiss", type: "Product / Strategy", img: work2, num: "02" },
    { title: "Void Protocol", client: "Nexus Hardware", type: "Digital / Web", img: work3, num: "03" },
  ];

  return (
    <section id="work">
      {/* Section header */}
      <div className="bg-black px-10 md:px-16 pt-24 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( Selected Campaigns )</p>
          <h2 className="font-display text-6xl md:text-8xl font-black uppercase text-white leading-none">
            Our<br /><span style={{ color: "hsl(25,100%,50%)" }}>Work</span>
          </h2>
        </div>
        <button className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/40 hover:text-primary transition-colors self-start md:self-end pb-2">
          View All
          <span className="w-8 h-8 border border-white/15 rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>

      {/* Sticky scroll panels */}
      <div>
        {works.map((work, i) => (
          <div
            key={work.title}
            className="sticky"
            style={{ top: 0, zIndex: 10 + i }}
          >
            {/* Full-bleed panel */}
            <div className="relative w-full overflow-hidden bg-black" style={{ height: "100vh" }}>

              {/* Full-bleed image */}
              <motion.img
                src={work.img}
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ opacity: 0.65 }}
              />

              {/* Dark gradient overlays */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)" }} />
              <div className="absolute inset-y-0 left-0 w-1/2"
                style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end px-10 md:px-16 pb-16">
                <div className="flex items-end justify-between">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <p className="font-mono text-primary text-xs uppercase tracking-widest mb-3">{work.client}</p>
                    <h3 className="font-display font-black text-5xl md:text-7xl text-white uppercase leading-none mb-3">
                      {work.title}
                    </h3>
                    <p className="font-sans text-white/40 text-sm">{work.type}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="hidden md:flex flex-col items-end gap-4"
                  >
                    <span className="font-mono text-white/20 text-6xl font-bold leading-none">{work.num}</span>
                    <button className="px-6 py-3 rounded-full border border-white/25 text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                      Case Study
                    </button>
                  </motion.div>
                </div>

                {/* Orange accent line at bottom */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                  style={{ height: 2, background: "linear-gradient(90deg, hsl(25,100%,50%), transparent)", originX: 0 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spacer after sticky panels */}
      <div className="bg-black h-24" />
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
    <section className="py-32 px-6 bg-primary text-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#000000" 
              strokeWidth={8} 
              dot={false}
              isAnimationActive={true}
              animationDuration={3000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 divide-y md:divide-y-0 md:divide-x divide-black/20">
          {[
            { value: "3M+", label: "Total Reach Per Month" },
            { value: "1.8M", label: "Instagram Reach" },
            { value: "293K", label: "Monthly Impressions" },
            { value: "0", label: "Compromises" }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="pt-8 md:pt-0 md:px-8 flex flex-col justify-center"
            >
              <h4 className="font-display font-bold text-6xl md:text-7xl mb-2">{stat.value}</h4>
              <p className="font-mono uppercase text-xs font-bold tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Clients = () => {
  return (
    <section className="py-24 bg-black overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 mb-12">
         <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest">( 04 — Industries We Serve )</p>
      </div>
      <div className="relative flex overflow-x-hidden group w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-24 py-4">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Fashion & Retail</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Food & Beverages</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Jewelry</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Healthcare</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Sports</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">E-Commerce</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Entertainment</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Beauty & Cosmetics</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Events</span>
            </React.Fragment>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-24 py-4">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Fashion & Retail</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Food & Beverages</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Jewelry</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Healthcare</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Sports</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">E-Commerce</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Entertainment</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Beauty & Cosmetics</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Events</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  return (
    <section id="team" className="py-32 px-6 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest mb-6">( 05 — Leadership )</p>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white max-w-2xl">
              Led by exactness. No account managers, only practitioners.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
          {[
            { name: "Elias Vanguard", role: "Creative Director", prior: "Ex-LVMH" },
            { name: "Sarah Chen", role: "Head of Strategy", prior: "Ex-McKinsey" },
            { name: "Marcus Thorne", role: "Media Director", prior: "Ex-WPP" }
          ].map((member, i) => (
            <motion.div 
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="w-full aspect-[3/4] bg-white/5 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="font-mono text-white text-xs uppercase tracking-widest">{member.prior}</span>
                </div>
              </div>
              <h4 className="font-display text-2xl text-white mb-2">{member.name}</h4>
              <p className="font-mono text-primary text-xs uppercase tracking-widest">{member.role}</p>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
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
                  lines: ["sales@swissulife.com"],
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
                    className="w-full py-3 rounded-lg font-mono text-sm uppercase tracking-widest text-white font-bold transition-opacity hover:opacity-90"
                    style={{ background: "hsl(25,100%,50%)" }}
                  >
                    Send Message
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
        <OurClients />
        <Contact />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 border-t border-white/10 pt-12 mt-16">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <img src={swissLogo} alt="Swissulife Media" className="h-10 w-auto object-contain" style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} />
            </div>
            <p className="font-sans text-muted-foreground text-sm max-w-sm">
              Personalized, high-quality digital marketing services with a tailored approach. Cutting-edge strategies for effective results.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4 font-sans text-muted-foreground text-sm">
              <li><a href="tel:+971505725515" className="hover:text-primary transition-colors">+971 50 572 5515</a></li>
              <li><a href="mailto:sales@swissulife.com" className="hover:text-primary transition-colors">sales@swissulife.com</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-6">Socials</h4>
            <ul className="space-y-4 font-sans text-muted-foreground text-sm">
              <li><a href="https://instagram.com/swissulifemedia" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@swissulifemedia</a></li>
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
      <Navbar />
      
      <main>
        <Hero />
        <ServicesTicker />
        <Services />
        <Clients />
        <SelectedWorks />
        <Stats />
        <Team />
      </main>

      <Footer />
    </div>
  );
}
