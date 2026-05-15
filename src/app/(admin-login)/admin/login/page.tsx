'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (data.success) {
      toast.success('Login berhasil')
      router.push('/admin')
      router.refresh()
    } else {
      toast.error(data.error || 'Username atau password salah')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        <div className="bg-base-200 border border-gold/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <span className="font-display text-3xl text-gold">Debouquet</span>
            <p className="text-xs text-gold/60 tracking-[0.3em] uppercase mt-1 font-heading">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-base-300 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20"
                placeholder="Username"
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-florea w-full disabled:opacity-50 mt-6"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
