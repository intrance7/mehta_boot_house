// =============================================
// SITE CONFIG — edit these values once
// =============================================

export const SITE_CONFIG = {
  name: "Mehta Boot House",
  tagline: "Premium Footwear Since 1987",
  phone: "919983673600",        // WhatsApp number with country code
  email: "mehtaboothouse@gmail.com",
  address: "Naya Bazaar Rd, Patel Nagar, Tohana, Haryana 125120",
  instagram: "https://instagram.com/mehtaboothouse",
  facebook: "https://facebook.com/mehtaboothouse",
  whatsappGreeting: "Hi! I'm browsing Mehta Boot House and need help.",
} as const;

// ─── INSTAGRAM REELS (LOCAL) ──────────────────────────────────
// Since Instagram blocks external embedding for your account, 
// download the 4 videos using any "Instagram Reel Downloader" website.
// Create a folder called "reels" inside the "public" folder.
// Save them there as reel1.mp4, reel2.mp4, etc.
export const LOCAL_REELS = [
  { video: "/reels/reel1.mp4", link: "https://www.instagram.com/reel/C-ACAUwxhcV/" },
  { video: "/reels/reel2.mp4", link: "https://www.instagram.com/reel/DBLKpOGRkPv/" },
  { video: "/reels/reel3.mp4", link: "https://www.instagram.com/reel/DE_0K__S1-l/" },
  { video: "/reels/reel4.mp4", link: "https://www.instagram.com/reel/DKwx90SSiV8/" },
];

export function createWhatsAppLink(msg: string) {
  return `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(msg)}`;
}

export const CATEGORIES = [
  { slug: "sports",  label: "Sports" },
  { slug: "casual",  label: "Casual" },
  { slug: "formal",  label: "Formal" },
  { slug: "kids",    label: "Kids" },
  { slug: "sandals", label: "Sandals" },
  { slug: "boots",   label: "Boots" },
  { slug: "women",   label: "Women" },
] as const;

export const SIZES = [6, 7, 8, 9, 10, 11];

export const PRICE_RANGES = [
  { label: "Under ₹500",     min: 0,    max: 500  },
  { label: "₹500 – ₹1000",  min: 500,  max: 1000 },
  { label: "₹1000 – ₹2000", min: 1000, max: 2000 },
  { label: "Above ₹2000",   min: 2000, max: Infinity },
] as const;

// Deal end time — set to midnight today + 24h for a rolling banner
export function getDealEndTime(): Date {
  const end = new Date();
  end.setHours(23, 59, 59, 0);
  return end;
}