import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CheckoutSuccessContent } from './content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pesanan Berhasil',
  description: 'Pesanan Anda telah berhasil dibuat. Terima kasih telah berbelanja di Debouquet Florist.',
  robots: { index: false, follow: false },
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen flex items-center justify-center">
        <Suspense fallback={<div className="loading loading-spinner loading-lg text-primary" />}>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
