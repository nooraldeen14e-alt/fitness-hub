import React from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import ScheduleModal from "@/components/ScheduleModal";

// ─── Industry data ────────────────────────────────────────────────────────────
// To add a video: push a YouTube embed URL into the `videos` array.
// e.g. "https://www.youtube.com/embed/VIDEO_ID"
// or an Instagram/Vimeo embed URL.

export const INDUSTRIES: Record<string, {
  name: string;
  tagline: string;
  description: string;
  videos: string[];   // YouTube / Vimeo embed URLs — add yours here
}> = {
  "fashion-apparel": {
    name: "Fashion & Apparel",
    tagline: "Campaigns that make people stop, look, and buy.",
    description: `Fashion moves fast — and your content needs to move faster. We work with fashion and apparel brands across the GCC and Europe to build content strategies that position you as a taste-maker, not just a seller.\n\nFrom seasonal lookbook shoots and reels to influencer seeding and paid media, we handle the full marketing picture. Our team understands the language of fashion — the aesthetics, the pacing, the platforms, and the communities that drive purchase intent.\n\nWhether you're a luxury label, a streetwear brand, or an emerging designer, we build campaigns that make people feel something — and then make them buy.`,
    videos: [],
  },
  "fitness-wellness": {
    name: "Fitness & Wellness",
    tagline: "Building brands people trust with their bodies.",
    description: `Fitness and wellness brands live and die by credibility. Audiences are savvy — they can tell instantly whether a brand actually understands health, or is just selling them something.\n\nWe work with gyms, supplement brands, wellness apps, and personal trainers to build content that educates, inspires, and converts. Our campaigns blend transformation stories, expert positioning, and performance-driven paid media into a full-funnel strategy.\n\nFrom before-and-after reels to long-form podcast content and Google Ads for gym sign-ups — we know what it takes to grow a fitness brand in a crowded market.`,
    videos: [],
  },
  "food-beverage": {
    name: "Food & Beverage",
    tagline: "Making your food impossible to scroll past.",
    description: `Food content is the most competitive space on social media — and the most rewarding when done right. We create content that makes people hungry, drives foot traffic, and builds loyal communities around your brand.\n\nOur team handles everything from restaurant photography and short-form video to influencer campaigns and delivery platform optimisation. We know how to capture texture, colour, and atmosphere in a way that translates into reservations and orders.\n\nWe've worked with restaurants, cafés, cloud kitchens, FMCG brands, and food delivery services across the region — and every campaign is built around one goal: making people want to eat what you're making.`,
    videos: [],
  },
  "fragrance-beauty": {
    name: "Fragrance & Beauty",
    tagline: "Sensory brands deserve sensory storytelling.",
    description: `Fragrance and beauty brands sell emotion before they sell product. The brand story, the visual world, and the feeling of aspiration — that's what moves units at this level.\n\nWe work with perfume houses, cosmetics brands, and skincare lines to build campaigns that feel premium, authentic, and culturally relevant. From editorial-style content and influencer gifting campaigns to Arabic-language social strategy and paid media, we position your brand exactly where your audience is already spending time.\n\nOur campaigns have driven everything from launch sell-outs to regional brand awareness that rival global houses.`,
    videos: [],
  },
  "luxury-lifestyle": {
    name: "Luxury & Lifestyle",
    tagline: "Premium brands require premium creative.",
    description: `Luxury is not about price — it's about perception. Every piece of content your brand publishes either reinforces or undermines the premium world you've built. We make sure it reinforces it.\n\nWe work with luxury hospitality, fashion, automotive, and lifestyle brands to craft marketing that speaks to high-net-worth audiences without ever being obvious about it. Understated storytelling, cinematic content, and white-glove community management — done with the same care and attention your products are made with.\n\nFrom Geneva to Dubai, we understand the codes of luxury across cultures and markets.`,
    videos: [],
  },
  "real-estate": {
    name: "Real Estate",
    tagline: "Turning properties into brands people want to live in.",
    description: `Real estate marketing has changed — buyers and investors do their research online long before they call an agent. Your digital presence needs to make the property feel real, the lifestyle feel aspirational, and the developer feel trustworthy.\n\nWe work with developers, agencies, and brokers across the UAE to build campaigns that generate qualified leads, not just impressions. From drone footage and property walkthrough reels to Google Ads targeting GCC investors — we know the full picture.\n\nOur campaigns have driven launches for off-plan projects, built broker brand authority, and positioned developments in Sharjah, Dubai, and beyond as must-have addresses.`,
    videos: [],
  },
  "technology-saas": {
    name: "Technology & SaaS",
    tagline: "Making complex products feel simple and essential.",
    description: `Tech companies often know their product inside out — but struggle to explain why someone should care. We bridge the gap between what you've built and the audience who needs it.\n\nWe work with SaaS companies, fintech startups, and tech platforms to create clear, compelling messaging across every channel. Product explainer videos, LinkedIn thought-leadership, case study content, and performance campaigns that target decision-makers in the right industries.\n\nWhether you're B2B or B2C, pre-launch or scaling, we build the marketing engine your product deserves.`,
    videos: [],
  },
  "ecommerce-retail": {
    name: "E-commerce & Retail",
    tagline: "Driving traffic that converts, not just traffic.",
    description: `E-commerce success is a numbers game — but the numbers only follow when the creative and strategy are right. We build full-funnel campaigns that bring the right people to your store and give them every reason to buy.\n\nFrom product photography and UGC-style video content to Google Shopping campaigns and Meta retargeting — we run the whole machine. We also optimise for the moments that matter: launches, sales events, and seasonal peaks when your competitors are spending big.\n\nOur clients see measurable improvements in ROAS, cart conversion rates, and customer lifetime value within the first 90 days.`,
    videos: [],
  },
  "automotive": {
    name: "Automotive",
    tagline: "Content that makes engines and audiences rev.",
    description: `Automotive marketing is visual, emotional, and deeply tribal. Whether you're selling supercars or daily drivers, the audience expects world-class production and content that speaks their language.\n\nWe produce cinematic automotive content — track shoots, lifestyle campaigns, launch events, and influencer partnerships — for dealerships, importers, and manufacturers across the Middle East. Our team understands the car community: the culture, the platforms (Instagram, YouTube, TikTok), and the content formats that drive genuine engagement.\n\nWe've built campaigns for premium and exotic brands that have generated millions of views and driven showroom floor traffic across the GCC.`,
    videos: [],
  },
  "healthcare-clinics": {
    name: "Healthcare & Clinics",
    tagline: "Building the trust that healthcare decisions demand.",
    description: `Healthcare marketing requires a different kind of authority. Patients aren't buying a product — they're trusting you with their health. Every piece of content needs to be accurate, empathetic, and positioned to build confidence before the appointment is ever booked.\n\nWe work with clinics, hospitals, dental practices, and wellness centres to build digital presences that attract and convert the right patients. Educational content, Google Ads targeting high-intent searches, and community-building across the platforms where your patients are already active.\n\nCompliance is always front of mind. Every campaign we run is built around what's appropriate for healthcare — and what actually works.`,
    videos: [],
  },
  "entertainment-media": {
    name: "Entertainment & Media",
    tagline: "Making noise in the noisiest industry on earth.",
    description: `Entertainment and media brands don't just need to be good — they need to be talked about. Buzz, reach, and cultural relevance are the currency, and we know how to earn all three.\n\nWe work with events, TV shows, streaming platforms, talent agencies, and media brands to build campaigns that get people excited, talking, and showing up. From teaser campaigns and influencer activations to paid social and PR strategy — we understand the mechanics of cultural moments.\n\nOur work spans live events in Sharjah and Dubai, content IPs, and regional media brands that have grown their audiences by six and seven figures.`,
    videos: [],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const slugify = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

// ─── Nav ─────────────────────────────────────────────────────────────────────
const IndustryNav = ({ scheduleOpen, setScheduleOpen }: {
  scheduleOpen: boolean;
  setScheduleOpen: (v: boolean) => void;
}) => (
  <motion.nav
    initial={{ y: -60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5"
    style={{ background: "rgba(5,5,5,0.85)", backdropFilter: "blur(16px)" }}
  >
    <Link href="/" className="font-display font-black text-white tracking-tight text-lg md:text-xl select-none">
      SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
    </Link>

    <div className="hidden md:flex items-center gap-8">
      <Link href="/"        className="text-sm font-medium text-white/60 hover:text-white transition-colors">Home</Link>
      <Link href="/#industries" className="text-sm font-medium text-white hover:text-white transition-colors">Industries</Link>
      <Link href="/about"   className="text-sm font-medium text-white/60 hover:text-white transition-colors">About Us</Link>
      <Link href="/contact" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Contact Us</Link>
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={() => setScheduleOpen(true)}
        className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ background: "hsl(25,100%,50%)" }}
      >
        Schedule a Meeting
      </button>
      <MobileNav active="industries" />
    </div>
  </motion.nav>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IndustryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const industry = INDUSTRIES[slug];
  const [scheduleOpen, setScheduleOpen] = React.useState(false);

  // Unknown slug → go home
  if (!industry) {
    React.useEffect(() => { window.location.replace("/"); }, []);
    return null;
  }

  const paragraphs = industry.description.split("\n\n");
  // Show at least 3 placeholders if no real videos yet
  const videoCount = Math.max(industry.videos.length, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
      <IndustryNav scheduleOpen={scheduleOpen} setScheduleOpen={setScheduleOpen} />
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 70% 50%, hsl(25,100%,50%,0.07) 0%, transparent 70%)",
          }}
        />

        {/* back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            All Industries
          </Link>
        </motion.div>

        {/* label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-mono text-[11px] uppercase tracking-[0.25em] mb-4"
          style={{ color: "hsl(25,100%,50%)" }}
        >
          Industry
        </motion.p>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6 max-w-4xl"
        >
          {industry.name}
        </motion.h1>

        {/* tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-xl md:text-2xl text-white/50 font-light max-w-2xl leading-relaxed mb-4"
        >
          {industry.tagline}
        </motion.p>

        {/* divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-[3px] origin-left mt-2"
          style={{ background: "hsl(25,100%,50%)" }}
        />
      </section>

      {/* ── Description ── */}
      <section className="px-6 md:px-16 lg:px-24 pb-24 max-w-4xl">
        <div className="space-y-6">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              className={`leading-relaxed ${
                i === 0
                  ? "text-lg md:text-xl text-white/85"
                  : "text-base md:text-lg text-white/55"
              }`}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ── Proof of Work ── */}
      <section className="px-6 md:px-16 lg:px-24 pb-32">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.55 }}
          className="flex items-center gap-4 mb-10"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] mb-1" style={{ color: "hsl(25,100%,50%)" }}>
              Proof of Work
            </p>
            <h2 className="font-display font-black text-3xl md:text-4xl">Our Work in {industry.name}</h2>
          </div>
        </motion.div>

        {/* video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industry.videos.length > 0
            ? industry.videos.map((url, i) => (
                <VideoEmbed key={i} url={url} index={i} />
              ))
            : Array.from({ length: videoCount }).map((_, i) => (
                <VideoPlaceholder key={i} index={i} />
              ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-16 lg:px-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
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
          <button
            onClick={() => setScheduleOpen(true)}
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-base hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}
          >
            Start a Project
          </button>
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

// Export slug helper for nav use
export { slugify };
