import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="mt-0">

      {/* ── Benefits band — white bg with dark icons (matches TechShopBD) ── */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '💵', title: 'Cash on Delivery', sub: 'Pay cash at your doorstep' },
            { icon: '🚚', title: 'Delivery', sub: 'All over Bangladesh' },
            { icon: '🔄', title: 'Extended Warranty', sub: 'Up to 1 year' },
          ].map(b => (
            <div key={b.title} className="flex items-center gap-4">
              <span className="text-3xl">{b.icon}</span>
              <div>
                <div className="font-semibold text-slate-800 text-sm">{b.title}</div>
                <div className="text-xs text-slate-500">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer body — dark navy ── */}
      <div style={{ background: '#0d1b3a', color: '#cbd5e1' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

          {/* Brand col */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center border border-slate-500 rounded">
                <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                  <rect x="4" y="4" width="10" height="10" rx="1" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                  <rect x="18" y="4" width="10" height="10" rx="1" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                  <rect x="4" y="18" width="10" height="10" rx="1" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                  <rect x="18" y="18" width="10" height="10" rx="1" fill="none" stroke="#94a3b8" strokeWidth="2"/>
                </svg>
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-lg text-white leading-none">
                  ROBOX<span style={{ color: '#4ade80' }}>PRESS</span>
                </div>
                <div className="text-[10px] text-slate-400">bd.com</div>
              </div>
            </Link>

            <div className="space-y-1.5 text-slate-400 text-xs">
              <p><span className="text-slate-300 font-medium">Phone:</span> +88 09678110190</p>
              <p><span className="text-slate-300 font-medium">Email:</span> info@roboxpressbd.com</p>
              <p><span className="text-slate-300 font-medium">Address:</span> Dhaka, Bangladesh</p>
            </div>

            <div className="mt-4 flex gap-2">
              {[
                { label: 'f', bg: '#1877f2' },
                { label: '𝕏', bg: '#111' },
                { label: 'in', bg: '#0a66c2' },
                { label: '▶', bg: '#ff0000' },
              ].map((s, i) => (
                <a key={i} href="#"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition"
                  style={{ background: s.bg }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Useful Links</h4>
            <ul className="space-y-2">
              {['All Categories', 'New Arrivals', 'Terms & Conditions', 'Privacy Policy', 'Warranty Support', 'Blog Tutorial', 'Shopping Guideline'].map(l => (
                <li key={l}>
                  <Link className="hover:text-white transition" to="/products">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">More Links</h4>
            <ul className="space-y-2">
              {['Product Sourcing', 'Customer Support', 'Offer List', 'Event List', 'Notification', 'Brand List', 'My Account'].map(l => (
                <li key={l}>
                  <a className="hover:text-white transition" href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-3">Get Exciting EEE Project Ideas!</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to our newsletter for the latest products, tutorials, and exclusive deals.
              We keep all information strictly confidential.
            </p>
            <form onSubmit={e => { e.preventDefault(); setEmail('') }} className="space-y-2">
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 rounded text-sm text-slate-800 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                className="w-full py-2 rounded text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: '#1a2a4f' }}>
                Subscribe 🚀
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-700 text-center text-xs py-3 text-slate-500">
          © 2024–2026 RoboXpressBD. All Rights Reserved. | Empowering Innovations in Bangladesh
        </div>
      </div>
    </footer>
  )
}
