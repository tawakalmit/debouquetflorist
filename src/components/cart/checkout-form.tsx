'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { useCartStore } from '@/store/cart'
import { createOrder } from '@/actions/orders'
import { formatPrice, generateWhatsAppUrl, generateCheckoutWhatsAppMessage } from '@/lib/utils'

export function CheckoutForm() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setMounted(true)
  })

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Keranjang kosong')
      return
    }

    setLoading(true)

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const result = await createOrder({
      customer_name: '-',
      phone: '-',
      address: '-',
      items: orderItems,
      total_price: getTotalPrice(),
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    // Generate WhatsApp message
    const whatsappItems = items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const message = generateCheckoutWhatsAppMessage(
      result.invoice_number!,
      whatsappItems,
      getTotalPrice(),
      '-',
      '-',
      '-',
      undefined
    )

    const waUrl = generateWhatsAppUrl(message)

    clearCart()
    window.open(waUrl, '_blank')
    router.push(`/checkout/success?invoice=${result.invoice_number}`)
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🛒</span>
        <h2 className="text-lg font-semibold text-white">Keranjang Kosong</h2>
        <p className="text-sm text-gray-500 mt-2">Tambahkan produk terlebih dahulu</p>
        <button
          onClick={() => router.push('/products')}
          className="btn-florea mt-6"
        >
          Belanja Sekarang
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="card-florea p-6">
        <h2 className="font-heading font-semibold text-white mb-4">Ringkasan Pesanan</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.thumbnail || '/placeholder.svg'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500">x{item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gold">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gold/10 mt-4 pt-4 flex justify-between">
          <span className="font-semibold text-gray-200">Total</span>
          <span className="font-bold text-lg text-gold">{formatPrice(getTotalPrice())}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-florea w-full flex items-center justify-center gap-2 disabled:opacity-50 py-3 text-base"
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Checkout via WhatsApp
          </>
        )}
      </button>
    </div>
  )
}
