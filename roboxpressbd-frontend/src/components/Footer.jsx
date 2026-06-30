import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-0 font-sans">

      {/* ── CTA Banner: "Have a great idea in mind? lets make it real" ── */}
      <div className="bg-black text-white py-20 px-4 text-center border-b border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tight leading-tight">
            Have a great idea in <span className="text-sky-400 font-medium">mind?</span>
          </h2>
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-neutral-300 mt-3">
            lets make it real
          </p>
          <div className="mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-white text-black font-medium px-8 py-3.5 rounded-full text-sm hover:bg-neutral-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
            >
              Lets Work Together
              <span className="text-sky-500 text-base font-bold">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer: Minimalist Black Footer ── */}
      <div className="bg-[#0f0f0f] text-neutral-400 pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 md:gap-8 pb-6">

            {/* Column 1: Brand / Logo Column (spans 2) */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="inline-block group">
                <h3 className="text-2xl font-black text-white tracking-widest uppercase transition-colors group-hover:text-sky-400">
                  ROBOXPRESS
                </h3>
                <p className="text-[10px] text-neutral-500 font-bold tracking-[0.25em] uppercase mt-1.5">
                  ROBOTICS & FPV STORE
                </p>
              </Link>

              {/* Headset/Questions block */}
              <div className="flex items-center gap-4 pt-2">
                <svg className="w-10 h-10 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 15a8 8 0 0 1 16 0" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18c1.5 2.5 4 3 6 2.5" />
                </svg>
                <div>
                  <div className="text-xs text-neutral-400 font-medium">Got Questions ? Call us 24/7!</div>
                  <div className="text-lg md:text-xl font-bold text-white mt-0.5 tracking-wide">(+880) 1303897972</div>
                </div>
              </div>
            </div>

            {/* Columns 2–4: Terms, Quick Links, Contact Us — grouped and shifted left */}
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 md:-ml-6">

              {/* Terms & Policies */}
              <div>
                <h4 className="text-sm md:text-base font-bold text-white mb-4">
                  Terms & Policies
                </h4>
                <ul className="space-y-3 text-xs md:text-sm text-neutral-400 font-light">
                  <li>
                    <Link to="/products" className="hover:text-white transition duration-300">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-white transition duration-300">
                      Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-white transition duration-300">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-white transition duration-300">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm md:text-base font-bold text-white mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-3 text-xs md:text-sm text-neutral-400 font-light">
                  <li>
                    <Link to="/" className="hover:text-white transition duration-300">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition duration-300">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-white transition duration-300">
                      Offers
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-white transition duration-300">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div>
                <h4 className="text-sm md:text-base font-bold text-white mb-4">
                  Contact Us
                </h4>
                <ul className="space-y-3 text-xs md:text-sm text-neutral-400 leading-relaxed font-light">
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Sayed Nagor, Vatara, Dhaka Bangladesh</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+88 01303 897 972 (WhatsApp)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>support@roboxpressbd.com</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Column 5: About Us Paragraph */}
            <div>
              <h4 className="text-sm md:text-base font-bold text-white mb-4">
                About Us
              </h4>
              <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-light">
                We're always developing and sourcing new model products and then bringing them to you at the lowest price possible while maintaining quality, performance and service.
              </p>
            </div>

          </div>

          {/* Payment Partners */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap opacity-60 hover:opacity-90 transition-opacity duration-300 mt-6 mb-8 max-w-2xl mx-auto">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 sm:h-5 object-contain" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjcSlnzzQp3knqX74KGyo1s1CgzUZpBR-4ZTbRqVGZtotE9VYah7HYQ0Hq&s=10" alt="Visa" className="h-4 sm:h-4.5 object-contain" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5 sm:h-6 object-contain" />
            <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="h-7 sm:h-8 object-contain -mx-2" />
            <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="h-8 sm:h-10 object-contain -mx-2" />
            <img src="https://static.vecteezy.com/system/resources/previews/068/706/013/non_2x/rocket-color-logo-mobile-banking-icon-free-png.png" alt="Rocket" className="h-5 sm:h-6 object-contain" />
          </div>

          {/* Thin divider line */}
          <div className="border-t border-neutral-800 my-8 w-full"></div>

          {/* Social Icons & Copyright */}
          <div className="flex flex-col items-center justify-center pt-2">

            {/* Social Icons - Circular Outlines */}
            <div className="flex items-center gap-4 mb-6">

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-sm font-semibold font-mono">f</span>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-xs font-semibold font-mono">t</span>
              </a>

              {/* RSS */}
              <a
                href="#"
                className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6.18 15.64a2.18 2.18 0 1 1-2.18-2.18 2.18 2.18 0 0 1 2.18 2.18zM0 0v4.26a19.74 19.74 0 0 1 19.74 19.74H24A24 24 0 0 0 0 0zm0 8.56v4.26a11.18 11.18 0 0 1 11.18 11.18h4.26A15.44 15.44 0 0 0 0 8.56z" />
                </svg>
              </a>

              {/* Google+ / G+ */}
              <a
                href="#"
                className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-xs font-semibold font-mono">g⁺</span>
              </a>

              {/* Flickr / Other dot logo */}
              <a
                href="#"
                className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all duration-300 hover:scale-105"
              >
                <span className="text-sm font-black tracking-[-1px] relative -top-[1px]">••</span>
              </a>

            </div>

            {/* Copyright Text */}
            <p className="text-xs text-neutral-500 font-light tracking-wider">
              ©Copyright. All rights reserved.
            </p>

          </div>

        </div>
      </div>

    </footer>
  )
}

