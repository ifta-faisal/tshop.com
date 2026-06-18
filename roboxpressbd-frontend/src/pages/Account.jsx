import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Account, Orders as OrdersApi } from '../api/client'
import toast from 'react-hot-toast'

const fmt = (n) => '৳' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function AccountPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({ fullName: '', phone: '', address: '' })
  const [orders, setOrders] = useState([])

  useEffect(() => {
    Account.me().then(u => setProfile({ fullName: u.fullName || '', phone: u.phone || '', address: u.address || '' }))
    OrdersApi.mine().then(setOrders).catch(() => {})
  }, [])

  const save = async (e) => {
    e.preventDefault()
    try {
      const u = await Account.update(profile)
      toast.success('Profile updated')
      setProfile({ fullName: u.fullName, phone: u.phone || '', address: u.address || '' })
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[300px_1fr] gap-6">
      <div className="bg-white border rounded-lg p-5 h-fit">
        <h2 className="font-semibold mb-2">My Account</h2>
        <p className="text-sm text-slate-500 mb-1">{user?.email}</p>
        <p className="text-sm text-slate-500 mb-4">Roles: {user?.roles?.join(', ')}</p>
        <form onSubmit={save} className="space-y-3 text-sm">
          <div>
            <label>Full Name</label>
            <input className="w-full mt-1 px-2 py-1.5 border rounded" value={profile.fullName}
              onChange={e => setProfile({ ...profile, fullName: e.target.value })} />
          </div>
          <div>
            <label>Phone</label>
            <input className="w-full mt-1 px-2 py-1.5 border rounded" value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label>Address</label>
            <textarea className="w-full mt-1 px-2 py-1.5 border rounded" rows="3" value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })} />
          </div>
          <button className="w-full bg-brand text-white py-2 rounded">Save Changes</button>
        </form>
      </div>
      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold mb-4">My Orders</h2>
        {orders.length === 0
          ? <p className="text-sm text-slate-500">No orders yet.</p>
          : <ul className="divide-y">
              {orders.map(o => (
                <li key={o.id} className="py-3 flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{o.orderNumber}</div>
                    <div className="text-slate-500">{new Date(o.createdAt).toLocaleString()} · {o.status}</div>
                  </div>
                  <div className="font-semibold">{fmt(o.totalAmount)}</div>
                </li>
              ))}
            </ul>}
      </div>
    </div>
  )
}
