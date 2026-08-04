import React from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import MobileNav from "@/components/MobileNav";

// ─── Unique hero visuals ──────────────────────────────────────────────────────

const FunnelVisual = () => {
  const stages = [
    { label: "Awareness",     shade: 52, w: "100%" },
    { label: "Engagement",    shade: 47, w: "88%"  },
    { label: "Consideration", shade: 42, w: "74%"  },
    { label: "Conversion",    shade: 36, w: "58%"  },
    { label: "Retention",     shade: 30, w: "42%"  },
  ];

  return (
    <div
      className="w-full max-w-xs mx-auto select-none py-4"
      style={{ perspective: "520px", perspectiveOrigin: "50% 110%" }}
    >
      {/* 3-D tilt wrapper */}
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateX: 28 }}
        animate={{ rotateX: 28 }}
      >
        {stages.map(({ label, shade, w }, i) => (
          <motion.div
            key={label}
            className="mx-auto mb-[6px] rounded-xl flex items-center justify-between px-4"
            style={{
              width: w,
              height: 46,
              background: `linear-gradient(135deg, hsl(25,100%,${shade}%) 0%, hsl(25,100%,${shade - 6}%) 100%)`,
              boxShadow: `0 6px 18px hsl(25,100%,${shade}%,0.35), inset 0 1px 0 rgba(255,255,255,0.18)`,
              transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, rotateX: -55, y: -18 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ delay: 0.3 + i * 0.13, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono font-bold text-[11px] uppercase tracking-widest text-black/80">
              {label}
            </span>
            <span className="font-mono text-[10px] text-black/50 font-bold">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* label */}
      <motion.div
        className="flex items-center gap-2 mt-5 justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="h-[1px] w-5 bg-primary/50" />
        <span className="font-mono text-primary text-[10px] uppercase tracking-widest">Full-funnel strategy</span>
        <div className="h-[1px] w-5 bg-primary/50" />
      </motion.div>
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
  const posts = [
    { handle: "@layla.ae",    label: "Fashion & Lifestyle", avatar: "L", likes: 18400, shares: 920  },
    { handle: "@marcotravels", label: "Travel & Adventure",  avatar: "M", likes: 31200, shares: 1540 },
    { handle: "@chef.nour",   label: "Food & Culture",      avatar: "N", likes: 9800,  shares: 480  },
    { handle: "@techwithali", label: "Tech & Reviews",      avatar: "A", likes: 24600, shares: 1120 },
    { handle: "@fitwithsara", label: "Fitness & Wellness",  avatar: "S", likes: 14300, shares: 760  },
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

  const PostCard = ({ post, index }: { post: typeof posts[0]; index: number }) => {
    const likes  = useTick(post.likes,  600 + index * 220);
    const shares = useTick(post.shares, 900 + index * 220);
    return (
      <motion.div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-black text-xs"
          style={{ background: `hsl(25,100%,${50 - index * 3}%)` }}>
          {post.avatar}
        </div>
        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="font-mono font-bold text-[11px] text-white truncate">{post.handle}</p>
          <p className="font-mono text-[9px] text-white/35 truncate">{post.label}</p>
        </div>
        {/* metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="font-mono font-bold text-[11px]" style={{ color: "hsl(25,100%,50%)" }}>{fmt(likes)}</p>
            <p className="font-mono text-[8px] text-white/30">likes</p>
          </div>
          <div className="text-right">
            <p className="font-mono font-bold text-[11px] text-white/60">{fmt(shares)}</p>
            <p className="font-mono text-[8px] text-white/30">shares</p>
          </div>
        </div>
      </motion.div>
    );
  };

  // floating notification bubbles
  const bubbles = [
    { icon: "❤️", label: "+2.4K",  top: "18%", left: "72%", delay: 1.1 },
    { icon: "💬", label: "+381",   top: "42%", left: "78%", delay: 1.5 },
    { icon: "🔁", label: "+920",   top: "66%", left: "70%", delay: 1.9 },
    { icon: "👁️", label: "+18K",   top: "30%", left: "80%", delay: 2.2 },
  ];

  return (
    <div className="w-full max-w-sm mx-auto select-none relative">
      {/* floating notification bubbles */}
      {bubbles.map((b, i) => (
        <motion.div key={i}
          className="absolute flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold z-10 pointer-events-none"
          style={{
            top: b.top, left: b.left,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "hsl(25,100%,55%)",
          }}
          initial={{ opacity: 0, y: 8, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, -8, -16], scale: [0.8, 1, 1, 0.9] }}
          transition={{ delay: b.delay, duration: 2.4, repeat: Infinity, repeatDelay: 2, ease: "easeOut" }}
        >
          <span>{b.icon}</span><span>{b.label}</span>
        </motion.div>
      ))}

      {/* feed cards */}
      <div className="flex flex-col gap-2 pr-16">
        {posts.map((post, i) => (
          <PostCard key={post.handle} post={post} index={i} />
        ))}
      </div>

      {/* bottom label */}
      <motion.div className="flex items-center gap-2 mt-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
        <div className="h-[1px] w-5 bg-primary/40" />
        <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">500+ active creators</span>
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
    tagline: "Built around your brand. Designed for results.",
    description: `Most brands don't fail because of a bad product — they fail because of a weak strategy. We build your marketing from the ground up: who you're speaking to, what you're saying, where you're saying it, and exactly how to measure whether it's working.\n\nWe start by auditing your current presence, mapping your competitive landscape, and identifying the gaps in your market positioning. From there we deliver a custom go-to-market roadmap with quarterly OKRs, channel priorities, and a content framework your whole team can execute against.\n\nWhether you're launching a new brand, entering a new market, or scaling an existing one — every decision we make is tied to a number.`,
    points: [
      "Full brand audit and competitive landscape analysis",
      "Audience segmentation and buyer persona development",
      "Channel mix strategy — organic, paid, social, and owned media",
      "Quarterly OKR framework with measurable KPIs",
      "Content strategy and editorial calendar planning",
      "Monthly performance reviews with strategic pivot recommendations",
    ],
    stats: [
      { value: "3×", label: "Avg. revenue lift in 6 months" },
      { value: "150+", label: "Brands strategised" },
    ],
    process: [
      { step: "01", title: "Discovery Call", detail: "We learn your goals, audience, and current challenges in depth." },
      { step: "02", title: "Market Audit", detail: "We map your competitors, gaps, and opportunities across all channels." },
      { step: "03", title: "Strategy Build", detail: "We deliver a tailored roadmap with priorities and timelines." },
      { step: "04", title: "Launch & Iterate", detail: "We execute, measure, and refine every 30 days." },
    ],
    Visual: FunnelVisual,
  },

  "social-media-management": {
    name: "Social Media Management",
    tagline: "Your brand voice, amplified across every platform.",
    description: `Social media isn't about posting — it's about being heard. We manage your brand's presence end-to-end: content creation, community engagement, analytics, and platform growth across Instagram, TikTok, LinkedIn, X, and beyond.\n\nOur team produces platform-native content that stops the scroll. Every caption is crafted, every story is intentional, and every comment is answered — because your audience is watching how you show up in real time.\n\nWe don't chase vanity metrics. We track reach, saves, DMs, and link-clicks — the signals that actually move business.`,
    points: [
      "Full-service content creation — photography, video, Reels, Stories",
      "Platform-specific strategy for Instagram, TikTok, LinkedIn, and X",
      "Community management — comments, DMs, and brand engagement",
      "Monthly content calendar with approval workflow",
      "Hashtag and SEO optimisation per post",
      "Bi-weekly analytics reporting with actionable insights",
    ],
    stats: [
      { value: "1.8M", label: "Instagram reach managed" },
      { value: "4.2×", label: "Avg. engagement rate increase" },
      { value: "30+", label: "Active brand accounts managed" },
    ],
    process: [
      { step: "01", title: "Brand Voice Audit", detail: "We define your tone, aesthetics, and posting identity." },
      { step: "02", title: "Content Strategy", detail: "We build a content calendar aligned with your goals." },
      { step: "03", title: "Produce & Publish", detail: "Our team creates, schedules, and publishes all content." },
      { step: "04", title: "Grow & Report", detail: "Weekly performance check-ins with growth recommendations." },
    ],
    Visual: SocialVisual,
  },

  "google-ads": {
    name: "Google Ads",
    tagline: "Precision targeting. Maximum return.",
    description: `Every dirham you spend on Google Ads should be tracked to a result. We manage Search, Display, Performance Max, and Shopping campaigns — building the kind of account structure that agencies charge twice as much to deliver.\n\nWe start with keyword architecture and audience mapping, then craft ad copy that earns the click, landing pages that earn the conversion, and bid strategies that maximise every dollar of budget. Nothing is set and forgotten.\n\nOur average client sees a 4× return on ad spend within the first 90 days. We don't just report metrics — we show you exactly where the money went and what it made.`,
    points: [
      "Full Google Ads account setup or takeover and audit",
      "Search, Display, Performance Max, and Shopping campaign management",
      "Keyword research, negative keyword strategy, and match-type architecture",
      "Ad copywriting — headlines, descriptions, extensions, and sitelinks",
      "Conversion tracking via Google Tag Manager and GA4",
      "Weekly bid adjustments and monthly account restructuring",
    ],
    stats: [
      { value: "4.2×", label: "Avg. ROAS in first 90 days" },
      { value: "38%", label: "Avg. reduction in cost-per-click" },
      { value: "420%", label: "Highest recorded ROI" },
    ],
    process: [
      { step: "01", title: "Account Audit", detail: "We review your existing campaigns or build from scratch." },
      { step: "02", title: "Keyword Architecture", detail: "We build a clean, structured keyword and audience map." },
      { step: "03", title: "Launch Campaigns", detail: "We write the ads, set bids, and go live with full tracking." },
      { step: "04", title: "Optimise Weekly", detail: "Constant refinement to push performance further every week." },
    ],
    Visual: AdsVisual,
  },

  "podcast-production": {
    name: "Podcast Production",
    tagline: "From concept to publish — we handle everything.",
    description: `Podcasting is one of the most powerful ways to build authority, trust, and an engaged audience that listens for 40+ minutes at a time. We handle the full production pipeline so you focus entirely on the conversation.\n\nFrom episode concept and guest booking, through recording, editing, sound design, show notes, and thumbnail design — we deliver a broadcast-quality show on a consistent schedule. We also manage distribution to Spotify, Apple Podcasts, YouTube, and everywhere your audience listens.\n\nEvery episode is also repurposed into short-form clips, social posts, and written content — multiplying the value of every recording session.`,
    points: [
      "Show concept development, naming, and brand identity",
      "Professional recording setup guidance and remote recording management",
      "Full audio editing — EQ, noise reduction, music, transitions",
      "Episode show notes, chapter markers, and SEO-optimised descriptions",
      "Distribution to Spotify, Apple Podcasts, YouTube, and Amazon Music",
      "Short-form clip extraction and social media repurposing",
    ],
    stats: [
      { value: "50+", label: "Episodes produced" },
      { value: "48hr", label: "Avg. turnaround time per episode" },
      { value: "5×", label: "Content multiplied per recording" },
    ],
    process: [
      { step: "01", title: "Show Brief", detail: "We nail your format, audience, and episode cadence." },
      { step: "02", title: "Record", detail: "You record — we provide setup guidance and remote tools." },
      { step: "03", title: "Edit & Design", detail: "Full post-production including artwork and show notes." },
      { step: "04", title: "Publish & Promote", detail: "We distribute everywhere and repurpose across social." },
    ],
    Visual: PodcastVisual,
  },

  "website-design": {
    name: "Website Design",
    tagline: "Websites that convert visitors into clients.",
    description: `Your website is your best salesperson — it works 24/7, speaks to thousands at once, and either builds trust instantly or loses it. We design and build websites that are fast, beautiful, and built to convert.\n\nWe handle everything from UX wireframing and visual design to development and launch. Every site we build is mobile-first, SEO-optimised, and connected to analytics from day one — so you always know what's working.\n\nWe don't use templates. Every design is custom-built around your brand, your audience, and the specific action you want visitors to take. We've built sites that load in under 1.5 seconds and convert at 3× the industry average.`,
    points: [
      "UX wireframing and information architecture planning",
      "Custom visual design — no templates, fully brand-aligned",
      "Responsive development for all screen sizes",
      "On-page SEO: meta tags, schema markup, page speed optimisation",
      "CMS setup (Webflow, WordPress, or headless) for self-managed content",
      "GA4 and heatmap tracking integration from day one",
    ],
    stats: [
      { value: "<1.5s", label: "Avg. page load time" },
      { value: "3×", label: "Avg. conversion rate vs. industry" },
      { value: "100", label: "Google PageSpeed score" },
    ],
    process: [
      { step: "01", title: "Discovery & Wireframe", detail: "We map the user journey and information architecture." },
      { step: "02", title: "Design", detail: "Full visual design with client approval at each stage." },
      { step: "03", title: "Develop", detail: "Pixel-perfect build with performance and SEO baked in." },
      { step: "04", title: "Launch & Handover", detail: "Live deployment plus training so you can manage it yourself." },
    ],
    Visual: WebsiteVisual,
  },

  "event-management": {
    name: "Event Management",
    tagline: "Experiences that leave a lasting impression.",
    description: `A great event doesn't happen by accident. It's the result of 6 weeks of invisible work — the vendor calls, the floor plan revisions, the contingency plans, and the 11pm emails. We handle all of it so you show up and own the room.\n\nWe manage brand activations, product launches, corporate dinners, panel events, and large-scale public experiences across the UAE, Switzerland, and Slovenia. Our network of trusted vendors, venues, and production partners means we can execute quickly and to a high standard.\n\nEvery event we produce comes with full social media coverage, a post-event content package, and a detailed impact report so you can show ROI to stakeholders.`,
    points: [
      "End-to-end event concept, brief, and budget planning",
      "Venue sourcing and vendor management across UAE and Europe",
      "Invitations, RSVP management, and guest experience design",
      "On-site production management from setup to teardown",
      "Live social media coverage and real-time content capture",
      "Post-event report including attendance, media coverage, and ROI",
    ],
    stats: [
      { value: "80+", label: "Events produced" },
      { value: "3", label: "Countries we operate in" },
      { value: "5K+", label: "Total attendees served" },
    ],
    process: [
      { step: "01", title: "Concept & Budget", detail: "We define the experience, scope, and cost structure." },
      { step: "02", title: "Venue & Vendors", detail: "We source and manage all logistics and production." },
      { step: "03", title: "Promote", detail: "We handle invitations, social promotion, and media." },
      { step: "04", title: "Execute & Report", detail: "Flawless on-site execution, followed by a full recap report." },
    ],
    Visual: EventVisual,
  },

  "influencer-marketing": {
    name: "Influencer Marketing",
    tagline: "The right voices, reaching the right audience.",
    description: `Influencer marketing works when the match is right. We've built a network of over 500 verified creators across the Gulf, Europe, and globally — covering fashion, lifestyle, food, tech, fitness, and business — and we know how to brief them so the content actually performs.\n\nWe handle the full campaign lifecycle: identifying creators whose audience matches yours, negotiating and managing contracts, writing the creative brief, reviewing content before it goes live, and reporting on every deliverable once the campaign ends.\n\nWe don't send a list of handles and call it a day. We run influencer campaigns as campaigns — with strategy, tracking, and accountability at every step.`,
    points: [
      "Creator identification across mega, macro, micro, and nano tiers",
      "Audience authenticity verification and fraud detection",
      "Contract negotiation, rate benchmarking, and usage rights",
      "Creative brief writing and content review before posting",
      "Campaign performance tracking — reach, engagement, link clicks, sales",
      "Post-campaign report with ROI breakdown and creator ratings",
    ],
    stats: [
      { value: "500+", label: "Verified creators in our network" },
      { value: "8.4%", label: "Avg. campaign engagement rate" },
      { value: "293K", label: "Monthly impressions driven" },
    ],
    process: [
      { step: "01", title: "Campaign Brief", detail: "We define objectives, budget, and creator tier mix." },
      { step: "02", title: "Creator Selection", detail: "We shortlist, vet, and present creators for approval." },
      { step: "03", title: "Content & Go Live", detail: "We brief, review, and approve all content before posting." },
      { step: "04", title: "Report", detail: "Full post-campaign analytics with ROI and recommendations." },
    ],
    Visual: InfluencerVisual,
  },

  "pr-management": {
    name: "PR Management",
    tagline: "Shape your story. Protect your reputation.",
    description: `Public relations is about controlling the narrative before someone else does. We manage your media presence, build relationships with journalists and editors, and make sure your brand is being talked about in the right rooms and the right publications.\n\nWe write and distribute press releases, pitch exclusive stories to regional and international media, manage crisis communications, and position your founders and executives as industry thought leaders through op-eds, interviews, and speaking opportunities.\n\nOur media relationships span Forbes Middle East, Entrepreneur, Gulf News, Bloomberg, and dozens of niche trade publications across your industry. We get coverage that builds long-term brand equity, not just a one-day spike.`,
    points: [
      "Press release writing and multi-channel distribution",
      "Media relationship management — journalists, editors, and outlets",
      "Earned media pitching for regional and international publications",
      "Executive positioning: thought leadership, op-eds, and interviews",
      "Crisis communications strategy and rapid response management",
      "Monthly media monitoring and brand sentiment reporting",
    ],
    stats: [
      { value: "120+", label: "Press placements secured" },
      { value: "40+", label: "Media outlets in our network" },
      { value: "94%", label: "Avg. positive sentiment score" },
    ],
    process: [
      { step: "01", title: "Brand Story Audit", detail: "We find and sharpen the angles that make you newsworthy." },
      { step: "02", title: "Media Strategy", detail: "We map the right outlets, journalists, and pitch angles." },
      { step: "03", title: "Pitch & Publish", detail: "We pitch your stories and manage relationships to placement." },
      { step: "04", title: "Monitor & Protect", detail: "We track coverage and respond to any reputational risks." },
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

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex gap-6 flex-wrap"
            >
              {service.stats.map((s, i) => (
                <div key={i}>
                  <p className="font-display font-black text-2xl text-primary leading-none">{s.value}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/35 mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
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
