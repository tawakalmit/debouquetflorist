import { AdminSidebar } from '@/components/layout/admin-sidebar'

export const metadata = {
  title: 'Admin Dashboard - Debouquet Florist',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-base-100 flex">
      <AdminSidebar />
      <main className="flex-1 pt-16 md:pt-0 p-4 md:p-8 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}
