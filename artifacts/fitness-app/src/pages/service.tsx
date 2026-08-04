import React from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import MobileNav from "@/components/MobileNav";

// ─── Service definitions ─────────────────────────────────────────────────────
// Edit the `description` and `points` for each service here.
export const SERVICES: Record<string, {
  name: string;
  tagline: string;
  description: string;
  points: string[];
}> = {
  "marketing-strategy": {
    name: "Marketing Strategy",
    tagline: "Built around your brand. Designed for results.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "social-media-management": {
    name: "Social Media Management",
    tagline: "Your brand voice, amplified across every platform.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "google-ads": {
    name: "Google Ads",
    tagline: "Precision targeting. Maximum return.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "podcast-production": {
    name: "Podcast Production",
    tagline: "From concept to publish — we handle everything.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "website-design": {
    name: "Website Design",
    tagline: "Websites that convert visitors into clients.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "event-management": {
    name: "Event Management",
    tagline: "Experiences that leave a lasting impression.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "influencer-marketing": {
    name: "Influencer Marketing",
    tagline: "The right voices, reaching the right audience.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
  },
  "pr-management": {
    name: "PR Management",
    tagline: "Shape your story. Protect your reputation.",
    description: "Write your description here.",
    points: ["Point one", "Point two", "Point three", "Point four"],
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
const Navbar = ({ currentSlug }: { currentSlug: string }) => {
  const [open, setOpen] = React.useState(false);

  return (
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

        {/* We Offer dropdown */}
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
                    s.slug === currentSlug
                      ? "text-white bg-white/5"
                      : "text-white/70 hover:text-white hover:bg-white/5"
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
};

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

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar currentSlug={slug} />

      {/* ── Hero ── */}
      <section className="relative pt-40 pb-24 px-8 md:px-16 overflow-hidden border-b border-white/10">
        {/* Orange glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 0% 0%, hsl(25,100%,50%,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-mono text-primary uppercase tracking-widest text-xs mb-4"
          >
            We Offer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black uppercase leading-[0.88] mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            {service.name}
          </motion.h1>

          {/* Orange accent bar */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0, height: 2, background: "linear-gradient(90deg, hsl(25,100%,50%), transparent)", borderRadius: 2 }}
            className="w-32 mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-white/50 font-sans text-lg max-w-xl"
          >
            {service.tagline}
          </motion.p>
        </div>
      </section>

      {/* ── Description ── */}
      <section className="py-24 px-8 md:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left: description */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <p className="font-mono text-primary uppercase tracking-widest text-xs mb-5">About this service</p>
            <p className="text-white/70 leading-relaxed text-base font-sans" style={{ whiteSpace: "pre-line" }}>
              {service.description}
            </p>
          </motion.div>

          {/* Right: bullet points */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="font-mono text-primary uppercase tracking-widest text-xs mb-5">What's included</p>
            <ul className="space-y-4">
              {service.points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "hsl(25,100%,50%)" }} />
                  <span className="text-white/70 font-sans text-base">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Other services ── */}
      <section className="py-16 px-8 md:px-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-white/30 uppercase tracking-widest text-xs mb-8">Other services</p>
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
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
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
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-display font-bold text-white/40 uppercase text-sm tracking-widest">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
          <span className="font-mono text-white/20 text-xs">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
