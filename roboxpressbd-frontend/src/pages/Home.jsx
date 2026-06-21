import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Catalog } from '../api/client'
import HeroCarousel from '../components/HeroCarousel.jsx'
import ProductCarousel from '../components/ProductCarousel.jsx'

const CATEGORY_ICON = (name) => {
  const n = (name || '').toLowerCase()
  if (n.includes('instrumen')) return ''
  if (n.includes('drone')) return ''
  if (n.includes('arduino')) return ''
  if (n.includes('esp')) return ''
  if (n.includes('home')) return ''
  if (n.includes('robot')) return ''
  if (n.includes('sensor')) return ''
  if (n.includes('power')) return ''
  return ''
}

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Instruments', slug: 'instruments' },
  { id: 2, name: 'Drone', slug: 'drone' },
  { id: 3, name: 'Arduino', slug: 'arduino' },
  { id: 4, name: 'ESP', slug: 'esp' },
  { id: 5, name: 'Home Automation', slug: 'home-automation' },
]

export default function Home() {
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [promoBanner, setPromoBanner] = useState(null)
  const [adBanner, setAdBanner] = useState(null)

  useEffect(() => {
    Catalog.categories().then(setCategories).catch(() => {})
    Catalog.brands().then(setBrands).catch(() => {})
    Catalog.banners().then(b => {
      const p = b.find(x => x.placement === 'PROMOTION')
      if (p) setPromoBanner(p)
      
      const ad = b.find(x => x.placement === 'AD')
      if (ad) setAdBanner(ad)
    }).catch(() => {})
  }, [])

  const cats = categories.length ? categories : DEFAULT_CATEGORIES
  const displayBrands = brands.filter(b => b.logoUrl).slice(0, 10)

  const TARGET_CATS = ['LiPo Batteries', 'Antenna', 'Radios & Tx Rx', 'Motors', 'Flight Controller']
  const displayCats = categories.length 
    ? categories.filter(c => TARGET_CATS.includes(c.name)).sort((a, b) => TARGET_CATS.indexOf(a.name) - TARGET_CATS.indexOf(b.name))
    : cats.slice(0, 5)

  return (
    <div style={{ background: '#e8edf5', minHeight: '100vh' }}>

      {/* ── Hero Carousel Container (aligned and relative for category overlay) ── */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <HeroCarousel />
      </div>

      {/* ── Content area ── */}
      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">

        {/* Top Selling Products */}
        <ProductCarousel
          title="Top Selling Products"
          fetcher={Catalog.featured}
          viewAllHref="/products?sort=newest"
        />

        {/* Electronics Products */}
        <ProductCarousel
          title="Electronics Products"
          fetcher={() => Catalog.products({ category: 'sensors', size: 10 }).then(r => r.content.length ? r.content : Catalog.featured())}
          viewAllHref="/products?category=sensors"
        />

        {/* Drone Accessories */}
        <ProductCarousel
          title="Drone Accessories"
          fetcher={() => Catalog.products({ category: 'fpv', size: 10 }).then(r => r.content.length ? r.content : Catalog.trending())}
          viewAllHref="/products?category=fpv"
        />

        {/* PROMOTION banner */}
        {promoBanner && (
          <Link to={promoBanner.linkUrl || '/products'}
            className="block rounded-lg overflow-hidden"
            style={{ display: 'block' }}>
            <img src={promoBanner.imageUrl} alt={promoBanner.title}
              className="w-full object-cover"
              style={{ height: '280px', objectPosition: 'center', borderRadius: '8px' }} />
          </Link>
        )}

        {/* 3D Printer & Accessories */}
        <ProductCarousel
          title="3D Printer & Accessories"
          fetcher={() => Catalog.products({ category: '3d-printer', size: 10 }).then(r => r.content.length ? r.content : Catalog.newArrivals())}
          viewAllHref="/products?category=3d-printer"
        />

        {/* Battery & Charger */}
        <ProductCarousel
          title="Battery & Charger"
          fetcher={() => Catalog.products({ category: 'chargers-power-supply', size: 10 }).then(r => r.content.length ? r.content : Catalog.backInStock())}
          viewAllHref="/products?category=chargers-power-supply"
        />

        {/* ── Popular Categories ── */}
        <section style={{ background: '#e8edf5', padding: '24px 0' }}>
          <div className="text-center mb-6">
            <h2 className="font-extrabold text-2xl text-slate-900 mb-1">Popular Categories</h2>
            <p className="text-slate-500 text-sm">RoboXpressBD Is An Online Store That Sells Electronics And Robotics Components</p>
          </div>

          {/* Category cards — big white cards with image + label */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {displayCats.map(c => (
                <Link key={c.id}
                  to={`/products?category=${c.slug}`}
                  className="flex-shrink-0 flex flex-col items-center bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow overflow-hidden"
                  style={{ width: 'calc(20% - 13px)', minWidth: '220px', height: '220px' }}>
                  {/* Image area */}
                  <div className="w-full flex items-center justify-center card-watermark"
                    style={{ height: '160px', background: '#f8fafc' }}>
                    {c.imageUrl
                      ? <img src={c.imageUrl} alt={c.name} className="w-36 h-36 object-contain relative z-10" />
                      : <div className="text-6xl relative z-10">{CATEGORY_ICON(c.name)}</div>
                    }
                  </div>
                  {/* Label */}
                  <div className="w-full h-[60px] flex items-center justify-center border-t border-slate-100 px-2 text-center">
                    <span className="text-[14px] font-semibold text-slate-800 line-clamp-2 leading-tight">{c.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <Link to="/products"
              className="inline-block text-sm px-6 py-1.5 rounded font-medium transition"
              style={{ border: '1px solid #2563eb', color: '#2563eb', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background='#2563eb'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#2563eb' }}>
              View All
            </Link>
          </div>
        </section>

        {/* ── Meet the Brands ── */}
        <section style={{ background: '#e8edf5', padding: '8px 0 24px' }}>
          <div className="text-center mb-6">
            <h2 className="font-extrabold text-2xl text-slate-900 mb-1">Meet the Brands</h2>
            <p className="text-slate-500 text-sm">Browse High-Quality Products From Trusted &amp; Experienced Brands</p>
          </div>
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => document.getElementById('supplier-scroll').scrollBy({ left: -220, behavior: 'smooth' })}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center text-slate-400 hover:text-blue-600 transition"
              style={{ width:'28px', height:'28px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:'50%', boxShadow:'0 1px 4px rgba(0,0,0,0.1)', fontSize:'18px' }}>
              ‹
            </button>

            <div id="supplier-scroll" className="flex gap-4 overflow-x-auto no-scrollbar">
              {displayBrands.map(b => (
                <Link key={b.id} to={`/products?brand=${b.slug}`}
                  className="flex-shrink-0 bg-white rounded-lg border border-slate-200 hover:shadow-md transition cursor-pointer overflow-hidden block"
                  style={{ width: 'calc(20% - 13px)', minWidth: '220px', height: '220px' }}>
                  <img
                    src={b.logoUrl}
                    alt={b.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = `https://placehold.co/220x220/334155/ffffff?text=${encodeURIComponent(b.name)}`
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => document.getElementById('supplier-scroll').scrollBy({ left: 220, behavior: 'smooth' })}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center text-slate-400 hover:text-blue-600 transition"
              style={{ width:'28px', height:'28px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:'50%', boxShadow:'0 1px 4px rgba(0,0,0,0.1)', fontSize:'18px' }}>
              ›
            </button>
          </div>

          <div className="text-center mt-6">
            <Link to="/brands"
              className="inline-block text-sm px-6 py-1.5 rounded font-medium transition"
              style={{ border: '1px solid #2563eb', color: '#2563eb', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background='#2563eb'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#2563eb' }}>
              View All
            </Link>
          </div>
        </section>

        {/* Secondary AD Banner */}
        {adBanner && (
          <Link to={adBanner.linkUrl || '/products'}
            className="block rounded-lg overflow-hidden mb-6"
            style={{ display: 'block' }}>
            <img src={adBanner.imageUrl} alt={adBanner.title}
              className="w-full object-cover"
              style={{ maxHeight: '200px', objectPosition: 'center', borderRadius: '8px' }} />
          </Link>
        )}

        {/* ── SEO Text Block ── */}
        <section className="bg-white rounded-lg border border-slate-200 p-6 text-sm text-slate-700 space-y-3 mb-4">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-4">
            Leading Drone &amp; Robotics Store in Bangladesh
          </h2>
          <p className="text-justify">
Looking for high-quality FPV drones, drone components, UAV systems, or reliable drone accessories in Bangladesh?
Our online store is built to meet the needs of drone pilots, aerial photographers, FPV racers, hobbyists, engineers, and UAV enthusiasts nationwide. We offer a wide range of products, including flight controllers, brushless motors, ESCs, propellers, GPS modules, FPV cameras, video transmitters, radio systems, batteries, chargers, frames, and more.
We also provide trusted sourcing services for specialized drone parts from international suppliers, ensuring you get the exact equipment you need — quickly and hassle-free. Whether you're building a custom FPV drone, upgrading your aerial platform, training for competitions, or developing advanced UAV projects, we've got you covered with expert support, competitive pricing, and a large inventory of genuine products.
Explore premium drone components, FPV gear, UAV accessories, and global sourcing services — perfect for pilots, makers, engineers, and drone enthusiasts across Bangladesh
          </p>
          <h3 className="font-bold text-slate-900">High-Quality Components for Your Next  Projects</h3>
          <p className="text-justify">
We offer a wide selection of high-quality FPV drones, drone components, and accessories to support pilots, hobbyists, and professionals alike.
Whether you're building a custom FPV drone, upgrading your racing quad, capturing cinematic footage, or working on a UAV project, we've got the right equipment for you. Browse through essential items like flight controllers, brushless motors, ESCs, propellers, GPS modules, radio transmitters, receivers, FPV cameras, video transmitters, batteries, chargers, frames, and more.
All our products are carefully tested for reliability and sourced from trusted brands to ensure top performance in every flight. Shop with confidence and take your drone experience to new heights
          </p>
        </section>

      </div>
    </div>
  )
}
