"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_CONFIG, CATEGORIES } from "../lib/configure";
import { MapPinIcon, PhoneIcon, ClockIcon, InstagramIcon, FacebookIcon, MessageIcon, CheckCircleIcon, TruckIcon, CreditCardIcon, RefreshCwIcon, ShieldCheckIcon, StarIcon } from "./Icons";

// ─── Google Maps embed src (dark-mode filter applied in CSS) ──────────────────
// Uses the "maps" embed with the store address as a query — no API key needed.
const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(SITE_CONFIG.address) +
  "&t=&z=15&ie=UTF8&iwloc=&output=embed";

const MAPS_LINK =
  "https://www.google.com/maps?sca_esv=33295543d8b8cd1e&biw=1440&bih=803&output=search&q=mehta+boot+house+tohana&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKp9lEhFAN_4ain3HSNQWw-mMGVXS0bCMe2eDZOQ2MOTwnRdx8cTjotWVyC2QMTVww_vaHXBxa7ot9-YjQnl-NYsKIpxAyI_ZGC7vaOxBd9o4hm0J84g4yMIGjHyasiTcdI2DFn9Un9AN1sCxHCIVnMa1p2Zx_1l0w5d9yjcrI-0vDXuWWEVp92g-N18nqqFtineCIVQw&entry=mc&ved=1t:200715&ictx=111" +
  encodeURIComponent(SITE_CONFIG.address);

// ─── Location Map Section ─────────────────────────────────────────────────────
function LocationMap() {
  return (
    <section
      className="py-16 px-4 max-w-7xl mx-auto reveal-group"
    >
      <div className="grid md:grid-cols-2 gap-10 items-start">

        {/* Left: store info */}
        <div className="reveal space-y-6">
          <div>
            <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">
              Visit Us
            </span>
            <h2 className="text-3xl font-bold mt-2">Find Our Store</h2>
            <p className="text-gray-400 mt-3 leading-relaxed">
              Come visit us in person and try on our full collection. 
              Our staff will help you find the perfect fit.
            </p>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-zinc-500"><MapPinIcon size={20} /></span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">Store Address</p>
                <p className="text-gray-400 text-sm">{SITE_CONFIG.address}</p>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 text-xs mt-1 inline-flex items-center gap-1 hover:underline transition"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-zinc-500"><PhoneIcon size={20} /></span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">WhatsApp / Phone</p>
                <a
                  href={`https://wa.me/${SITE_CONFIG.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm hover:text-white transition"
                >
                  +91 99836 73600
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-zinc-500"><ClockIcon size={20} /></span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-0.5">Store Hours</p>
                <p className="text-gray-400 text-sm">Mon – Sat: 10:00 AM – 8:30 PM</p>
                <p className="text-gray-400 text-sm">Sunday: 11:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Directions button */}
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 active:scale-95 px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm">
              <MapPinIcon size={16} className="inline mr-1" /> Get Directions
            </button>
          </a>
        </div>

        {/* Right: Map embed */}
        <div className="reveal">
          <div className="map-container h-72 md:h-96 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <iframe
              src={MAP_EMBED_SRC}
              title="Mehta Boot House Location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full border-0"
              style={{
                filter: "invert(90%) hue-rotate(180deg) brightness(0.85) contrast(0.9)",
              }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            <MapPinIcon size={16} className="inline mr-1" /> {SITE_CONFIG.address}
          </p>
        </div>

      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setStatus("err"); return; }
    setStatus("ok");
    setEmail("");
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Location section just above the footer */}
      <div className="bg-zinc-950 border-t border-zinc-900">
        <LocationMap />
      </div>

      <footer className="bg-zinc-950 border-t border-zinc-800">

        {/* ── Main grid ── */}
        <div
          className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 reveal-group"
        >

          {/* Col 1: Brand */}
          <div className="reveal space-y-4">
            <h2 className="text-xl font-bold">
              Mehta <span className="text-green-400">Boot</span> House
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium footwear at honest prices since 1987.
              Walk in confidence every day.
            </p>

            {/* Mini address with map link */}
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-xs text-gray-500 hover:text-green-400 transition-colors group"
            >
              <span className="mt-0.5 group-hover:animate-bounce text-zinc-400"><MapPinIcon size={16} /></span>
              <span>{SITE_CONFIG.address}</span>
            </a>

            <a
              href={`https://wa.me/${SITE_CONFIG.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <PhoneIcon size={16} className="inline mr-1" /> +91 99836 73600
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              ✉️ {SITE_CONFIG.email}
            </a>

            {/* Social icons */}
            <div className="flex gap-2 pt-1">
              {[
                { href: SITE_CONFIG.instagram, label: "Instagram", icon: <InstagramIcon size={16} /> },
                { href: SITE_CONFIG.facebook,  label: "Facebook",  icon: <FacebookIcon size={16} /> },
                { href: `https://wa.me/${SITE_CONFIG.phone}`, label: "WhatsApp", icon: <MessageIcon size={16} /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 border border-zinc-700 rounded-lg flex items-center justify-center hover:border-green-400 hover:bg-zinc-800 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="reveal">
            <h3 className="font-semibold mb-5 text-xs uppercase tracking-widest text-gray-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                ["/",          "Home"],
                ["/shop",      "Shop All"],
                ["/about",     "About Us"],
                ["/contact",   "Contact"],
                ["/faq",       "FAQ & Help"],
                ["/wishlist",  "My Wishlist"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-flex transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="reveal">
            <h3 className="font-semibold mb-5 text-xs uppercase tracking-widest text-gray-400">
              Categories
            </h3>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white flex items-center gap-2 hover:translate-x-1 transition-all duration-200 group"
                  >

                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter + Policies */}
          <div className="reveal">
            <h3 className="font-semibold mb-5 text-xs uppercase tracking-widest text-gray-400">
              Stay Updated
            </h3>

            {status === "ok" ? (
              <div className="bg-green-500/20 border border-green-500/40 text-green-400 text-sm rounded-xl p-4 animate-scale-in">
                <CheckCircleIcon size={16} className="inline mr-1" /> You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder="Your email"
                  className={`w-full px-4 py-2.5 bg-zinc-900 border rounded-xl text-sm outline-none transition-all duration-200
                    ${status === "err"
                      ? "border-red-500"
                      : "border-zinc-700 focus:border-green-400 focus:ring-1 focus:ring-green-400/20"}`}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-green-500 hover:bg-green-600 active:scale-95 rounded-xl text-sm font-semibold transition-all duration-200"
                >
                  Subscribe for Deals
                </button>
                {status === "err" && (
                  <p className="text-red-400 text-xs animate-fade-in">Invalid email address.</p>
                )}
              </form>
            )}

            {/* Policies */}
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-3">
                Policies
              </h3>
              {[
                ["/privacy",  "Privacy Policy"],
                ["/terms",    "Terms of Service"],
                ["/returns",  "Returns & Refunds"],
                ["/shipping", "Shipping Policy"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-sm text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="border-t border-zinc-800 py-5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><ShieldCheckIcon size={14} /> Secure WhatsApp Orders</span>
            <span className="flex items-center gap-1.5"><TruckIcon size={14} /> Free Delivery above ₹799</span>
            <span className="flex items-center gap-1.5"><RefreshCwIcon size={14} /> 7-Day Easy Returns</span>
            <span className="flex items-center gap-1.5"><CreditCardIcon size={14} /> UPI · COD · Card</span>
            <span className="flex items-center gap-1.5"><StarIcon size={14} /> 2000+ Happy Customers</span>
            <span className="flex items-center gap-1.5"><MapPinIcon size={14} /> Tohana, Haryana</span>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-zinc-800 py-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Mehta Boot House. All rights reserved.</p>
            <button
              onClick={scrollTop}
              className="border border-zinc-700 hover:border-white hover:-translate-y-0.5 px-4 py-2 rounded-lg transition-all duration-200 text-xs flex items-center gap-1"
            >
              Back to top ↑
            </button>
          </div>
        </div>

      </footer>
    </>
  );
}