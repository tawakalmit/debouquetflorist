import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { FeaturedProducts } from '@/components/product/featured-products'

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/3 rounded-full blur-3xl" />
          {/* Gold line accents */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </div>

        <div className="container-florea relative z-10 pt-20">
          <div className="text-center max-w-3xl mx-auto">
            <div>
              <span className="inline-block text-sm font-heading font-medium text-gold/80 tracking-[0.3em] uppercase mb-6">
                ✦ Say Love With Flowers ✦
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-gold leading-tight">
              Debouquet Florist
            </h1>

            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-heading">
              Hadirkan kebahagiaan dengan rangkaian buket bunga, buket uang, dan karangan bunga
              premium yang dirancang dengan penuh cinta dan keanggunan.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-florea text-center">
                Lihat Koleksi
              </Link>
              <Link href="/products" className="btn-florea-outline text-center">
                Pesan Sekarang
              </Link>
            </div>

            {/* Est badge */}
            <p className="mt-12 text-xs text-gold/40 tracking-[0.4em] uppercase font-heading">
              Est. 2021
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {/* <section className="section-padding bg-base-100">
        <div className="container-florea">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-white">
              Kategori Produk
            </h2>
            <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
            <p className="mt-4 text-gray-500 font-heading">Pilih kategori sesuai kebutuhan Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Buket Bunga',
                slug: 'buket-bunga',
                emoji: '💐',
                desc: 'Rangkaian bunga segar untuk berbagai momen',
              },
              {
                name: 'Buket Uang',
                slug: 'buket-uang',
                emoji: '💰',
                desc: 'Buket uang kreatif untuk hadiah spesial',
              },
              {
                name: 'Karangan Bunga',
                slug: 'karangan-bunga',
                emoji: '🌺',
                desc: 'Karangan bunga untuk ucapan & perayaan',
              },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group p-8 rounded-2xl bg-base-200 border border-gold/10 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-5xl block mb-4">{cat.emoji}</span>
                <h3 className="font-heading text-xl font-semibold text-white group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Products */}
      <section className="section-padding bg-base-200">
        <div className="container-florea">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-white">
              Produk Populer
            </h2>
            <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
            <p className="mt-4 text-gray-500 font-heading">Pilihan terbaik dari pelanggan kami</p>
          </div>
          <FeaturedProducts />
          <div className="text-center mt-10">
            <Link href="/products" className="btn-florea-outline">
              Lihat Semua Produk →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {/* <section className="section-padding bg-base-100">
        <div className="container-florea">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-white">
              Kenapa Memilih Kami?
            </h2>
            <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🌿', title: 'Bunga Segar', desc: 'Selalu menggunakan bunga segar berkualitas' },
              { icon: '🎨', title: 'Desain Unik', desc: 'Setiap buket didesain dengan kreativitas tinggi' },
              { icon: '🚀', title: 'Pengiriman Cepat', desc: 'Same day delivery untuk area tertentu' },
              { icon: '💝', title: 'Harga Terjangkau', desc: 'Kualitas premium dengan harga bersahabat' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl border border-gold/5 hover:border-gold/20 transition-colors">
                <span className="text-4xl block mb-3">{item.icon}</span>
                <h4 className="font-heading font-semibold text-white text-sm md:text-base">{item.title}</h4>
                <p className="mt-1 text-xs md:text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      {/* <section className="section-padding bg-base-200">
        <div className="container-florea">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-white">
              Apa Kata Mereka?
            </h2>
            <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rina S.',
                text: 'Buketnya cantik banget! Pacar saya sangat senang. Pasti order lagi.',
                rating: 5,
              },
              {
                name: 'Dian P.',
                text: 'Pelayanan cepat dan ramah. Buket uangnya kreatif, cocok untuk wisuda.',
                rating: 5,
              },
              {
                name: 'Andi M.',
                text: 'Karangan bunganya elegan. Pengiriman tepat waktu. Recommended!',
                rating: 5,
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="card-florea p-6"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-gold/80">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="section-padding bg-base-100 border-t border-gold/10">
        <div className="container-florea text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-light text-white">
            Siap Memesan?
          </h2>
          <div className="w-16 h-px bg-gold/50 mx-auto mt-4" />
          <p className="mt-6 text-gray-400 max-w-md mx-auto font-heading">
            Hubungi kami via WhatsApp untuk konsultasi dan pemesanan buket custom sesuai keinginan Anda.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285871533822'}?text=${encodeURIComponent('Halo admin Debouquet Florist, saya ingin memesan buket.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-florea inline-block mt-8"
          >
            💬 Chat WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}


