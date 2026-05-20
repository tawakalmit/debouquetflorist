'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'No file provided' }
  }

  const supabase = createAdminClient()

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `products/${fileName}`

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) {
    return { error: error.message }
  }

  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return { url: urlData.publicUrl }
}
