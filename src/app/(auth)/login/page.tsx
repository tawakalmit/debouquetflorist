import { Suspense } from 'react'
import { LoginContent } from './content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Masuk ke akun Debouquet Florist Anda untuk melakukan pemesanan dan melihat riwayat pesanan.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
