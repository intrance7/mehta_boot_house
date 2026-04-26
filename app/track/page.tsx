"use client";

import { useState } from "react";
import { SITE_CONFIG } from "../lib/configure";

type TrackingStatus = "idle" | "loading" | "found" | "not_found";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<TrackingStatus>("idle");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Mock API call
    setTimeout(() => {
      // If order ID starts with "MBH", simulate a found order, else not found.
      if (orderId.toUpperCase().startsWith("MBH")) {
        setStatus("found");
      } else {
        setStatus("not_found");
      }
    }, 1500);
  };

  return (
    <main className="py-20 px-4 max-w-4xl mx-auto min-h-[70vh]">
      <div className="text-center mb-12 animate-slide-up">
        <p className="text-xs uppercase tracking-[0.4em] text-green-500 mb-4">Tracking</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Track Your Order
        </h1>
        <p className="text-zinc-400">Enter your Order ID (starts with MBH) to see the live status.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <form onSubmit={handleTrack} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Order ID</label>
            <input 
              required
              type="text" 
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition uppercase"
              placeholder="e.g. MBH-12345"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Phone Number</label>
            <input 
              required
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition"
              placeholder="Your WhatsApp number"
            />
          </div>
          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition active:scale-95 disabled:opacity-50 mt-4"
          >
            {status === "loading" ? "Finding Order..." : "Track Package"}
          </button>
        </form>
      </div>

      {status === "not_found" && (
        <div className="mt-12 text-center animate-fade-in p-6 bg-red-500/10 border border-red-500/20 rounded-2xl max-w-lg mx-auto">
          <p className="text-red-400 font-medium">Order not found.</p>
          <p className="text-sm text-zinc-400 mt-2">Please ensure your Order ID starts with 'MBH' and try again. For help, contact us on WhatsApp.</p>
        </div>
      )}

      {status === "found" && (
        <div className="mt-16 animate-slide-up max-w-2xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex justify-between items-end border-b border-zinc-800 pb-6 mb-8">
              <div>
                <p className="text-sm text-zinc-500 mb-1">Order Number</p>
                <p className="text-xl font-bold tracking-tight uppercase">{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-500 mb-1">Estimated Delivery</p>
                <p className="text-green-400 font-semibold">Tomorrow by 8 PM</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 space-y-10">
              <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-zinc-800"></div>
              
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-green-500 border-4 border-zinc-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white">Order Confirmed</h3>
                  <p className="text-sm text-zinc-400 mt-1">Your order was placed via WhatsApp.</p>
                  <p className="text-xs text-zinc-600 mt-1">Yesterday, 10:45 AM</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-green-500 border-4 border-zinc-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white">Shipped</h3>
                  <p className="text-sm text-zinc-400 mt-1">Package has left the Tohana facility.</p>
                  <p className="text-xs text-zinc-600 mt-1">Today, 08:30 AM</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-zinc-800 border-4 border-zinc-900 z-10 animate-pulse"></div>
                <div className="absolute left-[11px] -top-10 h-12 w-0.5 bg-green-500 z-0"></div>
                <div>
                  <h3 className="font-bold text-white">Out for Delivery</h3>
                  <p className="text-sm text-zinc-400 mt-1">Your package is arriving soon.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-zinc-800 text-center">
              <a 
                href={`https://wa.me/${SITE_CONFIG.phone}?text=Hi, I need an update on my order ${orderId}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 hover:text-white transition"
              >
                Having trouble? Contact Support
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
