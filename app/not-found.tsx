import Link from "next/link";
import { SITE_CONFIG } from "./lib/configure";
import { ShoeIcon } from "./components/Icons";

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Visual Element */}
      <div className="relative w-48 h-48 mb-8 animate-fade-in">
        <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="flex items-center justify-center h-full w-full">
          <ShoeIcon size={120} className="text-zinc-500 opacity-80" />
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-zinc-300 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        Shoe Not Found
      </h2>
      <p className="text-zinc-500 max-w-md mx-auto mb-10 text-lg leading-relaxed animate-slide-up" style={{ animationDelay: "0.3s" }}>
        Looks like you stepped off the path! The page you are looking for at {SITE_CONFIG.name} doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <Link href="/">
          <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition active:scale-95 shadow-xl">
            Back to Home
          </button>
        </Link>
        <Link href="/shop">
          <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition active:scale-95 border border-zinc-800">
            Browse Shop
          </button>
        </Link>
      </div>
    </main>
  );
}
