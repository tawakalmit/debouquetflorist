import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { OrdersList } from '@/components/cart/orders-list'
import { getUserOrders } from '@/actions/orders'

export const metadata = {
  title: 'Pesanan Saya - Debouquet Florist',
}

export default async function MyOrdersPage() {
  const orders = await getUserOrders()

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="container-florea py-8 max-w-3xl">
          <h1 className="font-heading text-2xl md:text-3xl font-light text-white text-center mb-4">
            Pesanan Saya
          </h1>
          <div className="w-16 h-px bg-gold/50 mx-auto mb-8" />
          <OrdersList orders={orders} />
        </div>
      </main>
      <Footer />
    </>
  )
}
