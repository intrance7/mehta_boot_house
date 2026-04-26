"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { SITE_CONFIG, SIZES } from "../lib/configure";

export type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  tag?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockCount?: number;
  category?: string;
  /** "portrait" = tall card like Neeman's, "square" = default */
  variant?: "portrait" | "square";
};

// ─── Icons ────────────────────────────────────────────────────
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

// ─── Stars ────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-px">
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="10" height="10" viewBox="0 0 24 24"
          fill={s <= rating ? "#facc15" : "none"}
          stroke={s <= rating ? "#facc15" : "#3f3f46"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

// ─── Quick Add Modal ──────────────────────────────────────────
function QuickAddModal({ product, onClose }: { product: ProductCardProps; onClose: () => void }) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selected) return;
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, size: selected, quantity: 1 });
    setAdded(true);
    setTimeout(onClose, 900);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose}/>
      <div className="fixed z-[61] inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-full md:w-[400px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex gap-4 p-5 border-b border-zinc-800">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover"/>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm leading-snug">{product.name}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-green-400 font-bold">₹{product.price}</span>
              {product.originalPrice && <span className="text-zinc-500 text-xs line-through">₹{product.originalPrice}</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white mt-1 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-5">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">Select Size (UK)</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {SIZES.map(s => (
              <button key={s} onClick={() => setSelected(s)}
                className={`w-12 h-12 rounded-2xl border-2 text-sm font-semibold transition-all
                  ${selected === s
                    ? "border-green-500 bg-green-500 text-black"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}
              >{s}</button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={handleAdd} disabled={!selected || added}
              className={`flex-1 py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                ${added ? "bg-green-500 text-black"
                  : selected ? "bg-white text-black hover:bg-zinc-200 active:scale-95"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}`}
            >
              {added ? <><CheckIcon /> Added!</> : <><BagIcon /> {selected ? "Add to Bag" : "Select Size"}</>}
            </button>

            <a href={`https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(`Hi, I want to order ${product.name} for ₹${product.price}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-2xl flex items-center justify-center text-black transition-all active:scale-95"
            >
              <WaIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Card ────────────────────────────────────────────────
export default function ProductCard(props: ProductCardProps) {
  const {
    id, name, price, originalPrice, image, hoverImage,
    tag, rating = 4, inStock = true, stockCount, category,
    variant = "square",
  } = props;

  const { toggle, isWishlisted } = useWishlist();
  const [hovered, setHovered]   = useState(false);
  const [quickAdd, setQuickAdd] = useState(false);
  const wishlisted = isWishlisted(id);

  const discountPct = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const waUrl = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(`Hi, I want to order ${name} for ₹${price}`)}`;

  const imgClass = variant === "portrait"
    ? "aspect-[3/4]"   // tall portrait — like Neeman's
    : "aspect-square";  // square default

  return (
    <>
      <article
        className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-zinc-700 transition-all duration-300"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image container ── */}
        <Link href={`/product/${id}`} className={`relative block overflow-hidden bg-zinc-950 ${imgClass}`}>
          <Image
            src={(hovered && hoverImage) ? hoverImage : (image || "/shoes1.png")}
            alt={name || "Product"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />

          {/* Gradient overlay for bottom text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

          {/* Sold out */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick add CTA — slides up on hover */}
          {inStock && (
            <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
              <button
                onClick={e => { e.preventDefault(); setQuickAdd(true); }}
                className="w-full bg-black/90 backdrop-blur-sm text-white py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors"
              >
                Quick Add
              </button>
            </div>
          )}
        </Link>

        {/* ── Badges (absolute over image) ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {tag && (
            <span className="bg-zinc-800 text-zinc-200 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase shadow-sm">
              {tag}
            </span>
          )}
          {discountPct && (
            <span className="bg-green-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* ── Wishlist ── */}
        <button
          onClick={e => { e.stopPropagation(); toggle({ id, name, price, image }); }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90
            ${wishlisted
              ? "bg-red-500/10 text-red-500 border border-red-500/20"
              : "bg-zinc-900/50 backdrop-blur-sm text-zinc-400 hover:text-red-500 border border-zinc-700"}`}
          aria-label="Wishlist"
        >
          <HeartIcon filled={wishlisted} />
        </button>

        {/* ── Info ── */}
        <div className="p-4 flex flex-col gap-1.5">
          {category && (
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">{category}</p>
          )}
          <Link href={`/product/${id}`}>
            <h3 className="text-sm font-semibold text-zinc-100 leading-snug hover:text-green-400 transition-colors line-clamp-2">
              {name}
            </h3>
          </Link>

          <Stars rating={Math.round(rating)} />

          {inStock && stockCount !== undefined && stockCount <= 4 && (
            <p className="text-orange-500 text-[11px] font-medium">Only {stockCount} left</p>
          )}

          {/* Price + WA button row */}
          <div className="flex items-center justify-between mt-2 gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-green-400">₹{price}</span>
              {originalPrice && (
                <span className="text-xs text-zinc-500 line-through">₹{originalPrice}</span>
              )}
            </div>
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-black text-[11px] font-bold px-3.5 py-2 rounded-full transition-all active:scale-95">
                <WaIcon /> Order
              </button>
            </a>
          </div>
        </div>
      </article>

      {quickAdd && <QuickAddModal product={props} onClose={() => setQuickAdd(false)} />}
    </>
  );
}