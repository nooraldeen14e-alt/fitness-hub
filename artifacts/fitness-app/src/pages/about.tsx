import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import swissLogo from "@assets/66b7e0a1-9291-41da-82a2-6d89f100f8a3_1785308430142.jpg";

import ScheduleModal from "@/components/ScheduleModal";

const AboutNavbar = () => {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <img src={swissLogo} alt="Swissulife Media" className="h-9 w-auto object-contain cursor-pointer" style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors duration-200">Home</Link>

          {/* We Offer dropdown */}
          <div className="relative group">
            <button className="font-sans text-sm font-medium text-primary hover:text-white transition-colors duration-200 flex items-center gap-1">
              We Offer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
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
                  <Link key={s} href="/#services" className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <span className="font-sans text-base font-medium text-white cursor-default">About Us</span>
          <Link href="/#contact" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors duration-200">Contact Us</Link>
        </div>
        <button
          onClick={() => setScheduleOpen(true)}
          className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "hsl(25,100%,50%)" }}
        >
          Schedule a Meeting
        </button>
      </nav>
    </>
  );
};

const values = [
  { num: "01", title: "Transparency", desc: "We keep clients in the loop at every stage — full visibility into strategy, spend, and results." },
  { num: "02", title: "Result-Driven", desc: "Every campaign is built around measurable KPIs. We don't celebrate activity — we celebrate growth." },
  { num: "03", title: "Creativity", desc: "Bold ideas backed by data. We combine artistic vision with analytical thinking to make brands unforgettable." },
  { num: "04", title: "Partnership", desc: "We treat every client's business as our own — your goals are our goals, your wins are our wins." },
];

const process = [
  { num: "01", title: "Discovery", desc: "Deep-dive into your brand, industry, audience and competitors. We don't guess — we research." },
  { num: "02", title: "Strategy", desc: "A tailored roadmap built from insights: messaging, channels, budget, and KPIs that actually matter." },
  { num: "03", title: "Identity", desc: "Crafting the visual and verbal language of your brand — logo, palette, tone and all touchpoints." },
  { num: "04", title: "Execution", desc: "Content creation, campaign launch, community management and influencer activation — all in-house." },
  { num: "05", title: "Impact", desc: "Continuous tracking and optimisation. Monthly reports with honest numbers and clear next moves." },
];

const stats = [
  { value: "3M+",  label: "Monthly Reach" },
  { value: "1.8M", label: "Instagram Reach" },
  { value: "293K", label: "Monthly Impressions" },
  { value: "0",    label: "Compromises" },
];

export default function About() {
  return (
    <div className="bg-black min-h-screen text-white">
      <AboutNavbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[600px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(ellipse, hsl(25,100%,50%) 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="font-mono text-primary uppercase text-xs tracking-[0.35em] mb-6">
            Who We Are
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase text-6xl md:text-9xl leading-none mb-10">
            About <br />
            <span style={{ color: "hsl(25,100%,50%)" }}>Swissulife</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans text-white/60 text-lg max-w-2xl leading-relaxed">
            Swissulife Media is a 360° result-oriented digital marketing agency based in the UAE,
            helping brands across fashion, food, healthcare, entertainment and more dominate their markets.
          </motion.p>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest">( Mission )</p>
          </div>
          <div className="md:col-span-8">
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8 }}
              className="font-display text-4xl md:text-5xl font-medium leading-tight text-white">
              We deliver innovative and impactful marketing solutions that empower our clients to achieve their business goals and{" "}
              <span style={{ color: "hsl(25,100%,50%)" }} className="italic">inspire their audiences</span>.
            </motion.h2>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 border-t border-white/10" style={{ background: "hsl(25,100%,50%)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="text-black">
              <p className="font-display font-black text-5xl md:text-6xl">{s.value}</p>
              <p className="font-mono text-xs uppercase tracking-widest mt-2 opacity-70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( Our Values )</p>
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase">What We <br /><span style={{ color: "hsl(25,100%,50%)" }}>Stand For</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={v.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-t-2 pt-6" style={{ borderColor: "hsl(25,100%,50%)" }}>
                <span className="font-mono text-xs" style={{ color: "hsl(25,100%,50%)" }}>{v.num}</span>
                <h3 className="font-display text-2xl text-white mt-2 mb-3">{v.title}</h3>
                <p className="font-sans text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="py-24 px-6 border-t border-white/10" style={{ background: "#050505" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( How We Work )</p>
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase">Our <br /><span style={{ color: "hsl(25,100%,50%)" }}>Process</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {process.map((p, i) => (
              <motion.div key={p.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-colors">
                <span className="font-mono text-xs" style={{ color: "hsl(25,100%,50%)" }}>{p.num}</span>
                <h3 className="font-display text-xl text-white mt-3 mb-3">{p.title}</h3>
                <p className="font-sans text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="font-mono text-white/30 uppercase text-xs tracking-widest mb-4">( Industries We Serve )</p>
            <h2 className="font-display font-black text-5xl md:text-6xl uppercase">Our <span style={{ color: "hsl(25,100%,50%)" }}>Niches</span></h2>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            {["Fashion & Retail","Food & Beverages","Jewelry","Healthcare","Sports","E-Commerce","Entertainment","Beauty & Cosmetics","Events","Real Estate","Technology","Media"].map((industry, i) => (
              <motion.span key={industry} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-5 py-2.5 rounded-full border text-sm font-mono uppercase tracking-wide text-white/70 hover:border-primary hover:text-primary transition-colors cursor-default"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}>
                {industry}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-white/10 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="font-display font-black text-5xl md:text-7xl uppercase leading-none mb-8">
            Ready to <br /><span style={{ color: "hsl(25,100%,50%)" }}>Dominate?</span>
          </h2>
          <Link href="/#contact"
            className="inline-flex items-center px-10 py-4 rounded-full text-white font-semibold text-base hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}>
            Schedule a Meeting
          </Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={swissLogo} alt="Swissulife Media" className="h-8 w-auto object-contain" style={{ mixBlendMode: "screen", filter: "contrast(4) brightness(1.2)" }} />
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">© {new Date().getFullYear()} Swissulife Media. All rights reserved.</p>
          <div className="flex gap-6 font-mono text-xs text-white/40 uppercase tracking-wide">
            <a href="tel:+971505725515" className="hover:text-primary transition-colors">+971 50 572 5515</a>
            <a href="mailto:sales@swissulife.com" className="hover:text-primary transition-colors">sales@swissulife.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
