import React from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import SiteNav from "@/components/SiteNav";
import { INDUSTRIES, type VideoEntry } from "@/data/industries";

const videoUrl    = (v: VideoEntry) => typeof v === "string" ? v : v.url;
const videoPoster = (v: VideoEntry) => typeof v === "string" ? undefined : v.poster;

// ─── Lightbox modal ───────────────────────────────────────────────────────────
const Lightbox = ({ url, onClose }: { url: string; onClose: () => void }) => {
  const isLocal = url.startsWith("/") || url.endsWith(".mp4");
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0, y: 32 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.88, opacity: 0, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background: "#000", boxShadow: "0 40px 120px rgba(0,0,0,0.8)", maxHeight: "88vh", maxWidth: "min(92vw, 900px)", width: "100%" }}
        onClick={e => e.stopPropagation()}
      >
        {isLocal ? (
          <video
            src={url}
            className="block w-full"
            style={{ maxHeight: "88vh", objectFit: "contain", background: "#000" }}
            autoPlay controls playsInline
          />
        ) : (
          <div style={{ aspectRatio: "16/9" }}>
            <iframe
              src={url + "?autoplay=1"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base z-10"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
        >✕</button>
      </motion.div>
    </motion.div>
  );
};

// ─── Portrait video card ──────────────────────────────────────────────────────
const VideoCard = ({ entry, index, onOpen }: { entry: VideoEntry; index: number; onOpen: () => void }) => {
  const url    = videoUrl(entry);
  const poster = videoPoster(entry);
  const isLocal = url.startsWith("/") || url.endsWith(".mp4");
  const [ratio, setRatio] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isLocal) { setRatio("16/9"); return; }
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = url;
    v.onloadedmetadata = () => setRatio(`${v.videoWidth}/${v.videoHeight}`);
  }, [url, isLocal]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="group relative w-full rounded-2xl overflow-hidden border border-white/10 cursor-pointer focus:outline-none"
      style={{ aspectRatio: ratio ?? "9/16", background: "#111" }}
    >
      {/* poster image takes priority for thumbnail */}
      {poster ? (
        <img src={poster} className="absolute inset-0 w-full h-full object-cover" alt="thumbnail" />
      ) : isLocal ? (
        <video src={url} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" style={{ pointerEvents: "none" }} />
      ) : (
        <img src={`https://img.youtube.com/vi/${url.split("/embed/")[1]?.split("?")[0]}/hqdefault.jpg`} className="absolute inset-0 w-full h-full object-cover" alt="thumbnail" />
      )}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/50 group-hover:border-white group-hover:scale-110 transition-all duration-200" style={{ backdropFilter: "blur(6px)", background: "rgba(255,98,0,0.22)" }}>
          <Play size={18} className="text-white ml-0.5" fill="white" />
        </div>
      </div>
    </motion.button>
  );
};

// ─── Placeholder portrait card ────────────────────────────────────────────────
const VideoPlaceholder = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] flex flex-col items-center justify-center"
    style={{ aspectRatio: "9/16" }}
  >
    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 border border-white/15" style={{ background: "rgba(255,98,0,0.07)" }}>
      <Play size={18} className="text-white/30 ml-0.5" />
    </div>
    <p className="font-mono text-[10px] uppercase tracking-widest text-white/20">Coming Soon</p>
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

  const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null);
  const paragraphs = industry.description.split("\n\n");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <AnimatePresence>
        {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
      </AnimatePresence>
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

        {/* Portrait grid — 4 cols desktop, 2 mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {industry.videos.length > 0
            ? industry.videos.map((entry, i) => (
                <VideoCard key={i} entry={entry} index={i} onOpen={() => setLightboxUrl(videoUrl(entry))} />
              ))
            : Array.from({ length: 4 }).map((_, i) => <VideoPlaceholder key={i} index={i} />)
          }
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
