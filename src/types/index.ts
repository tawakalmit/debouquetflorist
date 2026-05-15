export type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Product = {
  id: string
  category_id: string
  name: string
  slug: string
  code_product: string
  description: string
  price: number
  thumbnail: string
  images: string[]
  stock: number
  is_featured: boolean
  created_at: string
  category?: Category
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
}

export type CartItem = {
  id: string
  cart_id: string
  product_id: string
  quantity: number
  product?: Product
}

export type Cart = {
  id: string
  user_id: string
  created_at: string
  items?: CartItem[]
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export type Order = {
  id: string
  user_id: string
  invoice_number: string
  customer_name: string
  phone: string
  address: string
  note: string | null
  total_price: number
  status: OrderStatus
  created_at: string
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  product?: Product
}
