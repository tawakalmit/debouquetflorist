import { getOrderStats } from '@/actions/orders'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const stats = await getOrderStats()

  const statCards = [
    {
      label: 'Total Produk',
      value: stats.totalProducts.toString(),
      icon: '📦',
    },
    {
      label: 'Total Pesanan',
      value: stats.totalOrders.toString(),
      icon: '🛒',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: '💰',
    },
    {
      label: 'Total Customer',
      value: stats.totalCustomers.toString(),
      icon: '👥',
    },
  ]

  return (
    <div>
      <h1 className="font-heading text-2xl md:text-3xl font-light text-white mb-8">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-base-200 rounded-2xl p-6 border border-gold/10 hover:border-gold/20 transition-colors"
          >
            <span className="text-3xl">{stat.icon}</span>
            <p className="mt-3 text-2xl font-bold text-gold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="mt-8 card-florea p-6">
        <h2 className="font-heading font-semibold text-white mb-4">Selamat Datang di Admin Panel ✦</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Kelola produk, pesanan, dan pantau performa toko Debouquet Florist Anda dari sini.
          Gunakan menu di sidebar untuk navigasi ke halaman yang diinginkan.
        </p>
      </div>
    </div>
  )
}
