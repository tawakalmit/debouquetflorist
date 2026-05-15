'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-base-200 border-l border-gold/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/10">
              <h2 className="font-heading text-lg font-semibold text-white">Keranjang</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Tutup keranjang"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-4xl mb-3">🛒</span>
                  <p className="text-gray-500 text-sm">Keranjang masih kosong</p>
                  <button onClick={onClose} className="mt-4 btn-florea text-sm">
                    Belanja Sekarang
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-3 p-3 rounded-xl bg-base-300/50 border border-gold/5"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.thumbnail || '/placeholder.svg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gold font-semibold">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-base-300 border border-gold/10 flex items-center justify-center text-xs text-gray-300 hover:border-gold/30 transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-6 text-center text-gray-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-base-300 border border-gold/10 flex items-center justify-center text-xs text-gray-300 hover:border-gold/30 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="self-start p-1 text-gray-500 hover:text-red-400 transition-colors"
                      aria-label="Hapus item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gold/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-lg font-bold text-gold">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="btn-florea w-full block text-center"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
