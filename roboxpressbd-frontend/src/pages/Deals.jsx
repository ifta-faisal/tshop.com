import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Catalog } from '../api/client'
import ProductCard from '../components/ProductCard'

export default function Deals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' })
  const [targetDate, setTargetDate] = useState(null)

  useEffect(() => {
    // Check for manual override first
    const manualEnd = localStorage.getItem('manualFlashSaleEndDate')
    let hasManualOverride = false
    
    if (manualEnd && !isNaN(new Date(manualEnd).getTime())) {
      setTargetDate(new Date(manualEnd).getTime())
      hasManualOverride = true
    }

    // Fetch flash sale products
    Catalog.flashSales()
      .then(data => {
        setProducts(data)
        // Find the earliest end date to use for the global timer if no manual override
        if (!hasManualOverride && data && data.length > 0) {
          const endDates = data
            .map(p => p.flashSaleEndDate)
            .filter(d => d)
            .map(d => new Date(d).getTime())
          
          if (endDates.length > 0) {
            setTargetDate(Math.min(...endDates))
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!targetDate) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' })
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center bg-[#151515] border border-gray-800 rounded-xl p-4 md:p-6 min-w-[90px] md:min-w-[120px] shadow-2xl">
      <span className="text-4xl md:text-5xl font-black text-white mb-1 tracking-tight">{value}</span>
      <span className="text-[10px] md:text-xs font-bold text-pink-600 uppercase tracking-widest">{label}</span>
    </div>
  )

  const Colon = () => (
    <div className="text-3xl md:text-4xl font-black text-gray-600 pb-6">:</div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner Section */}
      <section className="bg-[#0a0a0a] py-20 px-4 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-[#e11d48] text-white text-[10px] md:text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-6 shadow-[0_0_15px_rgba(225,29,72,0.5)]">
            Limited Time Offer
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            FLASH SALE
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-12 font-medium">
            Grab your favorite gear before they're gone! High-performance drones and parts at unbeatable prices.
          </p>

          <div className="flex items-center justify-center gap-2 md:gap-4">
            <TimeBox value={timeLeft.hours} label="Hours" />
            <Colon />
            <TimeBox value={timeLeft.minutes} label="Minutes" />
            <Colon />
            <TimeBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading flash sales...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No active flash sales right now</h3>
            <p className="text-slate-500 mb-6">Check back soon for more amazing deals!</p>
            <Link to="/products" className="inline-block bg-[#16a34a] text-white font-bold px-6 py-2 rounded hover:bg-green-700 transition">
              Browse All Products
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
