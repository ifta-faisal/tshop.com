import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const fmt = (n) => '৳ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function ProductCard({ product }) {
  const { add, isAuthed } = useCart()
  const onSale = product.oldPrice && Number(product.oldPrice) > Number(product.price)

  const onAdd = async () => {
    if (!isAuthed) { toast.error('Please sign in to add items to cart'); return }
    try { await add(product.id, 1); toast.success('Added to cart') }
    catch (e) { toast.error(e.response?.data?.message || 'Failed to add') }
  }

  return (
    <div className="product-card bg-white rounded border border-slate-200 overflow-hidden flex flex-col h-full" style={{ borderRadius: '6px' }}>
      {/* Image area with snowflake watermark */}
      <Link to={`/product/${product.slug}`}
        className="block relative overflow-hidden card-watermark"
        style={{ aspectRatio: '1/1', background: '#f8fafc' }}>
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name}
              className="w-full h-full object-contain p-3 relative z-10"
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex' }}
            />
          : null}
        <div className="w-full h-full items-center justify-center text-slate-300 text-sm relative z-10 flex-col gap-1"
          style={{ display: product.imageUrl ? 'none' : 'flex' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <span style={{fontSize:'11px'}}>No image</span>
        </div>
      </Link>

      {/* Info */}
      <div className="px-3 py-3 flex-1 flex flex-col text-center border-t border-slate-100">
        <Link to={`/product/${product.slug}`}
          className="text-[13px] leading-snug text-slate-800 hover:text-blue-600 line-clamp-2 min-h-[2.6em] font-normal transition">
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-2 font-semibold text-[14px]" style={{ color: '#2563eb' }}>
          {fmt(product.price)}
        </div>

        {/* Old price */}
        {onSale && (
          <div className="text-xs text-slate-400 line-through">{fmt(product.oldPrice)}</div>
        )}
      </div>
    </div>
  )
}
