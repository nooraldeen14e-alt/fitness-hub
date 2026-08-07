import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { ScrambleIn } from "../components/ScrambleIn";
import { ScrambleText } from "../components/ScrambleText";
import { SynapseXLogo } from "../components/SynapseXLogo";
import { SquashHamburger } from "../components/SquashHamburger";

export default function Home() {
  const [entranceComplete, setEntranceComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const nextSeekRef = useRef<number | null>(null);
  const isSeekingRef = useRef<boolean>(false);
  const lastMouseX = useRef<number | null>(null);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (lastMouseX.current === null) {
      lastMouseX.current = e.clientX;
      return;
    }
    const delta = e.clientX - lastMouseX.current;
    lastMouseX.current = e.clientX;
    
    if (heroVideoRef.current && heroVideoRef.current.duration) {
      const sensitivity = 0.8;
      const deltaSeconds = (delta / window.innerWidth) * heroVideoRef.current.duration * sensitivity;
      let newTime = heroVideoRef.current.currentTime + deltaSeconds;
      newTime = Math.max(0, Math.min(newTime, heroVideoRef.current.duration));
      
      queueSeek(newTime);
    }
  };

  const queueSeek = (time: number) => {
    if (!isSeekingRef.current) {
      isSeekingRef.current = true;
      if (heroVideoRef.current) {
        heroVideoRef.current.currentTime = time;
      }
    } else {
      nextSeekRef.current = time;
    }
  };

  const handleHeroSeeked = () => {
    isSeekingRef.current = false;
    if (nextSeekRef.current !== null) {
      const time = nextSeekRef.current;
      nextSeekRef.current = null;
      queueSeek(time);
    }
  };

  // Section 2 3D Text scroll
  const section2Ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"]
  });
  
  const springProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const yScaleValue = useTransform(springProgress, [0, 1], [60, -120]);
  const opacityValue = useTransform(springProgress, [0.3, 0.5], [0, 1]);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [downloadHover, setDownloadHover] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);
  const [metricsHover, setMetricsHover] = useState(false);

  return (
    <div className="w-full bg-black text-white min-h-screen font-sans">
      <style>{`
        :root {
          --menu-closed: 40px;
          --menu-open: 100%;
        }
        @media (min-width: 640px) {
          :root {
            --menu-closed: 48px;
            --menu-open: 290px;
          }
        }
      `}</style>
      {/* NAVBAR */}
      <motion.nav 
        className="fixed top-0 left-0 w-full h-20 z-50 px-4 sm:px-6 md:px-8 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex gap-2 w-full max-w-[290px] sm:max-w-none">
          <motion.div 
            className="h-9 px-3.5 sm:h-12 sm:px-5 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] flex items-center gap-2 overflow-hidden whitespace-nowrap cursor-pointer origin-left"
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.22)" }}
            whileTap={{ scale: 0.98 }}
            animate={{ 
              width: menuOpen ? 0 : "auto", 
              opacity: menuOpen ? 0 : 1,
              paddingLeft: menuOpen ? 0 : undefined,
              paddingRight: menuOpen ? 0 : undefined,
            }}
            transition={{ stiffness: 350, damping: 28, type: "spring" }}
          >
            <SynapseXLogo className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="white" />
            <span className="text-[13px] sm:text-[16px] font-medium tracking-tight text-white">SynapseX</span>
          </motion.div>

          <motion.div 
            className="h-9 sm:h-12 bg-white/15 backdrop-blur-md rounded-[10px] sm:rounded-[14px] flex items-center overflow-hidden flex-1 sm:flex-none"
            animate={{ width: menuOpen ? "var(--menu-open)" : "var(--menu-closed)" }}
            transition={{ stiffness: 350, damping: 28, type: "spring" }}
            style={{ maxWidth: "var(--menu-open)" }}
          >
            <button 
              className={`flex-shrink-0 flex items-center justify-center transition-all ${menuOpen ? 'w-7 h-7 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 rounded-[8px] sm:rounded-[11px] ml-1 sm:ml-1.5' : 'w-10 h-9 sm:w-12 sm:h-12 rounded-[10px] sm:rounded-[14px]'}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <SquashHamburger isOpen={menuOpen} />
            </button>
            
            {menuOpen && (
              <motion.div 
                className="flex items-center gap-4 sm:gap-6 ml-4 sm:ml-6"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button 
                  className="text-white/85 hover:text-white text-[13px] sm:text-[16px] whitespace-nowrap"
                  onMouseEnter={() => setAboutHover(true)}
                  onMouseLeave={() => setAboutHover(false)}
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  <ScrambleText text="About" isHovered={aboutHover} />
                </button>
                <button 
                  className="text-white/85 hover:text-white text-[13px] sm:text-[16px] whitespace-nowrap"
                  onMouseEnter={() => setMetricsHover(true)}
                  onMouseLeave={() => setMetricsHover(false)}
                  onClick={() => window.scrollTo({ top: window.innerHeight * 2, behavior: 'smooth' })}
                >
                  <ScrambleText text="Metrics" isHovered={metricsHover} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.button 
          className="h-9 px-3.5 sm:h-12 sm:px-6 bg-white rounded-full flex items-center gap-1.5 sm:gap-2 text-black cursor-pointer ml-auto"
          whileHover={{ scale: 1.03, backgroundColor: "#e2e2e6" }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => setDownloadHover(false)}
        >
          <i className="bi bi-apple text-[14px] sm:text-[16px]" />
          <span className="text-[13px] sm:text-[16px] font-medium font-sans">
            <ScrambleText text="Download" isHovered={downloadHover} />
          </span>
        </motion.button>
      </motion.nav>

      {/* SECTION 1: HERO */}
      <section 
        className="relative flex flex-col h-screen h-[100dvh] overflow-hidden px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => { lastMouseX.current = null; }}
      >
        <video 
          ref={heroVideoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4"
          muted
          playsInline
          onSeeked={handleHeroSeeked}
        />
        
        <div 
          className="absolute inset-0 z-10 pointer-events-none opacity-5"
          style={{ background: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        
        <div 
          className="absolute z-10 pointer-events-none select-none user-select-none flex items-center justify-center inset-0"
          style={{ transform: "translateY(50px)" }}
        >
          <span 
            className="font-display uppercase opacity-10"
            style={{ 
              fontSize: "clamp(120px, 30vw, 521px)",
              letterSpacing: "-4px",
              background: "radial-gradient(circle, rgba(255,98,0,0) 0%, #FF6200 70%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            TRANSCENDENCE
          </span>
        </div>

        <div className="flex-1" />

        <motion.div 
          className="relative z-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,10vw,100px)] text-white">
              <span className="block"><ScrambleIn text="Brain" delay={200} triggered={entranceComplete} /></span>
              <span className="block"><ScrambleIn text="And Body" delay={500} triggered={entranceComplete} /></span>
            </h1>
            <motion.p 
              className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed"
              initial={{ y: 25, opacity: 0 }}
              animate={entranceComplete ? { y: 0, opacity: 1 } : { y: 25, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.610, 0.355, 1.000] }}
            >
              Built at the intersection of neuroscience and artificial intelligence. SynapseX continuously maps neural pathways, cognitive load, and physiological states into a single adaptive intelligence layer.
            </motion.p>
          </div>

          <h1 className="font-light leading-[0.95] tracking-[-0.03em] text-[clamp(40px,10vw,100px)] text-white text-left md:text-right">
            <span className="block"><ScrambleIn text="One" delay={700} triggered={entranceComplete} /></span>
            <span className="block"><ScrambleIn text="Network" delay={1000} triggered={entranceComplete} /></span>
          </h1>
        </motion.div>
      </section>

      {/* SECTION 2: CINEMATIC TEXT */}
      <section ref={section2Ref} className="relative h-screen h-[100dvh] overflow-hidden">
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        
        <div 
          className="absolute top-0 left-0 right-0 h-[180px] z-10"
          style={{ background: "linear-gradient(to bottom, #010103, transparent)" }}
        />

        <div className="absolute inset-0 flex items-center justify-center z-20" style={{ perspective: "400px" }}>
          <div className="max-w-5xl mx-auto px-6 sm:px-12">
            <motion.p 
              className="font-sans font-normal text-[22px] sm:text-[30px] md:text-[36px] lg:text-[42px] text-white leading-[1.35] tracking-[-0.02em] select-none text-center"
              style={{
                rotateX: "24deg",
                translateZ: "15px",
                y: yScaleValue,
                opacity: opacityValue
              }}
            >
              A neural-AI interface built on the architecture of the human nervous system. SynapseX translates synaptic activity into computational intelligence. Every signal becomes measurable, structured, and visible. It continuously reconstructs internal state as a dynamic neural map. Biological noise is filtered into actionable cognitive patterns.
            </motion.p>
          </div>
        </div>
      </section>

      {/* SECTION 3: METRICS */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-32 px-6">
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        
        <div className="relative z-10 max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center"
          >
            Performance Metrics
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center md:text-left">
            {[
              { value: "2.4ms", label: "Synaptic Latency" },
              { value: "99.7%", label: "Signal Accuracy" },
              { value: "140B", label: "Neural Parameters" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="flex flex-col items-center md:items-start"
              >
                <div className="text-white text-[clamp(48px,10vw,96px)] font-light tracking-[-0.04em] leading-none">
                  {metric.value}
                </div>
                <div className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TECHNOLOGY */}
      <section className="relative flex flex-col h-screen h-[100dvh] overflow-hidden px-8 sm:px-12 md:px-16 py-12 sm:py-16">
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <motion.h2 
            className="text-white font-light text-[clamp(36px,8vw,72px)] leading-[0.95] tracking-[-0.03em]"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
          >
            Adaptive /<br/>Intelligence
          </motion.h2>
          
          <motion.p 
            className="text-white/50 text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2 }}
          >
            The system learns your neural baseline within 72 hours. From there, every cognitive state is mapped, predicted, and optimized in real time.
          </motion.p>
        </div>

        <div className="flex-1" />

        <motion.div 
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          {[
            { title: "Cortical Mapping", desc: "Real-time spatial reconstruction of active neural regions." },
            { title: "Signal Isolation", desc: "Separates cognitive intent from biological noise." },
            { title: "State Prediction", desc: "Anticipates cognitive transitions before they occur." },
            { title: "Loop Feedback", desc: "Closed-loop adjustment based on outcome correlation." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 + (i * 0.1) }}
            >
              <h3 className="text-white text-[14px] sm:text-[16px] font-normal mb-2">{item.title}</h3>
              <p className="text-white/40 text-[12px] sm:text-[14px] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 5: ARCHITECTURE */}
      <section className="relative min-h-screen bg-black flex items-center justify-center px-6 py-32">
        <div className="max-w-3xl w-full text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0 }}
          >
            <div className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-8">
              Architecture
            </div>
            <h2 className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.15] tracking-[-0.02em] mb-10">
              Three layers. Zero friction.
            </h2>
            <p className="text-white/45 text-[15px] sm:text-[17px] leading-relaxed max-w-xl mx-auto">
              Sensor layer captures raw bioelectric signals. Processing layer isolates intent. Interface layer delivers structured output to any connected system.
            </p>
          </motion.div>

          <motion.div 
            className="mt-20 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            {[
              { layer: "Layer 1", name: "Capture" },
              { layer: "Layer 2", name: "Process" },
              { layer: "Layer 3", name: "Interface" },
            ].map((layer, i) => (
              <div key={i} className="w-full max-w-md h-[72px] border border-white/10 rounded-lg flex items-center justify-between px-6">
                <span className="text-white/30 text-[12px] tracking-[0.15em] uppercase">{layer.layer}</span>
                <span className="text-white text-[16px] sm:text-[18px] font-light">{layer.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        <div className="h-[300px] md:h-auto md:w-1/2 flex-shrink-0">
          <video 
            className="w-full h-full object-cover"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className="flex flex-col justify-between p-10 sm:p-16 md:w-1/2 bg-[#050505]">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <SynapseXLogo className="w-[18px] h-[18px]" fill="rgba(255,255,255,0.7)" />
              <span className="text-[15px] font-medium text-white/70 tracking-tight">SynapseX</span>
            </div>
            <p className="text-white/40 text-[14px] sm:text-[15px] leading-relaxed max-w-sm">
              The next evolution of human-machine interaction. Built for those who refuse to be limited by biology alone.
            </p>
          </div>
          <div className="text-white/25 text-[12px] mt-12">
            © 2026 SynapseX Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
