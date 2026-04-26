"use client";

import { useProducts } from "../../context/ProductsContext";
import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, FrownIcon, PhoneIcon, HeartIcon, ShareIcon, TruckIcon, BoxIcon } from "../../components/Icons";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { SITE_CONFIG, SIZES, createWhatsAppLink } from "../../lib/configure";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ productName }: { productName: string }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-white transition">Home</Link>
      <span>/</span>
      <Link href="/shop" className="hover:text-white transition">Shop</Link>
      <span>/</span>
      <span className="text-white truncate max-w-xs">{productName}</span>
    </nav>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed]     = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-zinc-900 cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <Image
          src={images[selected]}
          alt={name}
          width={600}
          height={600}
          className="w-full aspect-square object-cover"
          priority
        />
        <span className="absolute top-3 right-3 bg-black/50 text-xs px-2 py-1 rounded">
          <SearchIcon size={14} className="inline mr-1" /> Click to zoom
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition
                ${selected === i ? "border-white" : "border-zinc-700 hover:border-zinc-500"}`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} width={80} height={80} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom lightbox */}
      {zoomed && (
        <>
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomed(false)}>
            <button className="absolute top-4 right-4 text-white text-3xl">✕</button>
            <Image src={images[selected]} alt={name} width={900} height={900} className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Size Guide Modal ─────────────────────────────────────────────────────────
function SizeGuideModal({ onClose }: { onClose: () => void }) {
  const guide = [
    { uk: 6,  eu: 39, us: 7,  cm: "24.5" },
    { uk: 7,  eu: 40, us: 8,  cm: "25.4" },
    { uk: 8,  eu: 41, us: 9,  cm: "26.2" },
    { uk: 9,  eu: 42, us: 10, cm: "27.1" },
    { uk: 10, eu: 43, us: 11, cm: "27.9" },
    { uk: 11, eu: 44, us: 12, cm: "28.8" },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 bg-zinc-900 rounded-2xl p-6 z-50 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Size Guide</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b border-zinc-700 text-gray-400">
              <th className="py-2">UK</th>
              <th className="py-2">EU</th>
              <th className="py-2">US</th>
              <th className="py-2">Foot Length</th>
            </tr>
          </thead>
          <tbody>
            {guide.map((row) => (
              <tr key={row.uk} className="border-b border-zinc-800 hover:bg-zinc-800 transition">
                <td className="py-2 font-medium">{row.uk}</td>
                <td className="py-2">{row.eu}</td>
                <td className="py-2">{row.us}</td>
                <td className="py-2">{row.cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-4">
          Tip: Measure your foot at the end of the day when it's at its largest. 
          If between sizes, go a half size up.
        </p>
      </div>
    </>
  );
}

// ─── Product Page ─────────────────────────────────────────────────────────────
export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { products, loading } = useProducts();

  if (loading) {
    return <div className="p-20 text-center text-zinc-500 animate-pulse">Loading product...</div>;
  }

  const product = products.find((p) => String(p.id) === id);
  if (!product) {
    return (
      <div className="p-10 text-center">
        <div className="flex justify-center mb-4 text-zinc-600"><FrownIcon size={48} /></div>
        <p className="text-xl mb-4">Product not found</p>
        <Link href="/shop" className="underline text-green-400">Back to Shop</Link>
      </div>
    );
  }

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity]         = useState(1);
  const [sizeGuide, setSizeGuide]       = useState(false);
  const [addedToCart, setAddedToCart]   = useState(false);

  const { addItem }      = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const productImages = product.images && product.images.length > 0 ? product.images : ["/shoes1.png"];

  // WhatsApp order URL
  const message = `Hi, I want to order ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ""} x${quantity} for ₹${product.price * quantity}`;
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(message)}`;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      size: selectedSize,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: `Check out ${product.name} for ₹${product.price} on Mehta Boot House!`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="py-10 px-4 max-w-7xl mx-auto">

      <Breadcrumb productName={product.name} />

      {/* ── Main product section ── */}
      <div className="grid md:grid-cols-2 gap-12 items-start mb-16">

        {/* LEFT: Gallery */}
        <ImageGallery images={productImages} name={product.name} />

        {/* RIGHT: Details */}
        <div className="sticky top-24">

          {/* Tag + name */}
          {product.tag && (
            <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold mb-3">
              {product.tag}
            </span>
          )}

          <h1 className="text-4xl font-extrabold leading-tight">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-sm text-gray-400">4.9 (24 reviews)</span>
            <span className="text-sm text-green-400 hover:underline cursor-pointer">
              See all
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-green-400">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-500 line-through text-lg">₹{product.originalPrice}</span>
                <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <p className="text-green-500 text-sm font-medium mt-2">✓ In Stock — Ready to ship</p>

          <hr className="border-zinc-800 my-6" />

          {/* Size selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Select Size (UK)</h3>
              <button
                onClick={() => setSizeGuide(true)}
                className="text-sm text-gray-400 hover:text-white underline"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl border font-semibold transition
                    ${selectedSize === size
                      ? "bg-white text-black border-white"
                      : "border-zinc-700 hover:border-white"}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-sm text-gray-500 mt-2">Please select a size to order</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold text-sm">Quantity:</span>
            <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 hover:bg-zinc-800 transition text-lg"
              >−</button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 hover:bg-zinc-800 transition text-lg"
              >+</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full py-4 rounded-xl font-bold text-lg transition
                ${selectedSize
                  ? addedToCart
                    ? "bg-green-600 cursor-default"
                    : "bg-white text-black hover:bg-gray-100"
                  : "bg-zinc-800 text-gray-500 cursor-not-allowed"}`}
            >
              {addedToCart ? "✓ Added to Cart!" : selectedSize ? "Add to Cart" : "Select Size First"}
            </button>

            {/* WhatsApp order */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <button
                disabled={!selectedSize}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2
                  ${selectedSize
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-zinc-800 text-gray-500 cursor-not-allowed pointer-events-none"}`}
              >
                <PhoneIcon size={16} className="inline mr-2" /> Order via WhatsApp
              </button>
            </a>

            {/* Secondary actions */}
            <div className="flex gap-3">
              <button
                onClick={() => toggle({ id: product.id, name: product.name, price: product.price, image: productImages[0] })}
                className={`flex-1 py-3 rounded-xl border font-medium transition flex items-center justify-center gap-2
                  ${wishlisted ? "border-red-400 text-red-400" : "border-zinc-700 hover:border-white"}`}
              >
                <HeartIcon size={16} className="inline mr-2" filled={wishlisted} /> {wishlisted ? "Wishlisted" : "Wishlist"}
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-3 rounded-xl border border-zinc-700 hover:border-white transition font-medium flex items-center justify-center gap-2"
              >
                <ShareIcon size={16} className="inline mr-2" /> Share
              </button>
            </div>
          </div>

          {/* Delivery info */}
          <div className="mt-6 p-4 bg-zinc-900 rounded-xl space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-zinc-400"><TruckIcon size={16} /></span>
              <span><strong>Free delivery</strong> on orders above ₹799</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-zinc-400"><BoxIcon size={16} /></span>
              <span>Ships within <strong>24 hours</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <span>↩️</span>
              <span><strong>7-day</strong> easy returns</span>
            </p>
          </div>

        </div>
      </div>

      {/* ── Product Description ── */}
      <div className="mb-16 border-t border-zinc-800 pt-12">
        <h2 className="text-2xl font-bold mb-6">Product Details</h2>
        <div className="max-w-3xl space-y-4 text-gray-300 leading-relaxed bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
          <p className="whitespace-pre-wrap">
            {product.description ??
              `The ${product.name} is crafted for all-day comfort and durability. 
              Whether you're heading to work or stepping out for a walk, these shoes offer 
              the perfect blend of style and functionality.`}
          </p>
        </div>
      </div>

      {/* ── Related products ── */}
      <section>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              originalPrice={item.originalPrice}
              image={item.images && item.images.length > 0 ? item.images[0] : "/shoes1.png"}
              hoverImage={item.images && item.images.length > 1 ? item.images[1] : undefined}
              tag={item.tag}
            />
          ))}
        </div>
      </section>

      {/* ── Size guide modal ── */}
      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}

    </main>
  );
}