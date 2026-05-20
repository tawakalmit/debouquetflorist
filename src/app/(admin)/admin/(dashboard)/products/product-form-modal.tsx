'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, Category } from '@/types'
import { toast } from 'sonner'
import { uploadImage } from '@/actions/upload'

type ProductFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
  product: Product | null
  categories: Category[]
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
}: ProductFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [thumbnail, setThumbnail] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (product) {
      setThumbnail(product.thumbnail || '')
      setImages(product.images || [])
    } else {
      setThumbnail('')
      setImages([])
    }
  }, [product])

  const handleUpload = async (files: FileList | null, isThumbnail: boolean) => {
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.set('file', file)

      const result = await uploadImage(formData)

      if (result.error) {
        toast.error(`Upload gagal: ${result.error}`)
        continue
      }

      if (result.url) {
        if (isThumbnail) {
          setThumbnail(result.url)
        } else {
          setImages((prev) => [...prev, result.url!])
        }
      }
    }

    setUploading(false)
    toast.success('Upload berhasil')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('thumbnail', thumbnail)
    formData.set('images', JSON.stringify(images))

    await onSubmit(formData)
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-base-200 border border-gold/10 rounded-2xl p-6 w-full max-w-lg my-8 shadow-xl"
          >
            <h2 className="font-heading text-xl font-semibold text-white mb-6">
              {product ? 'Edit Produk' : 'Tambah Produk'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nama Produk</label>
                <input
                  name="name"
                  defaultValue={product?.name}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kode Produk</label>
                  <input
                    name="code_product"
                    defaultValue={product?.code_product}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
                    placeholder="FLR-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
                  <select
                    name="category_id"
                    defaultValue={product?.category_id}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Harga (Rp)</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={product?.price}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stok</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={product?.stock || 0}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  defaultValue={product?.description}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_featured"
                  value="true"
                  defaultChecked={product?.is_featured}
                  className="checkbox checkbox-sm checkbox-primary"
                  id="is_featured"
                />
                <label htmlFor="is_featured" className="text-sm text-gray-300">
                  Produk Unggulan
                </label>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files, true)}
                  className="file-input file-input-bordered file-input-sm w-full"
                />
                {thumbnail && (
                  <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden">
                    <Image src={thumbnail} alt="Thumbnail" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Gallery Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Gambar Tambahan
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleUpload(e.target.files, false)}
                  className="file-input file-input-bordered file-input-sm w-full"
                />
                {images.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                        <Image src={img} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {uploading && (
                <p className="text-xs text-primary">Mengupload gambar...</p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn btn-ghost rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 btn-florea disabled:opacity-50"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : product ? (
                    'Simpan'
                  ) : (
                    'Tambah'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
