'use client'

import { motion } from 'framer-motion'
import type { Order } from '@/types'
import { formatPrice } from '@/lib/utils'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'

type OrdersListProps = {
  orders: Order[]
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' },
  processing: { label: 'Diproses', color: 'bg-blue-900/30 text-blue-400 border border-blue-500/20' },
  completed: { label: 'Selesai', color: 'bg-green-900/30 text-green-400 border border-green-500/20' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-900/30 text-red-400 border border-red-500/20' },
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="Belum ada pesanan"
        description="Pesanan Anda akan muncul di sini setelah checkout"
        action={
          <Link href="/products" className="btn-florea">
            Belanja Sekarang
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order, i) => {
        const status = statusConfig[order.status] || statusConfig.pending
        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-florea p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-white">{order.invoice_number}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.product?.name || 'Produk'} x{item.quantity}
                    </span>
                    <span className="text-gray-200 font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gold/10 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-bold text-gold">{formatPrice(order.total_price)}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
