'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import { ProductCard } from './product-card'
import { ProductGridSkeleton } from '@/components/ui/skeleton'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8)

      setProducts((data as Product[]) || [])
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  if (loading) return <ProductGridSkeleton />

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Belum ada produk unggulan.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
