import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Orders } from '../api/client'

const fmt = (n) => '৳' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function OrderSuccess() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => { Orders.get(orderNumber).then(setOrder).catch(() => setOrder(null)) }, [orderNumber])

  if (!order) return <div className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-lg p-6">
        <div className="text-emerald-600 text-4xl mb-2">✓</div>
        <h1 className="text-2xl font-bold">Thank you for your order!</h1>
        <p className="text-slate-500 mb-4">Order number: <span className="font-semibold">{order.orderNumber}</span></p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div><span className="text-slate-500">Status:</span> {order.status}</div>
          <div><span className="text-slate-500">Payment:</span> {order.paymentMethod}</div>
          <div><span className="text-slate-500">Name:</span> {order.customerName}</div>
          <div><span className="text-slate-500">Phone:</span> {order.customerPhone}</div>
          <div className="sm:col-span-2"><span className="text-slate-500">Address:</span> {order.shippingAddress}</div>
        </div>
        <hr className="my-4" />
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="divide-y text-sm">
          {order.items.map(i => (
            <li key={i.id} className="py-2 flex items-center gap-3">
              {i.productImage && <img src={i.productImage} alt="" className="w-12 h-12 object-cover rounded" />}
              <div className="flex-1">
                <div className="font-medium">{i.productName}</div>
                <div className="text-slate-500">× {i.quantity} · {fmt(i.unitPrice)}</div>
              </div>
              <div className="font-semibold">{fmt(i.unitPrice * i.quantity)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right font-bold text-lg">Total: {fmt(order.totalAmount)}</div>
        <Link to="/products" className="mt-6 inline-block bg-brand text-white px-5 py-2 rounded">Continue Shopping</Link>
      </div>
    </div>
  )
}
