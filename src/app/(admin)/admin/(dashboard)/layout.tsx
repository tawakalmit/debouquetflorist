import { AdminSidebar } from '@/components/layout/admin-sidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
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
