import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import heroBg from "@assets/hero-bg.jpg";
import work1 from "@assets/work-1.jpg";
import work2 from "@assets/work-2.jpg";
import work3 from "@assets/work-3.jpg";

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
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-6 mix-blend-difference"
    >
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 bg-primary"></div>
        <span className="font-display font-bold text-xl uppercase tracking-widest text-white">Swissulife</span>
      </div>
      <div className="flex items-center gap-8 text-white">
        <a href="#work" className="hidden md:block font-mono text-xs uppercase tracking-widest hover:text-primary transition-colors">Work</a>
        <a href="#agency" className="hidden md:block font-mono text-xs uppercase tracking-widest hover:text-primary transition-colors">Agency</a>
        <a href="#team" className="hidden md:block font-mono text-xs uppercase tracking-widest hover:text-primary transition-colors">Team</a>
        <button className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors">
          Let's Talk
        </button>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black flex flex-col justify-center px-6 md:px-16 pt-28 pb-20">
      {/* Subtle dark background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        {/* Faint glow top-center like reference */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, hsl(25,100%,50%) 0%, transparent 70%)" }} />
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col">

        {/* ── Row 1: tagline centered ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-mono text-white/40 uppercase tracking-[0.35em] text-xs mb-3"
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
            <span
              className="block text-[11vw] md:text-[90px] lg:text-[110px] tracking-tight"
              style={{
                color: "hsl(25,100%,50%)",
                textShadow: "0 0 60px hsl(25 100% 50% / 0.35), 0 0 120px hsl(25 100% 50% / 0.15)",
              }}
            >
              Swissulife
            </span>
          </h1>
        </motion.div>

        {/* ── Row 3: two-column — left text, right logo ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)" }}>
              <span className="text-white">A 360° Result-Oriented</span>
              <br />
              <span className="text-white/35">Digital Marketing Agency</span>
            </h2>

            <p className="text-white/45 text-sm leading-relaxed mb-2">
              At Swissulife Media, we promise results.
            </p>
            <p className="text-white/45 text-sm leading-relaxed mb-10">
              Our exceptional success rate comes from tested and proven strategies,
              having worked with a diverse portfolio of niches.
            </p>

            <a
              href="#agency"
              className="inline-block px-8 py-3 rounded-full border border-white/80 text-white font-sans text-sm font-medium hover:bg-primary hover:border-primary hover:text-black transition-all duration-300"
            >
              More About Us
            </a>
          </motion.div>

          {/* Right column — logo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-5"
          >
            <svg
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-44 h-44 md:w-56 md:h-56"
              style={{ filter: "drop-shadow(0 0 30px hsl(25 100% 50% / 0.5))" }}
            >
              {/* Outer hexagon ring */}
              <polygon
                points="120,8 220,62 220,178 120,232 20,178 20,62"
                stroke="hsl(25,100%,50%)"
                strokeWidth="2"
                fill="none"
                opacity="0.25"
              />
              {/* Bold S letterform built from paths */}
              <path
                d="M155 75 C155 75 90 75 80 75 C65 75 60 88 60 98 C60 115 75 122 95 128 L145 142 C165 148 175 158 175 172 C175 188 163 198 145 198 C130 198 85 198 85 198"
                stroke="hsl(25,100%,50%)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              {/* Inner glow dot */}
              <circle cx="120" cy="120" r="4" fill="hsl(25,100%,50%)" />
            </svg>

            <div className="text-center">
              <p className="font-mono text-white/70 uppercase tracking-[0.4em] text-xs">Swissulife Media</p>
              <p className="font-mono uppercase tracking-[0.3em] text-[10px] mt-1" style={{ color: "hsl(25,100%,50%)" }}>
                Digital Marketing
              </p>
            </div>
          </motion.div>

        </div>
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
            In a landscape of noise, we are the <span className="text-primary italic">signal</span>. Swiss precision merged with global ambition. We build campaigns that force the world to pay attention.
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-24">
            {[
              { num: "01", title: "Strategy", desc: "No guesswork. Data-backed positioning for market leaders." },
              { num: "02", title: "Creative", desc: "Award-winning art direction that breaks industry molds." },
              { num: "03", title: "Distribution", desc: "Global media buying with surgical targeting." },
              { num: "04", title: "Impact", desc: "Measurable growth. We optimize for revenue, not just reach." }
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
            { value: "3.2B", label: "Global Impressions" },
            { value: "$450M", label: "Client Revenue Generated" },
            { value: "14", label: "Industry Awards" },
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
         <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest">( 03 — Partners )</p>
      </div>
      <div className="relative flex overflow-x-hidden group w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-24 py-4">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">LVMH</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Porsche</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Balenciaga</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Acme Corp</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Rolex</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Polestar</span>
            </React.Fragment>
          ))}
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-24 py-4">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">LVMH</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Porsche</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Balenciaga</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Acme Corp</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Rolex</span>
              <span className="font-display text-4xl md:text-5xl font-bold text-white/30 uppercase">Polestar</span>
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
            <p className="font-mono text-muted-foreground uppercase text-xs tracking-widest mb-6">( 04 — Leadership )</p>
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

const Footer = () => {
  return (
    <footer className="bg-black pt-32 pb-12 px-6">
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
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 bg-primary"></div>
              <span className="font-display font-bold text-xl uppercase tracking-widest text-white">Swissulife</span>
            </div>
            <p className="font-sans text-muted-foreground text-sm max-w-sm">
              The premium media agency for brands that refuse to blend in. Precision execution at global scale.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-6">Offices</h4>
            <ul className="space-y-4 font-sans text-muted-foreground text-sm">
              <li>Zurich, CH</li>
              <li>New York, US</li>
              <li>Tokyo, JP</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-6">Socials</h4>
            <ul className="space-y-4 font-sans text-muted-foreground text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Twitter (X)</a></li>
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
        <Clients />
        <SelectedWorks />
        <Stats />
        <Team />
      </main>

      <Footer />
    </div>
  );
}
