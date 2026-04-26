"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { CATEGORIES, SITE_CONFIG } from "../lib/configure";
import { useProducts } from "../context/ProductsContext";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(SITE_CONFIG.address);

// ─── SVG Icons (no emojis) ────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, totalPrice, totalItems, removeItem, updateQty } = useCart();

  const orderText = items
    .map((i) => `• ${i.name} (Size ${i.size}) x${i.quantity} = ₹${i.price * i.quantity}`)
    .join("\n");
  const whatsappMsg = `Hi, I'd like to order:\n${orderText}\n\nTotal: ₹${totalPrice}`;
  const waUrl = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(whatsappMsg)}`;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-96 max-w-full bg-zinc-950 z-50 flex flex-col border-l border-zinc-800 animate-drawer-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="font-semibold tracking-tight text-white">Your Bag</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition p-1">
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-zinc-500">
            <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center">
              <BagIcon />
            </div>
            <p className="text-sm">Your bag is empty</p>
            <Link href="/shop" onClick={onClose} className="text-xs text-white border border-zinc-700 hover:border-white px-5 py-2.5 rounded-lg transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map((item) => (
                <li key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">UK {item.size}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => item.quantity > 1 ? updateQty(item.id, item.size, item.quantity - 1) : removeItem(item.id, item.size)}
                        className="w-7 h-7 border border-zinc-700 hover:border-white rounded-lg text-sm text-white transition flex items-center justify-center"
                      >−</button>
                      <span className="text-sm w-5 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 border border-zinc-700 hover:border-white rounded-lg text-sm text-white transition flex items-center justify-center"
                      >+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <p className="text-sm font-semibold text-white">₹{item.price * item.quantity}</p>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-zinc-600 hover:text-red-400 transition"
                      aria-label="Remove"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Subtotal</span>
                <span className="font-semibold text-white">₹{totalPrice}</span>
              </div>
              <p className="text-xs text-zinc-600">Delivery calculated at checkout via WhatsApp</p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <button className="w-full bg-green-500 hover:bg-green-400 active:scale-95 text-black font-semibold py-3.5 rounded-xl transition-all text-sm">
                  Order via WhatsApp
                </button>
              </a>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────
function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQuery(""); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  const results = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed top-0 inset-x-0 z-50 bg-zinc-950 border-b border-zinc-800 animate-slide-up p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 border-b border-zinc-700 pb-4 focus-within:border-white transition-colors">
            <span className="text-zinc-500"><SearchIcon /></span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shoes, styles, categories..."
              className="flex-1 bg-transparent outline-none text-white placeholder-zinc-600 text-lg"
            />
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition">
              <CloseIcon />
            </button>
          </div>

          {results.length > 0 && (
            <ul className="mt-4 space-y-1 animate-fade-in">
              {results.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.id}`} onClick={onClose}
                    className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-zinc-900 transition group"
                  >
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={p.images && p.images.length > 0 ? p.images[0] : "/shoes1.png"} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-300 group-hover:text-white">{p.name}</p>
                      <p className="text-xs text-zinc-500">₹{p.price}</p>
                    </div>
                    <span className="text-zinc-700 group-hover:text-zinc-400 transition"><ArrowRight /></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.length > 1 && results.length === 0 && (
            <p className="text-center text-zinc-600 text-sm mt-8 animate-fade-in">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { totalItems }                    = useCart();
  const { totalItems: wishlistCount }     = useWishlist();
  const [cartOpen, setCartOpen]           = useState(false);
  const [searchOpen, setSearchOpen]       = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [catOpen, setCatOpen]             = useState(false);
  const [scrolled, setScrolled]           = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setCartOpen(false); setSearchOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-30 transition-all duration-300
        ${scrolled ? "bg-black/95 backdrop-blur-md shadow-xl shadow-black/40" : "bg-black"}
        border-b border-zinc-900`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group flex items-center gap-2.5">
            <img src="/logo.png" alt="Mehta Boot House" className="h-9 w-9 object-contain rounded-lg" />
            <div className="flex flex-col leading-none">
              <span className="text-xs tracking-[0.3em] uppercase text-zinc-500 font-medium">Mehta</span>
              <span className="text-lg font-bold tracking-tight text-white">Boot House</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="nav-link text-zinc-300 hover:text-white transition-colors">Home</Link>
            <Link href="/shop" className="nav-link text-zinc-300 hover:text-white transition-colors">Shop</Link>

            {/* Categories */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="nav-link text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5">
                Categories
                <span className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}>
                  <ChevronDown />
                </span>
              </button>

              {catOpen && (
                <div className="absolute top-full left-0 pt-3 z-20">
                  <div className="animate-dropdown bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 min-w-[200px]">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-zinc-900 hover:text-green-400 transition-colors text-sm text-zinc-300 group"
                      >
                        <span>{cat.label}</span>
                        <span className="text-zinc-700 group-hover:text-green-400 transition-colors"><ArrowRight /></span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="nav-link text-zinc-300 hover:text-white transition-colors">About</Link>

            {/* Location */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-zinc-500 hover:text-green-400 transition-colors text-xs tracking-wide"
            >
              <MapPinIcon /> Tohana
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            <Link href="/wishlist" className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all relative" aria-label="Wishlist">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all relative"
              aria-label="Cart"
            >
              <BagIcon />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-lg hover:bg-zinc-900 transition flex flex-col gap-1.5 items-center justify-center w-10 h-10"
              aria-label="Menu"
            >
              <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-px bg-white transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`md:hidden border-t border-zinc-900 overflow-hidden transition-all duration-300 ease-in-out
          ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 py-5 space-y-1">
            {[["/" ,"Home"], ["/shop","Shop"], ["/about","About"]].map(([href, label]) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-zinc-300 hover:text-white transition-colors text-sm"
              >{label}</Link>
            ))}
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 py-2.5 text-green-400 text-sm"
            >
              <MapPinIcon /> {SITE_CONFIG.address}
            </a>
            <div className="pt-4 border-t border-zinc-900">
              <p className="text-xs uppercase tracking-widest text-zinc-600 mb-3">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop?category=${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm text-zinc-300 hover:text-white transition-colors"
                  >{cat.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}