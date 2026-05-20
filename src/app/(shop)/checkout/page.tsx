import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CheckoutForm } from '@/components/cart/checkout-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Selesaikan pemesanan buket bunga Anda di Debouquet Florist.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="container-florea py-8 max-w-2xl">
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white text-center mb-8">
            Checkout
          </h1>
          <div className="w-16 h-px bg-gold/50 mx-auto mb-8" />
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
