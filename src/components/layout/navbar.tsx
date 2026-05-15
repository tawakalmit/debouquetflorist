'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { CartDrawer } from '@/components/cart/cart-drawer'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCartStore((s) => s.getTotalItems())

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/products', label: 'Produk' },
    { href: '/my-orders', label: 'Pesanan' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-lg shadow-lg shadow-black/20 border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-florea flex items-center justify-between h-16 md:h-18">
          {/* Logo - links to home */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl text-gold">
              Debouquet
            </span>
            <span className="font-heading text-xs md:text-sm text-gold/70 tracking-wider uppercase hidden sm:block">
              Florist
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-gold transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Keranjang"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {mounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gold"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-lg border-t border-gold/10"
            >
              <div className="container-florea py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-gray-300 hover:text-gold py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
