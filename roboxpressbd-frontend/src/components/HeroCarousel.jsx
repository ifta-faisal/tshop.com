import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Catalog } from '../api/client'

const FALLBACK_SLIDES = [
  {
    id: 'f1',
    bg: 'linear-gradient(100deg, #0d1b6e 0%, #1a2fa0 40%, #0d1b6e 100%)',
    title: 'SMART PROJECTORS',
    subtitle: 'Your Home, Your Theatre',
    titleColor: '#FFD700',
    subtitleColor: '#ffffff',
    imageEmoji: '📽️',
  },
  {
    id: 'f2',
    bg: 'linear-gradient(100deg, #0d3b1a 0%, #166534 40%, #0d3b1a 100%)',
    title: 'ARDUINO & ESP32',
    subtitle: 'Build Your Next IoT Project',
    titleColor: '#86efac',
    subtitleColor: '#ffffff',
    imageEmoji: '🔌',
  },
  {
    id: 'f3',
    bg: 'linear-gradient(100deg, #1e003b 0%, #5b21b6 40%, #1e003b 100%)',
    title: 'ROBOTICS KITS',
    subtitle: 'Power Your Innovations',
    titleColor: '#d8b4fe',
    subtitleColor: '#ffffff',
    imageEmoji: '🤖',
  },
]

export default function HeroCarousel() {
  const [banners, setBanners] = useState([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    Catalog.banners().then(data => { 
      if (data?.length) {
        setBanners(data.filter(b => b.placement === 'HERO'))
      }
    }).catch(() => {})
  }, [])

  const slides = banners.length ? banners : FALLBACK_SLIDES
  const total = slides.length

  const prev = useCallback(() => setIdx(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx(i => (i + 1) % total), [total])

  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  return (
    <div className="relative overflow-hidden rounded-b-lg lg:rounded-lg h-[300px] sm:h-[380px] lg:h-[480px]" style={{ background: '#0d1b6e' }}>
      {slides.map((slide, i) => {
        const isApi = banners.length > 0 && slide.imageUrl
        return (
          <div key={slide.id || i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0, pointerEvents: i === idx ? 'auto' : 'none' }}>

            {isApi ? (
              <Link to={slide.linkUrl || '/products'} className="block w-full h-full">
                <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
              </Link>
            ) : (
              /* Fallback styled slide matching TechShopBD aesthetic */
              <Link to="/products" className="block w-full h-full relative" style={{ background: slide.bg }}>
                {/* Decorative circles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-10"
                    style={{ background: slide.titleColor }} />
                  <div className="absolute right-32 bottom-0 w-48 h-48 rounded-full opacity-5"
                    style={{ background: slide.titleColor }} />
                </div>
                {/* Text */}
                <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-12 lg:pl-[300px]">
                  <div className="max-w-lg">
                    <div className="text-6xl mb-3 drop-shadow-xl">{slide.imageEmoji}</div>
                    <h2 className="font-extrabold leading-none mb-3"
                      style={{
                        fontSize: '52px',
                        color: slide.titleColor,
                        fontStyle: 'italic',
                        textShadow: `0 0 40px ${slide.titleColor}55`,
                        lineHeight: 1.05,
                      }}>
                      {slide.title}
                    </h2>
                    <p className="text-white text-xl font-light italic mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                      {slide.subtitle}
                    </p>
                    <span className="inline-block text-sm font-bold tracking-widest px-8 py-2 rounded-full border-2 transition"
                      style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff', background: 'rgba(0,0,0,0.2)' }}>
                      CLICK HERE
                    </span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        )
      })}

      {/* Left arrow — TechShopBD style: semi-transparent circle */}
      <button onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-white transition hover:bg-black/40"
        style={{ width:'36px', height:'36px', background:'rgba(0,0,0,0.25)', borderRadius:'50%', fontSize:'22px', lineHeight:1 }}>
        ‹
      </button>
      <button onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-white transition hover:bg-black/40"
        style={{ width:'36px', height:'36px', background:'rgba(0,0,0,0.25)', borderRadius:'50%', fontSize:'22px', lineHeight:1 }}>
        ›
      </button>

      {/* Dots — centered at bottom */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? '28px' : '8px',
              height: '8px',
              background: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
            }} />
        ))}
      </div>
    </div>
  )
}
