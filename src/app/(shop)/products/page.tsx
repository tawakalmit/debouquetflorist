import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductsGrid } from '@/components/product/products-grid'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Koleksi Buket & Karangan Bunga',
  description:
    'Jelajahi koleksi lengkap buket bunga, buket uang, dan karangan bunga premium dari Debouquet Florist. Tersedia berbagai pilihan untuk wisuda, anniversary, valentine, dan momen spesial lainnya.',
  openGraph: {
    title: 'Koleksi Buket & Karangan Bunga - Debouquet Florist',
    description:
      'Jelajahi koleksi lengkap buket bunga, buket uang, dan karangan bunga premium dari Debouquet Florist.',
  },
  alternates: {
    canonical: '/products',
  },
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="container-florea py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-heading text-3xl md:text-4xl font-light text-white">
              Koleksi Kami
            </h1>
            <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
            <p className="mt-4 text-gray-500 font-heading">
              Temukan buket sempurna untuk setiap momen spesial
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsGrid />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
