import type { Metadata } from 'next'
import { Inter, Great_Vibes, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/toast-provider'
import { WhatsAppFloat } from '@/components/ui/whatsapp-float'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://debouquet.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Debouquet Florist - Say Love With Flowers',
    template: '%s | Debouquet Florist',
  },
  description:
    'Toko buket bunga, buket uang, dan karangan bunga premium di Indonesia. Desain elegan untuk setiap momen spesial Anda. Pengiriman cepat & harga terjangkau. Est. 2021.',
  keywords: [
    'buket bunga',
    'buket uang',
    'karangan bunga',
    'florist',
    'toko bunga',
    'debouquet',
    'bunga wisuda',
    'bunga anniversary',
    'bunga valentine',
    'rangkaian bunga',
    'buket bunga murah',
    'toko bunga online',
  ],
  authors: [{ name: 'Debouquet Florist' }],
  creator: 'Debouquet Florist',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'Debouquet Florist',
    title: 'Debouquet Florist - Say Love With Flowers',
    description:
      'Toko buket bunga, buket uang, dan karangan bunga premium. Desain elegan untuk setiap momen spesial Anda. Est. 2021.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Debouquet Florist - Say Love With Flowers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Debouquet Florist - Say Love With Flowers',
    description:
      'Toko buket bunga, buket uang, dan karangan bunga premium. Desain elegan untuk setiap momen spesial Anda.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${greatVibes.variable} ${cormorant.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
        <WhatsAppFloat />
        <ToastProvider />
      </body>
    </html>
  )
}
