// ─── Industry data ────────────────────────────────────────────────────────────
// To add a video: push a YouTube embed URL into the `videos` array for an industry.
// e.g. "https://www.youtube.com/embed/VIDEO_ID"

export type VideoEntry = string | { url: string; poster?: string };

export const INDUSTRIES: Record<string, {
  name: string;
  tagline: string;
  description: string;
  videos: VideoEntry[];
}> = {
  "fashion-apparel": {
    name: "Fashion & Apparel",
    tagline: "Campaigns that make people stop, look, and buy.",
    description: `Fashion moves fast — and your content needs to move faster. We work with fashion and apparel brands across the GCC and Europe to build content strategies that position you as a taste-maker, not just a seller.\n\nFrom seasonal lookbook shoots and reels to influencer seeding and paid media, we handle the full marketing picture. Our team understands the language of fashion — the aesthetics, the pacing, the platforms, and the communities that drive purchase intent.\n\nWhether you're a luxury label, a streetwear brand, or an emerging designer, we build campaigns that make people feel something — and then make them buy.`,
    videos: [
      "/fashion-reel-1.mp4",
      "/fashion-reel-2.mp4",
      "/fashion-reel-3.mp4",
      "/fashion-reel-4.mp4",
      "/fashion-reel-5.mp4",
    ],
  },
  "fitness-wellness": {
    name: "Fitness & Wellness",
    tagline: "Building brands people trust with their bodies.",
    description: `Fitness and wellness brands live and die by credibility. Audiences are savvy — they can tell instantly whether a brand actually understands health, or is just selling them something.\n\nWe work with gyms, supplement brands, wellness apps, and personal trainers to build content that educates, inspires, and converts. Our campaigns blend transformation stories, expert positioning, and performance-driven paid media into a full-funnel strategy.\n\nFrom before-and-after reels to long-form podcast content and Google Ads for gym sign-ups — we know what it takes to grow a fitness brand in a crowded market.`,
    videos: ["/fitness-reel-1.mp4", "/fitness-reel-2.mp4", "/fitness-reel-3.mp4", "/fitness-reel-4.mp4"],
  },
  "food-beverage": {
    name: "Food & Beverage",
    tagline: "Making your food impossible to scroll past.",
    description: `Food content is the most competitive space on social media — and the most rewarding when done right. We create content that makes people hungry, drives foot traffic, and builds loyal communities around your brand.\n\nOur team handles everything from restaurant photography and short-form video to influencer campaigns and delivery platform optimisation. We know how to capture texture, colour, and atmosphere in a way that translates into reservations and orders.\n\nWe've worked with restaurants, cafés, cloud kitchens, FMCG brands, and food delivery services across the region — and every campaign is built around one goal: making people want to eat what you're making.`,
    videos: ["/food-reel-1.mp4", "/food-reel-2.mp4", "/food-reel-3.mp4", "/food-reel-4.mp4", "/food-reel-5.mp4", "/food-reel-6.mp4", "/food-reel-7.mp4"],
  },
  "fragrance-beauty": {
    name: "Fragrance & Beauty",
    tagline: "Sensory brands deserve sensory storytelling.",
    description: `Fragrance and beauty brands sell emotion before they sell product. The brand story, the visual world, and the feeling of aspiration — that's what moves units at this level.\n\nWe work with perfume houses, cosmetics brands, and skincare lines to build campaigns that feel premium, authentic, and culturally relevant. From editorial-style content and influencer gifting campaigns to Arabic-language social strategy and paid media, we position your brand exactly where your audience is already spending time.\n\nOur campaigns have driven everything from launch sell-outs to regional brand awareness that rival global houses.`,
    videos: ["/beauty-reel-1.mp4", "/beauty-reel-2.mp4", "/beauty-reel-3.mp4", "/beauty-reel-4.mp4", "/beauty-reel-5.mp4"],
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
  "automotive": {
    name: "Automotive",
    tagline: "Content that makes engines and audiences rev.",
    description: `Automotive marketing is visual, emotional, and deeply tribal. Whether you're selling supercars or daily drivers, the audience expects world-class production and content that speaks their language.\n\nWe produce cinematic automotive content — track shoots, lifestyle campaigns, launch events, and influencer partnerships — for dealerships, importers, and manufacturers across the Middle East. Our team understands the car community: the culture, the platforms (Instagram, YouTube, TikTok), and the content formats that drive genuine engagement.\n\nWe've built campaigns for premium and exotic brands that have generated millions of views and driven showroom floor traffic across the GCC.`,
    videos: [
      { url: "/automotive-reel-1.mp4", poster: "/automotive-reel-1-poster.png" },
      "/automotive-reel-2.mp4",
      "/automotive-reel-3.mp4",
      "/automotive-reel-4.mp4",
      "/automotive-reel-5.mp4",
      { url: "/automotive-reel-6.mp4", poster: "/automotive-reel-6-poster.png" },
    ],
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
  "architecture": {
    name: "Architecture",
    tagline: "Spaces built to impress. Content built to sell.",
    description: `Architecture is one of the most visual industries in the world — yet most firms still rely on static renders and PDFs to win clients. We change that.\n\nWe produce cinematic walkthroughs, drone coverage, launch campaigns, and social content for architectural firms, real estate developers, and interior design studios across the Middle East and Europe. Our work translates the vision behind a building into content that resonates before the first brick is laid.\n\nFrom concept visualisation to project completion reels, we handle the full content lifecycle — helping firms attract investors, win tenders, and build a brand that stands as tall as their buildings.`,
    videos: [
      "/architecture-reel-1.mp4",
      "/architecture-reel-2.mp4",
      "/architecture-reel-3.mp4",
      "/architecture-reel-4.mp4",
    ],
  },

  "government": {
    name: "Government",
    tagline: "Communicating with clarity, authority, and reach.",
    description: `Government entities and public institutions require a different standard of communication — precise, trustworthy, and built for mass audiences. We help government bodies, ministries, and public-sector organisations craft digital strategies that inform, engage, and inspire public confidence.\n\nFrom large-scale awareness campaigns and multilingual social media management to event coverage and press content, we deliver communication that meets the standards of public office while connecting with citizens across every platform.\n\nOur work spans national initiatives, regional authorities, and municipal campaigns — always with the accuracy, sensitivity, and production quality that government communication demands.`,
    videos: ["/government-reel.mp4", "/government-reel-2.mp4", "/government-reel-3.mp4"],
  },
};
