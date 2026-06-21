import { useState, useEffect } from 'react'

export default function FloatingWidgets() {
  const [showTopBtn, setShowTopBtn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true)
      } else {
        setShowTopBtn(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* Messenger Button at Bottom Left */}
      <div className={`fixed bottom-6 left-6 z-[100] flex items-center group transition-opacity duration-300 ${showTopBtn ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="relative flex items-center cursor-pointer">
          {/* Button */}
          <div className="w-[46px] h-[46px] bg-[#0084FF] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-105 transition-transform"
               onClick={() => window.open('https://m.me/yourpage', '_blank')}>
            <svg viewBox="0 0 36 36" fill="currentColor" height="24" width="24">
              <path d="M18 2C9.16 2 2 8.79 2 17.16c0 4.75 2.41 8.93 6.13 11.66V34l5.65-3.11c1.36.38 2.8.59 4.22.59 8.84 0 16-6.79 16-15.16S26.84 2 18 2zm1.09 20.35l-4.14-4.42-8.08 4.42 8.87-9.42 4.3 4.42 7.9-4.42-8.85 9.42z" />
            </svg>
          </div>

          {/* Tooltip on the right */}
          <div className="absolute left-full ml-4 px-4 py-2 bg-white text-slate-800 text-[15px] rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.1)] border border-slate-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity flex items-center pointer-events-none">
             <div className="absolute -left-[5px] w-[10px] h-[10px] bg-white border-l border-b border-slate-100 rotate-45"></div>
             <span className="relative z-10">Contact us</span>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button at Bottom Right */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-opacity duration-300 ${showTopBtn ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={scrollToTop}
          className="w-11 h-11 bg-white border border-slate-200 text-slate-600 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/>
          </svg>
        </button>
      </div>
    </>
  )
}
