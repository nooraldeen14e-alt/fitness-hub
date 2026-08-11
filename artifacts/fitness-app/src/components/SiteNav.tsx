import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import MobileNav from "@/components/MobileNav";
import ScheduleModal from "@/components/ScheduleModal";

interface SiteNavProps {
  /** Which nav item should appear "active" (white + larger) */
  active?: string;
}

const SERVICES = [
  { label: "Marketing Strategy",       slug: "marketing-strategy"     },
  { label: "Social Media Management",  slug: "social-media-management"},
  { label: "Google Ads",               slug: "google-ads"             },
  { label: "Podcast Production",       slug: "podcast-production"     },
  { label: "Website Design",           slug: "website-design"         },
  { label: "Event Management",         slug: "event-management"       },
  { label: "Influencer Marketing",     slug: "influencer-marketing"   },
  { label: "PR Management",            slug: "pr-management"          },
];

const INDUSTRIES = [
  { label: "Architecture",          slug: "architecture"        },
  { label: "Automotive",            slug: "automotive"          },
  { label: "Entertainment & Media", slug: "entertainment-media" },
  { label: "Fashion & Apparel",     slug: "fashion-apparel"     },
  { label: "Fitness & Wellness",    slug: "fitness-wellness"    },
  { label: "Food & Beverage",       slug: "food-beverage"       },
  { label: "Fragrance & Beauty",    slug: "fragrance-beauty"    },
  { label: "Government",            slug: "government"          },
  { label: "Real Estate",           slug: "real-estate"         },
  { label: "Technology & SaaS",     slug: "technology-saas"     },
];

export default function SiteNav({ active = "" }: SiteNavProps) {
  const [scheduleOpen, setScheduleOpen] = React.useState(false);

  const linkClass = (id: string) =>
    `font-sans font-medium transition-all duration-300 ${
      active === id
        ? "text-white text-base"
        : "text-primary text-sm hover:text-white"
    }`;

  return (
    <>
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/5"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="font-display font-bold text-white tracking-widest uppercase text-lg">
            SWISSULIFE <span style={{ color: "hsl(25,100%,50%)" }}>MEDIA</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={linkClass("home")}>Home</Link>

          {/* We Offer dropdown */}
          <div className="relative group">
            <button className={linkClass("offer") + " flex items-center gap-1"}>
              We Offer
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                className="transition-transform duration-200 group-hover:rotate-180">
                <path d="M2 4l4 4 4-4"/>
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-64 py-2">
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Industries dropdown */}
          <div className="relative group">
            <button className={linkClass("industries") + " flex items-center gap-1"}>
              Industries
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                className="transition-transform duration-200 group-hover:rotate-180">
                <path d="M2 4l4 4 4-4"/>
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-56 py-2">
                {INDUSTRIES.map(({ label, slug }) => (
                  <Link
                    key={slug}
                    href={`/industries/${slug}`}
                    className="block px-5 py-2.5 text-sm font-sans text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about"   className={linkClass("about")}>About Us</Link>
          <Link href="/contact" className={linkClass("contact")}>Contact Us</Link>
        </div>

        {/* CTA + mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScheduleOpen(true)}
            className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "hsl(25,100%,50%)" }}
          >
            Schedule a Meeting
          </button>
          <MobileNav active={active} />
        </div>
      </motion.nav>
    </>
  );
}
