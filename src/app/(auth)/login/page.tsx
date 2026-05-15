import { Suspense } from 'react'
import { LoginContent } from './content'

export const metadata = {
  title: 'Login - Debouquet Florist',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
