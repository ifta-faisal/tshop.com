import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const fmt = (n) => '৳' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Cart() {
  const { items, update, remove, subtotal, clear } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Add some products to get started.</p>
        <Link to="/products" className="bg-brand text-white px-5 py-2 rounded">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[1fr_320px] gap-6">
      <div className="bg-white border rounded-lg divide-y">
        {items.map(it => (
          <div key={it.id} className="p-4 flex items-center gap-4">
            <Link to={`/product/${it.productSlug}`} className="w-20 h-20 bg-slate-50 rounded flex items-center justify-center">
              {it.productImage
                ? <img src={it.productImage} className="w-full h-full object-cover rounded" alt={it.productName} />
                : <span className="text-xs text-slate-400">No image</span>}
            </Link>
            <div className="flex-1">
              <Link to={`/product/${it.productSlug}`} className="font-medium hover:text-brand">{it.productName}</Link>
              <p className="text-sm text-slate-500">{fmt(it.unitPrice)} each</p>
            </div>
            <div className="flex items-center border rounded">
              <button onClick={() => update(it.productId, Math.max(1, it.quantity - 1))} className="px-3">-</button>
              <span className="px-3">{it.quantity}</span>
              <button onClick={() => update(it.productId, it.quantity + 1)} className="px-3">+</button>
            </div>
            <div className="w-24 text-right font-semibold">{fmt(it.lineTotal)}</div>
            <button onClick={() => remove(it.productId)} className="text-rose-500 text-sm">Remove</button>
          </div>
        ))}
        <div className="p-4 text-right">
          <button onClick={clear} className="text-sm text-slate-500 hover:text-rose-500">Clear cart</button>
        </div>
      </div>
      <div className="bg-white border rounded-lg p-4 h-fit">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="flex justify-between text-sm mb-1"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
        <div className="flex justify-between text-sm mb-1"><span>Delivery</span><span>Calculated at checkout</span></div>
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{fmt(subtotal)}</span></div>
        <button onClick={() => navigate('/checkout')}
          className="w-full mt-4 bg-brand text-white py-2 rounded hover:bg-brand-dark">Proceed to Checkout</button>
      </div>
    </div>
  )
}
