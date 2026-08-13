import React, { useCallback, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "@/components/MobileNav";

/* ─── Types ────────────────────────────────────────────────────────────── */
interface AuditCategory {
  name: string;
  score: number;
  emoji: string;
  issues: string[];
  wins: string[];
}
interface AuditResult {
  score: number;
  summary: string;
  categories: AuditCategory[];
  topPriorities: string[];
  verdict: string;
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "hsl(25,100%,50%)";
  return "#ef4444";
}
function scoreLabel(score: number) {
  if (score >= 80) return "Great";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

/* ─── Score Ring ───────────────────────────────────────────────────────── */
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontSize: size * 0.28, fontWeight: 900, color, lineHeight: 1, fontFamily: "var(--font-display, sans-serif)" }}
        >{score}</motion.span>
        <span style={{ fontSize: size * 0.11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

/* ─── Category Card ────────────────────────────────────────────────────── */
function CategoryCard({ cat, index }: { cat: AuditCategory; index: number }) {
  const color = scoreColor(cat.score);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.07 }}
      className="rounded-2xl border border-white/10 p-5 flex flex-col gap-4"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "1.25rem" }}>{cat.emoji}</span>
          <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide">{cat.name}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              whileInView={{ width: `${cat.score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="font-mono text-xs font-bold" style={{ color, minWidth: "2.5rem", textAlign: "right" }}>{cat.score}</span>
        </div>
      </div>

      {cat.issues.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {cat.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-red-400">✗</span>
              <p className="text-white/60 text-xs leading-relaxed">{issue}</p>
            </div>
          ))}
        </div>
      )}
      {cat.wins.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {cat.wins.map((win, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-green-400">✓</span>
              <p className="text-white/60 text-xs leading-relaxed">{win}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Drop Zone ────────────────────────────────────────────────────────── */
function DropZone({ onImage }: { onImage: (dataUrl: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImage(result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onPaste = useCallback((e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith("image/"));
    if (item) processFile(item.getAsFile()!);
  }, []);

  // Global paste listener
  React.useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith("image/"));
      if (item) processFile(item.getAsFile()!);
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, []);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onPaste={onPaste}
      onClick={() => inputRef.current?.click()}
      className="relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden"
      style={{
        borderColor: dragging ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.15)",
        background: dragging ? "rgba(255,100,0,0.05)" : "rgba(255,255,255,0.02)",
        minHeight: preview ? "auto" : 240,
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />

      {preview ? (
        <div className="relative">
          <img src={preview} alt="Uploaded screenshot" className="w-full rounded-2xl" style={{ maxHeight: 400, objectFit: "contain", background: "#111" }} />
          <button
            onClick={(e) => { e.stopPropagation(); setPreview(null); onImage(""); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          >✕</button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,100,0,0.1)", border: "1px solid rgba(255,100,0,0.2)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="hsl(25,100%,50%)" strokeWidth="1.5" className="w-7 h-7">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg mb-1">Drop your screenshot here</p>
            <p className="text-white/40 text-sm">or click to browse · paste with Ctrl+V</p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/20">PNG · JPG · WEBP · GIF</p>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function AuditPage() {
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string>("");
  const resultRef = useRef<HTMLDivElement>(null);

  const runAudit = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const endpoint = import.meta.env.DEV
        ? `${base}/api/audit`                   // dev: proxied via api-server
        : "/.netlify/functions/audit";           // prod: Netlify Function
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Unknown error");
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <span className="font-display font-bold text-white tracking-widest uppercase text-lg cursor-pointer">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/"><span className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer">Home</span></Link>
          <Link href="/about"><span className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer">About</span></Link>
          <Link href="/contact"><span className="font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer">Contact</span></Link>
        </div>
        <MobileNav active="home" />
      </nav>

      <main className="pt-28 pb-24 px-6 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12 text-center">
          <p className="font-mono text-primary uppercase tracking-[0.35em] text-xs mb-4">Free Tool</p>
          <h1 className="font-display font-black text-5xl md:text-7xl uppercase text-white leading-none mb-5">
            AI Website<br /><span style={{ color: "hsl(25,100%,50%)" }}>Audit</span>
          </h1>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Screenshot any page. Our AI gives you a detailed breakdown of what's hurting your conversions — in seconds.
          </p>
        </motion.div>

        {/* Upload */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <DropZone onImage={setImage} />
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5">
          <button
            onClick={runAudit}
            disabled={!image || loading}
            className="w-full py-4 rounded-xl font-mono text-sm uppercase tracking-widest font-bold transition-all duration-200"
            style={{
              background: image && !loading ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.07)",
              color: image && !loading ? "#000" : "rgba(255,255,255,0.3)",
              cursor: image && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block">⟳</motion.span>
                Analysing your page…
              </span>
            ) : "Run AI Audit →"}
          </button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm text-center">
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10 flex flex-col gap-4">
              {[140, 100, 120, 100, 120, 100].map((h, i) => (
                <div key={i} className="rounded-2xl border border-white/5 animate-pulse" style={{ height: h, background: "rgba(255,255,255,0.03)" }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div ref={resultRef} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mt-10 flex flex-col gap-6">

              {/* Overall Score */}
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center gap-6">
                  <ScoreRing score={result.score} size={110} />
                  <div className="flex flex-col gap-2">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Overall Score</p>
                    <p className="font-display font-bold text-white text-xl leading-snug">"{result.verdict}"</p>
                    <p className="text-white/50 text-sm leading-relaxed">{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Top Priorities */}
              <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,100,0,0.04)", borderColor: "rgba(255,100,0,0.2)" }}>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-4" style={{ color: "hsl(25,100%,50%)" }}>🔥 Top 3 Priorities</p>
                <div className="flex flex-col gap-3">
                  {result.topPriorities.map((p, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "hsl(25,100%,50%)", color: "#000" }}>{i + 1}</span>
                      <p className="text-white/80 text-sm leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.categories.map((cat, i) => (
                  <CategoryCard key={cat.name} cat={cat} index={i} />
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, rgba(255,100,0,0.12) 0%, rgba(255,100,0,0.04) 100%)", border: "1px solid rgba(255,100,0,0.2)" }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: "hsl(25,100%,50%)" }}>Want us to fix all of this?</p>
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase text-white mb-3">We've Done It for 150+ Brands</h3>
                <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">Swissulife Media turns audits into action. Let's rebuild your digital presence from the ground up.</p>
                <a
                  href="https://calendly.com/swissulife"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm uppercase tracking-widest font-bold text-black transition-opacity hover:opacity-90"
                  style={{ background: "hsl(25,100%,50%)" }}
                >
                  Book a Free Strategy Call →
                </a>
              </motion.div>

              {/* Run another */}
              <button
                onClick={() => { setResult(null); setImage(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="text-center text-white/30 hover:text-white/60 transition-colors text-sm font-mono uppercase tracking-widest"
              >
                ↑ Audit another page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
