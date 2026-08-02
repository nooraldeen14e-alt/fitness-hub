/**
 * MobileNav — hamburger drawer for small screens.
 * Drop-in for every page: <MobileNav active="home" />
 */
import React from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

type Page = "home" | "about" | "contact";

const LINKS: { href: string; label: string; id: Page }[] = [
  { href: "/",        label: "Home",       id: "home"    },
  { href: "/about",   label: "About Us",   id: "about"   },
  { href: "/contact", label: "Contact Us", id: "contact" },
];

export default function MobileNav({ active }: { active: Page }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 z-[1001] relative"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <motion.span
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          className="block h-[2px] w-full bg-white origin-center"
        />
        <motion.span
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          className="block h-[2px] w-full bg-white"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          className="block h-[2px] w-full bg-white origin-center"
        />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0d0d0d] border-l border-white/10 z-[1000] md:hidden flex flex-col pt-24 px-8 gap-2"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
            >
              {LINKS.map(l => (
                <Link key={l.id} href={l.href} onClick={() => setOpen(false)}>
                  <div className={`py-4 text-xl font-display font-bold uppercase tracking-wide border-b border-white/5 transition-colors ${active === l.id ? "text-primary" : "text-white/70 hover:text-white"}`}>
                    {l.label}
                  </div>
                </Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)}>
                <button className="mt-8 w-full py-4 rounded-xl font-mono text-sm uppercase tracking-widest text-black font-bold"
                  style={{ background: "hsl(25,100%,50%)" }}>
                  Schedule a Meeting
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
