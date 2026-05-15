'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { formatPrice, generateWhatsAppUrl, generateProductWhatsAppMessage } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

type ProductDetailProps = {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean)

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  const handleWhatsApp = () => {
    const message = generateProductWhatsAppMessage(product.code_product, product.name)
    const url = generateWhatsAppUrl(message)
    window.open(url, '_blank')
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-base-300 border border-gold/10"
        >
          {allImages.length > 0 ? (
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">💐</div>
          )}
        </motion.div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === i ? 'border-gold' : 'border-gold/10'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {product.category && (
          <span className="inline-block text-xs font-medium text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
            {product.category.name}
          </span>
        )}

        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-white">
          {product.name}
        </h1>

        <p className="text-3xl font-bold text-gold">
          {formatPrice(product.price)}
        </p>

        <div className="space-y-3 text-sm text-gray-400">
          <p>
            <span className="font-medium text-gray-200">Kode Produk:</span>{' '}
            {product.code_product}
          </p>
          <p>
            <span className="font-medium text-gray-200">Stok:</span>{' '}
            {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
          </p>
        </div>

        <div className="border-t border-gold/10 pt-6">
          <h3 className="font-semibold text-gray-200 mb-2">Deskripsi</h3>
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-300">Jumlah:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gray-300 hover:border-gold transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center font-medium text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gray-300 hover:border-gold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={handleAddToCart}
            className="btn-florea flex-1 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Tambah ke Keranjang
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2.5 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pesan via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
