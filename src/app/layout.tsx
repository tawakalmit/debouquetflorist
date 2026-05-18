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

export const metadata: Metadata = {
  title: 'Debouquet Florist - Say Love With Flowers',
  description:
    'Toko buket bunga, buket uang, dan karangan bunga premium. Desain elegan untuk setiap momen spesial Anda. Est. 2021',
  keywords: ['buket bunga', 'buket uang', 'karangan bunga', 'florist', 'toko bunga', 'debouquet'],
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
