# 👟 Mehta Boot House — Tohana

Premium footwear e-commerce website for **Mehta Boot House**, a trusted shoe store in Tohana, Haryana — serving customers since 1987.

🔗 **Live Site:** [Coming Soon on Vercel]

---

## ✨ Features

- 🏠 **Stunning Homepage** — Hero slider, animated stats, deal countdown, category browsing, Instagram reels integration
- 🛍️ **Shop Page** — Full product catalog with category filters, size filters, price range filters, and search
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 💬 **WhatsApp Integration** — One-click "Order via WhatsApp" on every product
- ❤️ **Wishlist** — Save favourite shoes with persistent local storage
- 🛒 **Cart System** — Add to cart with size selection and quantity management
- 📦 **Product Details** — Multi-image gallery, size chart, related products
- 🔐 **Secure Admin Dashboard** — PIN-protected with URL token & attempt lockout
- ➕ **Product Management** — Add single or bulk upload products via CSV
- 🗑️ **Inventory Control** — Category-wise view, search, filter & delete products
- 📸 **Multi-Image Upload** — Upload multiple shoe photos per product
- 🍪 **Cookie Consent Banner** — GDPR-friendly cookie notice
- 🎯 **SEO Optimized** — Proper meta tags, semantic HTML, fast load times

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Supabase** | Database & image storage |
| **Vercel** | Deployment platform |

## 📁 Project Structure

```
app/
├── admin/          # Protected admin dashboard
├── api/            # Server-side API routes (auth)
├── components/     # Reusable UI components
├── context/        # React context (Cart, Wishlist, Products, Toast)
├── lib/            # Config, Supabase client, utilities
├── shop/           # Shop page with filters
├── product/[id]/   # Dynamic product detail pages
├── about/          # About page
├── contact/        # Contact page
├── faq/            # FAQ page
├── track/          # Order tracking
└── wishlist/       # Wishlist page
middleware.ts       # Server-side admin route protection
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase project with `products` table and `shoes` storage bucket

### Setup

```bash
# Clone the repo
git clone https://github.com/intrance7/mehta_boot_house.git
cd mehta_boot_house/mehta-boot-house

# Install dependencies
npm install

# Create .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# ADMIN_URL_KEY=your_admin_url_key
# ADMIN_PIN=your_admin_pin

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Admin Access

Navigate to `/admin?key=<ADMIN_URL_KEY>` and enter the admin PIN.

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_URL_KEY`
   - `ADMIN_PIN`
4. Deploy!

## 📜 License

This project is proprietary software for Mehta Boot House, Tohana.

---

**Made with ❤️ for Mehta Boot House, Tohana — Premium Footwear Since 1987**
