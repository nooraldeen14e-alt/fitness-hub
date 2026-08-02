import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import MobileNav from "@/components/MobileNav";

const SERVICES = [
  "Brand Identity", "Social Media Management", "Content Creation",
  "Paid Advertising", "Website Design", "Marketing Strategy",
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
          <Link href="/" className="font-sans text-sm font-medium text-white/60 hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="font-sans text-sm font-medium text-white/60 hover:text-white transition-colors">About Us</Link>
          <Link href="/contact" className="font-sans text-sm font-medium text-primary transition-colors">Contact Us</Link>
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
          </div>

          {/* Locations */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4">Our Locations</p>
            <div className="flex flex-col gap-3">
              {[
                { flag: "🇦🇪", city: "Dubai, UAE",         sub: "MENA Operations" },
                { flag: "🇨🇭", city: "Switzerland",        sub: "European HQ" },
                { flag: "🇸🇮", city: "Slovenia",           sub: "Creative Studio" },
              ].map(l => (
                <div key={l.city} className="flex items-center gap-3">
                  <span className="text-2xl">{l.flag}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{l.city}</p>
                    <p className="text-white/30 text-xs font-mono">{l.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services we cover */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 mb-4">What We Offer</p>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-full border text-xs font-mono"
                  style={{ borderColor: "hsl(25,100%,50%,0.35)", color: "hsl(25,100%,50%)", background: "hsl(25,100%,50%,0.06)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Response time badge */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <p className="text-white/60 text-sm">We typically respond within <span className="text-white font-semibold">24 hours</span></p>
          </div>
        </motion.div>
      </div>

      {/* ── Location + Map ── */}
      <div className="px-8 md:px-20 max-w-7xl mx-auto pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display font-black text-4xl md:text-5xl uppercase text-white mb-12"
        >
          Find Us
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-6 content-start">
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
                label: "LOCATION",
                lines: ["Dubai,", "United Arab Emirates"],
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 4.18 2 2 0 015.07 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>,
                label: "PHONE",
                lines: ["+971 50 572 5515"],
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>,
                label: "EMAIL",
                lines: ["sales@swissulife.com"],
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
                label: "HOURS",
                lines: ["Sunday – Thursday", "9:00 AM – 6:00 PM"],
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2" style={{ color: "hsl(25,100%,50%)" }}>
                  {item.icon}
                  <span className="font-mono text-xs font-bold tracking-widest">{item.label}</span>
                </div>
                <div className="font-sans text-sm text-white/70 leading-relaxed">
                  {item.lines.map((l, i) => <p key={i}>{l}</p>)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/10 min-h-[380px]"
          >
            <iframe
              title="Swissulife Media Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462562.61292108404!2d54.94793630000001!3d25.075323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbf7a3b4b5909f72f!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>

      {/* ── Footer strip ── */}
      <div className="border-t border-white/5 px-8 md:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/25 text-xs font-mono">
        <span>© {new Date().getFullYear()} Swissulife Media. All rights reserved.</span>
        <span>sales@swissulife.com</span>
      </div>
    </div>
  );
}
