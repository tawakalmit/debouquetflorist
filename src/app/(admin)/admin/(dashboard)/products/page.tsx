import { AdminProductsClient } from './client'
import { getCategories } from '@/actions/categories'

export default async function AdminProductsPage() {
  const categories = await getCategories()

  return <AdminProductsClient categories={categories} />
}
