'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Category } from '@/types'

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return (data as Category[]) || []
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')

  const { error } = await supabase.from('categories').insert({ name, slug })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/products')
  return { success: true }
}
