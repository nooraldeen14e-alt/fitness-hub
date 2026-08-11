import React from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "@/components/MobileNav";

// ─── Unique hero visuals ──────────────────────────────────────────────────────

const FUNNEL_STAGES = ["AWARENESS", "ENGAGEMENT", "CONSIDERATION", "CONVERSION", "RETENTION"];

const FunnelVisual = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animRef   = React.useRef<number>(0);
  const [hovered, setHovered] = React.useState<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 320, H = 480;
    canvas.width  = W;
    canvas.height = H;

    const PAD_TOP = 24, PAD_BOT = 36;
    const TOP_W = 260, BOT_W = 52;
    const FUNNEL_H = H - PAD_TOP - PAD_BOT;
    const STAGE_H  = FUNNEL_H / 5;

    const funnelWidthAt = (y: number) => {
      const t = Math.max(0, Math.min(1, (y - PAD_TOP) / FUNNEL_H));
      return TOP_W + (BOT_W - TOP_W) * t;
    };

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; alpha: number;
      trail: { x: number; y: number }[];
    };

    const particles: Particle[] = [];
    const stageGlow = [0, 0, 0, 0, 0];
    let frame = 0;

    const spawn = () => {
      const fw = funnelWidthAt(PAD_TOP + 4);
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * fw * 0.75,
        y: PAD_TOP + 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.9 + Math.random() * 0.7,
        r: 1.4 + Math.random() * 1.6,
        alpha: 0.75 + Math.random() * 0.25,
        trail: [],
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── Draw each stage trapezoid ──
      for (let s = 0; s < 5; s++) {
        const y0 = PAD_TOP + s * STAGE_H;
        const y1 = y0 + STAGE_H;
        const w0 = funnelWidthAt(y0);
        const w1 = funnelWidthAt(y1);
        const xl0 = (W - w0) / 2, xr0 = (W + w0) / 2;
        const xl1 = (W - w1) / 2, xr1 = (W + w1) / 2;

        const g = stageGlow[s];

        // fill
        ctx.beginPath();
        ctx.moveTo(xl0, y0); ctx.lineTo(xr0, y0);
        ctx.lineTo(xr1, y1); ctx.lineTo(xl1, y1);
        ctx.closePath();
        ctx.fillStyle = `hsla(25,100%,50%,${0.03 + g * 0.13})`;
        ctx.fill();

        // edge lines
        ctx.strokeStyle = `hsla(25,100%,50%,${0.18 + g * 0.55})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // horizontal divider
        ctx.beginPath();
        ctx.moveTo(xl0, y0); ctx.lineTo(xr0, y0);
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + g * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // stage label
        const midY = y0 + STAGE_H / 2 + 4;
        ctx.font = "700 8px monospace";
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.25em";
        ctx.fillStyle = `hsla(25,100%,60%,${0.22 + g * 0.65})`;
        ctx.fillText(FUNNEL_STAGES[s], W / 2, midY);

        stageGlow[s] *= 0.94;
      }

      // ── Particles ──
      if (frame % 22 === 0) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 9) p.trail.shift();

        p.y += p.vy;
        p.x += p.vx;

        // constrain to funnel walls
        const fw = funnelWidthAt(p.y);
        const lx = (W - fw) / 2 + p.r;
        const rx = (W + fw) / 2 - p.r;
        if (p.x < lx) { p.x = lx; p.vx = Math.abs(p.vx) * 0.4; }
        if (p.x > rx) { p.x = rx; p.vx = -Math.abs(p.vx) * 0.4; }

        // boost stage glow
        const s = Math.floor((p.y - PAD_TOP) / STAGE_H);
        if (s >= 0 && s < 5) stageGlow[s] = Math.min(1, stageGlow[s] + 0.18);

        if (p.y > H - PAD_BOT + 24) { particles.splice(i, 1); continue; }

        // trail
        for (let t = 0; t < p.trail.length; t++) {
          const pt = p.trail[t];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(25,100%,60%,${(t / p.trail.length) * p.alpha * 0.35})`;
          ctx.fill();
        }

        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(30,100%,70%,${p.alpha})`;
        ctx.fill();

        // soft glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `hsla(25,100%,60%,${p.alpha * 0.35})`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // ── Bottom outlet glow ──
      const lastGlow = stageGlow[4];
      if (lastGlow > 0.05) {
        const exitY = H - PAD_BOT;
        const grd = ctx.createRadialGradient(W / 2, exitY, 0, W / 2, exitY, 28);
        grd.addColorStop(0, `hsla(25,100%,55%,${lastGlow * 0.55})`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(W / 2, exitY, 28, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative flex justify-center select-none">
      <canvas
        ref={canvasRef}
        style={{ width: 320, height: 480, display: "block" }}
      />
    </div>
  );
};

const SocialVisual = () => {
  const [counts, setCounts] = React.useState({ likes: 0, views: 0, shares: 0 });
  React.useEffect(() => {
    const t = setTimeout(() => {
      const id = setInterval(() => {
        setCounts(c => ({
          likes:  Math.min(c.likes  + 47,  12800),
          views:  Math.min(c.views  + 890, 310000),
          shares: Math.min(c.shares + 12,  3200),
        }));
      }, 30);
      return () => clearInterval(id);
    }, 400);
    return () => clearTimeout(t);
  }, []);
  const fmt = (n: number) => n >= 1000 ? `${(n/1000).toFixed(1)}K` : n.toString();
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      {[
        { icon: "♥", label: "Likes", value: counts.likes, color: "#ff4d6d" },
        { icon: "👁", label: "Views", value: counts.views, color: "hsl(25,100%,50%)" },
        { icon: "↗", label: "Shares", value: counts.shares, color: "#4cc9f0" },
      ].map(m => (
        <motion.div key={m.label}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + ["♥","👁","↗"].indexOf(m.icon) * 0.15 }}
          className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <span className="text-xl w-8 text-center">{m.icon}</span>
          <div className="flex-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">{m.label}</div>
            <div className="font-display font-black text-2xl" style={{ color: m.color }}>{fmt(m.value)}</div>
          </div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: m.color }} />
        </motion.div>
      ))}
    </div>
  );
};

const AdsVisual = () => {
  const [roi, setRoi] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => {
      const id = setInterval(() => setRoi(r => Math.min(r + 3, 420)), 20);
      return () => clearInterval(id);
    }, 500);
    return () => clearTimeout(t);
  }, []);
  const bars = [
    { label: "Jan", h: 40 }, { label: "Feb", h: 55 }, { label: "Mar", h: 48 },
    { label: "Apr", h: 70 }, { label: "May", h: 85 }, { label: "Jun", h: 100 },
  ];
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-end justify-between mb-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Avg. ROI</span>
          <motion.span className="font-display font-black text-3xl text-primary">
            {roi}%
          </motion.span>
        </div>
        <div className="flex items-end gap-2 h-24 mt-4">
          {bars.map((b, i) => (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${b.h}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: [0.16,1,0.3,1] }}
                className="w-full rounded-t-sm"
                style={{ background: i === 5 ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.12)" }}
              />
              <span className="font-mono text-[9px] text-white/30">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PodcastVisual = () => {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 120);
    return () => clearInterval(id);
  }, []);
  const heights = [20,45,70,55,90,40,75,60,85,35,65,50,80,45,70,55,90,40,75,60];
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(25,100%,50%)" }}>
            <span className="text-black font-bold text-lg">▶</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Your Podcast Episode</p>
            <p className="text-white/40 font-mono text-[10px]">02:47 / 45:12</p>
          </div>
        </div>
        <div className="flex items-center gap-[3px] h-12">
          {heights.map((h, i) => {
            const active = i <= (tick % 20);
            return (
              <motion.div key={i}
                animate={{ height: `${active ? h : h * 0.4}%`, opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.15 }}
                className="flex-1 rounded-full"
                style={{ background: active ? "hsl(25,100%,50%)" : "rgba(255,255,255,0.2)" }}
              />
            );
          })}
        </div>
        <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: "hsl(25,100%,50%)" }}
            animate={{ width: `${((tick % 40) / 40) * 100}%` }}
            transition={{ duration: 0.1 }} />
        </div>
      </div>
    </div>
  );
};

const WebsiteVisual = () => (
  <div className="w-full max-w-xs mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.7, ease: [0.16,1,0.3,1] }}
      className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-3 h-4 rounded bg-white/10 flex items-center px-2">
          <span className="font-mono text-[8px] text-white/30">swissulife.com</span>
        </div>
      </div>
      {/* Page skeleton loading in */}
      <div className="p-4 space-y-2">
        <motion.div initial={{ width: 0 }} animate={{ width: "60%" }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="h-6 rounded" style={{ background: "hsl(25,100%,50%,0.7)" }} />
        <motion.div initial={{ width: 0 }} animate={{ width: "85%" }}
          transition={{ delay: 1, duration: 0.6 }}
          className="h-3 rounded bg-white/20" />
        <motion.div initial={{ width: 0 }} animate={{ width: "70%" }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="h-3 rounded bg-white/15" />
        <div className="flex gap-2 mt-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="h-16 flex-1 rounded-lg bg-white/10" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.45 }}
            className="h-16 flex-1 rounded-lg bg-white/10" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="h-16 flex-1 rounded-lg bg-white/10" />
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.75 }}
          className="h-8 rounded-full mt-2"
          style={{ background: "hsl(25,100%,50%,0.8)", width: "50%" }} />
      </div>
    </motion.div>
  </div>
);

const EventVisual = () => {
  const steps = [
    { time: "Week 1–2", label: "Concept & Brief" },
    { time: "Week 3–4", label: "Venue & Vendors" },
    { time: "Week 5–6", label: "Promotion Launch" },
    { time: "Event Day", label: "Execution" },
    { time: "Post-Event", label: "Report & Recap" },
  ];
  return (
    <div className="w-full max-w-xs mx-auto space-y-2">
      {steps.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.16,1,0.3,1] }}
          className="flex items-center gap-3"
        >
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full border-2 flex-shrink-0"
              style={{ borderColor: "hsl(25,100%,50%)", background: i === 3 ? "hsl(25,100%,50%)" : "transparent" }} />
            {i < steps.length - 1 && <div className="w-[2px] h-5 bg-white/10 mt-1" />}
          </div>
          <div className="flex-1 flex items-center justify-between bg-white/[0.04] border border-white/8 rounded-xl px-3 py-2">
            <span className="text-white text-sm font-medium">{s.label}</span>
            <span className="font-mono text-[10px] text-white/30 tracking-wider">{s.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const InfluencerVisual = () => {
  const reactions = [
    { avatar: "S", handle: "@sara.dubai",    action: "❤️ liked this post",          time: "just now" },
    { avatar: "K", handle: "@khalid_uae",    action: '💬 "I need to try this!"',    time: "2s ago"   },
    { avatar: "R", handle: "@rana.lifestyle",action: "🔁 shared to her story",       time: "4s ago"   },
    { avatar: "J", handle: "@jad.beirut",    action: "❤️ liked this post",          time: "6s ago"   },
    { avatar: "M", handle: "@mia.geneva",    action: '💬 "Where can I buy this?"',  time: "9s ago"   },
  ];

  // live-ticking number hook
  const useTick = (target: number, delay: number) => {
    const [val, setVal] = React.useState(0);
    React.useEffect(() => {
      const t = setTimeout(() => {
        let start = 0;
        const step = Math.ceil(target / 40);
        const id = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(start);
          if (start >= target) clearInterval(id);
        }, 30);
        return () => clearInterval(id);
      }, delay);
      return () => clearTimeout(t);
    }, [target, delay]);
    return val;
  };

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  // floating notification bubbles
  const bubbles = [
    { icon: "❤️", label: "+2.4K",  top: "18%", left: "72%", delay: 1.1 },
    { icon: "💬", label: "+381",   top: "42%", left: "78%", delay: 1.5 },
    { icon: "🔁", label: "+920",   top: "66%", left: "70%", delay: 1.9 },
    { icon: "👁️", label: "+18K",   top: "30%", left: "80%", delay: 2.2 },
  ];

  return (
    <div className="w-full max-w-sm mx-auto select-none relative">

      {/* ── Influencer post (the cause) ── */}
      <motion.div
        className="relative rounded-xl p-3 mb-1"
        style={{
          background: "rgba(255,122,0,0.08)",
          border: "1px solid hsl(25,100%,50%,0.45)",
          boxShadow: "0 0 20px hsl(25,100%,50%,0.12)",
        }}
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* "campaign post" badge */}
        <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest text-black font-bold"
          style={{ background: "hsl(25,100%,50%)" }}>
          Campaign Post
        </div>

        <div className="flex items-center gap-3 mt-1">
          {/* influencer avatar */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-black text-sm"
            style={{ background: "hsl(25,100%,50%)", boxShadow: "0 0 12px hsl(25,100%,50%,0.5)" }}>
            ★
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans font-bold text-[14px] text-white tracking-tight">@swissulife.creator</p>
            <p className="font-sans text-[10px] text-white/40">Sponsored · just now</p>
          </div>
          {/* live total reach ticking */}
          <div className="text-right shrink-0">
            <p className="font-mono font-bold text-[13px]" style={{ color: "hsl(25,100%,50%)" }}>
              {fmt(useTick(98400, 400))}
            </p>
            <p className="font-mono text-[8px] text-white/30">reach</p>
          </div>
        </div>

        {/* post caption snippet */}
        <p className="font-sans text-[10px] text-white/50 mt-2 leading-relaxed pl-[52px]">
          "This product changed my routine — honestly can't stop talking about it 🔥"
        </p>
      </motion.div>

      {/* flow arrow */}
      <motion.div className="flex flex-col items-center my-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <motion.div
          style={{ width: 1, originY: 0, background: "linear-gradient(to bottom, hsl(25,100%,50%,0.7), hsl(25,100%,50%,0.2))" }}
          className="h-4"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: 0.6, duration: 0.35 }}
        />
        <span className="font-mono text-[8px] text-primary/60 uppercase tracking-widest">audience reacts</span>
        <motion.div
          style={{ width: 1, originY: 0, background: "linear-gradient(to bottom, hsl(25,100%,50%,0.2), transparent)" }}
          className="h-3"
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ delay: 0.65, duration: 0.3 }}
        />
      </motion.div>

      {/* ── Audience reaction cards ── */}
      <div className="flex flex-col gap-1.5">
        {reactions.map((r, i) => (
          <motion.div key={r.handle}
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 + i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* avatar */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-black text-xs"
              style={{ background: `hsl(25,100%,${52 - i * 4}%)` }}>
              {r.avatar}
            </div>
            {/* action */}
            <div className="flex-1 min-w-0">
              <p className="font-sans font-bold text-[12px] text-white tracking-tight truncate">{r.handle}</p>
              <p className="font-sans text-[10px] text-white/50 truncate">{r.action}</p>
            </div>
            {/* time */}
            <span className="font-mono text-[9px] text-white/25 shrink-0">{r.time}</span>
          </motion.div>
        ))}
      </div>

      {/* floating reaction bubbles */}
      {bubbles.map((b, i) => (
        <motion.div key={i}
          className="absolute flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold z-10 pointer-events-none"
          style={{
            top: b.top, left: b.left,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "hsl(25,100%,55%)",
          }}
          initial={{ opacity: 0, y: 6, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [6, 0, -10, -18], scale: [0.8, 1, 1, 0.85] }}
          transition={{ delay: b.delay, duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeOut" }}
        >
          <span>{b.icon}</span><span>{b.label}</span>
        </motion.div>
      ))}

      <motion.div className="flex items-center gap-2 mt-3"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
        <div className="h-[1px] w-5 bg-primary/40" />
        <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">500+ active creators</span>
      </motion.div>
    </div>
  );
};

const PRVisual = () => {
  const headlines = [
    "Swissulife Media Lands Major Campaign for Global Brand",
    "Agency Achieves 300% Media Coverage Growth in Q3",
    "Brand Reputation Score Hits All-Time High This Quarter",
    "Exclusive Feature in Forbes: The Agency Redefining Digital PR",
  ];
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % headlines.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-full max-w-xs mx-auto space-y-3">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden" style={{ minHeight: 80 }}>
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">Breaking Coverage</p>
        <AnimatePresence mode="wait">
          <motion.p key={index}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-white font-semibold text-sm leading-snug"
          >
            {headlines[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Press Hits", value: "120+" },
          { label: "Media Outlets", value: "40+" },
          { label: "Avg. Sentiment", value: "94%" },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.04] border border-white/8 rounded-xl p-3 text-center">
            <p className="font-display font-black text-primary text-xl">{s.value}</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Service definitions ─────────────────────────────────────────────────────
export const SERVICES: Record<string, {
  name: string;
  tagline: string;
  description: string;
  points: string[];
  stats: { value: string; label: string }[];
  process: { step: string; title: string; detail: string }[];
  Visual: React.FC;
}> = {
  "marketing-strategy": {
    name: "Marketing Strategy",
    tagline: "Built around your brand. Designed for real results.",
    description: `Most brands don't struggle because of a bad product. They struggle because nobody has sat down and figured out who they're really talking to, what to say, and where to say it. That's exactly what we do.\n\nWe start by getting to know your brand properly. We look at your current presence, study your competitors, and find the gaps in your market positioning. Then we put together a clear, practical roadmap that your whole team can actually follow.\n\nEvery decision we make is connected to a real goal. No fluff, no guesswork. Just a strategy that moves your business forward.`,
    points: [
      "Full brand audit and honest competitive analysis",
      "Audience research and buyer persona development",
      "Channel mix planning across organic, paid, social, and owned media",
      "Quarterly goal framework with clear and measurable KPIs",
      "Content strategy and editorial calendar planning",
      "Monthly performance reviews with honest recommendations",
    ],
    stats: [
      { value: "3×", label: "Avg. revenue lift in 6 months" },
      { value: "150+", label: "Brands strategised" },
    ],
    process: [
      { step: "01", title: "Discovery Call", detail: "We take the time to understand your goals, your audience, and where you are right now." },
      { step: "02", title: "Market Audit", detail: "We look at your competitors, find the gaps, and identify real opportunities." },
      { step: "03", title: "Strategy Build", detail: "We put together a clear roadmap with priorities and timelines that make sense." },
      { step: "04", title: "Launch and Learn", detail: "We get moving, track everything, and keep refining every 30 days." },
    ],
    Visual: FunnelVisual,
  },

  "social-media-management": {
    name: "Social Media Management",
    tagline: "Your brand voice, showing up consistently everywhere.",
    description: `Posting content is easy. Building a community around your brand is a different thing entirely. We manage your presence on Instagram, TikTok, LinkedIn, X, and more so that every post, every story, and every comment actually means something.\n\nWe create content that feels native to each platform. Not recycled, not rushed. Every caption is thought through, every visual is intentional, and we always show up for your audience in the comments and DMs.\n\nWe care about the numbers that actually matter. Reach, saves, replies, and the conversations that lead to real business. Not just likes.`,
    points: [
      "Full content creation including photography, video, Reels, and Stories",
      "Platform-specific strategy for Instagram, TikTok, LinkedIn, and X",
      "Community management covering comments, DMs, and brand engagement",
      "Monthly content calendar with a clear approval process",
      "Hashtag and SEO optimisation on every post",
      "Bi-weekly analytics reporting with clear and honest takeaways",
    ],
    stats: [
      { value: "1.8M", label: "Instagram reach managed" },
      { value: "4.2×", label: "Avg. engagement rate increase" },
      { value: "30+", label: "Active brand accounts managed" },
    ],
    process: [
      { step: "01", title: "Brand Voice Audit", detail: "We get a feel for your tone, your look, and how you want to come across." },
      { step: "02", title: "Content Strategy", detail: "We build a calendar around your goals and what your audience actually responds to." },
      { step: "03", title: "Produce and Publish", detail: "We create everything, schedule it, and publish it on your behalf." },
      { step: "04", title: "Grow and Report", detail: "We check in every week and share honest updates on what is working." },
    ],
    Visual: SocialVisual,
  },

  "google-ads": {
    name: "Google Ads",
    tagline: "Every dirham tracked. Every click accounted for.",
    description: `If you're running Google Ads and you're not sure exactly what you're getting back, something is wrong. We fix that. We manage Search, Display, Performance Max, and Shopping campaigns with the kind of care and structure most agencies skip.\n\nWe build the right keyword architecture, write ad copy that genuinely earns the click, and set up conversion tracking so you always know what happened after someone lands on your page. We check in constantly and never let things run on autopilot.\n\nMost of our clients see a strong return within the first 90 days. And we show you exactly where every dirham went.`,
    points: [
      "Full Google Ads account setup, takeover, and audit",
      "Search, Display, Performance Max, and Shopping campaign management",
      "Keyword research, negative keyword strategy, and match-type planning",
      "Ad copywriting covering headlines, descriptions, extensions, and sitelinks",
      "Conversion tracking through Google Tag Manager and GA4",
      "Weekly bid adjustments and monthly account restructuring",
    ],
    stats: [
      { value: "4.2×", label: "Avg. ROAS in first 90 days" },
      { value: "38%", label: "Avg. reduction in cost-per-click" },
      { value: "420%", label: "Highest recorded ROI" },
    ],
    process: [
      { step: "01", title: "Account Audit", detail: "We go through everything that exists or start fresh if needed." },
      { step: "02", title: "Keyword Planning", detail: "We build a clean, structured keyword and audience map." },
      { step: "03", title: "Launch Campaigns", detail: "We write the ads, set bids, and go live with full tracking in place." },
      { step: "04", title: "Optimise Weekly", detail: "We keep pushing performance every week. Nothing is ever just left running." },
    ],
    Visual: AdsVisual,
  },

  "podcast-production": {
    name: "Podcast Production",
    tagline: "You talk. We handle everything else.",
    description: `A podcast done right builds the kind of trust and authority that no paid ad can buy. People choose to listen for 40 minutes because they actually want to hear what you have to say. We make sure the show is worth their time.\n\nWe take care of everything from the initial concept and episode planning, through recording guidance, editing, sound design, show notes, and artwork. We get it published to Spotify, Apple Podcasts, YouTube, and everywhere else your audience listens.\n\nAnd every episode gets turned into clips, posts, and written content so the work you put into one recording goes much further.`,
    points: [
      "Show concept development, naming, and brand identity",
      "Recording setup guidance and remote recording support",
      "Full audio editing including EQ, noise reduction, music, and transitions",
      "Episode show notes, chapter markers, and SEO-friendly descriptions",
      "Distribution to Spotify, Apple Podcasts, YouTube, and Amazon Music",
      "Short-form clip creation and social media repurposing",
    ],
    stats: [
      { value: "50+", label: "Episodes produced" },
      { value: "48hr", label: "Avg. turnaround time per episode" },
      { value: "5×", label: "Content multiplied per recording" },
    ],
    process: [
      { step: "01", title: "Show Brief", detail: "We work out the format, the audience, and how often you want to publish." },
      { step: "02", title: "Record", detail: "You focus on the conversation. We handle all the setup and tools." },
      { step: "03", title: "Edit and Design", detail: "We take care of all post-production including artwork and show notes." },
      { step: "04", title: "Publish and Promote", detail: "We get it out everywhere and repurpose the content across social." },
    ],
    Visual: PodcastVisual,
  },

  "website-design": {
    name: "Website Design",
    tagline: "A website that actually works for your business.",
    description: `Your website is often the first real impression someone gets of your brand. It needs to feel right immediately, load fast, and make it obvious what to do next. We design and build sites that do exactly that.\n\nWe handle everything from the initial wireframes and visual design through to development and launch. Every site is built for mobile first, optimised for search engines, and connected to analytics from day one.\n\nWe never use templates. Every site is built specifically for you, your brand, and the people you are trying to reach. We have built sites that load in under 1.5 seconds and convert at three times the industry average.`,
    points: [
      "UX wireframing and clear information architecture planning",
      "Custom visual design with no templates, built around your brand",
      "Responsive development across all screen sizes",
      "On-page SEO including meta tags, schema markup, and page speed",
      "CMS setup in Webflow, WordPress, or headless for easy self-management",
      "GA4 and heatmap tracking integrated from the very start",
    ],
    stats: [
      { value: "<1.5s", label: "Avg. page load time" },
      { value: "3×", label: "Avg. conversion rate vs. industry" },
      { value: "100", label: "Google PageSpeed score" },
    ],
    process: [
      { step: "01", title: "Discovery and Wireframe", detail: "We map out the user journey and how the site should be structured." },
      { step: "02", title: "Design", detail: "We do the full visual design and get your sign-off at every stage." },
      { step: "03", title: "Develop", detail: "We build it properly with performance and SEO built in from the start." },
      { step: "04", title: "Launch and Handover", detail: "We go live together and make sure you know how to manage it yourself." },
    ],
    Visual: WebsiteVisual,
  },

  "event-management": {
    name: "Event Management",
    tagline: "Events people actually remember.",
    description: `A great event looks effortless on the day. What you don't see is the weeks of planning, the vendor conversations, the floor plan changes, and the late-night calls that made it all come together. That's the part we take off your plate.\n\nWe manage brand activations, product launches, corporate dinners, panel events, and large public experiences across the UAE, Switzerland, and Slovenia. We have a strong network of vendors, venues, and production teams we trust, which means we move fast and deliver to a high standard.\n\nEvery event we run comes with social media coverage during the day, a content package after, and a clear report so you can show what it achieved.`,
    points: [
      "End-to-end event concept, brief, and budget planning",
      "Venue sourcing and vendor management across the UAE and Europe",
      "Invitations, RSVP management, and guest experience design",
      "On-site production management from setup through to teardown",
      "Live social media coverage and real-time content capture",
      "Post-event report covering attendance, media, and results",
    ],
    stats: [
      { value: "80+", label: "Events produced" },
      { value: "3", label: "Countries we operate in" },
      { value: "5K+", label: "Total attendees served" },
    ],
    process: [
      { step: "01", title: "Concept and Budget", detail: "We define the experience, the scope, and what it is going to cost." },
      { step: "02", title: "Venue and Vendors", detail: "We take care of all the logistics and production sourcing." },
      { step: "03", title: "Promote", detail: "We handle invitations, social promotion, and any press." },
      { step: "04", title: "Execute and Report", detail: "We run the day and follow up with a full recap of what happened." },
    ],
    Visual: EventVisual,
  },

  "influencer-marketing": {
    name: "Influencer Marketing",
    tagline: "The right people, talking to the right audience.",
    description: `Influencer marketing only works when the creator and the brand genuinely fit together. We have spent years building a network of over 500 verified creators across the Gulf, Europe, and beyond, covering fashion, lifestyle, food, tech, fitness, and business.\n\nWe take care of everything. Finding creators whose audience actually matches yours, negotiating contracts, writing the brief, reviewing the content before it goes live, and reporting back with honest numbers once the campaign is done.\n\nThis is a proper campaign with a strategy behind it. Not just a list of handles sent over in an email.`,
    points: [
      "Creator identification across mega, macro, micro, and nano tiers",
      "Audience authenticity checks and fraud detection",
      "Contract negotiation, rate benchmarking, and usage rights",
      "Creative brief writing and content review before anything goes live",
      "Campaign tracking covering reach, engagement, link clicks, and sales",
      "Post-campaign report with honest ROI breakdown and creator ratings",
    ],
    stats: [
      { value: "500+", label: "Verified creators in our network" },
      { value: "8.4%", label: "Avg. campaign engagement rate" },
      { value: "293K", label: "Monthly impressions driven" },
    ],
    process: [
      { step: "01", title: "Campaign Brief", detail: "We get clear on objectives, budget, and the right type of creators." },
      { step: "02", title: "Creator Selection", detail: "We shortlist, vet, and share a curated list for your approval." },
      { step: "03", title: "Content and Go Live", detail: "We brief the creators, review everything, and approve before posting." },
      { step: "04", title: "Report", detail: "You get a full breakdown of what the campaign delivered." },
    ],
    Visual: InfluencerVisual,
  },

  "pr-management": {
    name: "PR Management",
    tagline: "Tell your story before someone else tells it for you.",
    description: `Your reputation is one of the most valuable things your brand has. We help you protect it, shape it, and make sure the right people are hearing the right things about you.\n\nWe write and distribute press releases, pitch stories to regional and international media, position your founders and executives as genuine voices in their industry, and handle things properly when a situation needs careful management.\n\nWe have strong relationships across Forbes Middle East, Entrepreneur, Gulf News, Bloomberg, and many niche trade publications. The coverage we get builds long-term credibility, not just a quick mention.`,
    points: [
      "Press release writing and multi-channel distribution",
      "Media relationship management with journalists, editors, and outlets",
      "Earned media pitching for regional and international publications",
      "Executive positioning through thought leadership, op-eds, and interviews",
      "Crisis communications strategy and rapid response when needed",
      "Monthly media monitoring and brand sentiment reporting",
    ],
    stats: [
      { value: "120+", label: "Press placements secured" },
      { value: "40+", label: "Media outlets in our network" },
      { value: "94%", label: "Avg. positive sentiment score" },
    ],
    process: [
      { step: "01", title: "Brand Story Audit", detail: "We find the angles that make your brand genuinely worth covering." },
      { step: "02", title: "Media Strategy", detail: "We identify the right outlets, journalists, and pitch approaches." },
      { step: "03", title: "Pitch and Publish", detail: "We reach out, build the relationships, and get the coverage." },
      { step: "04", title: "Monitor and Protect", detail: "We watch what is being said and respond quickly when it matters." },
    ],
    Visual: PRVisual,
  },
};

export const SERVICE_LIST = [
  { label: "Marketing Strategy",       slug: "marketing-strategy" },
  { label: "Social Media Management",  slug: "social-media-management" },
  { label: "Google Ads",               slug: "google-ads" },
  { label: "Podcast Production",       slug: "podcast-production" },
  { label: "Website Design",           slug: "website-design" },
  { label: "Event Management",         slug: "event-management" },
  { label: "Influencer Marketing",     slug: "influencer-marketing" },
  { label: "PR Management",            slug: "pr-management" },
];

// ─── Nav ─────────────────────────────────────────────────────────────────────
const Navbar = ({ currentSlug }: { currentSlug: string }) => (
  <motion.nav
    initial={{ y: -100 }} animate={{ y: 0 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5"
  >
    <Link href="/">
      <span className="font-display font-bold text-white tracking-widest uppercase text-lg cursor-pointer">
        SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
      </span>
    </Link>
    <div className="hidden md:flex items-center gap-8">
      <Link href="/" className="font-sans font-medium text-sm text-primary hover:text-white transition-colors">Home</Link>
      <div className="relative group">
        <button className="font-sans font-medium text-sm text-white flex items-center gap-1">
          We Offer
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
            className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-64 py-2">
            {SERVICE_LIST.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}
                className={`block px-5 py-2.5 text-sm font-sans transition-colors ${
                  s.slug === currentSlug ? "text-white bg-white/5" : "text-white/70 hover:text-white hover:bg-white/5"
                }`}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link href="/about"   className="font-sans font-medium text-sm text-primary hover:text-white transition-colors">About Us</Link>
      <Link href="/contact" className="font-sans font-medium text-sm text-primary hover:text-white transition-colors">Contact Us</Link>
    </div>
    <div className="flex items-center gap-3">
      <Link href="/contact"
        className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ background: "hsl(25,100%,50%)" }}>
        Get in Touch
      </Link>
      <MobileNav active="home" />
    </div>
  </motion.nav>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServicePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const service = SERVICES[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-6xl font-display font-black uppercase mb-4">Not Found</h1>
          <Link href="/" className="text-primary underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const { Visual } = service;

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar currentSlug={slug} />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 px-8 md:px-16 overflow-hidden border-b border-white/10">
        <div className="absolute top-0 left-0 w-[600px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 0% 0%, hsl(25,100%,50%,0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 0%, hsl(25,100%,50%,0.05) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left: text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-mono text-primary uppercase tracking-widest text-xs mb-4"
            >We Offer</motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.88] mb-6"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >{service.name}</motion.h1>

            <motion.div
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0, height: 2, background: "linear-gradient(90deg, hsl(25,100%,50%), transparent)", borderRadius: 2 }}
              className="w-32 mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="font-mono text-primary uppercase tracking-widest text-xs mb-3"
            >About this service</motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/60 font-sans text-sm leading-relaxed max-w-md mb-8"
              style={{ whiteSpace: "pre-line" }}
            >{service.description}</motion.p>

          </div>

          {/* Right: unique visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Visual />
          </motion.div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-primary uppercase tracking-widest text-xs mb-8">What's included</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.points.map((point, i) => (
                <motion.li key={i}
                  initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "hsl(25,100%,50%)" }} />
                  <span className="text-white/70 font-sans text-base">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Other services ── */}
      <section className="py-16 px-8 md:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-white/30 uppercase tracking-widest text-xs mb-8">Explore other services</p>
          <div className="flex flex-wrap gap-3">
            {SERVICE_LIST.filter(s => s.slug !== slug).map(s => (
              <Link key={s.slug} href={`/services/${s.slug}`}
                className="px-5 py-2 rounded-full border text-sm font-sans transition-all duration-200 hover:border-primary hover:text-white text-white/50 border-white/15">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-8 md:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-white mb-2">
              Ready to get<br /><span style={{ color: "hsl(25,100%,50%)" }}>started?</span>
            </h2>
            <p className="text-white/40 text-sm">Tell us about your brand and we'll take it from there.</p>
          </div>
          <Link href="/contact"
            className="shrink-0 inline-flex items-center px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}>
            Contact Us →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-8 px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-display font-bold text-white/40 uppercase text-sm tracking-widest">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
          <span className="font-mono text-white/20 text-xs">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
