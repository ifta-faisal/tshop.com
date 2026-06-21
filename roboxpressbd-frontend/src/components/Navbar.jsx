import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Catalog } from '../api/client'

const NAV_LINKS = [
  { label: 'PRODUCT CATEGORIES', action: 'toggle-categories' },
  { label: 'HOME', to: '/' },
  { label: 'ALL PRODUCTS', to: '/products' },
  { label: 'PRINTING HUB', to: '/printing-hub' },
  { label: 'CONTROLLERS', to: '/products?category=radios-tx-rx' },
  { label: 'GOGGLES & VIDEO', to: '/products?category=fpv' },
  { label: 'BATTERIES & CHARGERS', to: '/products?category=lipo-batteries' },
  { label: 'SALE', to: '/deals', isSaleLink: true },
  { label: 'DAILY DEALS', to: '/deals' },
]

const MEGA_MENUS = {
  'CONTROLLERS': [
    { title: 'REMOTE CONTROLLER', slug: 'radios-tx-rx', image: 'https://m.media-amazon.com/images/I/51l4NGQpo6L._AC_UF894,1000_QL80_.jpg' },
    { title: 'BATTERIES', slug: 'li-ion-batteries', image: 'https://radiomasterrc.com/cdn/shop/files/HP0157.BATT-6200-2S-1000X1000-2_1080x.jpg?v=1750061769' },
    { title: 'CONTROLLER EXTERNAL MODULE', slug: 'radios-tx-rx', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnvrrhUYhJD-BXTPps0uR9P71I72ZpDSQ7g4fusTgbZYbckBNbELSIZO8&s=10' },
    { title: 'ACCESSORIES', slug: 'tools-accessories', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkogHmRo45sV5sRRh1CRiAxDUatmBZeYftMlPw7or-h5d2upMuhVCDmOw&s=10' },
  ],
  'BATTERIES & CHARGERS': [
    { title: 'DRONE BATTERIES', slug: 'lipo-batteries', image: 'https://cdn-global-hk.hobbyking.com/media/catalog/product/cache/1/image/660x415/17f82f742ffe127f42dca9de82fb58b1/t/u/turnigy_rapid_lihv_9500mah_4s_15.2v_100c_lipo_battery_wec5_connector_for_rc_cars_1__1.jpg' },
    { title: 'CONTROLLER BATTERIES', slug: 'li-ion-batteries', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Hj2iqRyTcrdklnxXtrcZ0-kXZ1vfPTVlyN0EZO-3WfY9UizIhKP4vmxh&s=10' },
    { title: 'GOGGLE BATTERIES', slug: 'lipo-batteries', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhPW9POJnZ91SMpGc3KcMXIUr3_NrVgPr9PAIIqlLicQ49kQfbNsAm7oU&s=10' },
    { title: 'CHARGERS', slug: 'chargers-power-supply', image: 'https://www.toolkitrc.com/wp-content/uploads/2024/11/M6AC-1000px-6-e1733811027106-300x300.jpg' },
    { title: 'CONNECTORS & ADAPTERS', slug: 'cables', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJMpmGxLSOTPjMhAOuzcqfkR0hRDV1Gl1AvM8bqdy96D3wkvbrmc1Jew&s=10' },
    { title: 'ACCESSORIES', slug: 'tools-accessories', image: 'https://cdn11.bigcommerce.com/s-fhxxhuiq8q/products/121/images/756/2__35729.1659431009.386.513.jpg?c=2' },
  ],
  'GOGGLES & VIDEO': [
    { title: 'GOGGLES', slug: 'fpv', image: 'https://www.team-blacksheep.com/img/gallery/Walksnail%20Avatar%20HD%20Goggles%20X%200.jpg' },
    { title: 'VIDEO RECEIVER MODULE', slug: 'fpv', image: 'https://m.media-amazon.com/images/I/51mYY57zxtL.jpg' },
    { title: 'ANTENNAS', slug: 'antenna', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjcsGEpsjKGwQ65H5I7jT23G6dw_f_fVTKQzBFT2j34JkfZrAuibLTdTbN&s=10' },
    { title: 'BATTERIES & ACCESSORIES', slug: 'tools-accessories', image: 'https://newbeedrone.com/cdn/shop/files/NewBeeDrone-FatStraps-2_-FPV-Goggle-Strap-for-DJI-Goggle-V2-FatStraps-52286825_2268x.webp?v=1729799857' },
  ]
}

const MENU_CATEGORIES = [
  { name: '3D Printing', slug: '3d-printing', sub: ['3D Printer', '3D Printer Accessories', 'Filaments'] },
  { name: 'All Products', slug: '', isAll: true },
  { name: 'Li-ion Batteries', slug: 'li-ion-batteries' },
  { name: 'LiPo Batteries', slug: 'lipo-batteries' },
  { name: 'Brands', slug: 'brands', sub: ['Anycubic', 'AOS RC', 'Arduino', 'Axisflying', 'Bambu Lab', 'BETAFPV', 'Caddx', 'CUAV', 'CubePilot', 'DarwinFPV', 'Diatone', 'DJI', 'Eachine', 'Fat Shark', 'ISDT', 'FLSUN', 'Flysky', 'FlyFishRC', 'Flywoo', 'Foxeer', 'Gemfan'] },
  { name: 'Chargers & Power Supply', slug: 'chargers-power-supply' },
  { name: 'DJI', slug: 'dji' },
  { name: 'Drone Parts', slug: 'drone-parts', sub: ['Antenna', 'Electronics Speed Controller', 'Flight Controller', 'Flight Controller Stack', 'FPV', 'Frames', 'FPV/Action Camera', 'GPS', 'Radios & Tx Rx', 'Motors', 'Propellers'] },
  { name: 'Tools & Accessories', slug: 'tools-accessories' },
  { name: 'Microcontrollers', slug: 'microcontrollers' },
  { name: 'Robotics', slug: 'robotics' },
  { name: 'Drone Bundles', slug: 'drone-bundles' },
  { name: 'Ready-To-Fly Drones', slug: 'ready-to-fly-drones' },
  { name: 'Micro Quadcopters', slug: 'micro-quadcopters' },
  { name: 'Planes', slug: 'planes' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count, items, subtotal } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState(null)
  const [categories, setCategories] = useState(MENU_CATEGORIES)
  const [dbCategories, setDbCategories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [saleEnabled, setSaleEnabled] = useState(localStorage.getItem('flashSaleEnabled') !== 'false')
  const catRef = useRef(null)
  const userRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    Catalog.categories()
      .then(res => setDbCategories(res || []))
      .catch(() => {})
  }, [])

  const onSearch = (e) => {
    e?.preventDefault()
    if (q.trim()) {
      setShowResults(false)
      navigate(`/products?q=${encodeURIComponent(q.trim())}`)
    }
  }

  useEffect(() => {
    setCatOpen(false)
    setExpandedCat(null)
  }, [location.pathname])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (q.trim()) {
        Catalog.products({ q: q.trim(), size: 5 })
          .then(res => {
            setSearchResults(res.content || [])
            setShowResults(true)
          })
          .catch(() => {})
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false)
    }
    document.addEventListener('mousedown', handler)
    
    const handleStorage = () => {
      setSaleEnabled(localStorage.getItem('flashSaleEnabled') !== 'false')
    }
    window.addEventListener('storage', handleStorage)
    
    return () => {
      document.removeEventListener('mousedown', handler)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])



  const handleCatClick = (cat) => {
    if (cat.sub && cat.sub.length > 0) {
      setExpandedCat(expandedCat === cat.name ? null : cat.name)
    } else {
      if (cat.isAll) {
        navigate('/products')
      } else {
        navigate(`/products?category=${encodeURIComponent(cat.slug)}`)
      }
      setCatOpen(false)
      setExpandedCat(null)
    }
  }

  const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSubClick = (subName) => {
    if (expandedCatData && expandedCatData.slug === 'brands') {
      navigate(`/products?brand=${slugify(subName)}`)
    } else {
      const dbMatch = dbCategories.find(c => c.name.toLowerCase() === subName.toLowerCase())
      const targetSlug = dbMatch ? dbMatch.slug : slugify(subName)
      navigate(`/products?category=${targetSlug}`)
    }
    setCatOpen(false)
    setExpandedCat(null)
  }

  const expandedCatData = categories.find(c => c.name === expandedCat)

  return (
    <header className="bg-white sticky top-0 z-50" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>



      {/* ── Main bar ── */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-slate-700 rounded">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <rect x="4" y="4" width="10" height="10" rx="1" fill="none" stroke="#1a2a4f" strokeWidth="2"/>
                <rect x="18" y="4" width="10" height="10" rx="1" fill="none" stroke="#1a2a4f" strokeWidth="2"/>
                <rect x="4" y="18" width="10" height="10" rx="1" fill="none" stroke="#1a2a4f" strokeWidth="2"/>
                <rect x="18" y="18" width="10" height="10" rx="1" fill="none" stroke="#1a2a4f" strokeWidth="2"/>
                <line x1="9" y1="14" x2="9" y2="18" stroke="#1a2a4f" strokeWidth="1.5"/>
                <line x1="23" y1="14" x2="23" y2="18" stroke="#1a2a4f" strokeWidth="1.5"/>
                <line x1="14" y1="9" x2="18" y2="9" stroke="#1a2a4f" strokeWidth="1.5"/>
                <line x1="14" y1="23" x2="18" y2="23" stroke="#1a2a4f" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-xl tracking-tight leading-none" style={{ color: '#1a2a4f' }}>
                ROBOX<span style={{ color: '#16a34a' }}>PRESS</span>
              </div>
              <div className="text-[10px] text-slate-400 font-normal tracking-wide mt-0.5">bd.com</div>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex flex-1 max-w-2xl mx-auto relative" ref={searchRef}>
            <form onSubmit={onSearch}
              className="flex w-full border border-black rounded-full overflow-hidden relative z-50 bg-white">
              <input
                value={q}
                onChange={e => {
                  setQ(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => {
                  if (q.trim()) setShowResults(true)
                }}
                placeholder="Search for Products"
                className="flex-1 px-5 py-2 text-sm focus:outline-none bg-white text-slate-700 placeholder-slate-400 min-w-0"
              />
              <button type="submit"
                className="px-6 flex items-center justify-center bg-black hover:bg-gray-800 transition">
                <svg className="w-4 h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {showResults && q.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-xl border border-slate-200 z-[100] overflow-hidden">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/products/${p.slug}`}
                        onClick={() => { setShowResults(false); setQ('') }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition"
                      >
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-contain rounded bg-white border border-slate-100" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-100">No img</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-800 truncate">{p.name}</div>
                          <div className="text-xs text-slate-500 truncate mt-0.5">{p.category?.name}</div>
                        </div>
                        <div className="text-sm font-bold text-[#16a34a] whitespace-nowrap pl-4">৳{p.price}</div>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-2">
                      <button 
                        onClick={onSearch}
                        className="w-full text-center py-3 text-sm text-[#16a34a] font-semibold hover:bg-slate-50 transition"
                      >
                        See all results for "{q}"
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No products found for "{q}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-5 text-sm text-slate-800 shrink-0">
            {user ? (
              <div className="relative" ref={userRef}>
                <button onClick={() => setUserOpen(o => !o)}
                  className="flex items-center gap-1.5 hover:text-blue-700 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                  <span>{user.fullName?.split(' ')[0]}</span>
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-xl rounded-lg w-44 border border-slate-200 z-50 overflow-hidden">
                    {user.roles?.includes('ROLE_ADMIN') && (
                      <Link to="/admin/products" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-sm text-[#16a34a] font-medium border-b border-slate-100">
                        ⚙️ Admin Dashboard
                      </Link>
                    )}
                    {!user.roles?.includes('ROLE_ADMIN') && (
                      <Link to="/account" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-sm">
                        👤 My Account
                      </Link>
                    )}
                    <button onClick={() => { logout(); setUserOpen(false); navigate('/') }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-red-600">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center gap-1.5 hover:text-blue-700 transition font-normal">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
                Sign in
              </Link>
            )}
            <div className="relative group">
              <Link to="/cart" className="flex items-center hover:text-blue-700 transition pb-4 -mb-4 pt-4 -mt-4">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                  </svg>
                  <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5 leading-none">
                    {count || 0}
                  </span>
                </div>
              </Link>
              
              {/* Cart Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {items && items.length > 0 ? (
                  <div className="p-4">
                    <div className="max-h-[300px] overflow-y-auto space-y-4 mb-4">
                      {items.map(item => (
                        <div key={item.id || item.productId} className="flex gap-3">
                          <img src={item.productImage || 'https://placehold.co/100x100?text=No+Image'} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{item.productName}</h4>
                            <div className="text-xs text-slate-500 mt-0.5">{item.quantity} × ৳{Number(item.unitPrice).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mb-4">
                      <span className="font-semibold text-slate-700">Subtotal:</span>
                      <span className="font-bold text-slate-800 text-lg">৳{Number(subtotal).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/cart" className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded transition text-sm">View Cart</Link>
                      <Link to="/checkout" className="block text-center bg-black hover:bg-slate-800 text-white font-semibold py-2 rounded transition text-sm">Checkout</Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Your cart is empty.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-nav bar ── */}
      <div className="bg-white border-t border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-stretch relative" style={{ height: '46px' }}>
          <nav className="flex items-center flex-1 justify-between">
            {NAV_LINKS.map(l => {
              if (l.label === 'PRODUCT CATEGORIES') {
                return (
                  <button 
                    key={l.label} 
                    onClick={() => { setCatOpen(o => !o); setExpandedCat(null) }}
                    className={`px-2 h-full flex items-center gap-2 text-[12px] font-bold tracking-wide transition cursor-pointer ${catOpen ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'}`}
                  >
                    <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    {l.label}
                  </button>
                )
              }

              if (l.isSaleLink && !saleEnabled) return null

              const curSearch = new URLSearchParams(location.search)
              const curCat = curSearch.get('category')
              
              const getIsActive = () => {
                if (!l.to) return false
                if (l.to === '/') return location.pathname === '/'
                const [path, query] = l.to.split('?')
                if (location.pathname !== path) return false
                if (query) {
                  const lCat = new URLSearchParams(query).get('category')
                  return lCat === curCat
                }
                return !curCat
              }
              const isActive = getIsActive()

              if (MEGA_MENUS[l.label]) {
                const cols = MEGA_MENUS[l.label].length
                const gridClass = cols === 6 ? 'grid-cols-6' : 'grid-cols-4'
                
                return (
                  <div key={l.label} className="group h-full">
                    <Link to={l.to} className={`px-2 h-full flex items-center text-[12px] font-bold tracking-wide transition ${isActive ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'}`}>
                      {l.label}
                    </Link>
                    {/* Mega Menu Dropdown */}
                    <div className="absolute top-full left-4 right-4 bg-white shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 p-8 cursor-default" style={{ borderTop: '2px solid #2563eb' }}>
                      <div className={`grid ${gridClass} gap-6`}>
                        {MEGA_MENUS[l.label].map(item => {
                          const imgSrc = item.image
                          return (
                            <Link key={item.title} to={`/products?category=${item.slug}`} className="group/item flex flex-col">
                              <div className="h-40 w-full flex items-center justify-center mb-6">
                                <img src={imgSrc} alt={item.title} className="max-h-full max-w-full object-contain group-hover/item:scale-105 transition-transform mix-blend-multiply" />
                              </div>
                              <h3 className="font-bold text-[13px] text-slate-900 tracking-wide group-hover/item:text-blue-600 text-center transition">{item.title}</h3>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              }

              const textColor = l.isSaleLink ? 'text-red-600 hover:text-red-700' : (isActive && l.to !== '#' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600')
              
              return (
                <Link key={l.label} to={l.to}
                  className={`px-2 h-full flex items-center text-[12px] font-bold tracking-wide transition ${textColor}`}>
                  {l.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* ── Backdrop ── */}
      {catOpen && (
        <div className="fixed inset-0 bg-black/40 z-[90]"
          onClick={() => { setCatOpen(false); setExpandedCat(null) }} />
      )}

      {/* ── Categories Drawer ── */}
      <div
        className={`fixed top-0 left-0 h-full bg-white z-[100] shadow-2xl flex transition-all duration-300 ${catOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: expandedCat ? '540px' : '270px' }}
      >
        {/* Left pane: category list */}
        <div className="w-[270px] shrink-0 flex flex-col h-full">
          {/* Header */}
          <div className="bg-[#0d6efd] text-white flex items-center justify-between px-4 h-[46px] shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <span className="font-bold tracking-wide text-[13px]">PRODUCT CATEGORIES</span>
            </div>
            <button onClick={() => { setCatOpen(false); setExpandedCat(null) }} className="hover:opacity-80 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Category list */}
          <div className="flex-1 overflow-y-auto cat-scroll bg-white">
            <style>{`
              .cat-scroll::-webkit-scrollbar { width: 6px; }
              .cat-scroll::-webkit-scrollbar-track { background: #f8fafc; }
              .cat-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
              .cat-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleCatClick(cat)}
                className={`w-full flex items-center justify-between px-4 py-[12px] border-b border-slate-100 text-[14px] transition text-left ${
                  expandedCat === cat.name
                    ? 'bg-[#0d6efd] text-white'
                    : 'hover:bg-slate-50 text-slate-800 hover:text-[#0d6efd]'
                }`}
              >
                <span className="truncate pr-2 font-normal">{cat.name}</span>
                {cat.sub && cat.sub.length > 0 && (
                  <svg
                    className="w-3 h-3 shrink-0 transition-transform"
                    style={{ transform: expandedCat === cat.name ? 'rotate(90deg)' : 'none' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right pane: sub-categories */}
        {expandedCatData && (
          <div className="w-[270px] shrink-0 border-l border-slate-200 flex flex-col bg-white h-full">
            {/* Sub-pane header */}
            <div className="bg-slate-100 flex items-center px-4 h-[46px] shrink-0 border-b border-slate-200">
              <button onClick={() => setExpandedCat(null)} className="mr-2 text-slate-500 hover:text-slate-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <span className="font-semibold text-[13px] text-slate-800">{expandedCatData.name}</span>
            </div>
            {/* "View All" link for the category */}
            <button
              onClick={() => { navigate(expandedCatData.slug === 'brands' ? '/brands' : `/products?category=${encodeURIComponent(expandedCatData.slug)}`); setCatOpen(false); setExpandedCat(null) }}
              className="w-full text-left px-5 py-[11px] border-b border-slate-100 text-[13px] text-[#0d6efd] font-medium hover:bg-blue-50 transition"
            >
              All {expandedCatData.name}
            </button>
            {/* Sub-items */}
            <div className="flex-1 overflow-y-auto cat-scroll">
              {expandedCatData.sub.map(subItem => (
                <button key={subItem}
                  onClick={() => handleSubClick(subItem)}
                  className="w-full text-left px-5 py-[11px] border-b border-slate-100 last:border-0 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-[#0d6efd] transition"
                >
                  {subItem}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
