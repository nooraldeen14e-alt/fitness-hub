/**
 * MobileNav — hamburger drawer for small screens.
 * Drop-in for every page: <MobileNav active="home" />
 */
import React from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type Page = "home" | "about" | "contact";

const SERVICES = [
  { href: "/services/marketing-strategy",      label: "Marketing Strategy"      },
  { href: "/services/social-media-management", label: "Social Media Management" },
  { href: "/services/google-ads",              label: "Google Ads"              },
  { href: "/services/podcast-production",      label: "Podcast Production"      },
  { href: "/services/website-design",          label: "Website Design"          },
  { href: "/services/event-management",        label: "Event Management"        },
  { href: "/services/influencer-marketing",    label: "Influencer Marketing"    },
  { href: "/services/pr-management",           label: "PR Management"           },
];

const INDUSTRIES = [
  { href: "/industries/architecture",          label: "Architecture"          },
  { href: "/industries/automotive",            label: "Automotive"            },
  { href: "/industries/entertainment-media",   label: "Entertainment & Media" },
  { href: "/industries/fashion-apparel",       label: "Fashion & Apparel"     },
  { href: "/industries/fitness-wellness",      label: "Fitness & Wellness"    },
  { href: "/industries/food-beverage",         label: "Food & Beverage"       },
  { href: "/industries/fragrance-beauty",      label: "Fragrance & Beauty"    },
  { href: "/industries/government",            label: "Government"            },
  { href: "/industries/real-estate",           label: "Real Estate"           },
  { href: "/industries/technology-saas",       label: "Technology & SaaS"     },
];

function Accordion({ label, items, onClose }: { label: string; items: { href: string; label: string }[]; onClose: () => void }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-white/5">
      <button
        className="w-full flex items-center justify-between py-4 text-xl font-display font-bold uppercase tracking-wide text-white/70 hover:text-white transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        {label}
        <ChevronDown size={18} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ color: "hsl(25,100%,50%)" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col pb-3 pl-3 gap-0.5">
              {items.map(i => (
                <Link key={i.href} href={i.href} onClick={onClose}>
                  <div className="py-2.5 text-sm font-sans text-white/50 hover:text-white transition-colors">
                    {i.label}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MobileNav({ active }: { active: Page }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 z-[1001] relative"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-[2px] w-full bg-white origin-center" />
        <motion.span animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className="block h-[2px] w-full bg-white" />
        <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-[2px] w-full bg-white origin-center" />
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0d0d0d] border-l border-white/10 z-[1000] md:hidden flex flex-col pt-20 px-8 overflow-y-auto"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
            >
              <Link href="/" onClick={close}>
                <div className={`py-4 text-xl font-display font-bold uppercase tracking-wide border-b border-white/5 transition-colors ${active === "home" ? "text-primary" : "text-white/70 hover:text-white"}`}>
                  Home
                </div>
              </Link>

              <Accordion label="We Offer"   items={SERVICES}    onClose={close} />
              <Accordion label="Industries" items={INDUSTRIES}  onClose={close} />

              <Link href="/about" onClick={close}>
                <div className={`py-4 text-xl font-display font-bold uppercase tracking-wide border-b border-white/5 transition-colors ${active === "about" ? "text-primary" : "text-white/70 hover:text-white"}`}>
                  About Us
                </div>
              </Link>
              <Link href="/contact" onClick={close}>
                <div className={`py-4 text-xl font-display font-bold uppercase tracking-wide border-b border-white/5 transition-colors ${active === "contact" ? "text-primary" : "text-white/70 hover:text-white"}`}>
                  Contact Us
                </div>
              </Link>

              <Link href="/contact" onClick={close}>
                <button className="mt-8 mb-10 w-full py-4 rounded-xl font-mono text-sm uppercase tracking-widest text-black font-bold"
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
