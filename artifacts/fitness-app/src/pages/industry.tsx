import React from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { INDUSTRIES } from "@/data/industries";

// ─── Video placeholder card ───────────────────────────────────────────────────
const VideoPlaceholder = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center group"
  >
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center mb-3 border border-white/20 group-hover:border-primary/50 transition-colors"
      style={{ background: "rgba(255,98,0,0.08)" }}
    >
      <Play size={22} className="text-white/40 group-hover:text-primary transition-colors ml-1" />
    </div>
    <p className="font-mono text-[11px] uppercase tracking-widest text-white/25">Coming Soon</p>
  </motion.div>
);

// ─── Embed card ───────────────────────────────────────────────────────────────
const VideoEmbed = ({ url, index }: { url: string; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    className="relative aspect-video rounded-2xl overflow-hidden border border-white/10"
  >
    <iframe
      src={url}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IndustryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const industry = INDUSTRIES[slug];

  // Unknown slug → go home
  React.useEffect(() => {
    if (!industry) window.location.replace("/");
  }, [industry]);

  if (!industry) return null;

  const paragraphs = industry.description.split("\n\n");
  const videoCount = Math.max(industry.videos.length, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <SiteNav active="industries" />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-6 md:px-16 lg:px-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 70% 50%, hsl(25,100%,50%,0.07) 0%, transparent 70%)" }}
        />

        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest">
            <ArrowLeft size={14} />
            All Industries
          </Link>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] mb-4" style={{ color: "hsl(25,100%,50%)" }}>
          Industry
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6 max-w-4xl">
          {industry.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/50 font-light max-w-2xl leading-relaxed mb-4">
          {industry.tagline}
        </motion.p>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-[3px] origin-left mt-2" style={{ background: "hsl(25,100%,50%)" }} />
      </section>

      {/* ── Description (remaining paragraphs) ── */}
      <section className="px-6 md:px-16 lg:px-24 pb-24 max-w-4xl">
        <div className="space-y-6">
          {paragraphs.slice(1).map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-base md:text-lg text-white/55 leading-relaxed"
            >
              {para}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ── Proof of Work ── */}
      <section className="px-6 md:px-16 lg:px-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-2" style={{ color: "hsl(25,100%,50%)" }}>
            Proof of Work
          </p>
          <h2 className="font-display font-black text-3xl md:text-4xl">Our Work in {industry.name}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industry.videos.length > 0
            ? industry.videos.map((url, i) => <VideoEmbed key={i} url={url} index={i} />)
            : Array.from({ length: videoCount }).map((_, i) => <VideoPlaceholder key={i} index={i} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-16 lg:px-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ background: "rgba(255,98,0,0.05)" }}
        >
          <div>
            <h3 className="font-display font-black text-3xl md:text-4xl mb-3">
              Ready to grow your {industry.name.toLowerCase()} brand?
            </h3>
            <p className="text-white/50 text-lg max-w-lg">
              Let's build a campaign that moves your audience — and your numbers.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-base hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}
          >
            Start a Project
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 md:px-16 lg:px-24 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
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
