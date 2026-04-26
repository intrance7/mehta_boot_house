"use client";

import { useState } from "react";
import { SITE_CONFIG } from "../lib/configure";
import { useToast } from "../context/ToastContext";

export default function ContactPage() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      setIsSubmitting(false);
      addToast("Message sent successfully! We'll get back to you soon.", "success");
      setForm({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <main className="py-20 px-4 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up">
        <p className="text-xs uppercase tracking-[0.4em] text-green-500 mb-4">Get in touch</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          Contact Us
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Have a question about an order, sizing, or our collections? Drop us a message or visit our store in Tohana.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* ── Contact Form ── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <input 
                required
                type="text" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
              <input 
                required
                type="email" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Message</label>
              <textarea 
                required
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none transition resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-green-500 text-black font-bold py-4 rounded-xl hover:bg-green-400 transition active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* ── Store Info ── */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Visit Our Store
            </h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              {SITE_CONFIG.address}
            </p>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700">
              {/* Google Maps iframe */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13854.787611843232!2d75.89422891390453!3d29.700146036100586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39115d7f76eb1c29%3A0xc3b5fc3b1ce9f43!2sTohana%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-3">Contact</h3>
              <p className="text-white mb-1">+{SITE_CONFIG.phone.substring(2)}</p>
              <p className="text-white">{SITE_CONFIG.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-3">Hours</h3>
              <p className="text-white mb-1">Mon - Sat: 10AM - 8PM</p>
              <p className="text-white">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
