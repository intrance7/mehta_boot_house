"use client";

import { useState, useEffect } from "react";
import { SITE_CONFIG } from "../lib/configure";
import { MessageIcon, ShoeIcon, HandshakeIcon } from "./Icons";

const QUICK_MESSAGES = [
  "I need help finding the right size",
  "What's your return policy?",
  "Do you have COD delivery?",
  "I want to place a bulk order",
];

export default function WhatsAppButton() {
  const [open, setOpen]         = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // Show attention bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const buildUrl = (msg: string) =>
    `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">

      {/* ── Chat widget ── */}
      {open && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-72 overflow-hidden">

          {/* Header */}
          <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-lg">M</div>
            <div>
              <p className="font-semibold text-white text-sm">Mehta Boot House</p>
              <p className="text-green-200 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block" />
                Typically replies in minutes
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white">✕</button>
          </div>

          {/* Message bubble */}
          <div className="p-4">
            <div className="bg-zinc-800 rounded-xl rounded-tl-sm px-3 py-2 text-sm text-gray-300 mb-3">
              <span className="inline-block mr-1"><HandshakeIcon size={14} className="inline mb-0.5" /></span> Hi! How can we help you today? Pick a question below or type your own.
            </div>

            {/* Quick replies */}
            <div className="space-y-2">
              {QUICK_MESSAGES.map((msg) => (
                <a
                  key={msg}
                  href={buildUrl(msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-zinc-700 hover:border-green-500 hover:bg-zinc-800 rounded-xl px-3 py-2 text-sm transition"
                >
                  {msg}
                </a>
              ))}
            </div>
          </div>

          {/* Custom message input */}
          <div className="px-4 pb-4">
            <a
              href={buildUrl(SITE_CONFIG.whatsappGreeting)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition w-full justify-center"
            >
              <MessageIcon size={16} className="inline mr-1" /> Open in WhatsApp
            </a>
          </div>

        </div>
      )}

      {/* ── Attention bubble ── */}
      {showBubble && !open && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl rounded-br-sm px-4 py-2.5 text-sm shadow-xl max-w-[200px] text-right animate-bounce-once">
          Need help? <ShoeIcon size={16} className="inline mx-1" /> Chat with us!
          <button
            onClick={() => setShowBubble(false)}
            className="ml-2 text-gray-500 hover:text-white text-xs"
          >✕</button>
        </div>
      )}

      {/* ── Main FAB ── */}
      <button
        onClick={() => { setOpen((v) => !v); setShowBubble(false); }}
        className={`w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 relative
          ${open ? "rotate-0" : "hover:scale-110"}`}
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        )}
        <span className="text-2xl flex items-center justify-center">{open ? "✕" : <MessageIcon size={24} />}</span>
      </button>

    </div>
  );
}