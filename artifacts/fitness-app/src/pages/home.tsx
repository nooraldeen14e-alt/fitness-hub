import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import heroBg from "@assets/hero-bg.jpg";
import work1 from "@assets/work-1.jpg";
import work2 from "@assets/work-2.jpg";
import work3 from "@assets/work-3.jpg";
import swissLogo from "@assets/66b7e0a1-9291-41da-82a2-6d89f100f8a3_1785308430142.jpg";

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
        <a href="#hero"     className={linkClass("home")}>Home</a>
        <a href="#services" className={linkClass("offer") + " flex items-center gap-1"}>
          We Offer
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l4 4 4-4"/></svg>
        </a>
        <a href="#agency"   className={linkClass("about")}>About Us</a>
        <a href="#contact"  className={linkClass("contact")}>Contact Us</a>
      </div>

      {/* CTA */}
      <a
        href="#"
        className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ background: "hsl(25,100%,50%)" }}
      >
        Schedule a Meeting
      </a>
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative w-full overflow-hidden bg-black flex flex-col justify-center px-6 md:px-16 pt-28 pb-20">
      {/* Pure black background — needed for mix-blend-mode: screen on the logo */}
      <div className="absolute inset-0 z-0 bg-black" />

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col">

        {/* ── Row 1: tagline centered ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-mono font-normal text-white uppercase mb-4"
          style={{ fontSize: "0.7rem", letterSpacing: "0.45em" }}
        >
          Dare to be different?
        </motion.p>

        {/* ── Row 2: MEET SWISSULIFE centered ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <h1 className="font-display font-black uppercase leading-[0.9]">
            <span className="block text-white/25 text-2xl md:text-3xl tracking-[0.5em] mb-1">Meet</span>
            <span className="block text-[11vw] md:text-[90px] lg:text-[110px] tracking-tight">
              <span style={{ color: "hsl(25,100%,50%)", textShadow: "0 0 60px hsl(25 100% 50% / 0.35), 0 0 120px hsl(25 100% 50% / 0.15)" }}>Swiss</span>
              <span style={{ color: "#ffffff" }}>u</span>
              <span style={{ color: "hsl(25,100%,50%)", textShadow: "0 0 60px hsl(25 100% 50% / 0.35), 0 0 120px hsl(25 100% 50% / 0.15)" }}>life</span>
            </span>
          </h1>
        </motion.div>

        {/* ── Row 3: centered content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="font-display font-bold leading-tight mb-6"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
            <span className="text-white">A 360° Result-Oriented</span>
            <br />
            <span className="inline-flex flex-wrap justify-center gap-x-[0.3em]">
              {["Digital", "Marketing", "Agency"].map((word, i) => (
                <motion.span
                  key={word}
                  className="text-white/35 inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h2>

          <p className="text-white/45 text-sm leading-relaxed max-w-lg mb-1">
            At Swissulife Media, we promise results.
          </p>
          <p className="text-white/45 text-sm leading-relaxed max-w-lg mb-10">
            Our exceptional success rate comes from tested and proven strategies,
            having worked with a diverse portfolio of niches.
          </p>

          <a
            href="#agency"
            className="group inline-flex items-center gap-0 px-8 py-3 rounded-full border border-white/80 text-white font-sans text-sm font-medium hover:bg-primary hover:border-primary hover:text-black transition-all duration-300"
          >
            More About Us
            <span className="overflow-hidden w-0 group-hover:w-5 transition-all duration-300 ease-out flex items-center">
              <ArrowRight size={15} className="ml-1 shrink-0" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Manifesto = () => {
  return (
    <section id="agency" className="relative py-32 md:py-48 px-6 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest">( 01 — Mission )</p>
        </div>
        <div className="md:col-span-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl font-medium leading-tight text-white mb-12"
          >
            We deliver innovative and impactful marketing solutions that empower our clients to achieve their business goals and <span className="text-primary italic">inspire their audiences</span>.
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-24">
            {[
              { num: "01", title: "Discovery", desc: "We get to know your business, industry, audience and conduct in-depth research & development." },
              { num: "02", title: "Strategy", desc: "Development of brand strategy, including brand promise and tailored concept direction." },
              { num: "03", title: "Identity", desc: "Our creatives define your unique visual elements — logo, color palette, fonts and branded templates." },
              { num: "04", title: "Impact", desc: "Tracking performance and progress using measurable KPIs, optimising for real revenue growth." }
            ].map((item, i) => (
              <motion.div 
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border-t border-white/10 pt-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-2xl text-white">{item.title}</h3>
                  <span className="font-mono text-primary text-xs">{item.num}</span>
                </div>
                <p className="font-sans text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
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
              className="bg-white rounded-2xl aspect-square flex items-center justify-center p-5 hover:scale-105 transition-transform duration-300 cursor-default group"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="w-full h-full object-contain"
              />
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
              className="border border-white/10 p-8 group hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-300 cursor-default"
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
    { title: "Neon Edge", client: "Aura Fashion", type: "Editorial / Campaign", img: work1 },
    { title: "Titanium Core", client: "Chronos Swiss", type: "Product / Strategy", img: work2 },
    { title: "Void Protocol", client: "Nexus Hardware", type: "Digital / Web", img: work3 }
  ];

  return (
    <section id="work" className="py-32 bg-secondary">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest mb-6">( 02 — Work )</p>
            <h2 className="font-display text-6xl md:text-8xl font-bold uppercase text-white">Selected<br />Campaigns</h2>
          </div>
          <button className="group flex items-center gap-4 font-mono text-sm uppercase tracking-widest text-white hover:text-primary transition-colors pb-4">
            View All Archive
            <span className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-32">
          {works.map((work, i) => (
            <motion.div 
              key={work.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 md:gap-24 items-center`}
            >
              <div className="w-full md:w-3/5 overflow-hidden relative group cursor-pointer bg-black aspect-[4/3] md:aspect-[16/10]">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  src={work.img} 
                  alt={work.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="w-full md:w-2/5 flex flex-col items-start">
                <p className="font-mono text-primary text-xs uppercase tracking-widest mb-4">{work.client}</p>
                <h3 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">{work.title}</h3>
                <p className="font-sans text-muted-foreground mb-8">{work.type}</p>
                <button className="px-6 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  Case Study
                </button>
              </div>
            </motion.div>
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
        <div className="flex flex-col items-center text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-primary rounded-full mb-8 flex items-center justify-center text-black"
          >
            <ArrowRight size={24} className="rotate-45" />
          </motion.div>
          <h2 className="font-display text-5xl md:text-8xl font-bold text-white mb-12 uppercase leading-none">
            Ready to <br />
            Dominate?
          </h2>
          <button className="px-10 py-5 bg-white text-black font-mono text-sm uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_hsl(var(--primary))] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            Contact Us
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 border-t border-white/10 pt-12">
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
        <Manifesto />
        <Services />
        <OurClients />
        <Clients />
        <SelectedWorks />
        <Stats />
        <Team />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
