'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card-florea overflow-hidden group"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/80 backdrop-blur-sm text-[10px] md:text-xs font-medium text-gold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full border border-gold/20">
            {product.category.name}
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-2 right-2 md:top-3 md:right-3 bg-gold/90 backdrop-blur-sm text-[10px] md:text-xs font-medium text-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
            ★ Populer
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-200 text-xs md:text-base line-clamp-2 hover:text-gold transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 md:mt-1.5 text-gold font-bold text-sm md:text-lg">
          {formatPrice(product.price)}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-1.5 md:gap-2 mt-2.5 md:mt-3">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-center text-[11px] md:text-sm py-1.5 md:py-2 rounded-full border border-gold/20 text-gray-300 hover:border-gold hover:text-gold transition-colors"
          >
            Detail
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 text-[11px] md:text-sm py-1.5 md:py-2 rounded-full bg-gold text-black font-medium hover:bg-gold-light transition-colors"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </motion.div>
  )
}
