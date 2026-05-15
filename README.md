# 🌸 Floréa - Premium Florist E-Commerce

Website e-commerce modern untuk toko buket **Floréa** yang menjual buket bunga, buket uang, dan karangan bunga.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + DaisyUI
- **Database & Auth:** Supabase
- **State Management:** Zustand
- **Form:** React Hook Form + Zod
- **Animation:** Framer Motion
- **Toast:** Sonner

## Fitur

### 🛍️ Customer
- Landing page premium dengan hero section
- Katalog produk dengan filter, search, dan sorting
- Detail produk dengan image gallery
- Keranjang belanja (cart) dengan drawer
- Checkout dengan integrasi WhatsApp otomatis
- Riwayat pesanan (order history)
- Login dengan Google SSO & Email

### 🔧 Admin
- Dashboard dengan statistik
- CRUD produk lengkap
- Upload gambar ke Supabase Storage
- Manajemen pesanan dengan update status
- Kelola kategori

### ✨ UX
- Mobile-first responsive design
- Smooth animations (Framer Motion)
- Skeleton loading states
- Empty states
- Toast notifications
- Confirm dialog
- Floating WhatsApp button
- SEO friendly

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Jalankan SQL schema di SQL Editor:

```bash
# Copy isi file supabase-schema.sql ke SQL Editor Supabase
```

3. Setup Storage:
   - Buat bucket `images` (public)

4. Setup Auth:
   - Enable Google provider di Authentication > Providers
   - Set redirect URL: `http://localhost:3000/auth/callback`

### 3. Environment Variables

Copy `.env.local` dan isi dengan credentials Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Struktur Project

```
src/
├── actions/          # Server Actions (CRUD)
├── app/
│   ├── (admin)/      # Admin dashboard routes
│   ├── (auth)/       # Authentication routes
│   ├── (shop)/       # Customer-facing routes
│   └── auth/         # Auth callback
├── components/
│   ├── cart/         # Cart & checkout components
│   ├── layout/       # Navbar, footer, sidebar
│   ├── product/      # Product cards, grid, detail
│   └── ui/           # Reusable UI components
├── hooks/            # Custom hooks
├── lib/
│   └── supabase/     # Supabase client config
├── store/            # Zustand stores
├── types/            # TypeScript types
└── proxy.ts          # Auth proxy (middleware)
```

## Database Schema

Lihat `supabase-schema.sql` untuk schema lengkap termasuk:
- `categories` - Kategori produk
- `products` - Data produk
- `profiles` - Profil user
- `orders` - Data pesanan
- `order_items` - Item pesanan
- Row Level Security policies
- Auto-create profile trigger

## Deployment

```bash
npm run build
npm start
```

Untuk deploy ke Vercel:
1. Push ke GitHub
2. Import di Vercel
3. Set environment variables
4. Deploy

---

Built with ❤️ for UMKM Florist Modern
