'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/types'
import { ProductCard } from './product-card'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'

export function ProductsGrid() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('products')
      .select('*, category:categories(*)', { count: 'exact' })

    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      if (cat) {
        query = query.eq('category_id', cat.id)
      }
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true })
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, count } = await query
    setProducts((data as Product[]) || [])
    setTotalCount(count || 0)
    setLoading(false)
  }, [category, search, sort, page])

  const fetchCategories = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories((data as Category[]) || [])
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key !== 'page') params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Cari produk..."
            defaultValue={search}
            onChange={(e) => {
              const timeout = setTimeout(() => updateParams('search', e.target.value), 500)
              return () => clearTimeout(timeout)
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gold/20 bg-base-200 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => updateParams('category', e.target.value)}
          className="px-4 py-2.5 rounded-full border border-gold/20 bg-base-200 text-sm text-gray-200 focus:outline-none focus:border-gold transition-all"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="px-4 py-2.5 rounded-full border border-gold/20 bg-base-200 text-sm text-gray-200 focus:outline-none focus:border-gold transition-all"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga Termurah</option>
          <option value="price_desc">Harga Tertinggi</option>
        </select>
      </div>

      {/* Products */}
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Produk tidak ditemukan"
          description="Coba ubah filter atau kata kunci pencarian Anda"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParams('page', String(i + 1))}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-gold text-black'
                      : 'bg-base-200 border border-gold/20 text-gray-400 hover:border-gold'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
