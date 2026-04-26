"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "../lib/configure";

const FAQS = [
  {
    category: "Ordering & Payment",
    questions: [
      {
        q: "How do I place an order?",
        a: "Currently, all orders are processed via WhatsApp for a personalized experience. Simply browse our shop, add items to your bag, and click 'Order via WhatsApp'. You will be redirected to WhatsApp with your order details pre-filled."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI (GPay, PhonePe, Paytm), Bank Transfers, and Cash on Delivery (COD) for select pin codes."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Orders within Haryana typically arrive in 1-3 business days. For the rest of India, please allow 3-7 business days depending on your location."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders above ₹799. For orders below this amount, a nominal shipping fee is applied."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day hassle-free return policy. If you are not satisfied with your purchase or if there is a size issue, you can return the unworn shoes in their original packaging."
      },
      {
        q: "How do I initiate an exchange for a different size?",
        a: "To request an exchange, simply reply to us on WhatsApp with your order details and the new size you need. Our team will arrange a reverse pickup and send the replacement."
      }
    ]
  }
];

function Accordion({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-800 rounded-2xl overflow-hidden mb-4 transition-colors hover:border-zinc-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-zinc-900 focus:outline-none"
      >
        <span className="font-semibold text-white pr-4">{q}</span>
        <svg 
          className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out bg-zinc-950 px-5 overflow-hidden ${isOpen ? 'max-h-48 py-5 border-t border-zinc-800' : 'max-h-0'}`}
      >
        <p className="text-zinc-400 leading-relaxed text-sm">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="py-20 px-4 max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center mb-16 animate-slide-up">
        <p className="text-xs uppercase tracking-[0.4em] text-green-500 mb-4">Help Center</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Find answers to common questions about our products, shipping, and returns. Can't find what you're looking for? <Link href="/contact" className="text-green-400 hover:underline">Contact us</Link>.
        </p>
      </div>

      {/* ── FAQ Sections ── */}
      <div className="space-y-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {FAQS.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-zinc-700 inline-block"></span>
              {section.category}
            </h2>
            <div>
              {section.questions.map((faq, fidx) => (
                <Accordion key={fidx} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Still need help? ── */}
      <div className="mt-20 bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
        <p className="text-zinc-400 mb-8 max-w-md mx-auto">
          Our team is available to assist you Monday through Saturday. Drop us a message on WhatsApp.
        </p>
        <a 
          href={`https://wa.me/${SITE_CONFIG.phone}?text=Hi, I have a question about...`}
          target="_blank" 
          rel="noopener noreferrer"
        >
          <button className="bg-green-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-green-400 transition active:scale-95 shadow-xl">
            Chat on WhatsApp
          </button>
        </a>
      </div>
    </main>
  );
}
