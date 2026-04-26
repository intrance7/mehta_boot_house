"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Papa from "papaparse";
import { supabase } from "../lib/supabase";
import { CATEGORIES, SIZES } from "../lib/configure";
import { useProducts } from "../context/ProductsContext";
const UploadCloud = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
);
const Check = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const Plus = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const Trash2 = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);
const Loader2 = ({ className = "" }) => (
  <svg width="24" height="24" className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
);

export default function AdminDashboard() {
  const { products: existingProducts, refreshProducts } = useProducts();
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0].slug);
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [bulkText, setBulkText] = useState("");

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Too many failed attempts. Try again in ${secs}s`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (res.ok) {
        setAuthed(true);
        setAttempts(0);
        localStorage.setItem("admin_authed", "true");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          const lockout = Date.now() + 120000;
          setLockoutUntil(lockout);
          setError("Too many failed attempts. Locked for 2 minutes.");
        } else {
          setError(`Incorrect PIN (${5 - newAttempts} attempts left)`);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
    }
  }, []);

  const toggleSize = (size: number) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!name || !price || !category || !description || selectedSizes.length === 0) {
        throw new Error("Please fill in all required fields.");
      }

      let publicUrls: string[] = [];

      // 1. Upload Images to Supabase Storage
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("shoes")
            .upload(fileName, file);

          if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

          // Get public URL
          const { data } = supabase.storage
            .from("shoes")
            .getPublicUrl(fileName);
          
          publicUrls.push(data.publicUrl);
        }
      }

      // 2. Insert into database
      const { error: dbError } = await supabase
        .from("products")
        .insert({
          name,
          price: Number(price),
          original_price: originalPrice ? Number(originalPrice) : null,
          category,
          description,
          sizes: selectedSizes,
          images: publicUrls,
          tag: "New" // Default tag
        });

      if (dbError) throw new Error("Failed to save product: " + dbError.message);

      await refreshProducts();
      setSuccess(true);
      // Reset form
      setName(""); setPrice(""); setOriginalPrice(""); setDescription("");
      setSelectedSizes([]); setFiles([]);
      
      setTimeout(() => {
        setSuccess(false);
        setIsModalOpen(false); // Close modal on success after a delay
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!csvFile && !bulkText.trim()) {
      setError("Please select a CSV file or paste text data.");
      setLoading(false);
      return;
    }

    const parseOptions = {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        try {
          if (!results.meta.fields || !results.meta.fields.some((f: string) => f.toLowerCase().includes('name'))) {
             throw new Error("Invalid format. We couldn't detect the product details.");
          }
          const productsToInsert = results.data.map((row: any) => ({
            name: row.name || "Unnamed Product",
            price: Number(row.price) || 0,
            original_price: row.originalPrice ? Number(row.originalPrice) : null,
            category: row.category ? row.category.toLowerCase().trim() : CATEGORIES[0].slug,
            description: row.description || "",
            sizes: row.sizes ? String(row.sizes).split(",").map((s: string) => Number(s.trim())).filter(Boolean) : [6, 7, 8, 9, 10],
            images: [],
            tag: row.tag || "New"
          }));

          const { error: dbError } = await supabase
            .from("products")
            .insert(productsToInsert);

          if (dbError) throw new Error("Bulk insert failed: " + dbError.message);

          await refreshProducts();
          setSuccess(true);
          setCsvFile(null);
          setBulkText("");
          setTimeout(() => {
            setSuccess(false);
            setIsBulkUploadOpen(false);
          }, 2000);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err: any) => {
        setError("Failed to parse data: " + err.message);
        setLoading(false);
      }
    };

    if (csvFile) {
      Papa.parse(csvFile, parseOptions);
    } else {
      let textToParse = bulkText.trim();
      const firstLine = textToParse.split('\n')[0].toLowerCase();
      // Auto-inject header if missing
      if (!firstLine.includes('name') && !firstLine.includes('price')) {
         textToParse = "name,price,category,sizes,description,tag\n" + textToParse;
      }
      Papa.parse(textToParse, parseOptions);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This cannot be undone.`)) return;
    setDeleting(productId);
    try {
      const { error: dbError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      if (dbError) throw new Error("Delete failed: " + dbError.message);
      await refreshProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (!authed) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-zinc-950">
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-sm text-center">
          <h1 className="text-2xl font-black mb-6">Admin Login</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <input 
            type="password" 
            placeholder="Enter PIN" 
            value={pin}
            onChange={e => setPin(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl mb-4 text-center text-xl tracking-[0.5em] focus:border-green-500 outline-none"
          />
          <button className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-600 transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 py-12 px-4 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">Store Inventory</h1>
          <p className="text-zinc-400">Add new shoes directly to the website catalog.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => setIsBulkUploadOpen(true)} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-black/10">
            <UploadCloud size={18} /> Bulk Upload CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-white hover:bg-zinc-200 text-black font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-white/10">
            <Plus size={18} /> Add New Shoe
          </button>
          <button onClick={() => { setAuthed(false); localStorage.removeItem("admin_authed"); }} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-3 rounded-xl text-sm font-bold transition">
            Logout
          </button>
        </div>
      </div>
      
      <div>
        {/* Current Inventory Category-wise */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold border-b border-zinc-800 pb-4 mb-6">Current Products</h2>
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search shoes by name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-green-500 transition placeholder:text-zinc-600"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap tracking-wide transition-all ${filterCategory === "all" ? "bg-white text-black shadow" : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white"}`}
              >All</button>
              {CATEGORIES.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setFilterCategory(c.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap tracking-wide transition-all ${filterCategory === c.slug ? "bg-white text-black shadow" : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white"}`}
                >{c.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {CATEGORIES.filter(c => filterCategory === "all" || c.slug === filterCategory).map(category => {
              const categoryProducts = existingProducts
                .filter(p => p.category === category.slug)
                .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));
              if (categoryProducts.length === 0) return null;
              
              return (
                <div key={category.slug} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 self-start">
                  <h3 className="text-xl font-bold mb-4 flex justify-between items-center">
                    {category.label}
                    <span className="text-sm font-normal bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">
                      {categoryProducts.length} items
                    </span>
                  </h3>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {categoryProducts.map(p => (
                      <div key={p.id} className="flex gap-4 items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                        <img src={p.images && p.images.length > 0 ? p.images[0] : "/shoes1.png"} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-bold text-sm text-white">{p.name}</p>
                          <p className="text-xs text-green-400 font-bold">₹{p.price}</p>
                        </div>
                        <div className="text-xs text-zinc-500 text-right flex flex-col items-end gap-2">
                          <div>Sizes: {p.sizes.join(", ")}</div>
                          <div className="flex items-center gap-2">
                            <Link href={`/product/${p.id}`} target="_blank" className="text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                              View ↗
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              disabled={deleting === p.id}
                              className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded-lg transition text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 disabled:opacity-50"
                            >
                              {deleting === p.id ? <Loader2 className="w-3 h-3" /> : <Trash2 size={12} />}
                              {deleting === p.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          {existingProducts.length === 0 && (
            <div className="text-center py-10 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500">
              No products added yet. Add your first shoe!
            </div>
          )}
        </div>

        {/* Upload Form Modal */}
        {mounted && isModalOpen && createPortal(
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl animate-slide-up">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition bg-zinc-950 p-2 rounded-full border border-zinc-800 z-10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              
              <h2 className="text-3xl font-black mb-6 pr-12">Add New Shoe</h2>
              
              <form onSubmit={handleUpload} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
            <Check size={18} /> Product successfully added to the store!
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Shoe Name*</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Nike Air Max" className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Category*</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500 appearance-none">
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Selling Price (₹)*</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required placeholder="e.g. 799" className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Original Price (₹) - Optional</label>
            <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="e.g. 1299" className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Available Sizes (UK)*</label>
          <div className="flex flex-wrap gap-3">
            {SIZES.map(s => (
              <button 
                type="button"
                key={s} 
                onClick={() => toggleSize(s)}
                className={`w-12 h-12 rounded-xl font-bold transition ${selectedSizes.includes(s) ? 'bg-green-500 text-black' : 'bg-zinc-950 border border-zinc-700 text-zinc-400 hover:border-white'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description*</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="Describe the shoe..." rows={3} className="w-full bg-zinc-950 border border-zinc-700 p-4 rounded-xl outline-none focus:border-green-500 resize-none" />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Shoe Photos (Optional)</label>
          <label className="border-2 border-dashed border-zinc-700 hover:border-green-500 bg-zinc-950 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition text-zinc-400 hover:text-green-500 group">
            <UploadCloud size={32} className="mb-3 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-center">
              {files.length > 0 
                ? `${files.length} image(s) selected` 
                : "Tap to select multiple images"}
            </span>
            <input type="file" multiple accept="image/*" onChange={e => {
              if (e.target.files) {
                setFiles(Array.from(e.target.files));
              }
            }} className="hidden" />
          </label>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Plus />}
          {loading ? "Uploading to Store..." : "Add to Store"}
        </button>
      </form>
            </div>
          </div>,
          document.body
        )}
        {/* Bulk Upload Modal */}
        {mounted && isBulkUploadOpen && createPortal(
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl animate-slide-up">
              <button 
                onClick={() => setIsBulkUploadOpen(false)} 
                className="absolute top-6 right-6 text-zinc-400 hover:text-white transition bg-zinc-950 p-2 rounded-full border border-zinc-800 z-10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              
              <h2 className="text-3xl font-black mb-6 pr-12">Bulk Upload (CSV)</h2>

              <div className="mb-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-zinc-400">CSV format should include these columns:</p>
                  <a href="/products_template.csv" download className="text-xs font-bold text-green-400 hover:text-green-300 underline transition">
                    Download Template
                  </a>
                </div>
                <code className="text-xs text-green-400 font-mono block break-all">
                  name, price, originalPrice, category, description, sizes, tag
                </code>
                <p className="text-xs text-zinc-500 mt-2">Example: <i>Nike Air Max, 4999, 5999, men, Great shoe, "7,8,9,10", Best Seller</i></p>
              </div>
              
              <form onSubmit={handleBulkUpload} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                    <Check size={18} /> Products successfully imported!
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 items-stretch">
                  <div className="flex flex-col">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Upload File</label>
                    <label className="border-2 border-dashed border-zinc-700 hover:border-green-500 bg-zinc-950 rounded-2xl p-6 flex-1 flex flex-col items-center justify-center cursor-pointer transition text-zinc-400 hover:text-green-500 group h-32">
                      <UploadCloud size={28} className="mb-2 group-hover:scale-110 transition" />
                      <span className="text-xs font-medium text-center px-2">{csvFile ? csvFile.name : "Tap to browse files"}</span>
                      <input type="file" accept=".csv" onChange={e => { setCsvFile(e.target.files?.[0] || null); setBulkText(""); }} className="hidden" />
                    </label>
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Or Quick Paste List</label>
                    <textarea 
                      value={bulkText}
                      onChange={e => { setBulkText(e.target.value); setCsvFile(null); }}
                      placeholder="Nike Air Max, 4999, men&#10;Casual Loafer, 2499, formal"
                      className="w-full flex-1 bg-zinc-950 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-green-500 font-mono text-xs resize-none placeholder-zinc-700 h-32"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
                  {loading ? "Importing..." : "Upload & Import"}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
