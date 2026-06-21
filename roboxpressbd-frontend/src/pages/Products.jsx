import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Catalog } from '../api/client'
import ProductCard from '../components/ProductCard.jsx'

const HARDCODED_PRICES = [
  { label: '৳ 10 - ৳ 50', value: '10-50' },
  { label: '৳ 50 - ৳ 100', value: '50-100' },
  { label: '৳ 100 - ৳ 250', value: '100-250' },
  { label: '৳ 250 - ৳ 500', value: '250-500' },
  { label: '৳ 500 - ৳ 1,000', value: '500-1000' },
  { label: '৳ 1,000 - ৳ 2,500', value: '1000-2500' },
  { label: 'Above ৳ 2,500', value: '2500-above' },
];

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [adBanner, setAdBanner] = useState(null)
  const [page, setPage] = useState(0)

  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const brand = params.get('brand') || ''
  const price = params.get('price') || ''
  const sort = params.get('sort') || 'newest'

  useEffect(() => { 
    Catalog.categories().then(setCategories); 
    Catalog.brands().then(setBrands);
    Catalog.banners().then(b => {
      const ad = b.find(x => x.placement === 'AD');
      if (ad) setAdBanner(ad);
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setPage(0)
  }, [q, category, brand, price, sort])

  useEffect(() => {
    Catalog.products({ q, category, brand, price, sort, page, size: 48 })
      .then(setData)
      .catch(() => setData({ content: [], totalElements: 0, totalPages: 0 }))
  }, [q, category, brand, price, sort, page])

  const update = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    setParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <a href="/" className="hover:text-blue-600">Home</a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-slate-800 font-medium">Products</span>
      </div>

      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        <aside className="h-fit flex flex-col gap-6">
          {/* Categories */}
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Categories</h3>
            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <ul className="space-y-3 text-sm">
                <li>
                  <button onClick={() => update('category', '')} className={`flex items-center gap-2 w-full text-left transition ${!category ? 'text-[#1a56db] font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    All Categories
                  </button>
                </li>
                {categories.map(c => (
                  <li key={c.slug}>
                    <button onClick={() => update('category', c.slug)} className={`flex items-center gap-2 w-full text-left transition ${category === c.slug ? 'text-[#1a56db] font-semibold' : 'text-slate-600 hover:text-slate-900'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white p-5 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-slate-900">Filter by Brand</h3>
            <div className="max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              <ul className="space-y-3 text-sm">
                {brands.map(b => (
                  <li key={b.slug} className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id={`brand-${b.slug}`}
                      checked={brand === b.slug}
                      onChange={() => update('brand', brand === b.slug ? '' : b.slug)}
                      className="w-4 h-4 rounded border-slate-300 text-[#1a56db] focus:ring-[#1a56db]"
                    />
                    <label htmlFor={`brand-${b.slug}`} className="text-slate-700 cursor-pointer">{b.name}</label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 mb-6">
            <h3 className="font-bold text-lg mb-4 text-slate-900">PRICE</h3>
            <ul className="space-y-3 text-sm">
              {HARDCODED_PRICES.map(p => (
                <li key={p.value} className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id={`price-${p.value}`}
                    checked={price === p.value}
                    onChange={() => update('price', price === p.value ? '' : p.value)}
                    className="w-4 h-4 rounded border-slate-300 text-[#1a56db] focus:ring-[#1a56db]"
                  />
                  <label htmlFor={`price-${p.value}`} className="text-slate-700 cursor-pointer">{p.label}</label>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Side Banners */}
          <div className="flex flex-col gap-6">
            
            {/* Battery Restocked Banner */}
            <div className="bg-[#0f0f0f] text-white rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-md min-h-[320px]">
              <div className="flex flex-col items-center justify-center flex-1 w-full">
                <h2 className="text-4xl font-black italic leading-none mb-4" style={{ textShadow: '0 0 15px rgba(255,255,255,0.6)' }}>
                  <div className="tracking-wider">BATTERY</div>
                  <div className="tracking-wider">RESTOCKED</div>
                </h2>
                <p className="text-[13px] font-semibold text-gray-200 mt-2 mb-8 tracking-wide">
                  Check the description for more details
                </p>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="font-bold text-sm tracking-widest text-gray-300">roboxpressbd</span>
              </div>
            </div>

            {/* Walksnail Drone Banner */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col items-center pt-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-wider mb-1">WALKSNAIL</h3>
              <p className="text-xs font-semibold text-slate-400 tracking-widest mb-6 uppercase">Avatar HD System</p>
              <div className="w-full bg-[#e8dbd1] flex items-center justify-center p-4">
                {/* Using a drone image placeholder similar to the screenshot */}
                <img 
                  src="https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Walksnail Drone" 
                  className="w-full h-auto object-cover rounded shadow-sm"
                />
              </div>
            </div>

          </div>
        </aside>

      <section>
        <h1 className="text-xl font-bold mb-4">
          {q ? `Search: "${q}"` : category || brand ? 'Filtered Products' : 'All Products'}
          <span className="text-sm font-normal text-slate-500 ml-2">({data.totalElements})</span>
        </h1>
        {data.content.length === 0
          ? <div className="text-center py-20 text-slate-500">No products found</div>
          : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.content.map(p => <ProductCard key={p.id} product={p} />)}
            </div>}
        {data.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
            <span className="px-3 py-1">Page {page + 1} of {data.totalPages}</span>
            <button disabled={page + 1 >= data.totalPages} onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </section>
      </div>
    </div>
  )
}
