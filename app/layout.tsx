import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import { ScrollRevealProvider } from "./components/Scrollrevealprovider";
import { SITE_CONFIG } from "./lib/configure";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: `${SITE_CONFIG.tagline}. Sports, Casual, Formal & Kids Footwear. Order instantly on WhatsApp with fast delivery across India.`,
  keywords: ["shoes", "footwear", "boots", "Jaipur", "Mehta Boot House", "sneakers", "formal shoes"],
  openGraph: {
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_IN",
  },
};

// ─── Announcement messages — NO EMOJIS, text only ────────────────────────────
const ANNOUNCEMENTS = [
  "Free delivery on orders above ₹799",
  "Flat ₹100 OFF with code MEHTA100",
  "4.9 / 5 rating from 2,000+ customers",
  "New arrivals added every week",
  "Order in 30 seconds via WhatsApp",
  "7-day hassle-free returns",
  "Genuine footwear — no fakes",
];

// ─── Announcement Bar ─────────────────────────────────────────────────────────
function AnnouncementBar() {
  // Double the list so CSS translateX(-50%) creates a seamless loop
  const doubled = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div
      className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-xs py-2 overflow-hidden select-none"
      aria-label="Store announcements"
    >
      <div className="animate-marquee">
        {doubled.map((msg, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-12 whitespace-nowrap tracking-wide">
            {msg}
            <span className="w-1 h-1 rounded-full bg-zinc-600 inline-block" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-black text-white">

        {/* ① Global scroll reveal observer — MUST be here or .reveal stays opacity:0 */}
        <ScrollRevealProvider />

        <AnnouncementBar />

        <ToastProvider>
          <ProductsProvider>
            <CartProvider>
              <WishlistProvider>

              <Navbar />

              <main className="flex-1 animate-fade-in" style={{ animationDuration: "0.4s" }}>
                {children}
              </main>

              <Footer />
              <WhatsAppButton />

              </WishlistProvider>
            </CartProvider>
          </ProductsProvider>
        </ToastProvider>

      </body>
    </html>
  );
}