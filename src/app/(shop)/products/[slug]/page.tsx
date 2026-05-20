import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductDetail } from '@/components/product/product-detail'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://debouquet.com'

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description, thumbnail, price')
    .eq('slug', slug)
    .single()

  if (!data) {
    return {
      title: 'Produk Tidak Ditemukan',
      robots: { index: false },
    }
  }

  const description = data.description
    ? data.description.substring(0, 160)
    : `Beli ${data.name} dari Debouquet Florist. Buket premium dengan desain elegan untuk momen spesial Anda.`

  return {
    title: data.name,
    description,
    openGraph: {
      title: `${data.name} - Debouquet Florist`,
      description,
      type: 'website',
      images: data.thumbnail
        ? [{ url: data.thumbnail, width: 800, height: 800, alt: data.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} - Debouquet Florist`,
      description,
      images: data.thumbnail ? [data.thumbnail] : undefined,
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
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

  const product = data as Product

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} dari Debouquet Florist`,
    image: product.thumbnail || undefined,
    url: `${siteUrl}/products/${slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Debouquet Florist',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Debouquet Florist',
      },
    },
    category: product.category?.name || 'Buket Bunga',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20 min-h-screen bg-base-100">
        <div className="container-florea py-8">
          <ProductDetail product={product} />
        </div>
      </main>
      <Footer />
    </>
  )
}
