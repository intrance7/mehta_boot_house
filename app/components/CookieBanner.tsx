"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CookieIcon } from "./Icons";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    if (!localStorage.getItem("cookie_consent")) {
      // Delay showing it slightly for better UX
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 p-4 md:p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between pointer-events-auto animate-slide-up relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] pointer-events-none" />

        <div className="flex-1 relative z-10">
          <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <CookieIcon size={16} className="text-amber-600" /> We value your privacy
          </h4>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
            <Link href="/privacy" className="text-green-400 hover:underline ml-1">
              Read our Privacy Policy
            </Link>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShow(false)}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition active:scale-95 text-sm"
          >
            Decline
          </button>
          <button 
            onClick={accept}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-green-500 text-black font-bold hover:bg-green-400 transition active:scale-95 text-sm"
          >
            Accept All
          </button>
        </div>

      </div>
    </div>
  );
}
