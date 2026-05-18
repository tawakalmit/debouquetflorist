import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-base-200 border-t border-gold/10 mt-auto">
      <div className="container-florea py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl text-gold">Debouquet</span>
              <span className="font-heading text-xs text-gold/60 tracking-wider uppercase">Florist</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Say Love With Flowers. Kami menghadirkan rangkaian bunga dan buket premium
              dengan desain elegan untuk setiap perayaan Anda. Est. 2021
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-gold/90 mb-4 tracking-wide">Menu</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Produk
              </Link>
              <Link href="/products?category=buket-bunga" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Buket Bunga
              </Link>
              <Link href="/products?category=buket-uang" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Buket Uang
              </Link>
              <Link href="/products?category=karangan-bunga" className="text-sm text-gray-400 hover:text-gold transition-colors">
                Karangan Bunga
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-gold/90 mb-4 tracking-wide">Hubungi Kami</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <p>📍 Cianjur, Jawa Barat</p>
              <p>📱 +62 858-7153-3822</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Debouquet Florist. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
