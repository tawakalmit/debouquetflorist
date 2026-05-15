export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, '0')
  return `INV-${year}-${random}`
}

export function generateWhatsAppUrl(message: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890'
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encodedMessage}`
}

export function generateProductWhatsAppMessage(
  code: string,
  name: string
): string {
  return `Halo admin, saya ingin memesan produk:\n\nKode Produk: ${code}\nNama Produk: ${name}`
}

export function generateCheckoutWhatsAppMessage(
  invoiceNumber: string,
  items: { name: string; quantity: number; price: number }[],
  totalPrice: number,
  customerName: string,
  phone: string,
  address: string,
  note?: string
): string {
  const itemsList = items
    .map((item) => `• ${item.name} x${item.quantity}`)
    .join('\n')

  let message = `Halo admin Debouquet Florist ✦\n\nSaya ingin melakukan pemesanan:\n\nInvoice: ${invoiceNumber}\n\nItem:\n${itemsList}\n\nTotal: ${formatPrice(totalPrice)}`

  if (customerName && customerName !== '-') {
    message += `\n\nNama: ${customerName}`
  }
  if (phone && phone !== '-') {
    message += `\nNo WA: ${phone}`
  }
  if (address && address !== '-') {
    message += `\nAlamat: ${address}`
  }
  if (note) {
    message += `\nCatatan: ${note}`
  }

  return message
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
