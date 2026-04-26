"use client";

import { useProducts } from "./context/ProductsContext";
import ProductCard from "./components/ProductCard";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { CATEGORIES, SITE_CONFIG, getDealEndTime, LOCAL_REELS } from "./lib/configure";

// ─── SVG Icons ────────────────────────────────────────────────
const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const X = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const PlayIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
  </svg>
);
const StarIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 24 24"
    fill={filled ? "#facc15" : "none"}
    stroke="#facc15" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ─── Countdown ────────────────────────────────────────────────
function useCountdown(endTime: Date) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true);
    const calc = () => {
      const d = Math.max(0, endTime.getTime() - Date.now());
      return { h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [endTime.getTime()]);

  return mounted ? t : { h: 0, m: 0, s: 0 };
}

// ─── Animated counter ─────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = ref.current; 
    if (!el) return;
    
    let intervalId: ReturnType<typeof setInterval>;
    let n = 0; 
    const step = Math.max(1, Math.ceil(target / 55));
    
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; 
      io.disconnect();
      intervalId = setInterval(() => { 
        n = Math.min(n + step, target); 
        setV(n); 
        if (n >= target) clearInterval(intervalId); 
      }, 20);
    }, { threshold: 0.5 });
    
    io.observe(el); 
    
    return () => {
      io.disconnect();
      if (intervalId) clearInterval(intervalId);
    };
  }, [target]);
  
  return <span ref={ref}>{v.toLocaleString("en-IN")}{suffix}</span>;
}

// ═══════════════════════════════════════════════════════════════
// POPUP 1 — Exit Intent / First Visit Discount
// Shows after 8 seconds or on mouse leave (desktop)
// ═══════════════════════════════════════════════════════════════
function DiscountPopup() {
  const [show, setShow]         = useState(false);
  const [email, setEmail]       = useState("");
  const [claimed, setClaimed]   = useState(false);
  const hasShown                = useRef(false);

  const trigger = useCallback(() => {
    if (hasShown.current) return;
    hasShown.current = true;
    setShow(true);
  }, []);

  useEffect(() => {
    // Auto trigger after 8 seconds
    const t = setTimeout(trigger, 8000);

    // Exit intent on desktop
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => { clearTimeout(t); document.removeEventListener("mouseleave", onMouseLeave); };
  }, [trigger]);

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" onClick={() => setShow(false)} />
      <div className="fixed z-[51] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-[760px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-in">
        
        {/* Absolute Close Button for the entire modal */}
        <button onClick={() => setShow(false)}
          className="absolute top-5 right-5 z-20 text-zinc-500 hover:text-white transition bg-zinc-900/50 hover:bg-zinc-800 rounded-full p-2 backdrop-blur-sm">
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 h-full relative">
          {/* Left — Visual (Superkicks style) */}
          <div className="hidden md:flex flex-col bg-zinc-950 p-10 text-white relative overflow-hidden justify-center border-r border-zinc-800">
            {/* Background flair */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full" />
            
            <h2 className="text-2xl font-black tracking-widest text-center mb-10 uppercase relative z-10">Mehta Boot House</h2>
            <div className="flex justify-center flex-wrap gap-4 relative z-10">
              {[
                { i: <TruckIcon />, t: "Fast Shipping" },
                { i: <StarIcon filled />, t: "Exclusive Drops" },
                { i: <ShieldIcon />, t: "Global Curation" },
              ].map(f => (
                <div key={f.t} className="flex flex-col items-center justify-center gap-3 border border-zinc-800 hover:border-green-500/50 transition-colors rounded-2xl p-4 w-28 bg-zinc-900/80 shadow-lg">
                  <span className="text-green-400">{f.i}</span>
                  <span className="text-[10px] text-zinc-300 font-bold text-center leading-tight">{f.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="p-8 md:p-10 relative bg-zinc-900 flex flex-col justify-center">
            
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-green-400 mb-2">₹100 OFF</div>
              <p className="text-zinc-400 text-xs">Unlock free shipping & offers on your first order.</p>
            </div>

            {claimed ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl p-4 text-sm text-center font-medium animate-fade-in">
                Code sent! Use <strong className="text-white">MEHTA100</strong> at checkout.
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your Email*"
                  className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 focus:border-green-500 text-white rounded-xl text-sm outline-none transition-all placeholder:text-zinc-600"
                />
                <button
                  onClick={() => { if (email.includes("@")) setClaimed(true); }}
                  className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-lg"
                >
                  Submit
                </button>
              </div>
            )}

            <p className="text-[10px] text-zinc-500 mt-6 text-center leading-relaxed">
              I accept that I have read & understood the<br/>
              <span className="underline cursor-pointer hover:text-white transition-colors">Privacy Policy</span> and <span className="underline cursor-pointer hover:text-white transition-colors">T&Cs</span>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// POPUP 2 — Live "Someone just ordered" social proof toast
// ═══════════════════════════════════════════════════════════════
const SOCIAL_PROOFS = [
  { name: "Rahul from Jaipur", action: "ordered Nike Style Sneakers", time: "2 min ago" },
  { name: "Priya from Delhi", action: "added Casual Loafers to cart", time: "5 min ago" },
  { name: "Ankit from Lucknow", action: "ordered Formal Oxford Shoes", time: "8 min ago" },
  { name: "Sunita from Chandigarh", action: "just reviewed — 5 stars!", time: "12 min ago" },
];

function SocialProofToast() {
  const [current, setCurrent] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    const show = () => {
      setCurrent(idx.current % SOCIAL_PROOFS.length);
      setVisible(true);
      idx.current++;
      setTimeout(() => setVisible(false), 4500);
    };

    const t1 = setTimeout(show, 5000); // first after 5s
    const interval = setInterval(show, 12000); // every 12s after

    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  if (current === null || !visible) return null;
  const proof = SOCIAL_PROOFS[current];

  return (
    <div className={`fixed bottom-24 left-4 z-40 max-w-[280px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl px-4 py-3 flex gap-3 items-start transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-400 font-bold text-sm">
        {proof.name[0]}
      </div>
      <div>
        <p className="text-xs font-semibold text-zinc-200">{proof.name}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{proof.action}</p>
        <p className="text-[10px] text-zinc-500 mt-1">{proof.time}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. HERO — full-screen with background image
// ═══════════════════════════════════════════════════════════════
function Hero() {
  const [heroIndex, setHeroIndex] = useState(0);

  // Hero slides
  const slides = [
    {
      bg: "from-zinc-900 via-zinc-800 to-black",
      accent: "text-green-400",
      label: "New Season",
      heading: "Walk in\nConfidence",
      sub: "Curated footwear for every step of your journey.",
      cta: "Shop Sports",
      href: "/shop?category=sports",
    },
    {
      bg: "from-stone-900 via-neutral-800 to-black",
      accent: "text-amber-400",
      label: "Formal Collection",
      heading: "Dress to\nImpress",
      sub: "Premium formal shoes handpicked for professionals.",
      cta: "Shop Formal",
      href: "/shop?category=formal",
    },
    {
      bg: "from-slate-900 via-zinc-800 to-black",
      accent: "text-sky-400",
      label: "Kids Range",
      heading: "Little Feet,\nBig Style",
      sub: "Comfortable, durable shoes designed for growing kids.",
      cta: "Shop Kids",
      href: "/shop?category=kids",
    },
  ];

  useEffect(() => {
    const id = setInterval(() => setHeroIndex(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[heroIndex];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background Image (Superkicks style) */}
      <div className="absolute inset-0">
        <img src="/shoes1.png" alt="Hero background" className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow" />
      </div>
      {/* Dark gradient overlay so text remains readable */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950 transition-all duration-1000`} />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 mix-blend-overlay" />

      {/* Green accent glow bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 100%, rgba(34,197,94,0.15) 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
        <div className="max-w-2xl">
          <span className={`text-xs font-bold uppercase tracking-[0.35em] ${slide.accent} mb-6 block animate-slide-up animate-slide-up-delay-1`}>
            {slide.label} — Est. 1987
          </span>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-7 animate-slide-up animate-slide-up-delay-2 text-white">
            {slide.heading.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className={slide.accent}>{line}</span> : line}
              </span>
            ))}
          </h1>

          <p className="text-zinc-400 text-lg max-w-md leading-relaxed mb-10 animate-slide-up animate-slide-up-delay-3">
            {slide.sub}
          </p>

          <div className="flex flex-wrap gap-4 animate-slide-up animate-slide-up-delay-4">
            <Link href={slide.href}>
              <button className="group flex items-center gap-3 bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all text-sm tracking-wide shadow-lg">
                {slide.cta}
                <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
              </button>
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(SITE_CONFIG.whatsappGreeting)}`}
              target="_blank" rel="noopener noreferrer"
            >
              <button className="flex items-center gap-2.5 border border-white/20 hover:border-green-400/60 hover:text-green-400 font-semibold px-8 py-4 rounded-2xl transition-all text-sm backdrop-blur-sm">
                <WaIcon /> Chat With Us
              </button>
            </a>
          </div>

          {/* Trust micro-signals */}
          <div className="flex flex-wrap gap-5 mt-12 animate-slide-up animate-slide-up-delay-5">
            {["2,000+ customers", "Free delivery ₹799+", "7-day returns"].map(t => (
              <span key={t} className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0" />{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setHeroIndex(i)}
            className={`transition-all duration-300 rounded-full ${i === heroIndex ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 right-8 flex flex-col items-center gap-2 text-zinc-600 animate-float hidden md:flex">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-zinc-600" />
        <p className="text-[10px] uppercase tracking-widest" style={{writingMode:"vertical-rl"}}>Scroll</p>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. STATS BAR
// ═══════════════════════════════════════════════════════════════
function StatsBar() {
  const stats = [
    { v: 2000, s: "+", label: "Happy Customers" },
    { v: 500,  s: "+", label: "Products" },
    { v: 37,   s: "",  label: "Years in Business" },
    { v: 50,   s: "+", label: "Cities Delivered" },
  ];
  return (
    <section className="border-y border-zinc-900 bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 reveal-group">
        {stats.map(s => (
          <div key={s.label} className="reveal text-center group cursor-default">
            <p className="text-3xl md:text-4xl font-black text-green-400 tabular-nums transition-all duration-300 group-hover:text-green-300 group-hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">
              <Counter target={s.v} suffix={s.s} />
            </p>
            <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2 transition-colors duration-300 group-hover:text-zinc-300">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. DEAL BANNER
// ═══════════════════════════════════════════════════════════════
function DealBanner() {
  const { h, m, s } = useCountdown(getDealEndTime());
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="reveal bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-black shadow-[0_0_40px_rgba(34,197,94,0.15)] relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-4 text-center">
        <span className="font-bold text-sm tracking-wide">LIMITED TIME — Flat ₹100 OFF on orders above ₹999 · Code: MEHTA100</span>
        <div className="flex gap-1 font-mono font-black text-lg">
          {[pad(h), pad(m), pad(s)].map((u, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-black/20 px-2.5 py-0.5 rounded-lg tabular-nums shadow-inner">{u}</span>
              {i < 2 && <span className="opacity-50 text-sm">:</span>}
            </span>
          ))}
        </div>
        <Link href="/shop" className="flex items-center gap-1.5 font-bold text-xs tracking-widest uppercase hover:underline ml-2">
          Shop Now <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. CATEGORY STRIP — Neeman's style with floating shoes
// ═══════════════════════════════════════════════════════════════
function CategoryStrip() {
  const cats = [
    { slug: "sports",  label: "Sports",  bg: "from-blue-900/30 to-blue-950", img: "/cat-sports.png" },
    { slug: "casual",  label: "Casual",  bg: "from-rose-900/30 to-rose-950", img: "/cat-casual.png" },
    { slug: "formal",  label: "Formal",  bg: "from-zinc-800 to-zinc-900", img: "/cat-formal.png" },
    { slug: "kids",    label: "Kids",    bg: "from-stone-800 to-stone-900", img: "/cat-kids.png" },
    { slug: "sandals", label: "Sandals", bg: "from-amber-900/30 to-amber-950", img: "/cat-sandals.png" },
    { slug: "boots",   label: "Boots",   bg: "from-zinc-800 to-zinc-900", img: "/cat-boots.png" },
    { slug: "women",   label: "Women",   bg: "from-fuchsia-900/30 to-fuchsia-950", img: "/cat-women.png" },
  ];

  return (
    <section className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-16 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-2">Explore by style</p>
            <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-zinc-500 hover:text-white flex items-center gap-1.5 transition-colors">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, 7-column grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-8 pt-16 scrollbar-hide md:grid md:grid-cols-7 reveal-group">
          {cats.map(cat => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="reveal group flex-shrink-0 w-36 md:w-auto relative mt-8 md:mt-12 block"
            >
              {/* Pill background container */}
              <div
                className={`w-full h-36 rounded-3xl bg-gradient-to-br ${cat.bg} border border-white/5 flex flex-col items-center justify-end pb-5 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_15px_40px_rgba(255,255,255,0.05)]`}
              >
                <p className="text-center text-sm font-bold text-zinc-300 group-hover:text-white transition-colors tracking-wide z-10 relative">
                  {cat.label}
                </p>
              </div>

              {/* Floating Shoe popping out of top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-40 h-40 flex items-center justify-center pointer-events-none transition-transform duration-700 group-hover:-translate-y-6 group-hover:scale-110">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-[120%] h-[120%] object-contain"
                  style={{ filter: "drop-shadow(0px 25px 15px rgba(0,0,0,0.8))" }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. FEATURED PRODUCTS — with tab filter, white card layout
// ═══════════════════════════════════════════════════════════════
function FeaturedProducts() {
  const { products, loading } = useProducts();
  const tabs = ["All", "New Arrivals", "On Sale", "Trending"] as const;
  type Tab = typeof tabs[number];
  const [active, setActive] = useState<Tab>("All");

  const filtered = products.filter(p => {
    if (active === "On Sale")      return ["SALE","sale","Trending"].includes(p.tag ?? "");
    if (active === "New Arrivals") return ["NEW","new"].includes(p.tag ?? "");
    if (active === "Trending")     return ["HOT","hot","Trending","Best Seller"].includes(p.tag ?? "");
    return true;
  });

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-2">Handpicked</p>
            <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Featured Collection</h2>
          </div>
          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-2xl shadow-sm overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActive(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap tracking-wide transition-all
                  ${active === tab ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-white"}`}
              >{tab}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500 animate-pulse">Loading collection...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 animate-fade-in">
            <p className="mb-3">No products in this tab yet.</p>
            <button onClick={() => setActive("All")} className="text-sm underline hover:text-white transition">View all</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 reveal-group">
            {filtered.map(p => (
              <div key={p.id} className="reveal card-lift">
                <ProductCard
                  id={p.id} name={p.name} price={p.price}
                  originalPrice={p.originalPrice}
                  image={p.images && p.images.length > 0 ? p.images[0] : "/shoes1.png"} 
                  hoverImage={p.images && p.images.length > 1 ? p.images[1] : undefined}
                  tag={p.tag} category={p.category}
                />
              </div>
            ))}
          </div>
        )}

        <div className="reveal text-center mt-14">
          <Link href="/shop">
            <button className="group inline-flex items-center gap-3 border-2 border-zinc-700 hover:border-white text-zinc-300 hover:text-white px-10 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all">
              View Full Collection <span className="group-hover:translate-x-1 transition-transform"><ArrowRight /></span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 6. BRAND FEATURES — illustrated cards (like Asian Footwear)
// ═══════════════════════════════════════════════════════════════
function BrandFeatures() {
  const features = [
    {
      title: "Designed for Style.",
      desc: "Our shoes are crafted to make a statement, blending modern aesthetics with timeless design.",
      icon: (
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="60" rx="38" ry="14" fill="#3f3f46"/>
          <path d="M15 62 Q30 35 55 38 Q80 38 85 55" stroke="#71717a" strokeWidth="3" fill="#27272a"/>
          <path d="M55 38 Q80 38 85 55 L75 58 Q68 45 55 44 Z" fill="#22c55e"/>
          <circle cx="72" cy="32" r="5" fill="#a1a1aa"/>
          <path d="M70 30 L78 24" stroke="#a1a1aa" strokeWidth="2"/>
          <path d="M74 28 L80 30" stroke="#a1a1aa" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      title: "Engineered for Performance.",
      desc: "Built with cutting-edge materials to support your every move, from morning runs to long workdays.",
      icon: (
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="62" rx="36" ry="12" fill="#3f3f46"/>
          <path d="M18 64 Q32 34 54 37 Q78 37 82 56" stroke="#71717a" strokeWidth="3" fill="#27272a"/>
          <path d="M54 37 Q78 37 82 56 L72 60 Q66 44 54 44 Z" fill="#3b82f6"/>
          {/* Speedometer */}
          <circle cx="72" cy="25" r="14" fill="none" stroke="#71717a" strokeWidth="2"/>
          <path d="M62 28 A11 11 0 0 1 82 28" stroke="#a1a1aa" strokeWidth="2" strokeLinecap="round"/>
          <line x1="72" y1="25" x2="79" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="72" cy="25" r="2" fill="#a1a1aa"/>
        </svg>
      ),
    },
    {
      title: "Made for Comfort.",
      desc: "Experience all-day comfort with our cushioned insoles and breathable upper materials.",
      icon: (
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="65" rx="32" ry="11" fill="#3f3f46"/>
          {/* Foot outline */}
          <path d="M35 65 Q33 50 36 40 Q38 32 44 28 L48 26 L52 28 Q56 34 54 42 L50 65Z" fill="#27272a" stroke="#71717a" strokeWidth="1.5"/>
          {/* Shoe profile */}
          <path d="M20 65 Q25 52 35 48 Q42 44 52 46 Q68 44 72 55 L70 65Z" fill="#27272a" stroke="#a1a1aa" strokeWidth="2"/>
          <path d="M52 46 Q68 44 72 55 L62 58 Q56 48 52 50Z" fill="#22c55e"/>
          {/* Cushion line */}
          <path d="M22 62 Q46 58 68 61" stroke="#71717a" strokeWidth="1.5" strokeDasharray="3 2"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal text-center mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-3">Our promise</p>
          <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Why Mehta Boot House?</h2>
          <p className="text-zinc-500 text-sm mt-3 max-w-md mx-auto">
            35+ years of trust. We stand behind every pair we sell.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal-group">
          {features.map(f => (
            <div key={f.title}
              className="reveal group bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-green-500/30 hover:shadow-[0_10px_40px_-15px_rgba(34,197,94,0.15)] rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-1.5 backdrop-blur-md relative overflow-hidden"
            >
              {/* Subtle radial glow on hover */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-center mb-6 relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
              <h3 className="font-bold text-zinc-100 text-base mb-3 relative z-10 group-hover:text-white transition-colors">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="reveal mt-14 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: <ShieldIcon />, label: "Authentic Guarantee" },
            { icon: <TruckIcon />, label: "Fast Delivery" },
            { icon: <RefreshIcon />, label: "7-Day Returns" },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-4 p-5 border border-zinc-800 bg-zinc-900/30 rounded-2xl">
              <span className="text-green-500">{t.icon}</span>
              <p className="font-semibold text-sm text-zinc-300">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 7. BEST SELLERS — horizontal scroll
// ═══════════════════════════════════════════════════════════════
function BestSellers() {
  const { products, loading } = useProducts();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (d: "left" | "right") =>
    scrollRef.current?.scrollBy({ left: d === "right" ? 300 : -300, behavior: "smooth" });

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-2">Customer favourites</p>
            <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Best Sellers</h2>
          </div>
          <div className="flex gap-2">
            {(["left","right"] as const).map((d,i) => (
              <button key={d} onClick={() => scroll(d)}
                className="w-10 h-10 border-2 border-zinc-700 hover:border-white rounded-2xl flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 bg-zinc-900"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {i === 0
                    ? <polyline points="15 18 9 12 15 6"/>
                    : <polyline points="9 18 15 12 9 6"/>}
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x reveal">
          {loading ? (
            <div className="w-full text-center py-10 text-zinc-500 animate-pulse">Loading best sellers...</div>
          ) : (
            products.map(p => (
              <div key={p.id} className="min-w-[260px] snap-start card-lift">
                <ProductCard
                id={p.id} name={p.name} price={p.price}
                originalPrice={p.originalPrice}
                image={p.images && p.images.length > 0 ? p.images[0] : "/shoes1.png"} 
                hoverImage={p.images && p.images.length > 1 ? p.images[1] : undefined}
                tag={p.tag} category={p.category}
                variant="portrait"
              />
            </div>
          )))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 8. INSTAGRAM TRENDS GALLERY — like Asian Footwear
// ═══════════════════════════════════════════════════════════════
function InstagramTrends() {

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-zinc-400"><InstagramIcon /></span>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">@mehta_boot_house_tohana</p>
          </div>
          <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Trending on Instagram</h2>
          <p className="text-zinc-500 text-sm mt-2">Watch our latest collections and offers</p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x reveal-group px-2">
          {LOCAL_REELS.map((reel, i) => (
            <div key={i} className="reveal flex-shrink-0 w-[300px] md:w-[320px] snap-start">
              <a href={reel.link} target="_blank" rel="noopener noreferrer" className="block relative rounded-[2rem] overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] aspect-[9/16] group">
                
                {/* Fallback image shown before video loads or if video is missing */}
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center -z-10">
                  <span className="text-zinc-600 text-sm">Video Loading...</span>
                </div>

                <video
                  src={reel.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

                {/* Profile header */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center p-1.5 overflow-hidden backdrop-blur-sm">
                    <InstagramIcon />
                  </div>
                  <p className="text-white text-xs font-bold shadow-black drop-shadow-md">@mehta_boot_house_tohana</p>
                </div>

                {/* Play button indicator in center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <span className="text-white ml-1.5"><PlayIcon size={24} /></span>
                  </div>
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/40 backdrop-blur-md border border-white/20 px-4 py-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-bold">Watch on Instagram</p>
                      <p className="text-zinc-300 text-[10px]">Click to view full reel</p>
                    </div>
                    <div className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg">
                      Open
                    </div>
                  </div>
                </div>

              </a>
            </div>
          ))}
        </div>

        {/* Follow button */}
        <div className="reveal text-center mt-10">
          <a href={SITE_CONFIG.instagram} target="_blank" rel="noopener noreferrer">
            <button className="group inline-flex items-center gap-3 border-2 border-zinc-700 bg-zinc-900 text-white hover:bg-white hover:border-white hover:text-black px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-lg">
              <InstagramIcon />
              Follow @mehtaboothouse
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 9. TESTIMONIALS
// ═══════════════════════════════════════════════════════════════
const REVIEWS = [
  { name: "Rahul S.", city: "Jaipur", rating: 5, text: "Got my pair in 2 days. Perfect fit and quality is exceptional at this price point.", product: "Sports Sneakers" },
  { name: "Priya M.", city: "Delhi", rating: 5, text: "Ordered formal shoes for my husband's interview. Arrived early, beautifully packed.", product: "Formal Oxford" },
  { name: "Ankit J.", city: "Chandigarh", rating: 4, text: "WhatsApp ordering is incredibly smooth. Team guided me perfectly on sizing.", product: "Casual Loafers" },
  { name: "Sunita K.", city: "Ludhiana", rating: 5, text: "Kids sandals — outstanding durability. My son hasn't stopped wearing them.", product: "Kids Sandals" },
];

function Testimonials() {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500 mb-2">Social proof</p>
            <h2 className="text-3xl font-black tracking-tight text-zinc-100">What Customers Say</h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-green-400">4.9</p>
            <div className="flex justify-end gap-0.5 mt-1">{[1,2,3,4,5].map(s => <StarIcon key={s} filled />)}</div>
            <p className="text-xs text-zinc-500 mt-1">2,000+ verified reviews</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 reveal-group">
          {REVIEWS.map(r => (
            <div key={r.name}
              className="reveal bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= r.rating}/>)}</div>
              <p className="text-zinc-300 text-sm leading-relaxed flex-1">"{r.text}"</p>
              <div className="border-t border-zinc-800 pt-4">
                <p className="font-semibold text-sm text-zinc-200">{r.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{r.city} — {r.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 10. NEWSLETTER
// ═══════════════════════════════════════════════════════════════
function Newsletter() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  return (
    <section className="reveal py-20 border-t border-zinc-800">
      <div className="max-w-xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-400 mb-4">Stay in the loop</p>
        <h2 className="text-3xl font-black text-zinc-100 tracking-tight mb-3">Exclusive Access</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Early access to new drops, private sales, restocks. No spam — ever.</p>

        {status === "ok" ? (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl py-4 px-6 animate-scale-in text-sm font-medium">
            You&apos;re subscribed! Watch your inbox for exclusives.
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (email.includes("@")) setStatus("ok"); else setStatus("err"); }} className="flex gap-3 max-w-sm mx-auto">
            <input
              type="email" value={email}
              onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="your@email.com"
              className={`flex-1 px-5 py-3.5 border border-zinc-800 bg-zinc-950 text-white rounded-2xl text-sm outline-none transition-all placeholder:text-zinc-600
                ${status === "err" ? "border-red-400" : "focus:border-green-500"}`}
            />
            <button type="submit" className="px-6 py-3.5 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 active:scale-95 transition-all text-sm whitespace-nowrap shadow-lg">
              Join
            </button>
          </form>
        )}
        {status === "err" && <p className="text-red-500 text-xs mt-2 animate-fade-in">Enter a valid email.</p>}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div>
      <DiscountPopup />
      <SocialProofToast />
      <Hero />
      <StatsBar />
      <DealBanner />
      <CategoryStrip />
      <FeaturedProducts />
      <BrandFeatures />
      <BestSellers />
      <InstagramTrends />
      <Testimonials />
      <Newsletter />
    </div>
  );
}