import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductsGrid } from '@/components/product/products-grid'
import { ProductGridSkeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Produk - Debouquet Florist',
  description: 'Koleksi buket bunga, buket uang, dan karangan bunga premium dari Debouquet Florist.',
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
