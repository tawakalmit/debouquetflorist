'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { signInWithGoogle, signInWithEmail, signUp } from '@/actions/auth'

export function LoginContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signInWithGoogle(redirectTo)
    setLoading(false)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'register') {
      const result = await signUp(email, password, fullName)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.')
        setMode('login')
      }
    } else {
      const result = await signInWithEmail(email, password)
      if (result?.error) {
        toast.error(result.error)
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="card-florea p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-gold">Debouquet</h1>
            <p className="text-xs text-gold/60 tracking-[0.3em] uppercase mt-1 font-heading">Florist</p>
            <p className="text-sm text-gray-500 mt-4">
              {mode === 'login' ? 'Masuk ke akun Anda' : 'Buat akun baru'}
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gold/20 bg-base-300 hover:bg-base-300/80 transition-colors text-sm font-medium text-gray-200 disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gold/10" />
            <span className="text-xs text-gray-500">atau</span>
            <div className="flex-1 h-px bg-gold/10" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                  placeholder="Nama lengkap"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-florea w-full disabled:opacity-50"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : mode === 'login' ? (
                'Masuk'
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-gold font-medium hover:underline"
                >
                  Daftar
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-gold font-medium hover:underline"
                >
                  Masuk
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
