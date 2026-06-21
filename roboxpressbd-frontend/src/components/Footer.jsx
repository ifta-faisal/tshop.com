import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="mt-0">

      {/* ── Benefits band — white bg with dark icons (matches TechShopBD) ── */}
      <div className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a4.64 4.64 0 01-5.96-5.96m5.96 5.96l-8.48 8.48-1.42-1.42 8.48-8.48M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5L21 3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-3 3" />
            </svg>
            <div>
              <div className="font-semibold text-slate-800 text-[15px] leading-tight">Free Domestic Shipping</div>
              <div className="text-[13px] text-slate-500 mt-1">When you spend $80+</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V22.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25L3 7.5m18 0l-9-5.25" />
            </svg>
            <div>
              <div className="font-semibold text-slate-800 text-[15px] leading-tight">Same-Day Shipping</div>
              <div className="text-[13px] text-slate-500 mt-1">Mon-Fri til 3pm PST, Sat til 12pm PST</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <div>
              <div className="font-semibold text-slate-800 text-[15px] leading-tight">Customer Support</div>
              <div className="text-[13px] text-slate-500 mt-1">Industry Leading Support</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15" />
            </svg>
            <div>
              <div className="font-semibold text-slate-800 text-[15px] leading-tight">Best Prices</div>
              <div className="text-[13px] text-slate-500 mt-1">Price Match Guarantee</div>
            </div>
          </div>

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

        <div className="bg-[#f1f1f1] py-3 text-gray-700">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-[13px] gap-4 font-medium">
            <div>
              © 2020-2026 RoboXpressBD - All Rights Reserved.
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center opacity-90">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-[14px] object-contain" />
              <img src="/payment-visa.png" alt="Visa" className="h-[14px] object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-[16px] object-contain" />
              <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="h-[20px] object-contain -ml-1" />
              <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="h-[24px] object-contain -ml-1" />
              <img src="/payment-rocket.png" alt="Rocket" className="h-[16px] object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
