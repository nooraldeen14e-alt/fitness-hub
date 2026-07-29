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
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black flex items-end justify-center pb-24 px-6">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <img src={heroBg} alt="Abstract Structure" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </motion.div>
      
      <div className="z-10 w-full max-w-7xl relative flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="h-[1px] w-12 bg-primary"></div>
          <p className="font-mono text-primary text-sm uppercase tracking-[0.2em]">The Premium Media Agency</p>
        </motion.div>
        
        <div className="overflow-hidden">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[12vw] md:text-[140px] font-bold leading-[0.85] text-white uppercase"
          >
            We Move <br />
            <span className="text-stroke-primary">Culture.</span>
          </motion.h1>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-6 hidden md:flex items-center gap-4 text-white rotate-[-90deg] origin-bottom-left"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
        <div className="w-12 h-[1px] bg-white/20 relative overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-primary w-1/2"
          />
        </div>
      </motion.div>
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
