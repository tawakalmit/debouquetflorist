import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductDetail } from '@/components/product/product-detail'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Produk Tidak Ditemukan - Debouquet Florist' }

  return {
    title: `${data.name} - Debouquet Florist`,
    description: data.description,
  }
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()

  if (!data) notFound()

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-base-100">
        <div className="container-florea py-8">
          <ProductDetail product={data as Product} />
        </div>
      </main>
      <Footer />
    </>
  )
}
