import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Catalog } from '../api/client'
import ProductCard from '../components/ProductCard.jsx'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [page, setPage] = useState(0)

  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const brand = params.get('brand') || ''
  const sort = params.get('sort') || 'newest'

  useEffect(() => { Catalog.categories().then(setCategories); Catalog.brands().then(setBrands) }, [])
  useEffect(() => {
    setPage(0)
  }, [q, category, brand, sort])

  useEffect(() => {
    Catalog.products({ q, category, brand, sort, page, size: 48 })
      .then(setData)
      .catch(() => setData({ content: [], totalElements: 0, totalPages: 0 }))
  }, [q, category, brand, sort, page])

  const update = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    setParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[240px_1fr] gap-6">
      <aside className="bg-white p-4 rounded-lg border h-fit">
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li><button onClick={() => update('category', '')} className={!category ? 'text-brand font-medium' : 'hover:text-brand'}>All</button></li>
            {categories.map(c => (
              <li key={c.id}><button onClick={() => update('category', c.slug)}
                className={category === c.slug ? 'text-brand font-medium' : 'hover:text-brand'}>{c.name}</button></li>
            ))}
          </ul>
        </div>
        <div className="mb-5">
          <h3 className="font-semibold mb-2">Brands</h3>
          <ul className="space-y-1 text-sm">
            <li><button onClick={() => update('brand', '')} className={!brand ? 'text-brand font-medium' : 'hover:text-brand'}>All</button></li>
            {brands.map(b => (
              <li key={b.id}><button onClick={() => update('brand', b.slug)}
                className={brand === b.slug ? 'text-brand font-medium' : 'hover:text-brand'}>{b.name}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Sort By</h3>
          <select value={sort} onChange={e => update('sort', e.target.value)}
            className="w-full border rounded-md px-2 py-1 text-sm">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
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
  )
}
