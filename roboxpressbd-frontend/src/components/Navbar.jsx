import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Marketplace', to: '/products' },
  { label: 'Corporate', to: '#' },
  { label: 'Offers', to: '#' },
  { label: 'Event', to: '#' },
  { label: 'Blog', to: '#' },
]

const STATIC_SUBS = {
  'Instruments': ['Signal Generator', 'Signal Analyzer', 'Analog Multimeter', 'Load Tester', 'Digital Oscilloscopes', 'Digital Multimeters', 'Calculator', 'Measurement', 'Power Supply'],
  'Drone': ['Semi Professional Drone', 'Professional Drone'],
  'Arduino': ['Arduino Shield', 'Arduino Board'],
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [q, setQ] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState(null)
  const [categories, setCategories] = useState([])
  const catRef = useRef(null)
  const userRef = useRef(null)

  const onSearch = (e) => {
    e.preventDefault()
    if (q.trim()) navigate(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  useEffect(() => {
    setCatOpen(false)
    setExpandedCat(null)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data.map(c => ({ ...c, sub: STATIC_SUBS[c.name] || [] })))
        }
      })
      .catch(() => {})
  }, [])

  const handleCatClick = (cat) => {
    if (cat.sub && cat.sub.length > 0) {
      setExpandedCat(expandedCat === cat.name ? null : cat.name)
    } else {
      navigate(`/products?category=${encodeURIComponent(cat.slug)}`)
      setCatOpen(false)
      setExpandedCat(null)
    }
  }

  const handleSubClick = (subName) => {
    navigate(`/products?q=${encodeURIComponent(subName)}`)
    setCatOpen(false)
    setExpandedCat(null)
  }

  const expandedCatData = categories.find(c => c.name === expandedCat)

  return (
    <header className="bg-white sticky top-0 z-50" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

      {/* ── Top announcement bar ── */}
      <div className="text-white text-xs" style={{ background: '#0d1b3a' }}>
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="font-normal tracking-wide hidden sm:block">Where Creativity Meets Technology</span>
          <div className="flex items-center gap-3 ml-auto">
            {[
              { label: 'Facebook', icon: 'f', href: '#', bg: '#1877f2' },
              { label: 'X', icon: '✕', href: '#', bg: '#000' },
              { label: 'YouTube', icon: '▶', href: '#', bg: '#ff0000' },
              { label: 'LinkedIn', icon: 'in', href: '#', bg: '#0a66c2' },
            ].map(s => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition hover:opacity-80"
                style={{ background: s.bg }}>
                {s.icon}
              </a>
            ))}
            <span className="text-white/40 mx-1">|</span>
            <a href="tel:09678110110" className="font-medium hover:text-yellow-300 transition whitespace-nowrap">
              Hotline: 09678110110
            </a>
          </div>
        </div>
      </div>

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
          <form onSubmit={onSearch}
            className="flex flex-1 max-w-2xl mx-auto border border-slate-300 rounded overflow-hidden">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by product name ( Arduino, Microcontroller, DC Motor… )"
              className="flex-1 px-4 py-2 text-sm focus:outline-none bg-white text-slate-700 placeholder-slate-400 min-w-0"
            />
            <button type="submit"
              className="px-4 flex items-center justify-center bg-white border-l border-slate-300 hover:bg-slate-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="#2563eb" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>

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
                    <Link to="/account" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50 text-sm">
                      👤 My Account
                    </Link>
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
            <Link to="/cart" className="relative flex items-center hover:text-blue-700 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
              </svg>
              <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5 leading-none">
                {count || 0}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Sub-nav bar ── */}
      <div className="bg-white border-t border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-stretch" style={{ height: '46px' }}>
          <div className="relative flex items-stretch shrink-0" ref={catRef}>
            <button
              onClick={() => { setCatOpen(o => !o); setExpandedCat(null) }}
              className={`flex items-center justify-between px-4 w-[270px] h-full font-medium text-[13px] transition cursor-pointer ${
                catOpen ? 'bg-[#0d6efd] text-white hover:bg-[#0b5ed7]' : 'bg-white text-slate-800 hover:text-[#0d6efd] border-x border-slate-200'
              }`}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <span className={!catOpen ? 'font-normal' : 'font-bold tracking-wide text-[13px]'}>PRODUCT CATEGORIES</span>
              </div>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {catOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>}
              </svg>
            </button>
          </div>
          <div className="w-px bg-transparent mx-2 self-stretch my-2" />
          <nav className="flex items-center">
            {NAV_LINKS.map(l => (
              <NavLink key={l.label} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 h-full flex items-center text-[13px] transition hover:text-blue-600 ${
                    isActive && l.to !== '#' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-slate-700 font-normal'
                  }`
                }>
                {l.label}
              </NavLink>
            ))}
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
                <svg
                  className="w-3 h-3 shrink-0 transition-transform"
                  style={{ transform: expandedCat === cat.name ? 'rotate(90deg)' : 'none' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/>
                </svg>
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
              onClick={() => { navigate(`/products?category=${encodeURIComponent(expandedCatData.slug)}`); setCatOpen(false); setExpandedCat(null) }}
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
