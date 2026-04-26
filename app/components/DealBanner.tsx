"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDealEndTime } from "../lib/configure";

// ─── SVG Icons ────────────────────────────────────────────────
const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Countdown ────────────────────────────────────────────────
function useCountdown(endTime: Date) {
  const calc = () => {
    const d = Math.max(0, endTime.getTime() - Date.now());
    return { h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

export default function DealBanner() {
  const { h, m, s } = useCountdown(getDealEndTime());
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="reveal bg-green-500 text-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-4 text-center">
        <span className="font-bold text-sm tracking-wide">LIMITED TIME — Flat ₹100 OFF on orders above ₹999 · Code: MEHTA100</span>
        <div className="flex gap-1 font-mono font-black text-lg">
          {[pad(h), pad(m), pad(s)].map((u, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-black/15 px-2.5 py-0.5 rounded-lg tabular-nums">{u}</span>
              {i < 2 && <span className="opacity-40 text-sm">:</span>}
            </span>
          ))}
        </div>
        <Link href="/shop" className="flex items-center gap-1.5 font-bold text-xs tracking-widest uppercase hover:underline">
          Shop Now <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}