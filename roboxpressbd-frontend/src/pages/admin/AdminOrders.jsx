import { useState, useEffect } from 'react'
import { Admin } from '../../api/client'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    setLoading(true)
    Admin.orders.list()
      .then(res => setOrders(res || []))
      .catch(err => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await Admin.orders.updateStatus(id, newStatus)
      toast.success('Status updated!')
      fetchOrders()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading orders...</div>

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Customer Orders ({orders.length})</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500 bg-white rounded-lg border border-slate-200">
          No orders found.
        </div>
      ) : (
        <div className="border border-slate-200 rounded overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 bg-white">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ORDER ID</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TOTAL</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">UPDATE STATUS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map(order => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-800">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-slate-400">{order.customerEmail || order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#16a34a]">৳{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="border border-slate-200 rounded px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#16a34a] cursor-pointer bg-white"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
