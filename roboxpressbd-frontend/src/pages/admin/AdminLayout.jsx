import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Account } from '../../api/client'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Account.me()
      .then(user => {
        if (user.roles && user.roles.includes('ROLE_ADMIN')) {
          setIsAdmin(true)
        } else {
          navigate('/')
        }
      })
      .catch(() => {
        navigate('/login')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
  }

  if (!isAdmin) return null

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`)

  const tabClass = (path) => 
    isActive(path) 
      ? 'px-4 py-2 font-bold text-sm bg-[#16a34a] text-white rounded shadow-sm transition' 
      : 'px-4 py-2 font-bold text-sm text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 transition'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-sm border border-slate-200 min-h-[80vh] flex flex-col">
        {/* Header Section */}
        <header className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-1 text-sm">Welcome back, Administrator.</p>
          </div>
          
          <div className="flex gap-3">
            <Link to="/admin/products" className={tabClass('/admin/products')}>Products</Link>
            <Link to="/admin/orders" className={tabClass('/admin/orders')}>Orders</Link>
            <Link to="/admin/tools" className={tabClass('/admin/tools')}>Tools</Link>
            <Link to="/" className="px-4 py-2 font-bold text-sm text-slate-700 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 transition">Store Home</Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
