import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Catalog } from '../api/client'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const fmt = (n) => '৳ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function ProductDetail() {
  const { slug } = useParams()
  const [p, setP] = useState(null)
  const [related, setRelated] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [mainImg, setMainImg] = useState('')
  const [sidebarAds, setSidebarAds] = useState([])
  const { add, isAuthed } = useCart()

  useEffect(() => {
    Catalog.product(slug).then(data => {
      setP(data)
      setMainImg(data.images?.[0] || data.imageUrl || '')
      
      // Fetch actual related products from the same category
      if (data.category?.slug) {
        Catalog.products({ category: data.category.slug, size: 5 }).then(res => {
          const filtered = res.content.filter(x => x.id !== data.id).slice(0, 4)
          setRelated(filtered)
        }).catch(() => {})
      }
    }).catch(() => setP(null))
    
    // Fetch top/trending products independently
    Catalog.trending().then(data => {
      if (data && data.length) {
        setTopProducts(data)
      }
    }).catch(() => {})

    Catalog.banners().then(data => {
      if (data && data.length) {
        setSidebarAds(data.filter(b => b.placement === 'AD_SIDEBAR'))
      }
    }).catch(() => {})
  }, [slug])

  if (!p) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )

  const onSale = p.oldPrice && Number(p.oldPrice) > Number(p.price)

  const onAdd = async () => {
    try { await add(p.id, qty, p); toast.success('Added to cart') }
    catch (e) { toast.error(e.response?.data?.message || 'Failed') }
  }

  const specsList = (p.specifications || '').split('\n').filter(Boolean).map(line => {
    const parts = line.split(':')
    if (parts.length >= 2) return { key: parts[0].trim(), val: parts.slice(1).join(':').trim() }
    return { key: 'Feature', val: line.trim() }
  })

  const relatedTotal = related.reduce((acc, curr) => acc + Number(curr.price), Number(p.price))

  const images = p.images?.length > 0 ? p.images : [p.imageUrl].filter(Boolean)
  const galleryImages = images.length > 0 ? images : []

  const displayTopProducts = topProducts
    .filter(tp => tp.id !== p.id && !related.some(rp => rp.id === tp.id))
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[13px] text-[#4b5563] mb-8 font-medium">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <svg className="w-3 h-3 text-gray-800 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          
          {p.brand?.name ? (
            <>
              <div className="bg-[#f3f4f6] px-2.5 py-1 rounded text-[#374151]">Brands</div>
              <svg className="w-3 h-3 text-gray-800 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              <div className="bg-[#f3f4f6] px-2.5 py-1 rounded text-[#374151]">{p.brand.name}</div>
              <svg className="w-3 h-3 text-gray-800 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </>
          ) : p.category?.name ? (
            <>
              <div className="bg-[#f3f4f6] px-2.5 py-1 rounded text-[#374151]">Categories</div>
              <svg className="w-3 h-3 text-gray-800 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              <div className="bg-[#f3f4f6] px-2.5 py-1 rounded text-[#374151]">{p.category.name}</div>
              <svg className="w-3 h-3 text-gray-800 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </>
          ) : null}

          <span className="text-[#4b5563] truncate">{p.name}</span>
        </nav>
        
        {/* Main Layout wrapper */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            
            {/* Top Product section */}
            <div className="grid md:grid-cols-2 gap-10 mb-16">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col">
            <div 
              className="relative w-full aspect-square bg-white flex items-center justify-center mb-4 overflow-hidden group cursor-crosshair"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.currentTarget.style.setProperty('--x', `${x}%`);
                e.currentTarget.style.setProperty('--y', `${y}%`);
              }}
            >
              {mainImg ? (
                <img 
                  src={mainImg} 
                  alt={p.name} 
                  className="w-full h-full object-contain transition-transform duration-[50ms] ease-out group-hover:scale-[2.5]" 
                  style={{ transformOrigin: 'var(--x, 50%) var(--y, 50%)' }}
                />
              ) : (
                <div className="text-gray-400">No image available</div>
              )}
              {/* Zoom Icon Mockup */}
              <div className="absolute top-4 right-4 text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </div>
              {onSale && (
                <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-bold px-3 py-1 uppercase rounded-sm">
                  Sale
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {galleryImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImg(img)}
                    className={`relative w-20 h-20 flex-shrink-0 transition-all duration-200 bg-white border-b-2 ${mainImg === img ? 'border-gray-800' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} className="w-full h-full object-contain p-1" alt={`Gallery ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col text-gray-800 pt-2">

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl text-gray-800 font-normal leading-tight mb-3">
              {p.name}
            </h1>

            {/* Availability */}
            <div className="text-sm text-gray-500 mb-5">
              Availability: <span className="text-yellow-500 font-bold ml-1">{p.stock > 0 ? `In stock (${p.stock})` : 'Available on backorder'}</span>
            </div>

            {/* Top Divider */}
            <div className="w-full h-px bg-gray-200 mb-5"></div>

            {/* Short Desc */}
            {p.shortDescription && (
              <p className="text-gray-600 text-base mb-5 leading-relaxed">
                {p.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-end gap-3 mb-5">
              {onSale && <span className="text-2xl line-through text-gray-400 font-medium">{fmt(p.oldPrice)}</span>}
              <span className="text-[2.5rem] leading-none text-gray-800 font-normal tracking-tight">{fmt(p.price)}</span>
            </div>

            {/* Bottom Divider */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setQty(Math.max(1, (qty || 1) - 1))}
                  className="w-10 h-10 md:w-11 md:h-11 border border-gray-200 rounded-md flex items-center justify-center bg-[#fafafa] hover:bg-gray-100 transition"
                >
                  <span className="block w-3.5 h-[2.5px] bg-gray-400 rounded-full"></span>
                </button>
                <input 
                  type="text" 
                  value={qty} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setQty(val === '' ? '' : Math.max(1, parseInt(val) || 1));
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) setQty(1);
                  }}
                  className="w-12 h-10 md:w-16 md:h-11 border border-gray-200 rounded-md text-center text-[#1a2a4f] focus:outline-none focus:border-gray-400 font-medium bg-white text-[15px]" 
                />
                <button 
                  onClick={() => setQty((qty === '' ? 1 : qty) + 1)}
                  className="w-10 h-10 md:w-11 md:h-11 border border-gray-200 rounded-md flex items-center justify-center bg-white hover:bg-gray-50 transition"
                >
                  <svg className="w-[18px] h-[18px] text-black stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
              <button onClick={onAdd} className="h-11 px-8 bg-[#555] hover:bg-[#444] text-white font-bold rounded-full transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Add to cart
              </button>
            </div>


          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR: Related Products */}
      <div className="w-full lg:w-[320px] shrink-0 pt-2 lg:pt-0">
        <h3 className="text-lg font-bold text-gray-800 mb-5 tracking-tight uppercase">Related Products</h3>
        <div className="flex flex-col gap-4">
          {related.length > 0 ? related.map((rp, idx) => (
            <Link 
              key={idx} 
              to={`/product/${rp.slug}`} 
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="w-[72px] h-[72px] shrink-0 bg-black flex items-center justify-center overflow-hidden rounded">
                <img src={rp.images?.[0] || rp.imageUrl} alt={rp.name} className="w-full h-full object-contain bg-black" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[15px] font-medium text-gray-800 leading-snug line-clamp-2 mb-1">{rp.name}</h4>
                <div className="text-[16px] font-bold text-[#1d4ed8]">{fmt(rp.price)}</div>
              </div>
            </Link>
          )) : (
            <p className="text-gray-500 text-sm">No related products found.</p>
          )}
        </div>
      </div>
    </div>

    {/* BOTTOM SECTION: 3 Columns */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 border-t border-gray-200 pt-12 mt-4">
      
      {/* Left: Top Products */}
      <div className="lg:col-span-1 hidden lg:block">
        <h3 className="text-lg text-gray-800 font-bold mb-5 tracking-wide uppercase">Top Products</h3>
        <div className="w-full h-px bg-gray-200 mb-5"></div>
        <div className="flex flex-col gap-4">
          {displayTopProducts.length > 0 ? displayTopProducts.map((tp, idx) => (
            <Link 
              key={`top-${idx}`} 
              to={`/product/${tp.slug}`} 
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:opacity-80 transition"
            >
              <div className="w-16 h-16 shrink-0 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                <img src={tp.images?.[0] || tp.imageUrl} alt={tp.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[13px] font-medium text-gray-800 line-clamp-2 mb-1 leading-snug">{tp.name}</h4>
                <div className="text-[15px] font-bold text-[#1d4ed8]">{fmt(tp.price)}</div>
              </div>
            </Link>
          )) : (
            <p className="text-gray-500 text-sm">No products found.</p>
          )}
        </div>
      </div>

      {/* Middle: Tabs */}
      <div className="lg:col-span-2">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-gray-200 mb-8 w-full">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 border-b-2 ${activeTab === tab ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="w-full">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="animate-fade-in w-full overflow-x-hidden flex justify-center">
                {p.description ? (
                  <div 
                    className="prose prose-base text-gray-700 max-w-4xl prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:max-w-[70%] lg:prose-img:max-w-[50%] prose-img:h-auto prose-img:object-contain prose-img:mx-auto prose-img:block prose-img:my-8 prose-p:leading-relaxed prose-table:w-full prose-table:overflow-x-auto block"
                    dangerouslySetInnerHTML={{ 
                      __html: p.description
                        .replace(/\\n/g, '<br />')
                        .replace(/\n/g, '<br />')
                        .replace(/\[embed\](.*?)\[\/embed\]/g, (match, url) => {
                          let videoId = '';
                          const watchMatch = url.match(/v=([^&]+)/);
                          const youtuMatch = url.match(/youtu\.be\/([^?]+)/);
                          if (watchMatch) videoId = watchMatch[1];
                          else if (youtuMatch) videoId = youtuMatch[1];
                          if (videoId) {
                            return `<div class="my-8 w-full max-w-3xl mx-auto"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full aspect-video rounded-lg shadow-md"></iframe></div>`;
                          }
                          return `<a href="${url}" target="_blank" rel="noreferrer" class="text-blue-600 underline">${url}</a>`;
                        })
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic text-center w-full">No description provided for this product.</p>
                )}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="animate-fade-in">
                {specsList.length > 0 ? (
                  <div className="border border-gray-200 rounded-md overflow-hidden max-w-3xl">
                    <table className="w-full text-left text-sm">
                      <tbody>
                        {specsList.map((spec, i) => (
                          <tr key={i} className={`border-b border-gray-200 last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <th className="py-3 px-5 font-bold text-gray-800 w-1/3 sm:w-1/4 border-r border-gray-200">{spec.key}</th>
                            <td className="py-3 px-5 text-gray-600">{spec.val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No detailed specifications available.</p>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row gap-10 mb-10 max-w-3xl">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-5xl font-black text-gray-800 mb-2">4.8</div>
                    <div className="text-yellow-400 text-xl mb-2 tracking-widest">★★★★<span className="text-gray-300">★</span></div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Based on 24 reviews</div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2 justify-center">
                    {[
                      { stars: 5, pct: 85, count: 20 },
                      { stars: 4, pct: 10, count: 3 },
                      { stars: 3, pct: 5, count: 1 },
                      { stars: 2, pct: 0, count: 0 },
                      { stars: 1, pct: 0, count: 0 },
                    ].map(row => (
                      <div key={row.stars} className="flex items-center gap-3 text-sm font-medium">
                        <div className="w-14 text-gray-600 flex items-center gap-1">{row.stars} <span className="text-yellow-400">★</span></div>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${row.pct}%` }}></div>
                        </div>
                        <div className="w-8 text-right text-gray-400 text-xs">{row.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6 max-w-3xl">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-base border border-gray-200">AS</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-gray-800 text-base">Arifuzzaman Shovo</div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">2 days ago</div>
                      </div>
                      <div className="text-yellow-400 text-xs mb-2 tracking-widest">★★★★★</div>
                      <p className="text-gray-600 leading-relaxed text-sm">Excellent quality component. It worked perfectly out of the box for my robotics project. Highly recommend buying from this store, delivery was also very fast!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>

      {/* Right: Advertise */}
      <div className="lg:col-span-1 hidden lg:block">
        <h3 className="text-lg text-gray-800 font-bold mb-5 tracking-wide uppercase">Advertise</h3>
        <div className="w-full h-px bg-gray-200 mb-5"></div>
        <div className="flex flex-col gap-8">
          {sidebarAds.length > 0 ? sidebarAds.map((ad, idx) => (
            ad.imageUrl === 'COMPONENT:BatteryAd' ? (
              <a key={idx} href={ad.linkUrl || '#'} className="block hover:opacity-90 transition group overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <div className="aspect-square bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 to-black mix-blend-overlay"></div>
                  <h4 className="text-3xl font-black italic mb-2 tracking-tighter shadow-sm z-10 leading-none" style={{textShadow: "0 0 10px rgba(255,255,255,0.5)", color: "#fff"}}>BATTERY<br/>RESTOCKED</h4>
                  <p className="text-[10px] text-gray-300 font-medium z-10 mb-4 tracking-wide">Check the description for more details</p>
                  <div className="z-10 flex items-center gap-1.5 opacity-80">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                    <span className="text-[12px] font-bold tracking-widest lowercase">roboxpressbd</span>
                  </div>
                </div>
              </a>
            ) : ad.imageUrl === 'COMPONENT:WalksnailAd' ? (
              <a key={idx} href={ad.linkUrl || '#'} className="block hover:opacity-90 transition group bg-white text-center mt-2">
                <h4 className="text-[15px] font-black text-gray-900 mb-1 tracking-wider uppercase">WALKSNAIL</h4>
                <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest">Avatar HD System</p>
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center border border-gray-100 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400" alt="Drone Parts" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
                </div>
              </a>
            ) : (
              <a key={idx} href={ad.linkUrl || '#'} className="block hover:opacity-90 transition group overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto object-cover" />
              </a>
            )
          )) : (
            <>
              {/* Fallback Ad 1 */}
              <a href="#" className="block hover:opacity-90 transition group overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <div className="aspect-square bg-[#1a1a1a] flex flex-col items-center justify-center p-4 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/30 to-black mix-blend-overlay"></div>
                  <h4 className="text-3xl font-black italic mb-2 tracking-tighter shadow-sm z-10 leading-none" style={{textShadow: "0 0 10px rgba(255,255,255,0.5)", color: "#fff"}}>BATTERY<br/>RESTOCKED</h4>
                  <p className="text-[10px] text-gray-300 font-medium z-10 mb-4 tracking-wide">Check the description for more details</p>
                  <div className="z-10 flex items-center gap-1.5 opacity-80">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                    <span className="text-[12px] font-bold tracking-widest lowercase">roboxpressbd</span>
                  </div>
                </div>
              </a>
              {/* Fallback Ad 2 */}
              <a href="#" className="block hover:opacity-90 transition group bg-white text-center mt-2">
                <h4 className="text-[15px] font-black text-gray-900 mb-1 tracking-wider uppercase">WALKSNAIL</h4>
                <p className="text-[10px] text-gray-400 mb-3 uppercase tracking-widest">Avatar HD System</p>
                <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center border border-gray-100 relative overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&q=80&w=400" alt="Drone Parts" className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
                </div>
              </a>
            </>
          )}
        </div>
      </div>

    </div>

  </div>
</div>
  )
}
