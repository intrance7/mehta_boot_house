"use client";

import { CATEGORIES, SIZES, PRICE_RANGES, SITE_CONFIG } from "../lib/configure" ;
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchIcon } from "../components/Icons";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";

const PRODUCTS_PER_PAGE = 12;

type SortOption = "default" | "low" | "high" | "newest" | "popular";
type ViewMode   = "grid" | "list";

// ─── Active filter pill ───────────────────────────────────────────────────────
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white text-black text-xs px-3 py-1 rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 ml-1">✕</button>
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
type FilterState = {
  categories: string[];
  sizes: number[];
  priceRange: number | null; // index into PRICE_RANGES
};

function Sidebar({
  filters,
  onChange,
  mobileOpen,
  onCloseMobile,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const toggle = <K extends "categories" | "sizes">(
    key: K,
    val: K extends "categories" ? string : number
  ) => {
    const arr = filters[key] as (string | number)[];
    onChange({
      ...filters,
      [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    } as FilterState);
  };

  const content = (
    <div className="space-y-6 p-4">

      {/* Category */}
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Category</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition text-sm">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat.slug)}
                  onChange={() => toggle("categories", cat.slug)}
                  className="accent-green-500"
                />
                <span>{cat.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-zinc-800" />

      {/* Size */}
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Size (UK)</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle("sizes", s)}
              className={`w-10 h-10 rounded-lg border text-sm font-medium transition
                ${filters.sizes.includes(s)
                  ? "bg-white text-black border-white"
                  : "border-zinc-700 hover:border-zinc-400"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <hr className="border-zinc-800" />

      {/* Price */}
      <div>
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Price Range</h3>
        <ul className="space-y-2">
          {PRICE_RANGES.map((range, i) => (
            <li key={range.label}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition text-sm">
                <input
                  type="radio"
                  name="price"
                  checked={filters.priceRange === i}
                  onChange={() =>
                    onChange({
                      ...filters,
                      priceRange: filters.priceRange === i ? null : i,
                    })
                  }
                  className="accent-green-500"
                />
                {range.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ categories: [], sizes: [], priceRange: null })}
        className="w-full py-2 border border-zinc-700 rounded-lg text-sm hover:border-white transition"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 flex-shrink-0 bg-zinc-950 rounded-xl sticky top-24 self-start">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onCloseMobile} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 z-50 overflow-y-auto md:hidden">
            <div className="flex justify-between items-center px-4 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={onCloseMobile} className="text-xl">✕</button>
            </div>
            {content}
          </aside>
        </>
      )}
    </>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
function ShopContent() {
  const { products, loading } = useProducts();
  const searchParams = useSearchParams();
  const urlCategory  = searchParams.get("category") ?? "";

  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState<SortOption>("default");
  const [view, setView]           = useState<ViewMode>("grid");
  const [page, setPage]           = useState(1);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [filters, setFilters]     = useState<FilterState>({
    categories: urlCategory ? [urlCategory] : [],
    sizes: [],
    priceRange: null,
  });

  // Sync URL category param → filter
  useEffect(() => {
    if (urlCategory) setFilters((f) => ({ ...f, categories: [urlCategory] }));
  }, [urlCategory]);

  // Reset to page 1 whenever filters / search / sort change
  useEffect(() => { setPage(1); }, [search, sort, filters]);

  const filtered = useMemo(() => {
    let list = [...products];

    // Text search
    if (search.trim()) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      list = list.filter((p) =>
        filters.categories.some((c) =>
          p.category?.toLowerCase() === c
        )
      );
    }

    // Size filter (assumes product has a `sizes` array)
    if (filters.sizes.length > 0) {
      list = list.filter((p) =>
        filters.sizes.some((s) => p.sizes?.includes(s))
      );
    }

    // Price range
    if (filters.priceRange !== null) {
      const range = PRICE_RANGES[filters.priceRange];
      list = list.filter((p) => p.price >= range.min && p.price <= range.max);
    }

    // Sort
    if (sort === "low")     list.sort((a, b) => a.price - b.price);
    if (sort === "high")    list.sort((a, b) => b.price - a.price);
    if (sort === "newest")  list.sort((a, b) => b.id - a.id);

    return list;
  }, [search, sort, filters]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Active filter pills
  type ActiveFilter = { label: string; remove: () => void };
  const activeFilters: ActiveFilter[] = [
    ...filters.categories.map((c) => ({
      label: CATEGORIES.find((cat) => cat.slug === c)?.label ?? c,
      remove: () =>
        setFilters((f) => ({ ...f, categories: f.categories.filter((v) => v !== c) })),
    })),
    ...filters.sizes.map((s) => ({
      label: `Size ${s}`,
      remove: () => setFilters((f) => ({ ...f, sizes: f.sizes.filter((v) => v !== s) })),
    })),
    ...(filters.priceRange !== null
      ? [{
          label: PRICE_RANGES[filters.priceRange].label,
          remove: () => setFilters((f) => ({ ...f, priceRange: null })),
        }]
      : []),
  ];

  return (
    <main className="py-10 px-4 max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-10 md:p-16 flex flex-col items-center justify-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/15 via-transparent to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] pointer-events-none"></div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 relative z-10">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Collection</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-lg relative z-10">
          Discover {filtered.length} curated pairs that perfectly balance premium craftsmanship with everyday comfort.
        </p>
      </div>

      {/* ── Search + toolbar ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            placeholder="Search shoes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >✕</button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:border-white outline-none transition"
        >
          <option value="default">Sort: Featured</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>

        {/* View toggle */}
        <div className="flex border border-zinc-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={`px-4 py-3 transition ${view === "grid" ? "bg-white text-black" : "hover:bg-zinc-800"}`}
            title="Grid view"
          >⊞</button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-3 transition ${view === "list" ? "bg-white text-black" : "hover:bg-zinc-800"}`}
            title="List view"
          >☰</button>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileSidebar(true)}
          className="md:hidden px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center gap-2"
        >
          ⚙ Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>
      </div>

      {/* ── Active filter pills ── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f) => (
            <FilterPill key={f.label} label={f.label} onRemove={f.remove} />
          ))}
          <button
            onClick={() => setFilters({ categories: [], sizes: [], priceRange: null })}
            className="text-gray-400 text-sm hover:text-white"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Layout: sidebar + products ── */}
      <div className="flex gap-8">
        <Sidebar
          filters={filters}
          onChange={setFilters}
          mobileOpen={mobileSidebar}
          onCloseMobile={() => setMobileSidebar(false)}
        />

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-24 text-zinc-500 animate-pulse">Loading products...</div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <p className="mb-4 flex justify-center text-zinc-600"><SearchIcon size={48} /></p>
              <p className="text-xl font-semibold mb-2">No products found</p>
              <p className="text-sm">Try different search terms or remove some filters</p>
              <button
                onClick={() => { setSearch(""); setFilters({ categories: [], sizes: [], priceRange: null }); }}
                className="mt-6 px-6 py-2 border border-zinc-700 rounded-lg hover:border-white transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid view */}
              {view === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {paginated.map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      price={p.price}
                      originalPrice={p.originalPrice}
                      image={p.images && p.images.length > 0 ? p.images[0] : "/shoes1.png"}
                      hoverImage={p.images && p.images.length > 1 ? p.images[1] : undefined}
                      tag={p.tag}
                    />
                  ))}
                </div>
              )}

              {/* List view */}
              {view === "list" && (
                <div className="space-y-6">
                  {paginated.map((p) => (
                    <div key={p.id} className="flex flex-col sm:flex-row gap-6 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition duration-300 p-4 rounded-3xl group">
                      
                      {/* Image block */}
                      <Link href={`/product/${p.id}`} className="w-full sm:w-56 h-56 bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 block">
                        <img
                          src={p.images && p.images.length > 0 ? p.images[0] : "/shoes1.png"}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        />
                        {p.tag && (
                          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-xl">
                            {p.tag}
                          </span>
                        )}
                      </Link>

                      {/* Content block */}
                      <div className="flex-1 flex flex-col justify-center py-2 sm:pr-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold mb-2 block">{p.category}</span>
                          <Link href={`/product/${p.id}`}>
                            <h3 className="font-bold text-2xl text-white mb-2 hover:text-green-400 transition-colors">{p.name}</h3>
                          </Link>
                          <p className="text-zinc-400 text-sm max-w-lg mb-6 leading-relaxed line-clamp-2">
                            {(p as any).description || "Experience the perfect blend of modern aesthetics and unparalleled comfort with this premium pair."}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-6 mt-auto">
                          <div className="flex flex-col">
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-black text-white tracking-tight">₹{p.price}</span>
                              {p.originalPrice && <span className="text-sm text-zinc-500 line-through mb-1">₹{p.originalPrice}</span>}
                            </div>
                            {p.originalPrice && (
                              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wide">
                                Save ₹{p.originalPrice - p.price}
                              </span>
                            )}
                          </div>
                          
                          <Link href={`/product/${p.id}`} className="ml-auto">
                            <button className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl text-sm font-bold transition active:scale-95 shadow-lg">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-zinc-700 rounded-lg disabled:opacity-40 hover:border-white transition"
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                      if (i > 0 && (arr[i - 1] as number) + 1 < p) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-gray-500">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-10 h-10 rounded-lg border transition
                            ${page === p
                              ? "bg-white text-black border-white"
                              : "border-zinc-700 hover:border-white"}`}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-zinc-700 rounded-lg disabled:opacity-40 hover:border-white transition"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense 
      fallback={
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}