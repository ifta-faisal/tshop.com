import { useState, useEffect } from 'react'
import { Catalog } from '../api/client'
import ProductCard from '../components/ProductCard'

export default function PrintingHub() {
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('Latest')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [customFile, setCustomFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [quotePrice, setQuotePrice] = useState(null)

  useEffect(() => {
    setLoading(true)
    // Fetch products in 3D Printing Designs category (using our seeded dummy data)
    Catalog.products({ category: '3d-printing-designs' })
      .then(res => setProducts(res.content || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Top Button */}
      <div className="flex justify-center mb-10">
        <button 
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="bg-[#1a56db] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-md flex items-center gap-2"
        >
          {showCustomForm ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hide Form
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Order with a Custom Design
            </>
          )}
        </button>
      </div>

      {/* Expanded Custom Form */}
      {showCustomForm && (
        <div className="max-w-5xl mx-auto mb-16 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Upload Area */}
            <div className="flex-1 border border-[#3b82f6] rounded-lg bg-white flex flex-col items-center justify-center p-10 min-h-[340px]">
              <svg className="w-16 h-16 text-[#3b82f6] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="text-[22px] font-bold text-slate-900 mb-2">Drop your STL or OBJ file</h3>
              <p className="text-slate-400 text-sm mb-8">Uploading your 3D model is the best way to get an instant quote</p>
              <input 
                type="file" 
                id="3d-upload" 
                accept=".stl,.obj" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCustomFile(e.target.files[0])
                    setQuotePrice(null)
                  }
                }} 
              />
              <label 
                htmlFor="3d-upload"
                className="cursor-pointer bg-[#1a56db] hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded shadow-sm mb-2 transition inline-block"
              >
                {customFile ? 'Change File' : 'Upload your models'}
              </label>
              {customFile ? (
                <div className="text-[#16a34a] text-sm font-semibold mb-6 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {customFile.name} attached
                </div>
              ) : (
                <div className="mb-6"></div>
              )}
              <div className="flex items-center gap-1.5 text-slate-400 text-[13px]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                All uploads are secure and confidential
              </div>
            </div>

            {/* Right Form Area */}
            <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden bg-white flex flex-col">
              <div className="bg-[#3b0b59] text-white px-5 py-4 font-semibold text-lg">
                Print Settings
              </div>
              <div className="p-6 flex flex-col gap-6 flex-1">
                <div>
                  <label className="block text-[13px] text-slate-600 mb-2 font-medium">Material Type</label>
                  <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-[14px] text-slate-700 focus:outline-none focus:border-[#3b0b59] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] bg-[length:16px_16px] bg-[position:right_10px_center]">
                    <option>PLA+ (10 tk per gram)</option>
                    <option>PETG (12 tk per gram)</option>
                    <option>ABS (15 tk per gram)</option>
                    <option>TPU (Flexible) (20 tk per gram)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-600 mb-2 font-medium">Color</label>
                  <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-[14px] text-slate-700 focus:outline-none focus:border-[#3b0b59] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] bg-[length:16px_16px] bg-[position:right_10px_center]">
                    <option>White</option>
                    <option>Black</option>
                    <option>Grey</option>
                    <option>Red</option>
                    <option>Blue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] text-slate-600 mb-2 font-medium">Infill Density</label>
                  <select className="w-full border border-slate-200 rounded px-3 py-2.5 text-[14px] text-slate-700 focus:outline-none focus:border-[#3b0b59] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] bg-[length:16px_16px] bg-[position:right_10px_center]">
                    <option>20% (Light)</option>
                    <option>50% (Medium)</option>
                    <option>100% (Solid)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 px-2">
            <div className="text-lg font-bold text-slate-800">
              {quotePrice && `Estimated Cost: ৳${quotePrice}`}
            </div>
            <button 
              onClick={() => {
                if (!customFile) {
                  alert('Please upload an STL or OBJ file first.')
                  return
                }
                if (quotePrice) {
                  alert('Your custom print request has been sent! We will review the file and contact you shortly to confirm the order.')
                  setCustomFile(null)
                  setQuotePrice(null)
                  setShowCustomForm(false)
                  return
                }
                setUploading(true)
                setTimeout(() => {
                  setQuotePrice(Math.floor(Math.random() * 2000) + 500) // Dummy price calculation
                  setUploading(false)
                }, 1500)
              }}
              disabled={uploading}
              className="bg-[#4a1464] hover:bg-[#3b0b59] text-white font-medium py-2.5 px-6 rounded shadow-sm flex items-center gap-2 transition disabled:opacity-50"
            >
              {uploading ? 'Calculating...' : (quotePrice ? 'Request Custom Order' : 'Calculate Price')}
              {!uploading && !quotePrice && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
            </button>
          </div>
        </div>
      )}

      {/* 3 Step Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 text-center max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <svg className="w-14 h-14 text-gray-700 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.759-1.549 3.5 3.5 0 11-7.39 8.529H5.5z" />
            <path d="M10 5a1 1 0 011 1v3h2.586l-3.293 3.293a1 1 0 01-1.414 0L5.586 9H8V6a1 1 0 011-1z" />
          </svg>
          <h3 className="font-bold text-gray-900 text-base mb-2">Upload Model</h3>
          <p className="text-gray-400 text-[13px] leading-relaxed px-4">Upload your 3D files or multiple STL file and select material and settings</p>
        </div>
        <div className="flex flex-col items-center">
          <svg className="w-14 h-14 text-gray-700 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v2h8V4H6zm0 4v2h2V8H6zm4 0v2h2V8h-2zm-4 4v2h2v-2H6zm4 0v2h2v-2h-2zm-4 4v2h2v-2H6zm4 0v2h2v-2h-2z" />
          </svg>
          <h3 className="font-bold text-gray-900 text-base mb-2">Get Quote</h3>
          <p className="text-gray-400 text-[13px] leading-relaxed px-4">Receive instant pricing based on your model and settings</p>
        </div>
        <div className="flex flex-col items-center">
          <svg className="w-14 h-14 text-gray-700 mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <h3 className="font-bold text-gray-900 text-base mb-2">Place Order</h3>
          <p className="text-gray-400 text-[13px] leading-relaxed px-4">Confirm your order and we'll start printing</p>
        </div>
      </div>

      <h2 className="text-[22px] font-bold mb-6 text-gray-900 tracking-tight">3D Printing Designs</h2>
      
      {/* Filter Section */}
      <div className="border border-gray-100 shadow-sm rounded-lg p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-5">
          <div>
            <label className="block text-[13px] text-gray-600 mb-1.5 font-medium">Search Products</label>
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-[13px] text-gray-600 mb-1.5 font-medium">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] bg-[length:16px_16px] bg-[position:right_10px_center]"
            >
              <option>All Categories</option>
              <option>Prototypes</option>
              <option>Miniatures</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] text-gray-600 mb-1.5 font-medium">Min Price</label>
            <input 
              type="text" 
              placeholder="Min" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-[13px] text-gray-600 mb-1.5 font-medium">Max Price</label>
            <input 
              type="text" 
              placeholder="Max" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-[13px] text-gray-600 mb-1.5 font-medium">Sort By</label>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-200 rounded px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] bg-[length:16px_16px] bg-[position:right_10px_center]"
            >
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="flex gap-4 items-center">
            <button className="bg-[#1a56db] text-white px-5 py-2.5 rounded text-[13px] font-medium flex items-center gap-2 hover:bg-blue-700 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Apply Filters
            </button>
            <button className="text-gray-600 text-[13px] font-medium hover:text-gray-900 flex items-center gap-1.5 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Reset
            </button>
          </div>
          <div className="text-gray-400 text-[13px]">
            Showing {products.length} products
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a56db]"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No 3D printing products found.
          </div>
        )}
      </div>
      
    </div>
  )
}
