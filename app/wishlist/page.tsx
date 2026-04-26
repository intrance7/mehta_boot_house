"use client";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SITE_CONFIG, SIZES } from "../lib/configure";

// ─── Icons ────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const BagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Size Picker Modal ────────────────────────────────────────
function SizePicker({
  productId, productName, productPrice, productImage,
  onClose,
}: {
  productId: number; productName: string; productPrice: number;
  productImage: string; onClose: () => void;
}) {
  const { addItem } = useCart();
  const { removeItem } = useWishlist();
  const [selected, setSelected] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!selected) return;
    addItem({ id: productId, name: productName, price: productPrice, image: productImage, size: selected, quantity: 1 });
    setAdded(true);
    setTimeout(() => { onClose(); removeItem(productId); }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-[380px] bg-zinc-950 border border-zinc-800 rounded-3xl p-6 z-50 shadow-2xl animate-scale-in">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-zinc-900 rounded-2xl overflow-hidden flex-shrink-0">
            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-sm">{productName}</p>
            <p className="text-green-400 font-bold mt-0.5">₹{productPrice}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-zinc-600 hover:text-white transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-3">Select Size (UK)</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {SIZES.map(s => (
            <button key={s} onClick={() => setSelected(s)}
              className={`w-12 h-12 rounded-2xl border text-sm font-semibold transition-all
                ${selected === s ? "bg-white text-black border-white" : "border-zinc-700 hover:border-zinc-400 text-zinc-300"}`}
            >{s}</button>
          ))}
        </div>

        <button onClick={handleAdd} disabled={!selected || added}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2
            ${added ? "bg-green-500 text-black"
              : selected ? "bg-white text-black hover:bg-zinc-100 active:scale-95"
              : "bg-zinc-900 text-zinc-600 cursor-not-allowed"}`}
        >
          {added ? <><CheckIcon /> Moved to Bag!</> : selected ? <><BagIcon /> Move to Bag</> : "Choose a Size"}
        </button>
      </div>
    </>
  );
}

// ─── Wishlist Page ────────────────────────────────────────────
export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const [sizePickerFor, setSizePickerFor] = useState<number | null>(null);
  const [removed, setRemoved] = useState<Set<number>>(new Set());

  const handleRemove = (id: number) => {
    setRemoved(prev => new Set(prev).add(id));
    setTimeout(() => removeItem(id), 350);
  };

  const selectedItem = items.find(i => i.id === sizePickerFor);

  // WhatsApp wishlist share
  const waText = `Hi! I'd like to enquire about these items from my wishlist:\n${items.map(i => `• ${i.name} — ₹${i.price}`).join("\n")}`;
  const waUrl = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Wishlist</h1>
            <p className="text-zinc-500 text-sm mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
          </div>
          {items.length > 0 && (
            <div className="flex gap-3">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 text-xs font-semibold border border-green-500/40 text-green-400 hover:bg-green-500 hover:border-green-500 hover:text-black px-4 py-2.5 rounded-xl transition-all">
                  <WaIcon /> Share on WhatsApp
                </button>
              </a>
              <button onClick={clearWishlist}
                className="text-xs font-medium text-zinc-600 hover:text-red-400 border border-zinc-800 hover:border-red-400/50 px-4 py-2.5 rounded-xl transition-all">
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-zinc-600">
            <div className="w-24 h-24 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-700">
              <HeartIcon />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-zinc-400 mb-2">Your wishlist is empty</p>
              <p className="text-sm">Save items you love and come back to them anytime.</p>
            </div>
            <Link href="/shop">
              <button className="flex items-center gap-2 bg-white text-black font-bold px-8 py-3.5 rounded-2xl hover:bg-zinc-100 active:scale-95 transition-all text-sm">
                Browse Products <ArrowRight />
              </button>
            </Link>
          </div>
        )}

        {/* Items grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <div
                key={item.id}
                className={`group bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden hover:border-zinc-700 transition-all duration-300 ${
                  removed.has(item.id) ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
                style={{ transition: "opacity 0.3s ease, transform 0.3s ease, border-color 0.2s" }}
              >
                {/* Image */}
                <Link href={`/product/${item.id}`} className="relative block aspect-square bg-zinc-900 overflow-hidden img-zoom">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-semibold text-sm hover:text-green-400 transition-colors line-clamp-2 mb-1">{item.name}</h3>
                  </Link>
                  <p className="text-base font-black text-white">₹{item.price}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSizePickerFor(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-bold py-2.5 rounded-2xl hover:bg-zinc-100 active:scale-95 transition-all text-xs"
                    >
                      <BagIcon /> Add to Bag
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-10 h-10 flex items-center justify-center border border-zinc-800 hover:border-red-400/60 hover:text-red-400 text-zinc-600 rounded-2xl transition-all"
                      aria-label="Remove"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  {/* WhatsApp quick order */}
                  <a
                    href={`https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(`Hi, I want to order ${item.name} for ₹${item.price}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-2 border border-green-500/30 hover:bg-green-500 hover:border-green-500 text-green-400 hover:text-black text-xs font-semibold py-2.5 rounded-2xl transition-all w-full"
                  >
                    <WaIcon /> Order on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue shopping */}
        {items.length > 0 && (
          <div className="text-center mt-14">
            <Link href="/shop">
              <button className="inline-flex items-center gap-2 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white px-8 py-3.5 rounded-2xl text-sm font-medium transition-all">
                Continue Shopping <ArrowRight />
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Size picker modal */}
      {sizePickerFor !== null && selectedItem && (
        <SizePicker
          productId={selectedItem.id}
          productName={selectedItem.name}
          productPrice={selectedItem.price}
          productImage={selectedItem.image}
          onClose={() => setSizePickerFor(null)}
        />
      )}
    </div>
  );
}