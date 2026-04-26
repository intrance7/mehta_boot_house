"use client";

import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "../lib/configure";
import { StarIcon, SearchIcon, ShoeIcon, HandshakeIcon } from "../components/Icons";

export default function AboutPage() {
  return (
    <main className="py-20 px-4 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
        <p className="text-xs uppercase tracking-[0.4em] text-green-500 mb-4">Our Story</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          Premium Footwear Since 1987.
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Welcome to {SITE_CONFIG.name}. For over 35 years, we have been the trusted destination for authentic, high-quality footwear in Tohana and beyond.
        </p>
      </div>

      {/* ── Image & History ── */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
          {/* Placeholder for Store Image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center flex-col text-zinc-700">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mb-4">
              <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-3" /><path d="M9 9v1" /><path d="M9 13v1" /><path d="M9 17v1" />
            </svg>
            <span className="text-sm font-semibold tracking-widest uppercase">Est. 1987</span>
          </div>
        </div>
        <div className="space-y-6 text-zinc-300">
          <h2 className="text-3xl font-bold text-white mb-4">Our Heritage</h2>
          <p className="leading-relaxed">
            What started as a small local shop in Patel Nagar, Tohana, has grown into a landmark store. We pride ourselves on offering footwear that perfectly balances style, durability, and comfort.
          </p>
          <p className="leading-relaxed">
            We curate the best collections from top brands, ensuring that every shoe on our shelves meets our strict quality standards. From robust sports shoes to elegant formal wear, we cater to every step of your journey.
          </p>
          <p className="leading-relaxed font-semibold text-white">
            "Our philosophy is simple: Treat every customer like family and sell only what we would wear ourselves."
          </p>
        </div>
      </div>

      {/* ── Core Values ── */}
      <div className="mb-24 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Our Core Values</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: "Premium Quality", desc: "Every shoe is checked for durability and material excellence.", icon: <StarIcon size={24} /> },
            { title: "Wide Selection", desc: "From sports sneakers to elegant formal wear, we have it all.", icon: <SearchIcon size={24} /> },
            { title: "Comfort First", desc: "Handpicked selections ensuring all-day wearability.", icon: <ShoeIcon size={24} /> },
            { title: "Customer Trust", desc: "A legacy of 35+ years built on honest pricing and service.", icon: <HandshakeIcon size={24} /> },
          ].map((val) => (
            <div key={val.title} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 text-center hover:bg-zinc-900 transition duration-300">
              <div className="flex justify-center text-green-500 mb-4">{val.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-green-500 rounded-3xl p-10 md:p-16 text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-3xl md:text-4xl font-black text-black mb-6">Ready to upgrade your step?</h2>
        <Link href="/shop">
          <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition active:scale-95 shadow-xl">
            Explore Collection
          </button>
        </Link>
      </div>
    </main>
  );
}
