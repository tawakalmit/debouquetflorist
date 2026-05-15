'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types'
import { formatPrice } from '@/lib/utils'
import { deleteProduct, createProduct, updateProduct } from '@/actions/products'
import { createCategory } from '@/actions/categories'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ProductFormModal } from './product-form-modal'

type AdminProductsClientProps = {
  categories: Category[]
}

export function AdminProductsClient({ categories }: AdminProductsClientProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [categoryName, setCategoryName] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data } = await query
    setProducts((data as Product[]) || [])
    setLoading(false)
  }, [search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteProduct(deleteId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Produk berhasil dihapus')
      fetchProducts()
    }
    setDeleteId(null)
  }

  const handleCreateProduct = async (formData: FormData) => {
    const result = await createProduct(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Produk berhasil ditambahkan')
      setFormOpen(false)
      fetchProducts()
    }
  }

  const handleUpdateProduct = async (formData: FormData) => {
    if (!editProduct) return
    const result = await updateProduct(editProduct.id, formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Produk berhasil diperbarui')
      setEditProduct(null)
      setFormOpen(false)
      fetchProducts()
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    const formData = new FormData()
    formData.set('name', categoryName)
    const result = await createCategory(formData)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Kategori berhasil ditambahkan')
      setCategoryName('')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-xl md:text-3xl font-light text-white">
          Kelola Produk
        </h1>
        <button
          onClick={() => {
            setEditProduct(null)
            setFormOpen(true)
          }}
          className="btn-florea text-xs md:text-sm"
        >
          + Tambah
        </button>
      </div>

      {/* Add Category */}
      <div className="card-florea p-3 md:p-4 mb-4 md:mb-6">
        <form onSubmit={handleCreateCategory} className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nama kategori baru..."
            className="flex-1 px-3 md:px-4 py-2 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
          />
          <button type="submit" className="btn-florea text-xs md:text-sm whitespace-nowrap">
            + Kategori
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="mb-4 md:mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Belum ada produk</div>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div key={product.id} className="card-florea p-3 flex gap-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
                  {product.thumbnail ? (
                    <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">💐</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 text-sm truncate">{product.name}</p>
                  <p className="text-gold font-bold text-sm mt-0.5">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-full border border-gold/20">
                      {product.category?.name || '-'}
                    </span>
                    <span className="text-[10px] text-gray-500">Stok: {product.stock}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <button
                    onClick={() => { setEditProduct(product); setFormOpen(true) }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-red-900/30 text-red-400 border border-red-500/20"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden md:block card-florea overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-base-300 border-b border-gold/10">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-400">Produk</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-400">Kode</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-400">Kategori</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-400">Harga</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-400">Stok</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
                            {product.thumbnail ? (
                              <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-lg">💐</div>
                            )}
                          </div>
                          <span className="font-medium text-gray-200 truncate max-w-[150px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{product.code_product}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">{product.category?.name || '-'}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gold">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3 text-gray-400">{product.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => { setEditProduct(product); setFormOpen(true) }}
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-900/30 text-blue-400 border border-blue-500/20 hover:bg-blue-900/50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 text-red-400 border border-red-500/20 hover:bg-red-900/50 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Hapus Produk"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditProduct(null) }}
        onSubmit={editProduct ? handleUpdateProduct : handleCreateProduct}
        product={editProduct}
        categories={categories}
      />
    </div>
  )
}
