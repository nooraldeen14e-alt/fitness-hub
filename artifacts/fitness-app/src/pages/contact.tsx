import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import MobileNav from "@/components/MobileNav";

const SERVICES = [
  { label: "Marketing Strategy",      slug: "marketing-strategy" },
  { label: "Social Media Management", slug: "social-media-management" },
  { label: "Google Ads",              slug: "google-ads" },
  { label: "Podcast Production",      slug: "podcast-production" },
  { label: "Website Design",          slug: "website-design" },
  { label: "Event Management",        slug: "event-management" },
  { label: "Influencer Marketing",    slug: "influencer-marketing" },
  { label: "PR Management",           slug: "pr-management" },
];

export default function Contact() {
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", company: "", message: "",
  });
  const [status, setStatus] = React.useState<"idle" | "sending" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-1.5">
        {label}
      </label>
      {key === "message" ? (
        <textarea
          rows={4}
          placeholder={placeholder || label}
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder || label}
          value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          required={key !== "phone" && key !== "company"}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5">
        <Link href="/">
          <span className="font-display font-bold text-white tracking-widest uppercase text-lg cursor-pointer">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">Home</Link>

          {/* We Offer dropdown */}
          <div className="relative group">
            <button className="font-sans text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
              We Offer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:rotate-180"><path d="M2 4l4 4 4-4"/></svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-64 py-2">
                {[
                  { label: "Marketing Strategy",      slug: "marketing-strategy" },
                  { label: "Social Media Management", slug: "social-media-management" },
                  { label: "Google Ads",              slug: "google-ads" },
                  { label: "Podcast Production",      slug: "podcast-production" },
                  { label: "Website Design",          slug: "website-design" },
                  { label: "Event Management",        slug: "event-management" },
                  { label: "Influencer Marketing",    slug: "influencer-marketing" },
                  { label: "PR Management",           slug: "pr-management" },
                ].map(s => (
                  <Link key={s.slug} href={`/services/${s.slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about" className="font-sans text-sm font-medium text-primary hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="font-sans text-sm font-medium text-white transition-colors">Contact Us</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/contact">
            <button className="hidden md:inline-flex px-5 py-2.5 rounded-full text-black text-sm font-bold" style={{ background: "hsl(25,100%,50%)" }}>
              Get in Touch
            </button>
          </Link>
          <MobileNav active="contact" />
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="pt-32 pb-12 px-8 md:px-20 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-4">Let's Talk</p>
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-none mb-6">
            START YOUR<br />
            <span style={{ color: "hsl(25,100%,50%)" }}>BRAND JOURNEY.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            Tell us where you want your brand to go. We'll create the strategy, content, and digital presence to get you there.
          </p>
        </motion.div>
      </div>

      {/* ── Main grid ── */}
      <div className="px-8 md:px-20 max-w-7xl mx-auto pb-24 grid md:grid-cols-2 gap-16">

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
          {status === "done" ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ background: "hsl(25,100%,50%)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
              </div>
              <h2 className="font-display font-bold text-3xl mb-3">Message Sent!</h2>
              <p className="text-white/50 text-sm">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setForm({ name:"",email:"",phone:"",company:"",message:"" }); setStatus("idle"); }}
                className="mt-8 px-8 py-3 rounded-full text-black text-sm font-bold"
                style={{ background: "hsl(25,100%,50%)" }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                {field("name", "Full Name", "text", "Your name")}
                {field("company", "Company", "text", "Your brand / company")}
              </div>
              {field("email", "Email", "email", "your@email.com")}
              {field("phone", "Phone", "tel", "+971 XX XXX XXXX")}
              {field("message", "Message", "text", "Tell us about your brand and goals…")}

              {status === "error" && (
                <p className="text-red-400 text-xs font-mono">Something went wrong — please try again.</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 rounded-xl font-mono text-sm uppercase tracking-widest text-black font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ background: "hsl(25,100%,50%)" }}
              >
                {status === "sending" ? "Sending…" : "Send Message →"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Info panel */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col gap-10">

          {/* Services we cover */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4">What We Offer</p>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <Link key={s.slug} href={`/services/${s.slug}`}
                  className="px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-200 hover:bg-primary hover:border-primary hover:text-black"
                  style={{ borderColor: "hsl(25,100%,50%,0.6)", color: "#ffffff", background: "transparent" }}>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4">Our Locations</p>
            <div className="flex flex-col gap-3">
              {[
                { code: "ae", country: "UAE",         place: "Trade Center Second, Dubai" },
                { code: "ch", country: "Switzerland",  place: "Geneva" },
                { code: "si", country: "Slovenia",     place: "Ljubljana" },
              ].map(l => (
                <div key={l.country} className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w40/${l.code}.png`}
                    alt={l.country}
                    width={28}
                    height={20}
                    className="rounded-sm object-cover shrink-0"
                    style={{ height: 20, width: 28 }}
                  />
                  <div>
                    <p className="text-white text-sm font-semibold">{l.country}</p>
                    <p className="text-white/40 text-xs font-mono">{l.place}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-white/10 h-56">
            <iframe
              title="Swissulife Media Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.9!2d55.2892!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5965f4e68b01%3A0x54e7e70e9b3f3e8a!2sTrade%20Centre%202%2C%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "224px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Direct contact */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4">Direct Contact</p>
            <a href="mailto:sales@swissulife.com"
              className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(25,100%,50%)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-0.5">Email us</p>
                <p className="text-white font-medium group-hover:text-primary transition-colors">sales@swissulife.com</p>
              </div>
            </a>
            <a href="tel:+971505725515" className="flex items-center gap-3 group mt-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "hsl(25,100%,50%)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-0.5">Call us</p>
                <p className="text-white font-medium group-hover:text-primary transition-colors">+971 50 572 5515</p>
              </div>
            </a>
          </div>

          {/* Response time badge */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <p className="text-white/60 text-sm">We typically respond within <span className="text-white font-semibold">24 hours</span></p>
          </div>
        </motion.div>
      </div>

      {/* ── Footer strip ── */}
      <div className="border-t border-white/5 px-8 md:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-xs font-mono">
        <span>© {new Date().getFullYear()} Swissulife Media. All rights reserved.</span>
        <span>sales@swissulife.com</span>
      </div>
    </div>
  );
}
