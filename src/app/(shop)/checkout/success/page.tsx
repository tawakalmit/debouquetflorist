import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CheckoutSuccessContent } from './content'

export const metadata = {
  title: 'Pesanan Berhasil - Debouquet Florist',
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
