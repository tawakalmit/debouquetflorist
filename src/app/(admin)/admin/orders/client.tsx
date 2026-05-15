'use client'

import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import type { Order, OrderStatus } from '@/types'
import { formatPrice } from '@/lib/utils'
import { updateOrderStatus, updateOrderCustomer } from '@/actions/orders'
import { EmptyState } from '@/components/ui/empty-state'

type AdminOrdersClientProps = {
  orders: Order[]
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-900/30 text-yellow-400' },
  processing: { label: 'Diproses', color: 'bg-blue-900/30 text-blue-400' },
  completed: { label: 'Selesai', color: 'bg-green-900/30 text-green-400' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-900/30 text-red-400' },
}

export function AdminOrdersClient({ orders: initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const result = await updateOrderStatus(orderId, status)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Status pesanan diperbarui')
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
    }
  }

  const startEditing = (order: Order) => {
    setEditingId(order.id)
    setEditName(order.customer_name)
    setEditPhone(order.phone)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditName('')
    setEditPhone('')
  }

  const saveCustomer = async (orderId: string) => {
    if (!editName.trim()) {
      toast.error('Nama customer tidak boleh kosong')
      return
    }
    const result = await updateOrderCustomer(orderId, {
      customer_name: editName.trim(),
      phone: editPhone.trim(),
    })
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Data customer diperbarui')
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, customer_name: editName.trim(), phone: editPhone.trim() }
            : o
        )
      )
      setEditingId(null)
    }
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-light text-white mb-8">
          Kelola Pesanan
        </h1>
        <EmptyState icon="📋" title="Belum ada pesanan" description="Pesanan akan muncul di sini" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-light text-white mb-6">
        Kelola Pesanan
      </h1>

      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending
          const isExpanded = expandedId === order.id
          const isEditing = editingId === order.id

          return (
            <div key={order.id} className="card-florea p-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                  <p className="font-medium text-gray-200 text-sm">{order.invoice_number}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Customer & Phone */}
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nama customer"
                    className="w-full px-3 py-2 rounded-lg border border-gold/20 bg-base-300 text-sm text-gray-200 focus:outline-none focus:border-gold"
                  />
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="No WhatsApp"
                    className="w-full px-3 py-2 rounded-lg border border-gold/20 bg-base-300 text-sm text-gray-200 focus:outline-none focus:border-gold"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveCustomer(order.id)}
                      className="flex-1 text-xs py-2 rounded-lg bg-green-900/30 text-green-400 border border-green-500/20"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="flex-1 text-xs py-2 rounded-lg bg-base-300 text-gray-400"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-300">{order.customer_name}</p>
                    <a href={`https://wa.me/${order.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-500 text-xs">
                      {order.phone}
                    </a>
                  </div>
                  <p className="font-bold text-gold">{formatPrice(order.total_price)}</p>
                </div>
              )}

              {/* Status + Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-gold/5">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className={`text-[10px] font-medium px-2 py-1 rounded-full border-none flex-shrink-0 ${status.color}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Diproses</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
                <div className="flex gap-1.5 ml-auto">
                  {!isEditing && (
                    <button
                      onClick={() => startEditing(order)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-gold/10 text-gold border border-gold/20"
                  >
                    {isExpanded ? 'Tutup' : 'Detail'}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="pt-3 border-t border-gold/10 space-y-2">
                  {order.address && order.address !== '-' && (
                    <div className="text-xs">
                      <span className="text-gray-500">Alamat: </span>
                      <span className="text-gray-300">{order.address}</span>
                    </div>
                  )}
                  {order.note && (
                    <div className="text-xs">
                      <span className="text-gray-500">Catatan: </span>
                      <span className="text-gray-300">{order.note}</span>
                    </div>
                  )}
                  <div className="space-y-1">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs bg-base-300/50 p-2 rounded-lg">
                        <span className="text-gray-300">{item.product?.name || 'Produk'} x{item.quantity}</span>
                        <span className="text-gold font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden md:block card-florea overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-base-300 border-b border-gold/10">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-400">Invoice</th>
                <th className="text-left px-4 py-3 font-medium text-gray-400">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-400">WhatsApp</th>
                <th className="text-left px-4 py-3 font-medium text-gray-400">Total</th>
                <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-400">Tanggal</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending
                const isExpanded = expandedId === order.id
                const isEditing = editingId === order.id

                return (
                  <Fragment key={order.id}>
                    <tr className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium text-gray-200">{order.invoice_number}</td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2 py-1 rounded-lg border border-gold/20 bg-base-300 text-sm text-gray-200 focus:outline-none focus:border-gold" />
                        ) : (
                          <span className="text-gray-400">{order.customer_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-2 py-1 rounded-lg border border-gold/20 bg-base-300 text-sm text-gray-200 focus:outline-none focus:border-gold" />
                        ) : (
                          <a href={`https://wa.me/${order.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">{order.phone}</a>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gold">{formatPrice(order.total_price)}</td>
                      <td className="px-4 py-3">
                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)} className={`text-xs font-medium px-2 py-1 rounded-full border-none ${status.color}`}>
                          <option value="pending">Pending</option>
                          <option value="processing">Diproses</option>
                          <option value="completed">Selesai</option>
                          <option value="cancelled">Dibatalkan</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-1.5 justify-end">
                          {isEditing ? (
                            <>
                              <button onClick={() => saveCustomer(order.id)} className="text-xs px-2.5 py-1.5 rounded-lg bg-green-900/30 text-green-400 border border-green-500/20 hover:bg-green-900/50 transition-colors">Simpan</button>
                              <button onClick={cancelEditing} className="text-xs px-2.5 py-1.5 rounded-lg bg-base-300 text-gray-400 hover:text-gray-200 transition-colors">Batal</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEditing(order)} className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 hover:bg-blue-900/50 transition-colors">Edit</button>
                              <button onClick={() => setExpandedId(isExpanded ? null : order.id)} className="text-xs px-2.5 py-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors">{isExpanded ? 'Tutup' : 'Detail'}</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-4 py-4 bg-base-300/50">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {order.address && order.address !== '-' && (
                                <div>
                                  <p className="text-gray-500">Alamat:</p>
                                  <p className="text-gray-200">{order.address}</p>
                                </div>
                              )}
                              {order.note && (
                                <div>
                                  <p className="text-gray-500">Catatan:</p>
                                  <p className="text-gray-200">{order.note}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-500 text-sm mb-2">Item Pesanan:</p>
                              <div className="space-y-1">
                                {order.items?.map((item) => (
                                  <div key={item.id} className="flex justify-between text-sm bg-base-200 p-2 rounded-lg">
                                    <span className="text-gray-300">{item.product?.name || 'Produk'} x{item.quantity}</span>
                                    <span className="font-medium text-gold">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
