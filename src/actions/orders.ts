'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateInvoiceNumber } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

export async function createOrder(data: {
  customer_name: string
  phone: string
  address: string
  note?: string
  items: { product_id: string; quantity: number; price: number }[]
  total_price: number
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const invoice_number = generateInvoiceNumber()

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      invoice_number,
      customer_name: data.customer_name,
      phone: data.phone,
      address: data.address,
      note: data.note || null,
      total_price: data.total_price,
      status: 'pending' as OrderStatus,
    })
    .select()
    .single()

  if (orderError) {
    return { error: orderError.message }
  }

  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    return { error: itemsError.message }
  }

  revalidatePath('/my-orders')
  revalidatePath('/admin/orders')

  return { success: true, invoice_number, order_id: order.id }
}

export async function getUserOrders() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return (data as Order[]) || []
}

export async function getAllOrders() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }

  return (data as Order[]) || []
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath('/my-orders')
  return { success: true }
}

export async function getOrderStats() {
  const supabase = await createClient()

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_price')
    .in('status', ['pending', 'processing', 'completed'])

  const totalRevenue = revenueData?.reduce((sum, o) => sum + o.total_price, 0) || 0

  const { count: totalCustomers } = await supabase
    .from('orders')
    .select('user_id', { count: 'exact', head: true })

  return {
    totalProducts: totalProducts || 0,
    totalOrders: totalOrders || 0,
    totalRevenue,
    totalCustomers: totalCustomers || 0,
  }
}

export async function updateOrderCustomer(
  orderId: string,
  data: { customer_name: string; phone: string }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ customer_name: data.customer_name, phone: data.phone })
    .eq('id', orderId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/orders')
  return { success: true }
}
