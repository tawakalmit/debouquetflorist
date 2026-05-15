'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Product } from '@/types'

export async function getProducts(options?: {
  category?: string
  search?: string
  sort?: string
  limit?: number
  offset?: number
  featured?: boolean
}) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*, category:categories(*)', { count: 'exact' })

  if (options?.category) {
    query = query.eq('category.slug', options.category)
  }

  if (options?.search) {
    query = query.ilike('name', `%${options.search}%`)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  if (options?.sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (options?.sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 12) - 1)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], count: 0 }
  }

  return { products: (data as Product[]) || [], count: count || 0 }
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
  const category_id = formData.get('category_id') as string
  const code_product = formData.get('code_product') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string) || 0
  const is_featured = formData.get('is_featured') === 'true'
  const thumbnail = formData.get('thumbnail') as string
  const imagesRaw = formData.get('images') as string
  const images = imagesRaw ? JSON.parse(imagesRaw) : []

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    category_id,
    code_product,
    description,
    price,
    stock,
    is_featured,
    thumbnail,
    images,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
  const category_id = formData.get('category_id') as string
  const code_product = formData.get('code_product') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string) || 0
  const is_featured = formData.get('is_featured') === 'true'
  const thumbnail = formData.get('thumbnail') as string
  const imagesRaw = formData.get('images') as string
  const images = imagesRaw ? JSON.parse(imagesRaw) : []

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      category_id,
      code_product,
      description,
      price,
      stock,
      is_featured,
      thumbnail,
      images,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/products')
  revalidatePath('/admin/products')
  return { success: true }
}
