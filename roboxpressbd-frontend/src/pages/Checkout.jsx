import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Orders } from '../api/client'
import toast from 'react-hot-toast'

const fmt = (n) => '৳' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ customerName: user?.fullName || '', customerPhone: user?.phone || '', shippingAddress: user?.address || '', paymentMethod: 'COD' })
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const order = await Orders.checkout(form)
      await clear()
      toast.success('Order placed!')
      navigate(`/order/${order.orderNumber}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally { setBusy(false) }
  }

  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-slate-500">Your cart is empty.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[1fr_320px] gap-6">
      <form onSubmit={submit} className="bg-white border rounded-lg p-5 space-y-4">
        <h2 className="font-semibold text-lg">Shipping Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Full Name</label>
            <input required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input required value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full mt-1 px-3 py-2 border rounded" />
          </div>
        </div>
        <div>
          <label className="text-sm">Shipping Address</label>
          <textarea required value={form.shippingAddress} onChange={e => setForm({ ...form, shippingAddress: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded" rows="3" />
        </div>
        <div>
          <label className="text-sm">Payment Method</label>
          <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full mt-1 px-3 py-2 border rounded">
            <option value="COD">Cash on Delivery</option>
            <option value="BKASH">bKash</option>
            <option value="NAGAD">Nagad</option>
          </select>
        </div>
        <button disabled={busy} className="w-full bg-brand text-white py-2 rounded hover:bg-brand-dark disabled:opacity-50">
          {busy ? 'Placing order…' : 'Place Order'}
        </button>
      </form>
      <div className="bg-white border rounded-lg p-4 h-fit">
        <h2 className="font-semibold mb-3">Your Order</h2>
        <ul className="text-sm divide-y mb-3">
          {items.map(i => (
            <li key={i.id} className="py-2 flex justify-between gap-2">
              <span className="line-clamp-1">{i.productName} × {i.quantity}</span>
              <span>{fmt(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold"><span>Total</span><span>{fmt(subtotal)}</span></div>
      </div>
    </div>
  )
}
