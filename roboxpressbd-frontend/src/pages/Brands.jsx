import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Catalog } from '../api/client'

export default function Brands() {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    Catalog.brands()
      .then(b => setBrands(b.filter(brand => brand.logoUrl)))
      .catch(() => { })
  }, [])

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-[28px] font-bold text-center text-slate-800 uppercase tracking-widest mb-16">
          Featured Brands
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center">
            {brands.map(b => (
              <Link
                key={b.id}
                to={`/products?brand=${b.slug}`}
                className="flex items-center justify-center w-full h-24 p-2 hover:scale-110 transition-transform duration-300"
              >
                <img
                  src={b.logoUrl}
                  alt={b.name}
                  className="max-w-full max-h-full object-contain"
                  onError={e => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = `https://placehold.co/200x100/ffffff/334155?text=${encodeURIComponent(b.name)}`
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
