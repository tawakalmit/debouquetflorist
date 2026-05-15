'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const invoice = searchParams.get('invoice')

  return (
    <div className="container-florea max-w-md text-center py-16">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="text-6xl mb-6"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="font-heading text-2xl md:text-3xl font-light text-white">
          Pesanan Berhasil!
        </h1>
        <p className="mt-4 text-gray-400">
          Terima kasih telah memesan di Debouquet Florist. Pesanan Anda sedang diproses.
        </p>

        {invoice && (
          <div className="mt-6 p-4 bg-base-200 rounded-xl border border-gold/10">
            <p className="text-sm text-gray-500">Nomor Invoice</p>
            <p className="text-lg font-bold text-gold">{invoice}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-green-900/20 rounded-xl border border-green-500/20">
          <p className="text-sm text-green-400">
            ✅ Pesan WhatsApp telah dikirim ke admin. Silakan tunggu konfirmasi.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/my-orders" className="btn-florea">
            Lihat Pesanan Saya
          </Link>
          <Link href="/products" className="btn-florea-outline">
            Belanja Lagi
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
