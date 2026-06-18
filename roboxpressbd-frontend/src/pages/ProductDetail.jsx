import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Catalog } from '../api/client'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const fmt = (n) => '৳' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function ProductDetail() {
  const { slug } = useParams()
  const [p, setP] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const { add, isAuthed } = useCart()

  useEffect(() => {
    Catalog.product(slug).then(setP).catch(() => setP(null))
    Catalog.trending().then(data => {
      // Just pick 3 random/trending items for the "Frequently Bought Together" section
      if (data && data.length) {
        setRelated(data.slice(0, 3))
      }
    }).catch(() => {})
  }, [slug])

  if (!p) return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500">Loading…</div>

  const onSale = p.oldPrice && Number(p.oldPrice) > Number(p.price)

  const onAdd = async () => {
    if (!isAuthed) { toast.error('Please sign in'); return }
    try { await add(p.id, qty); toast.success('Added to cart') }
    catch (e) { toast.error(e.response?.data?.message || 'Failed') }
  }

  // Parse specifications into key-value pairs if it's formatted like "Key: Value" or similar.
  // For simplicity, we just split by newlines and try to split by colon.
  const specsList = (p.specifications || '').split('\n').filter(Boolean).map(line => {
    const parts = line.split(':')
    if (parts.length >= 2) return { key: parts[0].trim(), val: parts.slice(1).join(':').trim() }
    return { key: 'Feature', val: line.trim() }
  })

  // Calculate mock total for frequently bought together
  const relatedTotal = related.reduce((acc, curr) => acc + Number(curr.price), Number(p.price))

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-8">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500 mb-4 font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          {p.category && (
            <>
              <span className="mx-2">›</span>
              <Link to={`/products?category=${p.category.slug}`} className="hover:text-blue-600 transition-colors">{p.category.name}</Link>
            </>
          )}
          <span className="mx-2">›</span>
          <span className="text-slate-800">{p.name}</span>
        </nav>

        {/* TOP SECTION (Above the fold) */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 grid md:grid-cols-2 gap-10 mb-8 shadow-sm">
          {/* Left: Media Gallery */}
          <div>
            <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-center bg-white h-[400px] mb-4">
              {p.imageUrl
                ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                : <div className="text-slate-400">No image available</div>}
            </div>
            {/* Thumbnail Mock */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {[p.imageUrl, p.imageUrl, p.imageUrl, p.imageUrl].map((img, idx) => (
                <div key={idx} className={`w-20 h-20 flex-shrink-0 border-2 rounded p-1 cursor-pointer ${idx === 0 ? 'border-blue-500' : 'border-slate-200 opacity-60 hover:opacity-100'}`}>
                  {img ? <img src={img} className="w-full h-full object-contain" alt="" /> : <div className="w-full h-full bg-slate-100"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Core Buying Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3 leading-tight">{p.name}</h1>
            
            {/* Quick Info & Ratings */}
            <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center text-amber-400 text-lg">
                ★★★★<span className="text-slate-300">★</span>
                <span className="text-blue-600 ml-2 text-sm hover:underline cursor-pointer">(24 Reviews)</span>
              </div>
              <div className="text-slate-400">|</div>
              <div>Brand: <span className="font-semibold text-slate-800">{p.brand?.name || 'Generic'}</span></div>
              <div className="text-slate-400">|</div>
              <div>SKU: <span className="text-slate-800">{p.sku || 'N/A'}</span></div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-4xl text-blue-600 font-extrabold">{fmt(p.price)}</span>
                {onSale && <span className="text-lg line-through text-slate-400 mb-1">{fmt(p.oldPrice)}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex h-2 w-2 rounded-full ${p.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <span className={`text-sm font-medium ${p.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 mt-auto">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden h-12 w-32">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-full hover:bg-slate-100 text-xl font-medium text-slate-600 transition-colors">-</button>
                  <input type="text" value={qty} readOnly className="w-full h-full text-center font-bold text-slate-800 border-x border-slate-300 outline-none" />
                  <button onClick={() => setQty(q => q + 1)} className="w-10 h-full hover:bg-slate-100 text-xl font-medium text-slate-600 transition-colors">+</button>
                </div>
                <button onClick={onAdd} className="flex-1 h-12 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                  Add to Cart
                </button>
              </div>
              <button className="w-full h-12 border-2 border-slate-300 text-slate-700 font-bold rounded mt-3 hover:border-slate-400 hover:bg-slate-100 transition-colors">
                Buy Now
              </button>
              
              <div className="flex justify-between items-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1"><span className="text-lg">🛡️</span> Secure Payment</div>
                <div className="flex items-center gap-1"><span className="text-lg">🚚</span> Fast Delivery</div>
                <div className="flex items-center gap-1"><span className="text-lg">↩️</span> 3 Days Return</div>
              </div>
            </div>
          </div>
        </div>

        {/* FREQUENTLY BOUGHT TOGETHER */}
        {related.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 lg:p-8 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Bought Together</h2>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              <div className="flex items-center flex-wrap gap-4 flex-1">
                {/* Main Product */}
                <div className="w-24 flex flex-col items-center text-center">
                  <div className="w-24 h-24 border border-slate-200 rounded p-2 mb-2 bg-white flex items-center justify-center relative">
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">✓</span>
                    <img src={p.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2" title={p.name}>This Item</div>
                  <div className="text-sm font-bold text-slate-900">{fmt(p.price)}</div>
                </div>

                {related.map(r => (
                  <div key={r.id} className="flex items-center gap-4">
                    <span className="text-2xl text-slate-300 font-light">+</span>
                    <div className="w-24 flex flex-col items-center text-center">
                      <Link to={`/products/${r.slug}`} className="w-24 h-24 border border-slate-200 rounded p-2 mb-2 bg-white flex items-center justify-center relative group">
                        <span className="absolute -top-2 -right-2 bg-slate-200 text-slate-600 w-5 h-5 rounded-full flex items-center justify-center text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors cursor-pointer">✓</span>
                        <img src={r.imageUrl} alt="" className="max-h-full max-w-full object-contain group-hover:opacity-80 transition-opacity" />
                      </Link>
                      <Link to={`/products/${r.slug}`} className="text-xs text-slate-600 line-clamp-2 hover:text-blue-600 transition-colors" title={r.name}>{r.name}</Link>
                      <div className="text-sm font-bold text-rose-600">{fmt(r.price)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 min-w-[280px]">
                <div className="text-sm text-slate-600 mb-1">Total Price:</div>
                <div className="text-3xl font-extrabold text-blue-600 mb-4">{fmt(relatedTotal)}</div>
                <button className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 mb-2">
                  Add Selected to Cart
                </button>
                <div className="text-xs text-center text-slate-500">Includes {related.length + 1} items</div>
              </div>

            </div>
          </div>
        )}

        {/* TWO-COLUMN MAIN AREA */}
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Left Column (Content) */}
          <div className="flex-1 min-w-0 w-full bg-white border border-slate-200 rounded-lg p-6 lg:p-8 shadow-sm">
            
            {/* Tabs Mock */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
              <button className="px-6 py-3 font-bold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap">Description</button>
              <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap">Specifications</button>
              <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap">Reviews (24)</button>
              <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-800 transition-colors whitespace-nowrap">Q&A</button>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Description</h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-justify leading-relaxed">
                {p.description ? (
                  p.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))
                ) : (
                  <p>No description provided for this product.</p>
                )}
              </div>
            </div>

            {/* Specifications Table */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Specifications</h2>
              {specsList.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {specsList.map((spec, i) => (
                        <tr key={i} className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                          <th className="py-3 px-4 font-semibold text-slate-800 w-1/3 border-r border-slate-100">{spec.key}</th>
                          <td className="py-3 px-4 text-slate-600">{spec.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 italic">No detailed specifications available.</p>
              )}
            </div>

            {/* Mock Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
              <div className="flex flex-col md:flex-row gap-8 mb-8 border border-slate-200 rounded-lg p-6 bg-slate-50">
                <div className="flex flex-col items-center justify-center min-w-[150px] border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
                  <div className="text-5xl font-extrabold text-slate-900 mb-2">4.8</div>
                  <div className="text-amber-400 text-xl mb-1">★★★★<span className="text-slate-300">★</span></div>
                  <div className="text-sm text-slate-500">Based on 24 reviews</div>
                </div>
                <div className="flex-1 flex flex-col gap-2 justify-center">
                  {[
                    { stars: 5, pct: 85, count: 20 },
                    { stars: 4, pct: 10, count: 3 },
                    { stars: 3, pct: 5, count: 1 },
                    { stars: 2, pct: 0, count: 0 },
                    { stars: 1, pct: 0, count: 0 },
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm">
                      <div className="w-12 text-slate-600 font-medium">{row.stars} Stars</div>
                      <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }}></div>
                      </div>
                      <div className="w-8 text-right text-slate-500">{row.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Review */}
              <div className="border-b border-slate-100 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">AS</div>
                  <div>
                    <div className="font-bold text-slate-900">Arifuzzaman Shovo</div>
                    <div className="text-amber-400 text-sm">★★★★★</div>
                  </div>
                  <div className="ml-auto text-xs text-slate-400">2 days ago</div>
                </div>
                <p className="text-slate-700 text-sm">Excellent quality component. It worked perfectly out of the box for my robotics project. Highly recommend buying from this store, delivery was also very fast!</p>
              </div>
            </div>

          </div>


        </div>

      </div>
    </div>
  )
}
