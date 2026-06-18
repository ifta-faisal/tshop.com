import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

export default function ProductCarousel({ title, fetcher, viewAllHref }) {
  const [items, setItems] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    if (fetcher) fetcher().then(setItems).catch(() => {})
  }, [fetcher])

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 880, behavior: 'smooth' })

  if (!items.length) return null

  return (
    <section className="mb-4" style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '16px 20px 20px' }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[17px] font-bold text-slate-900 leading-tight">{title}</h2>
        {viewAllHref && (
          <Link to={viewAllHref}
            className="text-xs px-3 py-1 rounded font-medium transition"
            style={{ border: '1px solid #2563eb', color: '#2563eb', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background='#2563eb'; e.currentTarget.style.color='#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#2563eb' }}>
            View All
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left chevron */}
        <button onClick={() => scroll(-1)}
          className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center text-slate-400 hover:text-blue-600 transition"
          style={{ width:'28px', height:'28px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:'50%', boxShadow:'0 1px 4px rgba(0,0,0,0.1)', fontSize:'18px', lineHeight:1 }}>
          ‹
        </button>

        {/* Products strip */}
        <div ref={ref} className="flex gap-3 overflow-x-auto no-scrollbar">
          {items.map(p => (
            <div key={p.id}
              className="flex-shrink-0"
              style={{ minWidth: '175px', maxWidth: '175px' }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Right chevron */}
        <button onClick={() => scroll(1)}
          className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center text-slate-400 hover:text-blue-600 transition"
          style={{ width:'28px', height:'28px', background:'#fff', border:'1px solid #e2e8f0', borderRadius:'50%', boxShadow:'0 1px 4px rgba(0,0,0,0.1)', fontSize:'18px', lineHeight:1 }}>
          ›
        </button>
      </div>
    </section>
  )
}
