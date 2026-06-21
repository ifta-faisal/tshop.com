import { useState } from 'react'
import { Admin } from '../../api/client'
import toast from 'react-hot-toast'

export default function AdminTools() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [flashSaleEnabled, setFlashSaleEnabled] = useState(localStorage.getItem('flashSaleEnabled') !== 'false')
  const [manualEndDate, setManualEndDate] = useState(localStorage.getItem('manualFlashSaleEndDate') || '')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await Admin.uploadCsv(formData)
      toast.success(res.message || 'Products imported successfully!')
      setFile(null)
      // Reset the file input
      document.getElementById('csv-upload').value = ''
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to import products')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Bulk Upload */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#16a34a] mb-6">Bulk Upload (CSV)</h3>
          <div className="border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-2">Bulk Product Upload (CSV)</h4>
            <div className="flex items-center gap-2 mb-2">
              <input 
                type="file" 
                id="csv-upload"
                accept=".csv"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:border file:border-slate-300 file:bg-gray-100 file:text-slate-700 hover:file:bg-gray-200 cursor-pointer"
              />
            </div>
            <button 
              onClick={handleUpload}
              disabled={uploading || !file}
              className="bg-gray-100 border border-slate-300 text-slate-700 hover:bg-gray-200 px-3 py-1 text-sm transition disabled:opacity-50"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Security Tools */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#16a34a] mb-6">Security Tools</h3>
          <div className="border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-4">Secure User Authentication</h4>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-20">Email:</span>
                <input type="email" className="border border-slate-300 px-2 py-1 flex-1" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-20">Password:</span>
                <input type="password" className="border border-slate-300 px-2 py-1 flex-1" />
              </div>
            </div>
            <button className="bg-gray-100 border border-slate-300 text-slate-700 hover:bg-gray-200 px-3 py-1 text-sm transition">
              Sign Up
            </button>
          </div>
        </div>

        {/* Banner Config */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#16a34a] mb-6">Banner Config</h3>
          <div className="mb-4">
            <label className="flex items-start gap-2 text-sm font-bold text-slate-800 cursor-pointer">
              <input 
                type="checkbox" 
                checked={flashSaleEnabled} 
                onChange={(e) => setFlashSaleEnabled(e.target.checked)} 
                className="mt-1" 
              />
              <span>Enable Active Flash Sale Event<br/>(Shows/Hides Entire Section & Navbar Link)</span>
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-2">Manual End Date (Overrides auto-detection)</label>
            <div className="flex items-center gap-2">
              <input 
                type="datetime-local" 
                value={manualEndDate} 
                onChange={(e) => setManualEndDate(e.target.value)} 
                className="border border-slate-300 px-3 py-1.5 text-sm flex-1" 
              />
              <button 
                onClick={() => setManualEndDate('')}
                className="bg-gray-100 border border-slate-300 text-slate-700 hover:bg-gray-200 px-3 py-1.5 text-sm"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-tight">If you leave this blank, the timer will automatically use the earliest end date of your active flash sale products.</p>
          </div>
          <button 
            onClick={() => {
              localStorage.setItem('flashSaleEnabled', flashSaleEnabled)
              if (manualEndDate) {
                localStorage.setItem('manualFlashSaleEndDate', manualEndDate)
              } else {
                localStorage.removeItem('manualFlashSaleEndDate')
              }
              window.dispatchEvent(new Event('storage'))
              toast.success('Banner settings saved! Navbar updated.')
            }}
            className="bg-[#16a34a] text-white font-bold px-4 py-2 hover:bg-green-700 transition"
          >
            Save Settings
          </button>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#16a34a] mb-6">Invoice Preview</h3>
          <div className="border border-slate-200 p-4">
            <h4 className="font-bold text-slate-800 mb-1">Automated Invoice System</h4>
            <p className="text-sm text-slate-600 leading-tight mb-3">Click to simulate an order (sends PDF to admin/customer).</p>
            <button className="bg-gray-100 border border-slate-300 text-slate-700 hover:bg-gray-200 px-3 py-1 text-sm transition">
              Place Demo Order
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
